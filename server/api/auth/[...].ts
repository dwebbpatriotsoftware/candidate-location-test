import { defineEventHandler, readBody, setCookie, deleteCookie, parseCookies, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'

// Create Supabase client for server-side operations
function createServerSupabaseClient() {
  const config = useRuntimeConfig()
  return createClient(config.public.supabaseUrl, config.public.supabaseKey)
}

// Login handler
export const loginHandler = defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body
  
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    })
  }
  
  const supabase = createServerSupabaseClient()
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      throw createError({
        statusCode: 401,
        message: error.message
      })
    }
    
    if (!data.session) {
      throw createError({
        statusCode: 401,
        message: 'Authentication failed'
      })
    }
    
    // Set secure HTTP-only cookie with session
    setCookie(event, 'auth_session', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    })
    
    // Return user data (but not tokens)
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        // other user properties you want to expose
      }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Authentication failed'
    })
  }
})

// Logout handler
export const logoutHandler = defineEventHandler(async (event) => {
  const cookies = parseCookies(event)
  
  if (cookies.auth_session) {
    const supabase = createServerSupabaseClient()
    
    try {
      await supabase.auth.signOut()
      
      // Clear the auth cookie
      deleteCookie(event, 'auth_session')
    } catch (error: any) {
      console.error('Logout error:', error)
    }
  }
  
  return { success: true }
})

// Session handler
export const sessionHandler = defineEventHandler(async (event) => {
  const cookies = parseCookies(event)
  
  if (!cookies.auth_session) {
    return { user: null }
  }
  
  const supabase = createServerSupabaseClient()
  
  try {
    // Verify the session token
    const { data, error } = await supabase.auth.getUser(cookies.auth_session)
    
    if (error || !data.user) {
      // Invalid or expired token
      deleteCookie(event, 'auth_session')
      return { user: null }
    }
    
    // Return user data
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        // other user properties
      }
    }
  } catch (error: any) {
    console.error('Session verification error:', error)
    deleteCookie(event, 'auth_session')
    return { user: null }
  }
})

// Route handler
export default defineEventHandler(async (event) => {
  const path = event.path || ''
  
  // Extract the part after /api/auth/
  const authPath = path.replace(/^\/api\/auth\//, '')
  
  // Route to the appropriate handler
  if (authPath === 'login' && event.method === 'POST') {
    return loginHandler(event)
  }
  
  if (authPath === 'logout' && event.method === 'POST') {
    return logoutHandler(event)
  }
  
  if (authPath === 'session' && event.method === 'GET') {
    return sessionHandler(event)
  }
  
  throw createError({
    statusCode: 404,
    message: 'Not found'
  })
})
