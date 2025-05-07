import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { H3Event, parseCookies } from 'h3'

// Create a Supabase client for server-side operations
export function createServerSupabaseClient(event?: H3Event): SupabaseClient {
  try {
    const config = useRuntimeConfig()
    
    const supabaseUrl = config.public.supabaseUrl
    const supabaseKey = config.public.supabaseKey
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL and key must be defined in environment variables');
      // Create a client with minimal config that will fail gracefully
      return createClient('https://example.com', 'fallback-key');
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
      try {
        const cookies = parseCookies(event)
        const authCookie = cookies['supabase-auth-token']
        
        if (authCookie) {
          try {
            const authData = JSON.parse(authCookie)
            // Set the auth data in the client
            if (authData && authData.access_token && authData.refresh_token) {
              supabase.auth.setSession({
                access_token: authData.access_token,
                refresh_token: authData.refresh_token
              }).catch(err => {
                console.error('Error setting session from cookie:', err);
              });
            }
          } catch (e) {
            console.error('Error parsing auth cookie:', e)
          }
        }
      } catch (cookieError) {
        console.error('Error accessing cookies:', cookieError);
      }
    }
    
    return supabase;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    // Create a client with minimal config that will fail gracefully
    return createClient('https://example.com', 'fallback-key');
  }
}

// Helper function to handle API errors consistently
export function handleApiError(error: any) {
  console.error('API Error:', error)
  
  try {
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
  } catch (formatError) {
    console.error('Error formatting API error:', formatError);
    // Return a simple error object if error formatting fails
    return { 
      statusCode: 500, 
      message: 'Internal server error',
      error: true
    };
  }
}
