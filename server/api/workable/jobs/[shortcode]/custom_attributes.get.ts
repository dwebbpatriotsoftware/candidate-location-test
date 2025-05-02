// Rate limiting variables
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
    console.log(`Rate limit reached. Waiting ${waitTime}ms before next call.`);
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
    
    // Get runtime config
    const config = useRuntimeConfig();
    const subDomain = config.workableSubDomain;
    const apiKey = config.workableApiKey;
    
    if (!subDomain || !apiKey) {
      throw new Error('Workable credentials not configured');
    }
    
    // Apply rate limiting
    await rateLimiter();
    
    // Direct fetch to Workable API
    const response = await fetch(`https://${subDomain}.workable.com/spi/v3/jobs/${shortcode}/custom_attributes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch job custom attributes: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data;
  } catch (error: any) {
    console.error('Error fetching job custom attributes:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch job custom attributes',
      data: error.message
    });
  }
});
