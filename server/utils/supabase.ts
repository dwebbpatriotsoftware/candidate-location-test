import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { H3Event, parseCookies } from 'h3'

// Create a Supabase client for server-side operations
export function createServerSupabaseClient(event?: H3Event): SupabaseClient {
  const config = useRuntimeConfig()
  
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and key must be defined in environment variables')
  }
  
  // Create client with session persistence
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: 'supabase-auth-token'
    }
  })
  
  // If we have an event, set the auth cookie from the request
  if (event) {
    const cookies = parseCookies(event)
    const authCookie = cookies['supabase-auth-token']
    
    if (authCookie) {
      try {
        const authData = JSON.parse(authCookie)
        // Set the auth data in the client
        supabase.auth.setSession({
          access_token: authData.access_token,
          refresh_token: authData.refresh_token
        })
      } catch (e) {
        console.error('Error parsing auth cookie:', e)
      }
    }
  }
  
  return supabase
}

// Helper function to handle API errors consistently
export function handleApiError(error: any) {
  console.error('API Error:', error)
  
  // If it's already a formatted error from h3, just return it
  if (error.statusCode) {
    return error
  }
  
  // Handle Supabase errors
  if (error.code) {
    return createError({
      statusCode: 400,
      message: error.message || 'Database operation failed',
      data: { code: error.code }
    })
  }
  
  // Generic error
  return createError({
    statusCode: 500,
    message: error.message || 'Internal server error'
  })
}
