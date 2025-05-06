import { createServerSupabaseClient, handleApiError } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    // Get job ID from route params
    const jobId = getRouterParam(event, 'id')
    
    if (!jobId) {
      throw createError({
        statusCode: 400,
        message: 'Job ID is required'
      })
    }
    
    // Create server-side Supabase client
    const supabase = createServerSupabaseClient(event)
    
    // First get the job data
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()
    
    if (jobError) {
      throw createError({
        statusCode: 400,
        message: jobError.message
      })
    }
    
    if (!job || !job.questions) {
      console.warn(`No job or questions data found for job ID: ${jobId}`)
      return []
    }
    
    // Extract questions map from job data for fallback
    const questionsMap = job.questions.questions_map || {}
    const allQuestions = Object.values(questionsMap)
    
    // If there are no questions at all, return empty array
    if (allQuestions.length === 0) {
      console.warn(`No questions found in job data for job ID: ${jobId}`)
      return []
    }
    
    try {
      // Try to get form customizations
      const { data: jobForm, error: formError } = await supabase
        .from('job_form')
        .select('*')
        .eq('job_id', jobId)
        .single()
      
      // If no customizations exist or there was an error, return all questions from the job data
      if (formError || !jobForm || !jobForm.visible_questions || jobForm.visible_questions.length === 0) {
        console.log(`Using all questions for job ID: ${jobId} (no form customizations found)`)
        return allQuestions
      }
      
      // If customizations exist, apply them
      const visibleQuestions = jobForm.visible_questions
        .map((id: string) => questionsMap[id])
        .filter((q: any) => q) // Filter out any undefined questions
      
      // If filtering resulted in no questions, fall back to all questions
      if (visibleQuestions.length === 0) {
        console.warn(`Form customization resulted in no questions, falling back to all questions for job ID: ${jobId}`)
        return allQuestions
      }
      
      return visibleQuestions
    } catch (formError) {
      // If there's any error getting the form, fall back to all questions
      console.warn(`Error getting job form, falling back to all questions for job ID: ${jobId}`, formError)
      return allQuestions
    }
  } catch (error) {
    return handleApiError(error)
  }
})
