import { createServerSupabaseClient, handleApiError } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    // Create server-side Supabase client
    const supabase = createServerSupabaseClient(event)
    
    // Get the current session
    const { data, error } = await supabase.auth.getSession()
    
    // Handle errors
    if (error) {
      console.error('Session fetch error:', error);
      // Return empty data instead of throwing an error
      return { session: null };
    }
    
    // Ensure we have all necessary session data for client-side restoration
    if (data?.session) {
      try {
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
        return sessionData;
      } catch (formatError) {
        console.error('Error formatting session data:', formatError);
        // Return empty data if we can't format the session
        return { session: null };
      }
    }
    
    // Return the session data or empty object if no session
    return data || { session: null };
  } catch (error) {
    console.error('Unhandled session API error:', error);
    // Return empty data instead of throwing an error
    return { session: null };
  }
})
