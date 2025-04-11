import { ref } from 'vue'
import { useSupabase } from '~/utils/supabase'

export const useAuthStore = () => {
  const supabase = useSupabase()
  const user = useState('user', () => null)
  const isAuthenticated = useState('isAuthenticated', () => false)
  
  // Initialize auth state from existing session
  const initAuth = async () => {
    try {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        user.value = data.session.user
        isAuthenticated.value = true
      }
    } catch (error) {
      console.error('Session initialization error:', error)
    }
  }

  // Call initAuth when the store is first used
  onMounted(() => {
    initAuth()
    
    // Set up auth state change listener
    supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (event === 'SIGNED_IN' && session) {
        user.value = session.user
        isAuthenticated.value = true
      } else if (event === 'SIGNED_OUT') {
        user.value = null
        isAuthenticated.value = false
      }
    })
  })

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Login error:', error.message)
        return false
      }
      
      if (data.session) {
        user.value = data.session.user
        isAuthenticated.value = true
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error.message)
      } else {
        user.value = null
        isAuthenticated.value = false
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initAuth
  }
}
