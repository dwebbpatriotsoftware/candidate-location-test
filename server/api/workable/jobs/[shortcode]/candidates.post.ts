import { createServerSupabaseClient } from '~/server/utils/supabase';

// Rate limiting variables (similar to other Workable API endpoints)
let callCount = 0;
let resetTime = Date.now() + 10000; // 10 seconds from now

// Rate limiter function
const rateLimiter = async () => {
  const now = Date.now();
  
  // Reset counter if 10 seconds have passed
  if (now > resetTime) {
    callCount = 0;
    resetTime = now + 10000;
  }
  
  // Check if we've hit the rate limit
  if (callCount >= 10) {
    const waitTime = resetTime - now;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // Reset after waiting
    callCount = 0;
    resetTime = Date.now() + 10000;
  }
  
  // Increment call count
  callCount++;
}

export default defineEventHandler(async (event) => {
  try {
    // Get the shortcode from the URL
    const shortcode = event.context.params?.shortcode;
    if (!shortcode) {
      throw new Error('Job shortcode is required');
    }
    
    // Parse the request body
    const body = await readBody(event);
    const { applicationId, status } = body;
    
    if (!applicationId) {
      throw new Error('Application ID is required');
    }
    
    // Determine if the candidate is qualified based on status
    const isQualified = status === 'accepted';
    
    // Get runtime config
    const config = useRuntimeConfig();
    const subDomain = config.workableSubDomain;
    const apiKey = config.workableApiKey;
    
    if (!subDomain || !apiKey) {
      throw new Error('Workable credentials not configured');
    }
    
    // Create server-side Supabase client
    const supabase = createServerSupabaseClient(event);
    
    // Fetch the application data
    const { data: application, error: appError } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', applicationId)
      .single();
    
    if (appError || !application) {
      throw new Error('Application not found');
    }
    
    // Generate signed URLs for resume and cover letter if they exist
    let resumeUrl = null;
    let coverLetterUrl = null;
    
    if (application.resume_path) {
      const { data } = await supabase
        .storage
        .from('docs')
        .createSignedUrl(application.resume_path, 60 * 60); // 1 hour expiration
      
      if (data) {
        resumeUrl = data.signedUrl;
      }
    }
    
    if (application.cover_letter_path) {
      const { data } = await supabase
        .storage
        .from('docs')
        .createSignedUrl(application.cover_letter_path, 60 * 60); // 1 hour expiration
      
      if (data) {
        coverLetterUrl = data.signedUrl;
      }
    }
    
    // Fetch the job data to get question types
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('questions')
      .eq('id', shortcode)
      .single();

    if (jobError) {
      console.warn('Could not fetch job questions data:', jobError);
      // Continue without question types, but this might cause issues
    }

    // Create a map of question keys to their types
    const questionTypesMap: Record<string, string> = {};
    if (job?.questions?.questions_map) {
      Object.entries(job.questions.questions_map).forEach(([id, question]: [string, any]) => {
        // The key in our application might not have the CA_ prefix
        const key = id.replace('CA_', '');
        questionTypesMap[key] = question.type;
      });
    }

    console.log('Question types map:', questionTypesMap);
    console.log('Application answers:', application.answers?.job_questions);

    // Format answers based on question types
    const formattedAnswers = Object.entries(application.answers?.job_questions || {}).map(([key, value]: [string, any]) => {
      const questionType = questionTypesMap[key] || 'text'; // Default to text if type unknown
      
      console.log(`Formatting answer for question ${key}, type: ${questionType}, value:`, value);
      
      switch (questionType.toLowerCase()) {
        case 'boolean':
          return {
            question_key: key,
            checked: value === true || value === 'true' || value === 'yes' || value === 1
          };
        case 'multiple':
        case 'dropdown':
          // If value is already an array, use it; otherwise, wrap it in an array
          const choices = Array.isArray(value) ? value : [value];
          return {
            question_key: key,
            choices
          };
        case 'date':
          return {
            question_key: key,
            date: value
          };
        case 'number':
          return {
            question_key: key,
            number: parseFloat(value)
          };
        case 'text':
        case 'textarea':
        default:
          return {
            question_key: key,
            body: typeof value === 'string' ? value : (value !== null && value !== undefined ? String(value as any) : '')
          };
      }
    });

    // Transform application data to Workable format
    const personalInfo = application.answers?.personal_info || {};
    
    const workableCandidate = {
      sourced: false, // Mark as applied rather than sourced
      candidate: {
        name: `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim(),
        firstname: personalInfo.firstName || '',
        lastname: personalInfo.lastName || '',
        email: personalInfo.email || '',
        headline: personalInfo.headline || '',
        summary: personalInfo.summary || '',
        address: personalInfo.address || `${personalInfo.city || ''}, ${personalInfo.state || ''} ${personalInfo.zipCode || ''}`.trim(),
        phone: personalInfo.phone || '',
        cover_letter: application.cover_letter_text || '',
        
        // Add resume URL if available
        ...(resumeUrl ? { resume_url: resumeUrl } : {}),
        
        // Add cover letter URL if available
        ...(coverLetterUrl ? { cover_letter_url: coverLetterUrl } : {}),
        
        // Use formatted answers
        answers: formattedAnswers,
        
        // Set disqualified status if rejected
        ...(!isQualified ? { 
          disqualified: true,
          disqualification_reason: "Doesn't meet location requirements"
        } : {})
      }
    };

    console.log('Workable candidate payload:', JSON.stringify(workableCandidate, null, 2));
    
    // Apply rate limiting
    await rateLimiter();
    
    // Make the API call to Workable
    const response = await fetch(`https://${subDomain}.workable.com/spi/v3/jobs/${shortcode}/candidates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workableCandidate)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to push candidate to Workable: ${response.status} - ${errorText}`);
    }
    
    const workableResponse = await response.json();
    
    // Update the application record with Workable status
    await supabase
      .from('job_applications')
      .update({
        workable_status: isQualified ? 'qualified' : 'disqualified',
        workable_candidate_id: workableResponse.id,
        workable_data: workableResponse
      })
      .eq('id', applicationId);
    
    return workableResponse;
  } catch (error: any) {
    console.error('Error pushing candidate to Workable:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to push candidate to Workable',
      data: error.message
    });
  }
});
