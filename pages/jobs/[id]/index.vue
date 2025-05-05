<template>
  <JobPageTabs :job="jobPosting">
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    
    
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
        
        <div class="prose prose-indigo max-w-none job-description">
          <div v-html="jobPosting.data.full_description || jobPosting.description"></div>
        </div>
        
        <div class="mt-8 flex justify-end">
          <NuxtLink 
            :to="`/jobs/${jobId}/apply?from=description&hasData=true`" 
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Now
          </NuxtLink>
        </div>
      </div>
    </div>
    </div>
  </JobPageTabs>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useJobStore } from '../../../composables/useJobStore'
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

// Helper methods
const formatSalary = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const formatWorkplaceType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'on_site':
      return 'On-site';
    case 'hybrid':
      return 'Hybrid';
    case 'remote':
      return 'Remote';
    default:
      return type;
  }
}

// Fetch job posting
onMounted(async () => {
  isLoading.value = true
  error.value = null
  
  try {
    await jobStore.fetchJob(jobId.value)
  } catch (err: any) {
    error.value = err.message || 'Failed to load job posting'
  } finally {
    isLoading.value = false
  }
})
</script>

<style>
/* Custom styles for job description that align with the application's styling */
.job-description h3 {
  font-size: 1.25rem; /* 20px - matches global h3 */
  font-weight: 400;
  margin: 3rem 0 2rem;
  line-height: 1.3;
}

.job-description h4 {
  font-size: 1.125rem; /* 18px - matches global h4 */
  font-weight: 500;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.job-description p {
  margin-bottom: 1.5rem; /* Matches global p margin */
  line-height: 1.4;
}

.job-description ul, 
.job-description ol {
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.job-description ul {
  list-style-type: disc;
}

.job-description ol {
  list-style-type: decimal;
}

.job-description li {
  margin-bottom: 0.25rem;
  display: list-item; /* Critical for list rendering */
  line-height: 1.4;
}

/* Handle nested lists */
.job-description ul ul,
.job-description ol ol,
.job-description ul ol,
.job-description ol ul {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

/* Fix for empty paragraphs used for spacing */
.job-description p:empty {
  margin: 0.5rem 0;
}

/* Links styling to match application's color scheme */
.job-description a {
  color: var(--primary-500); /* Using app's primary color */
  text-decoration: underline;
}

.job-description a:hover {
  color: var(--primary-800); /* Using app's darker primary color */
}
</style>
