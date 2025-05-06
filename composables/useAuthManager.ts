import { useAuth } from '@sidebase/nuxt-auth/client'
import { useSupabase } from '~/utils/supabase'

export const useAuthManager = () => {
  const { status, data, signIn, signOut } = useAuth()
  const user = computed(() => data.value?.user || null)
  const isAuthenticated = computed(() => status.value === 'authenticated')
  
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
      
      await initSupabaseSession()
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }
  
  // Logout
  const logout = async () => {
    await signOut({ redirect: false })
    // Clear any remaining Supabase session
    const supabase = useSupabase()
    await supabase.auth.signOut()
  }
  
  // Setup auth listener for Supabase
  const setupAuthListener = () => {
    if (process.client) {
      const supabase = useSupabase()
      supabase.auth.onAuthStateChange((event: string, session: any) => {
        // This is mainly for backward compatibility during migration
        console.log('Supabase auth state change:', event)
      })
    }
  }
  
  // Initialize auth state - for backward compatibility
  const initAuth = async () => {
    // This is a no-op as Sidebase Auth handles session initialization
    // But we keep it for backward compatibility
    if (isAuthenticated.value) {
      await initSupabaseSession()
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
