<template>
  <JobPageTabs :job="jobPosting">
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div v-if="isLoading" class="flex justify-center py-6">
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
    
    <div v-if="jobPosting">
      <ApplicationForm :job-id="jobId" :key="jobId" />
    </div>
    </div>
  </JobPageTabs>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useJobStore } from '../../../composables/useJobStore'
import ApplicationForm from '../../../components/jobs/ApplicationForm.vue'
import JobPageTabs from '../../../components/jobs/JobPageTabs.vue'

// Get job ID from route
const route = useRoute()
const jobId = computed(() => route.params.id as string)

// Setup
const jobStore = useJobStore()
const isLoading = ref(true)
const error = ref<string | null>(null)

// Computed
const jobPosting = computed(() => jobStore.currentJob.value)

  // Check if we're coming from the description page
const fromDescription = computed(() => route.query.from === 'description')

// Watch for route changes to ensure data is saved when navigating away
watch(
  () => route.path,
  (newPath, oldPath) => {
    if (oldPath && oldPath.includes('/apply') && !newPath.includes('/apply')) {
      // User is navigating away from the apply page
      // The ApplicationForm component will handle saving the data
      console.log('Navigating away from application form')
    }
  }
)

  // Fetch job posting and questions
onMounted(async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Fetch job data
    await jobStore.fetchJob(jobId.value)
    
    // Fetch job questions with form customizations applied
    await jobStore.fetchJobQuestions(jobId.value)
    
    // Log if we're coming from the description page
    if (fromDescription.value) {
      console.log('Returning to application form from job description')
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load job posting'
  } finally {
    isLoading.value = false
  }
})
</script>
