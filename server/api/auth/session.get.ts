import { createServerSupabaseClient, handleApiError } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    // Create server-side Supabase client
    const supabase = createServerSupabaseClient(event)
    
    // Get the current session
    const { data, error } = await supabase.auth.getSession()
    
    // Handle errors
    if (error) {
      throw createError({
        statusCode: 500,
        message: error.message
      })
    }
    
    // Return the session data
    return data
  } catch (error) {
    return handleApiError(error)
  }
})
