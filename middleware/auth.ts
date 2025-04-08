export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuthStore()
  
  // Add check for login page to prevent redirect loop
  if (to.path === '/login') {
    return
  }
  
  if (!isAuthenticated.value && to.path === '/reports') {
    return navigateTo('/login')
  }
})