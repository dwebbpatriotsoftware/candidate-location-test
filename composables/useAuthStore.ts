import { ref } from 'vue'

export const useAuthStore = () => {
  const isAuthenticated = useState('isAuthenticated', () => false)

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { username, password }
      })
      
      if (response.success) {
        isAuthenticated.value = true
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    isAuthenticated.value = false
  }

  return {
    isAuthenticated,
    login,
    logout
  }
}
