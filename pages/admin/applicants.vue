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
      
      <!-- Applications list with ApplicantCard component -->
      <div v-else class="space-y-4">
        <ApplicantCard
          v-for="application in filteredApplications" 
          :key="application.id"
          :application="application"
          :jobs="jobStore.jobs.value"
          @update-status="updateStatus"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useJobStore } from '../../composables/useJobStore'
import ApplicantCard from '../../components/admin/ApplicantCard.vue'

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
const updateStatus = async (applicationId: string | undefined, status: string) => {
  if (!applicationId) return
  
  try {
    await jobStore.updateApplicationStatus(applicationId, status)
  } catch (error) {
    console.error('Failed to update application status:', error)
  }
}
</script>
