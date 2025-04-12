export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, initAuth, setupAuthListener } = useAuthStore()
  
  // Add check for login page to prevent redirect loop
  if (to.path === '/login') {
    return
  }
  
  // Make sure auth state is initialized and set up listener
  await initAuth()
  setupAuthListener()
  
  if (!isAuthenticated.value && to.path === '/reports') {
    return navigateTo('/login')
  }
})
