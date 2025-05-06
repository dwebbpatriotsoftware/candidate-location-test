import { createServerSupabaseClient, handleApiError } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    // Create server-side Supabase client
    const supabase = createServerSupabaseClient(event)
    
    // Sign out the user
    const { error } = await supabase.auth.signOut()
    
    // Handle sign out errors
    if (error) {
      throw createError({
        statusCode: 500,
        message: error.message
      })
    }
    
    // Return success response
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
})
