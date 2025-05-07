import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  [key: string]: any
}

export function useAuth() {
  const user = useState<User | null>('auth:user', () => null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const isAuthenticated = computed(() => !!user.value)
  
  // Initialize auth state from session
  const initAuth = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data } = await useFetch<{ user: User | null }>('/api/auth/session')
      user.value = data.value?.user || null
    } catch (err) {
      console.error('Failed to initialize auth:', err)
      user.value = null
    } finally {
      isLoading.value = false
    }
  }
  
  // Login with email and password
  const login = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ user: User }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      
      if (response.user) {
        user.value = response.user
        return true
      }
      
      return false
    } catch (err: any) {
      console.error('Login error:', err)
      error.value = err.data?.message || 'Authentication failed'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  // Logout
  const logout = async () => {
    isLoading.value = true
    
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  // Refresh session
  const refreshSession = async () => {
    return initAuth()
  }
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    initAuth,
    refreshSession
  }
}
