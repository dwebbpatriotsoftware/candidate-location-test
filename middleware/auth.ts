import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, initAuth, refreshSession } = useAuth()
  
  // Add check for login page to prevent redirect loop
  if (to.path === '/login') {
    return
  }
  
  // Make sure auth state is initialized
  await initAuth()
  
  // Force session refresh to ensure we have the latest auth state
  await refreshSession()
  
  // Protect reports and all admin routes
  if (!isAuthenticated.value && (
      to.path === '/reports' || 
      to.path.startsWith('/admin/')
    )) {
    return navigateTo('/login')
  }
})
