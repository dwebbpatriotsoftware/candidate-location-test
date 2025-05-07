import { useSupabase } from '~/utils/supabase'

export const useAuthManager = () => {
  // Using useAuth directly without importing it
  const { status, data, signIn, signOut } = useAuth()
  
  // Use useState instead of computed to ensure state persists across components
  const user = useState<any>('user', () => null)
  const isAuthenticated = useState('isAuthenticated', () => false)
  
  // Watch for changes in the auth state and update our state
  watch(() => data.value?.user, (newUser) => {
    if (newUser) {
      user.value = newUser
      isAuthenticated.value = true
    }
  }, { immediate: true })
  
  watch(() => status.value, (newStatus) => {
    isAuthenticated.value = newStatus === 'authenticated'
  }, { immediate: true })
  
  // Initialize Supabase session from Sidebase Auth session
  const initSupabaseSession = async () => {
    if (isAuthenticated.value && data.value?.supabaseAccessToken) {
      const supabase = useSupabase()
      await supabase.auth.setSession({
        access_token: data.value.supabaseAccessToken,
        refresh_token: data.value.supabaseRefreshToken || ''
      })
    }
  }
  
  // Login with email/password
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signIn('credentials', { 
        email, 
        password,
        redirect: false
      })
      
      if (result?.error) {
        console.error('Login error:', result.error)
        return false
      }
      
      // Explicitly set the state
      isAuthenticated.value = true
      
      await initSupabaseSession()
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }
  
  // Logout
  const logout = async () => {
    try {
      await signOut({ redirect: false })
      
      // Clear Supabase client session
      const supabase = useSupabase()
      await supabase.auth.signOut()
      
      // Update local state
      user.value = null
      isAuthenticated.value = false
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  
  // Setup auth listener for Supabase
  const setupAuthListener = () => {
    if (process.client) {
      const supabase = useSupabase()
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
  
  // Initialize auth state with more robust approach
  const initAuth = async () => {
    try {
      // First check if we have a session in localStorage (client-side only)
      if (process.client) {
        // Try to get the session from Supabase client directly
        const supabase = useSupabase()
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (session) {
          user.value = session.user
          isAuthenticated.value = true
          return // Successfully restored session
        }
      }
      
      // If client-side restoration failed or we're on server, try the API
      try {
        const sessionData = await $fetch('/api/auth/session')
        if (sessionData.session) {
          user.value = sessionData.session.user
          isAuthenticated.value = true
          
          // Also update Supabase client session
          if (process.client && sessionData.session) {
            const supabase = useSupabase()
            await supabase.auth.setSession({
              access_token: sessionData.session.access_token,
              refresh_token: sessionData.session.refresh_token
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
  
  return {
    user,
    isAuthenticated,
    login,
    logout,
    initAuth,
    setupAuthListener,
    initSupabaseSession
  }
}
