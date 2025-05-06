import { createServerSupabaseClient } from '~/server/utils/supabase'

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
    
    // If no session, return empty response
    if (!data.session) {
      return { user: null, session: null }
    }
    
    // Return session data in the format expected by Sidebase Auth
    return {
      user: {
        id: data.session.user.id,
        email: data.session.user.email,
        name: data.session.user.user_metadata?.full_name || data.session.user.email,
      },
      session: {
        supabaseAccessToken: data.session.access_token,
        supabaseRefreshToken: data.session.refresh_token
      }
    }
  } catch (error) {
    console.error('Session error:', error)
    return { user: null, session: null }
  }
})
