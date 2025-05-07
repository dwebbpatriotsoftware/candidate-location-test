import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(async () => {
  const { initAuth } = useAuth()
  
  // Initialize auth state on app startup
  await initAuth()
})
