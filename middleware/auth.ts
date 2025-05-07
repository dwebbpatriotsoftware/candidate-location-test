export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, initAuth, setupAuthListener } = useAuthManager()
  
  // Add check for login page to prevent redirect loop
  if (to.path === '/login') {
    return
  }
  
  // Make sure auth state is initialized
  await initAuth()
  
  // Set up listener only on client side
  if (process.client) {
    setupAuthListener()
  }
  
  // Add a small delay to ensure auth state is fully processed
  if (process.client && !isAuthenticated.value) {
    // Try one more time with a small delay
    await new Promise(resolve => setTimeout(resolve, 100))
    await initAuth()
  }
  
  // Protect reports and all admin routes
  if (!isAuthenticated.value && (
      to.path === '/reports' || 
      to.path.startsWith('/admin/')
    )) {
    return navigateTo('/login')
  }
})
