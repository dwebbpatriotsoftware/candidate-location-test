import { createServerSupabaseClient, handleApiError } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        message: 'Email and password are required'
      })
    }
    
    // Create server-side Supabase client
    const supabase = createServerSupabaseClient(event)
    
    // Attempt to sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password
    })
    
    // Handle authentication errors
    if (error) {
      throw createError({
        statusCode: 401,
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
