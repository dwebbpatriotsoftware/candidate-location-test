<template>
  <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
      <div class="flex items-center">
        <NuxtLink to="/admin/jobs" class="text-indigo-600 hover:text-indigo-500 flex items-center">
          <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Jobs
        </NuxtLink>
      </div>
      
      <div v-if="isLoading" class="mt-4 flex justify-center">
        <div class="animate-spin h-8 w-8 text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
      
      <div v-else-if="error" class="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
        {{ error }}
      </div>
      
      <div v-else>
        <h1 class="mt-4 text-3xl font-bold text-gray-900">Edit Job Posting</h1>
        <p class="mt-2 text-gray-600">Update job details and questions for candidates.</p>
      </div>
    </div>
    
    <div v-if="!isLoading && !error">
      <div class="mb-6 flex justify-between items-center">
        <div class="flex space-x-2">
          <span 
            :class="[
              jobStore.currentJobPosting.value?.status === 'published' ? 'bg-green-100 text-green-800' : 
              jobStore.currentJobPosting.value?.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-gray-100 text-gray-800',
              'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full'
            ]"
          >
            {{ jobStore.currentJobPosting.value?.status.charAt(0).toUpperCase() + (jobStore.currentJobPosting.value?.status.slice(1) || '') }}
          </span>
          
          <span class="text-sm text-gray-500">
            Created: {{ formatDate(jobStore.currentJobPosting.value?.created_at) }}
          </span>
        </div>
        
        <div class="flex space-x-2">
          <NuxtLink 
            :to="`/jobs/${jobId}`" 
            target="_blank"
            class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Job
          </NuxtLink>
          
          <NuxtLink 
            :to="`/admin/jobs/${jobId}/applications`" 
            class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Applications
          </NuxtLink>
        </div>
      </div>
      
      <JobForm :job-id="jobId" @submit="handleSubmit" @cancel="handleCancel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useJobStore } from '../../../../composables/useJobStore'
import JobForm from '../../../../components/admin/JobForm.vue'

// Get job ID from route
const route = useRoute()
const jobId = computed(() => route.params.id as string)

// Setup
const router = useRouter()
const jobStore = useJobStore()
const isLoading = ref(true)
const error = ref<string | null>(null)

// Methods
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const handleSubmit = () => {
  // Redirect to job listings
  router.push('/admin/jobs')
}

const handleCancel = () => {
  router.push('/admin/jobs')
}

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
