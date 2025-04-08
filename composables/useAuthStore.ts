import { ref } from 'vue'

export const useAuthStore = () => {
  const isAuthenticated = useState('isAuthenticated', () => false)

  const login = (username: string, password: string): boolean => {
    if (username === 'admin_stuff' && password === 'you will never guess my password') {
      isAuthenticated.value = true
      return true
    }
    return false
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