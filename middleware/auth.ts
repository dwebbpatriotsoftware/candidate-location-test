export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, initAuth } = useAuthStore()
  
  // Add check for login page to prevent redirect loop
  if (to.path === '/login') {
    return
  }
  
  // Make sure auth state is initialized
  await initAuth()
  
  if (!isAuthenticated.value && to.path === '/reports') {
    return navigateTo('/login')
  }
})
