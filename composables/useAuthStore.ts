import { ref } from 'vue'
import { useSupabase } from '~/utils/supabase'

export const useAuthStore = () => {
  // Keep the client-side Supabase instance for candidate_info and other client-side operations
  const supabase = useSupabase()
  const user = useState('user', () => null)
  const isAuthenticated = useState('isAuthenticated', () => false)
  
  // Initialize auth state from existing session using server-side endpoint
  const initAuth = async () => {
    try {
      const data = await $fetch('/api/auth/session')
      if (data.session) {
        user.value = data.session.user
        isAuthenticated.value = true
      }
    } catch (error) {
      console.error('Session initialization error:', error)
    }
  }

  // Set up auth state change listener
  // Note: We still need this client-side for real-time auth state changes
  const setupAuthListener = () => {
    supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (event === 'SIGNED_IN' && session) {
        user.value = session.user
        isAuthenticated.value = true
      } else if (event === 'SIGNED_OUT') {
        user.value = null
        isAuthenticated.value = false
      }
    })
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
