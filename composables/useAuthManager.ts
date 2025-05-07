import { useSupabase } from '~/utils/supabase'

export const useAuthManager = () => {
  // Using useAuth directly without importing it
  const { status, data, signIn, signOut } = useAuth()
  
  // Use useState instead of computed to ensure state persists across components
  const user = useState<any>('user', () => null)
  const isAuthenticated = useState('isAuthenticated', () => false)
  
  // Use a single watcher that considers both sources of truth for authentication state
  watch([() => data.value?.user, () => status.value], ([newUser, newStatus]) => {
    console.log('Auth state update:', { user: !!newUser, status: newStatus });
    
    // If user is null, we're not authenticated regardless of status
    if (!newUser) {
      console.log('No user data, setting to unauthenticated');
      isAuthenticated.value = false;
    } else {
      // Otherwise, require both user and authenticated status
      isAuthenticated.value = (!!newUser && newStatus === 'authenticated');
      console.log('Setting authentication state to:', isAuthenticated.value);
    }
    
    if (newUser) {
      user.value = newUser;
    }
  }, { immediate: true });
  
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
      console.log('Starting logout process');
      
      // Update local state immediately
      user.value = null;
      isAuthenticated.value = false;
      
      // Then sign out from auth providers
      await signOut({ redirect: false });
      
      // Clear Supabase client session
      if (process.client) {
        const supabase = useSupabase();
        await supabase.auth.signOut();
      }
      
      // Double-check authentication state after logout
      console.log('Logout complete, ensuring auth state is updated');
      isAuthenticated.value = false;
    } catch (error) {
      console.error('Logout error:', error);
      isAuthenticated.value = false;
    }
  }
  
  // Setup auth listener for Supabase
  const setupAuthListener = () => {
    if (process.client) {
      const supabase = useSupabase()
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
        console.log('Auth state changed:', event, session)
        
        // Handle session events
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
          console.log(`Auth event ${event} with session, updating user and auth state`);
          user.value = session.user;
          
          // Don't directly set isAuthenticated here, let the watcher handle it
          // This prevents conflicts with the status watcher
          
          // Instead, ensure the session is properly synced with Nuxt Auth if needed
          if (status.value !== 'authenticated' && event === 'INITIAL_SESSION') {
            console.log('Detected Supabase session but Nuxt Auth status is not authenticated, syncing...');
            // We could potentially sync with Nuxt Auth here if needed
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('Signed out event, clearing user and explicitly setting not authenticated');
          user.value = null;
          // Explicitly set not authenticated for SIGNED_OUT events
          isAuthenticated.value = false;
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
      console.log('Initializing auth state...');
      
      // Check if we already have auth data from useAuth
      if (status.value === 'authenticated' && data.value?.user) {
        console.log('Already authenticated via useAuth');
        user.value = data.value.user;
        isAuthenticated.value = true;
        
        // Sync with Supabase if we have tokens
        if (data.value?.supabaseAccessToken) {
          await initSupabaseSession();
        }
        return;
      }
      
      // First check if we have a session in localStorage (client-side only)
      if (process.client) {
        // Try to get the session from Supabase client directly
        const supabase = useSupabase();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Found Supabase session');
          user.value = session.user;
          isAuthenticated.value = true;
          return; // Successfully restored session
        } else {
          console.log('No Supabase session found');
        }
      }
      
      // If client-side restoration failed or we're on server, try the API
      try {
        const sessionData = await $fetch('/api/auth/session');
        if (sessionData.session) {
          console.log('Found session via API');
          user.value = sessionData.session.user;
          isAuthenticated.value = true;
          
          // Also update Supabase client session
          if (process.client && sessionData.session) {
            const supabase = useSupabase();
            await supabase.auth.setSession({
              access_token: sessionData.session.access_token,
              refresh_token: sessionData.session.refresh_token
            });
          }
        } else {
          console.log('No session found via API');
        }
      } catch (apiError) {
        console.error('API session fetch error:', apiError);
      }
      
      // Final check - if we still don't have a user, we're not authenticated
      // regardless of what the status says
      if (!user.value) {
        console.log('No user data found, setting to unauthenticated regardless of status');
        isAuthenticated.value = false;
      } else if (!isAuthenticated.value) {
        console.log('No authentication found, setting to unauthenticated');
      }
      
    } catch (error) {
      console.error('Session initialization error:', error);
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
