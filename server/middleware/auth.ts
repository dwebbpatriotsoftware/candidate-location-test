import { defineEventHandler, parseCookies, deleteCookie } from 'h3'
import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event)
  
  // Skip if no auth session cookie
  if (!cookies.auth_session) {
    return
  }
  
  // Create Supabase client
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
  
  try {
    // Verify the session token
    const { data, error } = await supabase.auth.getUser(cookies.auth_session)
    
    if (error || !data.user) {
      // Invalid or expired token, clear the cookie
      deleteCookie(event, 'auth_session')
      return
    }
    
    // Attach user to event context for use in API routes
    event.context.user = {
      id: data.user.id,
      email: data.user.email
    }
  } catch (error: any) {
    console.error('Session verification error:', error)
    // Clear invalid session
    deleteCookie(event, 'auth_session')
  }
})
