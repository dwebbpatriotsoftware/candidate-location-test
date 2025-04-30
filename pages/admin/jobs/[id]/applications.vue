<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
      <div class="flex items-center">
        <NuxtLink :to="`/admin/jobs/${jobId}`" class="text-indigo-600 hover:text-indigo-500 flex items-center">
          <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Job
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
      
      <div v-else class="mt-4 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Applications</h1>
          <p class="mt-2 text-gray-600">
            {{ jobStore.currentJobPosting.value?.title || 'Job' }} Applications
          </p>
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
        </div>
      </div>
    </div>
    
    <div v-if="!isLoading && !error">
      <!-- Status tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            @click="activeTab = 'all'"
            :class="[
              activeTab === 'all'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            All Applications
            <span
              :class="[
                activeTab === 'all' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]"
            >
              {{ jobStore.jobApplications.value.length }}
            </span>
          </button>
          
          <button
            @click="activeTab = 'submitted'"
            :class="[
              activeTab === 'submitted'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            New
            <span
              :class="[
                activeTab === 'submitted' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]"
            >
              {{ submittedApplications.length }}
            </span>
          </button>
          
          <button
            @click="activeTab = 'reviewed'"
            :class="[
              activeTab === 'reviewed'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Reviewed
            <span
              :class="[
                activeTab === 'reviewed' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]"
            >
              {{ reviewedApplications.length }}
            </span>
          </button>
        </nav>
      </div>
      
      <!-- Applications list -->
      <div v-if="filteredApplications.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No applications</h3>
        <p class="mt-1 text-gray-500">There are no applications for this job posting yet.</p>
      </div>
      
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="application in filteredApplications" :key="application.id">
            <div class="block hover:bg-gray-50">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <p class="text-sm font-medium text-indigo-600 truncate">
                      {{ getApplicantName(application) }}
                    </p>
                    <div class="ml-2 flex-shrink-0 flex">
                      <p 
                        :class="[
                          application.status === 'submitted' ? 'bg-green-100 text-green-800' : 
                          application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800',
                          'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                        ]"
                      >
                        {{ application.status.charAt(0).toUpperCase() + application.status.slice(1) }}
                      </p>
                    </div>
                  </div>
                  <div class="ml-2 flex-shrink-0 flex">
                    <button 
                      @click="viewApplication(application)"
                      class="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View details
                    </button>
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {{ getApplicantEmail(application) }}
                    </p>
                    <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {{ getApplicantPhone(application) }}
                    </p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>
                      Applied on <time :datetime="application.created_at">{{ formatDate(application.created_at) }}</time>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useJobStore } from '../../../../composables/useJobStore'
import { documentService } from '../../../../services/documentService'

// Authentication middleware
definePageMeta({
  middleware: ['auth']
})

// Get job ID from route
const route = useRoute()
const jobId = computed(() => route.params.id as string)

// Setup
const jobStore = useJobStore()
const isLoading = ref(true)
const error = ref<string | null>(null)
const activeTab = ref('all')

// Computed
const filteredApplications = computed(() => {
  if (activeTab.value === 'all') {
    return jobStore.jobApplications.value
  } else {
    return jobStore.jobApplications.value.filter(app => app.status === activeTab.value)
  }
})

const submittedApplications = computed(() => {
  return jobStore.jobApplications.value.filter(app => app.status === 'submitted')
})

const reviewedApplications = computed(() => {
  return jobStore.jobApplications.value.filter(app => app.status === 'reviewed')
})

// Methods
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const getApplicantName = (application: any) => {
  const personalInfo = application.answers?.personal_info
  if (personalInfo) {
    return `${personalInfo.firstName} ${personalInfo.lastName}`
  }
  return 'Unknown Applicant'
}

const getApplicantEmail = (application: any) => {
  return application.answers?.personal_info?.email || 'No email provided'
}

const getApplicantPhone = (application: any) => {
  return application.answers?.personal_info?.phone || 'No phone provided'
}

const viewApplication = async (application: any) => {
  // In a real app, this would open a modal or navigate to a details page
  alert(`Viewing application for ${getApplicantName(application)}`)
  
  // If there's a resume, we could open it
  if (application.resume_path) {
    const resumeUrl = await documentService.getResumeUrl(application.resume_path)
    if (resumeUrl) {
      window.open(resumeUrl, '_blank')
    }
  }
}

// Fetch job posting and applications
onMounted(async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Fetch job posting
    await jobStore.fetchJobPosting(jobId.value)
    
    // Fetch applications for this job
    await jobStore.fetchJobApplications(jobId.value)
  } catch (err: any) {
    error.value = err.message || 'Failed to load job applications'
  } finally {
    isLoading.value = false
  }
})
</script>
