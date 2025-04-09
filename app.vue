<template>
  <div class="min-h-screen bg-white">
    <nav class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center relative">
          <div class="flex items-center justify-center w-full">
            <img src="/images/patriot-logo.svg" alt="Patriot Software" class="h-16 w-auto" />
          </div>
          <div class="flex items-center space-x-4 absolute right-0">
            <ClientOnly>
              <NuxtLink 
                v-if="!isAssessmentPage"
                :to="authLinkDestination" 
                class="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-500 transition duration-150 shadow-sm"
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
const { isAuthenticated, logout } = useAuthStore()

// Check if current page is the assessment page
const isAssessmentPage = computed(() => {
  return route.path === '/assessment'
})

// Determine auth link text based on authentication state
const authLinkText = computed(() => {
  return isAuthenticated.value ? 'Logout' : 'Login'
})

// Determine auth link destination
const authLinkDestination = computed(() => {
  return isAuthenticated.value ? '#' : '/login'
})

// Handle auth link click
const handleAuthClick = () => {
  if (isAuthenticated.value) {
    logout()
    // Redirect to home page after logout
    router.push('/')
  }
}
</script>
