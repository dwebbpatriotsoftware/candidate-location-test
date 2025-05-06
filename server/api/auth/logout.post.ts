import { createServerSupabaseClient, handleApiError } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    // Create server-side Supabase client
    const supabase = createServerSupabaseClient(event)
    
    // Sign out the user with scope: 'global' to invalidate all sessions
    const { error } = await supabase.auth.signOut({ scope: 'global' })
    
    // Handle sign out errors
    if (error) {
      throw createError({
        statusCode: 500,
        message: error.message
      })
    }
    
    // Set headers to clear any auth cookies
    setHeader(event, 'Set-Cookie', [
      'supabase-auth-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
      'sb-refresh-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
      'sb-access-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'
    ])
    
    // Return success response
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
})
