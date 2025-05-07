<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Job Openings</h1>
      <p class="mt-2 text-gray-600">Explore our current job opportunities and find your next career move.</p>
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
    
    <div v-else-if="displayedJobs.length === 0" class="py-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No job openings</h3>
      <p class="mt-1 text-gray-500">There are currently no job openings available.</p>
    </div>
    
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="job in displayedJobs" 
        :key="job.id" 
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ job.title }}</h2>
          
          <div class="mb-4 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Created:</span>
              <span class="text-sm font-medium">{{ formatDate(job.created_at) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Updated:</span>
              <span class="text-sm font-medium">{{ formatDate(job.updated_at) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Status:</span>
              <span 
                class="text-sm font-medium px-2 py-1 rounded-full" 
                :class="{
                  'bg-green-100 text-green-800': job.status === 'published',
                  'bg-yellow-100 text-yellow-800': job.status === 'draft',
                  'bg-gray-100 text-gray-800': job.status === 'closed' || job.status === 'archived'
                }"
              >
                {{ job.status }}
              </span>
            </div>
          </div>
          
          <NuxtLink 
            :to="`/jobs/${job.id}`" 
            class="text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
          >
            View Details
            <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useJobStore } from '../../composables/useJobStore'
import { useAuth } from '../../composables/useAuth'

// Apply middleware to control access to this page
definePageMeta({
  middleware: ['jobs-access']
})

// Setup
const jobStore = useJobStore()
const { isAuthenticated } = useAuth()
const isLoading = ref(true)
const error = ref<string | null>(null)

// Computed
const displayedJobs = computed(() => {
  if (isAuthenticated.value) {

    return jobStore.jobs.value // Show all jobs if authenticated
  } else {
    return jobStore.publishedJobs.value // Show only published jobs if not authenticated
  }
})

// Methods
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

// Fetch job postings
onMounted(async () => {
  isLoading.value = true
  error.value = null
  
  try {
    await jobStore.fetchJobs()
  } catch (err: any) {
    error.value = err.message || 'Failed to load job postings'
  } finally {
    isLoading.value = false
  }
})
</script>
