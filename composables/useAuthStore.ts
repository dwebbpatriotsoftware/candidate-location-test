import { ref } from 'vue'
import { useSupabase } from '~/utils/supabase'

export const useAuthStore = () => {
  // Keep the client-side Supabase instance for candidate_info and other client-side operations
  const supabase = useSupabase()
  const user = useState<any>('user', () => null)
  const isAuthenticated = useState('isAuthenticated', () => false)
  
  // Initialize auth state from existing session
  const initAuth = async () => {
    try {
      // First check if we have a session in localStorage (client-side only)
      if (process.client) {
        // Try to get the session from Supabase client directly
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (session) {
          user.value = session.user
          isAuthenticated.value = true
          return // Successfully restored session
        }
      }
      
      // If client-side restoration failed or we're on server, try the API
      try {
        const data = await $fetch('/api/auth/session')
        if (data.session) {
          user.value = data.session.user
          isAuthenticated.value = true
          
          // Also update Supabase client session
          if (process.client && data.session) {
            await supabase.auth.setSession({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token
            })
          }
        }
      } catch (apiError) {
        console.error('API session fetch error:', apiError)
      }
    } catch (error) {
      console.error('Session initialization error:', error)
    }
  }

  // Set up auth state change listener
  const setupAuthListener = () => {
    if (process.client) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
        console.log('Auth state changed:', event, session)
        if (event === 'SIGNED_IN' && session) {
          user.value = session.user
          isAuthenticated.value = true
        } else if (event === 'SIGNED_OUT') {
          user.value = null
          isAuthenticated.value = false
        } else if (event === 'TOKEN_REFRESHED' && session) {
          user.value = session.user
          isAuthenticated.value = true
        } else if (event === 'INITIAL_SESSION' && session) {
          user.value = session.user
          isAuthenticated.value = true
        }
      })
      
      // Return unsubscribe function
      return () => {
        subscription.unsubscribe()
      }
    }
    
    return () => {}
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Use server-side login endpoint instead of direct Supabase call
      const data = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      
      if (data.session) {
        user.value = data.session.user
        isAuthenticated.value = true
        
        // Update Supabase client session
        if (process.client) {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          })
        }
        
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      // Use server-side logout endpoint
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
      
      // Clear Supabase client session
      if (process.client) {
        await supabase.auth.signOut()
      }
      
      // Update local state
      user.value = null
      isAuthenticated.value = false
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initAuth,
    setupAuthListener
  }
}
