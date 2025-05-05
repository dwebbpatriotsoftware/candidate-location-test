<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Page header -->
    <div class="mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">All Applicants</h1>
        <p class="mt-2 text-gray-600">View and manage applications across all job postings</p>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin h-8 w-8 text-indigo-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="p-4 bg-red-50 text-red-700 rounded-md">
      {{ error }}
    </div>
    
    <div v-else>
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
              {{ filteredApplications.length }}
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
          
          <button
            @click="activeTab = 'rejected'"
            :class="[
              activeTab === 'rejected'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Rejected
            <span
              :class="[
                activeTab === 'rejected' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]"
            >
              {{ rejectedApplications.length }}
            </span>
          </button>
          
          <button
            @click="activeTab = 'accepted'"
            :class="[
              activeTab === 'accepted'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Accepted
            <span
              :class="[
                activeTab === 'accepted' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]"
            >
              {{ acceptedApplications.length }}
            </span>
          </button>
        </nav>
      </div>
      
      <!-- Empty state -->
      <div v-if="filteredApplications.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No applications</h3>
        <p class="mt-1 text-gray-500">There are no applications matching your filters.</p>
      </div>
      
      <!-- Applications list with card design -->
      <div v-else class="space-y-4">
        <div 
          v-for="application in filteredApplications" 
          :key="application.id"
          class="bg-white shadow overflow-hidden sm:rounded-lg"
        >
          <!-- Card header with applicant info -->
          <div class="px-4 py-4 sm:px-6">
            <div>
              <div class="flex items-start">
                <p class="text-sm font-medium text-indigo-600 truncate">
                  {{ getApplicantName(application) }}
                </p>
                <p 
                  class="ml-2 px-2 inline-flex text-sm leading-5 font-semibold rounded-full"
                  :class="[
                    application.status === 'submitted' ? 'bg-green-100 text-green-800' : 
                    application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 
                    application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                    application.status === 'accepted' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ application.status.charAt(0).toUpperCase() + application.status.slice(1) }}
                </p>
              </div>
              <p class="flex items-start text-sm text-gray-500 mt-1">
                <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ getApplicantCityState(application) }}
              </p>
            </div>
            
            <!-- Job info -->
            <div class="mt-2 flex items-start text-sm text-gray-500">
              <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Applied for: {{ getJobTitle(application) }}
            </div>
            
            <!-- Applied on info -->
            <div class="mt-2 flex items-start text-sm text-gray-500">
              <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Applied on: <time :datetime="application.created_at"> {{ formatDate(application.created_at) }}</time>
            </div>
            
            <!-- Action buttons and view details -->
            <div class="mt-3 flex justify-between items-center">
              <!-- Action buttons -->
              <div class="flex space-x-2">
                <button 
                  v-if="application.status === 'submitted'"
                  class="px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  @click="updateStatus(application.id, 'reviewed')"
                >
                  Mark as Reviewed
                </button>
                <button 
                  v-if="['submitted', 'reviewed'].includes(application.status)"
                  class="px-2 py-1 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  @click="updateStatus(application.id, 'accepted')"
                >
                  Accept
                </button>
                <button 
                  v-if="['submitted', 'reviewed'].includes(application.status)"
                  class="px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-gray-50"
                  @click="updateStatus(application.id, 'rejected')"
                >
                  Reject
                </button>
              </div>
              
              <!-- View details link -->
              <button 
                @click="toggleApplicationDetails(application.id)"
                class="flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <span>{{ expandedApplications.includes(application.id) ? 'Show less' : 'See more details' }}</span>
                <svg 
                  class="ml-1 h-4 w-4 transition-transform" 
                  :class="{ 'transform rotate-180': expandedApplications.includes(application.id) }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Expanded details section -->
          <div v-if="expandedApplications.includes(application.id)">
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
                
                <!-- Cover Letter section -->
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Cover Letter</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <CoverLetterViewer 
                      v-if="application.cover_letter_path" 
                      :cover-letter-path="application.cover_letter_path" 
                    />
                    <p v-else class="text-gray-500 italic">No cover letter provided</p>
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
            
            <!-- No actions here anymore, they've been moved to the main card -->
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
import CoverLetterViewer from '../../components/admin/CoverLetterViewer.vue'

// Authentication middleware
definePageMeta({
  middleware: ['auth']
})

// Setup
const jobStore = useJobStore()
const isLoading = ref(true)
const error = ref<string | null>(null)
const jobFilter = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const activeTab = ref('all')
const expandedApplications = ref<string[]>([])

// Fetch data
onMounted(async () => {
  // Fetch all jobs for the filter dropdown
  await jobStore.fetchJobs()
  
  // Fetch all applications
  await jobStore.fetchAllApplications()
  
  isLoading.value = false
})

// Computed properties for tabs
const submittedApplications = computed(() => {
  return applyFilters(jobStore.jobApplications.value).filter(app => app.status === 'submitted')
})

const reviewedApplications = computed(() => {
  return applyFilters(jobStore.jobApplications.value).filter(app => app.status === 'reviewed')
})

const rejectedApplications = computed(() => {
  return applyFilters(jobStore.jobApplications.value).filter(app => app.status === 'rejected')
})

const acceptedApplications = computed(() => {
  return applyFilters(jobStore.jobApplications.value).filter(app => app.status === 'accepted')
})

// Apply filters to applications
const applyFilters = (applications: any[]) => {
  let filtered = [...applications]
  
  // Filter by job
  if (jobFilter.value) {
    filtered = filtered.filter(app => app.job_id === jobFilter.value)
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
    
    filtered = filtered.filter(app => {
      if (!app.created_at) return false
      return new Date(app.created_at) >= cutoff
    })
  }
  
  return filtered
}

// Computed property for filtered applications
const filteredApplications = computed(() => {
  let applications = applyFilters(jobStore.jobApplications.value)
  
  // Filter by tab
  if (activeTab.value !== 'all') {
    applications = applications.filter(app => app.status === activeTab.value)
  }
  
  // Filter by status (from dropdown)
  if (statusFilter.value) {
    applications = applications.filter(app => app.status === statusFilter.value)
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

const getApplicantCityState = (application: any) => {
  const personalInfo = application.answers?.personal_info
  if (personalInfo && personalInfo.city && personalInfo.state) {
    return `${personalInfo.city}, ${personalInfo.state}`
  }
  return 'Location not provided'
}

const getJobTitle = (application: any) => {
  // Try to get the title from the joined job_posting data
  if (application.jobs && application.jobs.title) {
    return application.jobs.title
  }
  
  // Fallback: try to find the job in jobs
  const job = jobStore.jobs.value.find(j => j.id === application.job_id)
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

const toggleApplicationDetails = (applicationId: string) => {
  const index = expandedApplications.value.indexOf(applicationId)
  if (index === -1) {
    expandedApplications.value.push(applicationId)
  } else {
    expandedApplications.value.splice(index, 1)
  }
}
</script>
