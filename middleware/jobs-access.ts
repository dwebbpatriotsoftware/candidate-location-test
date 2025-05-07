import { defineNuxtRouteMiddleware, navigateTo, abortNavigation } from '#app'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  // Only apply this middleware to the /jobs index page, not to individual job pages
  if (to.path === '/jobs') {
    const { isAuthenticated } = useAuth()
    
    // For authenticated users, redirect to the Manage Jobs page with "our" tab selected
    if (isAuthenticated.value) {
      return navigateTo('/admin/jobs?tab=our')
    }
    
    // For unauthenticated users, show a 404 error page
    return abortNavigation({ statusCode: 404, statusMessage: 'Page not found' })
  }
})
