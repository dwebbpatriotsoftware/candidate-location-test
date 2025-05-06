import { createServerSupabaseClient, handleApiError } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    // Get job ID from route params
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Job ID is required'
      })
    }
    
    // Create server-side Supabase client
    const supabase = createServerSupabaseClient(event)
    
    // Query the jobs table
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single()
    
    // Handle database errors
    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message
      })
    }
    
    // Return the job data
    return data
  } catch (error) {
    return handleApiError(error)
  }
})
