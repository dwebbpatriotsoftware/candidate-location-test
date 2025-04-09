<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-indigo-600 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <ClientOnly>
            <NuxtLink 
              v-if="!isAssessmentPage"
              to="/login" 
              class="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-400 transition duration-150 shadow-sm"
            >
              Login
            </NuxtLink>
          </ClientOnly>
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
const route = useRoute()

// Check if current page is the assessment page
const isAssessmentPage = computed(() => {
  return route.path === '/assessment'
})
</script>
