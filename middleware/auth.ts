export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, initAuth, setupAuthListener } = useAuthStore()
  
  // Add check for login page to prevent redirect loop
  if (to.path === '/login') {
    return
  }
  
  // Make sure auth state is initialized and set up listener
  await initAuth()
  setupAuthListener()
  
  // Protect reports and all admin routes
  if (!isAuthenticated.value && (
      to.path === '/reports' || 
      to.path.startsWith('/admin/')
    )) {
    return navigateTo('/login')
  }
})
