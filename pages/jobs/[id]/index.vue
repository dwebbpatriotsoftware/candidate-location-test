<template>
  <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
      <div class="flex items-center">
        <NuxtLink to="/jobs" class="text-indigo-600 hover:text-indigo-500 flex items-center">
          <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Jobs
        </NuxtLink>
      </div>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin h-8 w-8 text-indigo-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
    
    <div v-else-if="error" class="p-4 bg-red-50 text-red-700 rounded-md">
      {{ error }}
    </div>
    
    <div v-else-if="jobPosting" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ jobPosting.title }}</h1>
        
        <div class="prose prose-indigo max-w-none">
          <p class="whitespace-pre-line">{{ jobPosting.description }}</p>
        </div>
        
        <div class="mt-8 flex justify-end">
          <NuxtLink 
            :to="`/jobs/${jobId}/apply`" 
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Now
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useJobStore } from '../../../composables/useJobStore'

// Get job ID from route
const route = useRoute()
const jobId = computed(() => route.params.id as string)

// Setup
const jobStore = useJobStore()
const isLoading = ref(true)
const error = ref<string | null>(null)

// Computed
const jobPosting = computed(() => jobStore.currentJobPosting.value)

// Fetch job posting
onMounted(async () => {
  isLoading.value = true
  error.value = null
  
  try {
    await jobStore.fetchJobPosting(jobId.value)
  } catch (err: any) {
    error.value = err.message || 'Failed to load job posting'
  } finally {
    isLoading.value = false
  }
})
</script>
