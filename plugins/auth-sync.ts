export default defineNuxtPlugin(async () => {
  // Only run on client-side
  if (process.client) {
    const { isAuthenticated, initAuth } = useAuthStore()
    
    // Initialize auth state
    await initAuth()
    
    // Add a small delay to ensure auth state is fully processed
    if (!isAuthenticated.value) {
      // Try one more time with a small delay
      await new Promise(resolve => setTimeout(resolve, 100))
      await initAuth()
    }
  }
})
