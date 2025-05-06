<template>
  <div class="min-h-screen bg-white">
    <!-- Simplified header for unauthenticated users on job details or apply page -->
    <div v-if="isJobDetailsOrApplyPage && !isAuthenticated" class="bg-white border-b border-gray-200 py-4">
      <div class="flex justify-center">
        <NuxtLink to="/" class="flex-shrink-0">
          <img src="/images/patriot-logo.svg" alt="Patriot Software" class="h-24 w-auto" />
        </NuxtLink>
      </div>
    </div>
    
    <!-- Regular header for all other cases -->
    <nav v-else class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex-shrink-0">
              <img src="/images/patriot-logo.svg" alt="Patriot Software" class="h-16 w-auto" />
            </NuxtLink>
            <div class="hidden md:block ml-10">
              <div class="flex items-baseline space-x-4">
                <NuxtLink 
                  v-if="isAuthenticated"
                  to="/admin/jobs" 
                  class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  :class="{ 'text-indigo-600': isAdminPage && !isApplicantsPage }"
                >
                  Manage Jobs
                </NuxtLink>
                <NuxtLink 
                  v-if="isAuthenticated"
                  to="/admin/applicants" 
                  class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  :class="{ 'text-indigo-600': isApplicantsPage }"
                >
                  Manage Applications
                </NuxtLink>
                <NuxtLink 
                  v-if="isAuthenticated"
                  to="/reports" 
                  class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  :class="{ 'text-indigo-600': isReportsPage }"
                >
                  Reports
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <ClientOnly>
              <NuxtLink 
                v-if="!isAssessmentPage"
                :to="authLinkDestination" 
                class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-150 shadow-sm"
                @click.prevent="handleAuthClick"
              >
                {{ authLinkText }}
              </NuxtLink>
            </ClientOnly>
          </div>
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { isAuthenticated, logout, initAuth, setupAuthListener } = useAuthStore()

// Initialize auth state when app loads
onMounted(async () => {
  await initAuth()
  if (process.client) {
    setupAuthListener()
  }
})

// Check current page
const isAssessmentPage = computed(() => route.path === '/assessment')
const isJobsPage = computed(() => route.path.startsWith('/jobs'))
const isJobDetailsPage = computed(() => route.path.match(/^\/jobs\/[^\/]+$/) !== null)
const isJobDetailsOrApplyPage = computed(() => 
  route.path.match(/^\/jobs\/[^\/]+$/) !== null || 
  route.path.match(/^\/jobs\/[^\/]+\/apply$/) !== null
)
const isReportsPage = computed(() => route.path === '/reports')
const isAdminPage = computed(() => route.path.startsWith('/admin'))
const isApplicantsPage = computed(() => route.path === '/admin/applicants')

// Determine auth link text based on authentication state
const authLinkText = computed(() => {
  return isAuthenticated.value ? 'Logout' : 'Login'
})

// Determine auth link destination
const authLinkDestination = computed(() => {
  return isAuthenticated.value ? '#' : '/login'
})

// Handle auth link click
const handleAuthClick = async () => {
  if (isAuthenticated.value) {
    await logout()
    // Redirect to home page after logout
    router.push('/')
  }
}
</script>
