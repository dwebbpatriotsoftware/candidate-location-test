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
    
    // Return the session data
    return data
  } catch (error) {
    return handleApiError(error)
  }
})
