<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Job Postings</h1>
        <p class="mt-2 text-gray-600">Manage job postings and applications</p>
      </div>
      
      <div class="flex space-x-2">
        <button 
          @click="pullWorkableJobs" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          :disabled="isLoading"
        >
          <svg v-if="!isLoading" class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Pull Workable Jobs
        </button>
        
        <NuxtLink 
          to="/admin/jobs/new" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Job Posting
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
    
    <div v-else-if="jobStore.jobPostings.value.length === 0" class="py-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No job postings</h3>
      <p class="mt-1 text-gray-500">Get started by creating a new job posting.</p>
    </div>
    
    <div v-else>
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
            All Jobs
            <span
              :class="[
                activeTab === 'all' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]"
            >
              {{ jobStore.jobPostings.value.length }}
            </span>
          </button>
          
          <button
            @click="activeTab = 'published'"
            :class="[
              activeTab === 'published'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Published
            <span
              :class="[
                activeTab === 'published' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]"
            >
              {{ jobStore.publishedJobs.value.length }}
            </span>
          </button>
          
          <button
            @click="activeTab = 'draft'"
            :class="[
              activeTab === 'draft'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Drafts
            <span
              :class="[
                activeTab === 'draft' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]"
            >
              {{ jobStore.draftJobs.value.length }}
            </span>
          </button>
          
          <button
            @click="activeTab = 'closed'"
            :class="[
              activeTab === 'closed'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Closed
            <span
              :class="[
                activeTab === 'closed' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]"
            >
              {{ jobStore.closedJobs.value.length }}
            </span>
          </button>
          
          <button
            @click="activeTab = 'workable'"
            :class="[
              activeTab === 'workable'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Workable
            <span
              :class="[
                activeTab === 'workable' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]"
            >
              {{ jobStore.workablePagination.value.totalJobs }}
            </span>
          </button>
        </nav>
      </div>
      
      <!-- Job listings table -->
      <div class="overflow-x-auto">
        <!-- Pagination controls for Workable jobs -->
        <div v-if="activeTab === 'workable' && jobStore.workablePagination.value.totalPages > 1" class="mb-4 flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Showing page {{ jobStore.workablePagination.value.currentPage }} of {{ jobStore.workablePagination.value.totalPages }}
          </div>
          <div class="flex space-x-2">
            <button
              @click="changePage(jobStore.workablePagination.value.currentPage - 1)"
              :disabled="jobStore.workablePagination.value.currentPage === 1 || isLoading"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="changePage(jobStore.workablePagination.value.currentPage + 1)"
              :disabled="jobStore.workablePagination.value.currentPage === jobStore.workablePagination.value.totalPages || isLoading"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
        <table class="min-w-full divide-y divide-gray-200 border-table responsive-table-labels">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applications
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="job in filteredJobs" :key="job.id">
              <td data-column="Job Title" class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ job.title }}</div>
                <div v-if="job.workable_job" class="text-xs text-blue-600">Workable</div>
              </td>
              <td data-column="Department" class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ job.workable_job ? (job.department?.name || 'Unknown') : getDepartmentName(job.department_id) }}
                </div>
              </td>
              <td data-column="Status" class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    job.status === 'published' ? 'bg-green-100 text-green-800' : 
                    job.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800',
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                  ]"
                >
                  {{ job.status ? (job.status.charAt(0).toUpperCase() + job.status.slice(1)) : 'Unknown' }}
                </span>
              </td>
              <td data-column="Applications" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <!-- In a real app, this would show the actual count -->
                0 applications
              </td>
              <td data-column="Created" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(job.created_at) }}
              </td>
              <td data-column="Actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <template v-if="job.workable_job">
                    <a 
                      v-if="job.shortcode"
                      :href="`https://${runtimeConfig.public.workableSubDomain}.workable.com/jobs/${job.shortcode}`" 
                      target="_blank" 
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      View in Workable
                    </a>
                    <span v-else class="text-gray-400">No link available</span>
                  </template>
                  <template v-else>
                    <NuxtLink :to="`/admin/jobs/${job.id}`" class="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </NuxtLink>
                    <NuxtLink :to="`/jobs/${job.id}`" class="text-gray-600 hover:text-gray-900">
                      View
                    </NuxtLink>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useJobStore } from '../../../composables/useJobStore'
import { useRuntimeConfig } from '#app'

// Authentication middleware
definePageMeta({
  middleware: ['auth']
})

// Setup
const jobStore = useJobStore()
const isLoading = ref(true)
const error = ref<string | null>(null)
const activeTab = ref('all')
const runtimeConfig = useRuntimeConfig()

// Computed
const filteredJobs = computed(() => {
  if (activeTab.value === 'all') {
    return jobStore.jobPostings.value
  } else if (activeTab.value === 'published') {
    return jobStore.publishedJobs.value
  } else if (activeTab.value === 'draft') {
    return jobStore.draftJobs.value
  } else if (activeTab.value === 'closed') {
    return jobStore.closedJobs.value
  } else if (activeTab.value === 'workable') {
    return jobStore.workableJobs.value.map(job => ({
      ...job,
      workable_job: true // Flag to identify Workable jobs
    }))
  }
  return []
})

// Methods
const getDepartmentName = (departmentId: string) => {
  const departments = {
    'dept_1': 'Engineering',
    'dept_2': 'Marketing',
    'dept_3': 'Sales',
    'dept_4': 'Human Resources',
    'dept_5': 'Finance'
  }
  return departments[departmentId as keyof typeof departments] || 'Unknown'
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

// Methods for Workable jobs
const pullWorkableJobs = async () => {
  try {
    await jobStore.fetchWorkableJobs(1) // Start with page 1
    // Switch to the Workable tab after fetching
    activeTab.value = 'workable'
  } catch (err: any) {
    error.value = err.message || 'Failed to pull Workable jobs'
  }
}

const changePage = async (page: number) => {
  if (page < 1 || page > jobStore.workablePagination.value.totalPages) {
    return
  }
  
  try {
    isLoading.value = true
    await jobStore.fetchWorkableJobs(page)
  } catch (err: any) {
    error.value = err.message || 'Failed to change page'
  } finally {
    isLoading.value = false
  }
}

// Fetch job postings
onMounted(async () => {
  isLoading.value = true
  error.value = null
  
  try {
    await jobStore.fetchJobPostings()
  } catch (err: any) {
    error.value = err.message || 'Failed to load job postings'
  } finally {
    isLoading.value = false
  }
})
</script>
