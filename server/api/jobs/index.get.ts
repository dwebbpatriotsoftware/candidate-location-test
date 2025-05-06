import { createServerSupabaseClient, handleApiError } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    // Create server-side Supabase client
    const supabase = createServerSupabaseClient(event)
    
    // Query the jobs table
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('updated_at', { ascending: false })
    
    // Handle database errors
    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message
      })
    }
    
    // Return the jobs data
    return data || []
  } catch (error) {
    return handleApiError(error)
  }
})
