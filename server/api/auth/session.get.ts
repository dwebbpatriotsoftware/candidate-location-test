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
    
    // Ensure we have all necessary session data for client-side restoration
    if (data.session) {
      // Make sure we have the tokens in the response
      const sessionData = {
        ...data,
        session: {
          ...data.session,
          // Ensure these fields are present for client-side storage
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        }
      }
      return sessionData
    }
    
    // Return the session data
    return data
  } catch (error) {
    return handleApiError(error)
  }
})
