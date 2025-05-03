<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">All Job Applications</h1>
      <p class="mt-2 text-gray-600">View and manage applications across all job postings</p>
    </div>
    
    <!-- Filters -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Job filter -->
        <div>
          <label for="job-filter" class="block text-sm font-medium text-gray-700 mb-1">Job</label>
          <select
            id="job-filter"
            v-model="jobFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Jobs</option>
            <option v-for="job in jobStore.jobs.value" :key="job.id" :value="job.id">
              {{ job.title }}
            </option>
          </select>
        </div>
        
        <!-- Status filter -->
        <div>
          <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status-filter"
            v-model="statusFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="reviewed">Reviewed</option>
            <option value="rejected">Rejected</option>
            <option value="accepted">Accepted</option>
          </select>
        </div>
        
        <!-- Date filter -->
        <div>
          <label for="date-filter" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
            id="date-filter"
            v-model="dateFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="jobStore.isLoading.value" class="flex justify-center py-12">
      <div class="animate-spin h-8 w-8 text-indigo-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="jobStore.error.value" class="p-4 bg-red-50 text-red-700 rounded-md">
      {{ jobStore.error.value }}
    </div>
    
    <!-- Empty state -->
    <div v-else-if="filteredApplications.length === 0" class="py-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No applications</h3>
      <p class="mt-1 text-gray-500">There are no applications matching your filters.</p>
    </div>
    
    <!-- Applications list -->
    <div v-else>
      <div class="space-y-6">
        <div 
          v-for="application in filteredApplications" 
          :key="application.id"
          class="bg-white shadow overflow-hidden sm:rounded-lg"
        >
          <div class="px-4 py-5 sm:px-6">
            <div class="flex justify-between">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ getApplicantName(application) }}
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  Applied for: {{ getJobTitle(application) }}
                </p>
              </div>
              <span 
                :class="[
                  application.status === 'submitted' ? 'bg-green-100 text-green-800' : 
                  application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 
                  application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                  application.status === 'accepted' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800',
                  'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full'
                ]"
              >
                {{ application.status.charAt(0).toUpperCase() + application.status.slice(1) }}
              </span>
            </div>
          </div>
          
          <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ getApplicantEmail(application) }}</dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Phone</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ getApplicantPhone(application) }}</dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Applied on</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(application.created_at) }}</dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Location</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ getApplicantLocation(application) }}
                </dd>
              </div>
              
              <!-- Resume section -->
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">Resume</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <ResumeViewer 
                    v-if="application.resume_path" 
                    :resume-path="application.resume_path" 
                  />
                  <p v-else class="text-gray-500 italic">No resume provided</p>
                </dd>
              </div>
              
              <!-- Additional questions section -->
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">Additional Information</dt>
                <dd class="mt-1 text-sm text-gray-900 space-y-2">
                  <div v-for="(answer, questionId) in application.answers?.job_questions" :key="questionId">
                    <p class="font-medium">{{ getQuestionText(questionId) }}</p>
                    <p>{{ answer }}</p>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
          
          <!-- Actions -->
          <div class="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50 flex justify-end space-x-3">
            <button 
              v-if="application.status === 'submitted'"
              class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              @click="updateStatus(application.id, 'reviewed')"
            >
              Mark as Reviewed
            </button>
            <button 
              v-if="['submitted', 'reviewed'].includes(application.status)"
              class="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              @click="updateStatus(application.id, 'accepted')"
            >
              Accept
            </button>
            <button 
              v-if="['submitted', 'reviewed'].includes(application.status)"
              class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50"
              @click="updateStatus(application.id, 'rejected')"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useJobStore } from '../../composables/useJobStore'
import ResumeViewer from '../../components/admin/ResumeViewer.vue'

// Authentication middleware
definePageMeta({
  middleware: ['auth']
})

// Setup
const jobStore = useJobStore()
const jobFilter = ref('')
const statusFilter = ref('')
const dateFilter = ref('')

// Fetch data
onMounted(async () => {
  // Fetch all jobs for the filter dropdown
  await jobStore.fetchJobs()
  
  // Fetch all applications
  await jobStore.fetchAllApplications()
})

// Computed
const filteredApplications = computed(() => {
  let applications = jobStore.jobApplications.value

  // Filter by job
  if (jobFilter.value) {
    applications = applications.filter(app => app.job_posting_id === jobFilter.value)
  }

  // Filter by status
  if (statusFilter.value) {
    applications = applications.filter(app => app.status === statusFilter.value)
  }

  // Filter by date
  if (dateFilter.value) {
    const now = new Date()
    let cutoff = new Date()
    
    if (dateFilter.value === 'today') {
      cutoff.setHours(0, 0, 0, 0)
    } else if (dateFilter.value === 'week') {
      cutoff.setDate(now.getDate() - 7)
    } else if (dateFilter.value === 'month') {
      cutoff.setMonth(now.getMonth() - 1)
    }
    
    applications = applications.filter(app => {
      if (!app.created_at) return false
      return new Date(app.created_at) >= cutoff
    })
  }

  return applications
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

const getApplicantLocation = (application: any) => {
  const personalInfo = application.answers?.personal_info
  if (personalInfo) {
    return `${personalInfo.city}, ${personalInfo.state} ${personalInfo.zipCode}`
  }
  return 'Location not provided'
}

const getJobTitle = (application: any) => {
  // Try to get the title from the joined job_posting data
  if (application.job_posting && application.job_posting.title) {
    return application.job_posting.title
  }
  
  // Fallback: try to find the job in jobs
  const job = jobStore.jobs.value.find(j => j.id === application.job_posting_id)
  return job ? job.title : 'Unknown Job'
}

const getQuestionText = (questionId: string | number) => {
  // This would need to fetch the question text from somewhere
  // For now, just return a placeholder
  return `Question ${questionId}`
}

const updateStatus = async (applicationId: string | undefined, status: string) => {
  if (!applicationId) return
  
  try {
    await jobStore.updateApplicationStatus(applicationId, status)
  } catch (error) {
    console.error('Failed to update application status:', error)
  }
}
</script>
