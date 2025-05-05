<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Job Postings</h1>
        <p class="mt-2 text-gray-600">Manage job postings and applications</p>
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
    
    <div v-else-if="jobStore.jobs.value.length === 0 && activeTab !== 'workable'" class="py-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No job postings</h3>
      <p class="mt-1 text-gray-500">Pull jobs from Workable to get started.</p>
    </div>
    
    <div v-else>
      <!-- Status tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            @click="activeTab = 'workable'"
            :class="[
              activeTab === 'workable'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            1. Import Workable Jobs
            <span
              :class="[
                activeTab === 'workable' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]"
            >
              {{ jobStore.workablePagination.value.totalJobs }}
            </span>
          </button>
          
          <button
            @click="activeTab = 'our'"
            :class="[
              activeTab === 'our'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            2. Saved Jobs
            <span
              :class="[
                activeTab === 'our' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]"
            >
              {{ Array.isArray(jobStore.jobs.value) ? jobStore.jobs.value.length : 0 }}
            </span>
          </button>
        </nav>
      </div>
      
      <!-- Job listings table (shown when workable or our tabs are active) -->
      <div v-if="activeTab === 'workable' || activeTab === 'our'" class="mt-6">
        <!-- Workable tab controls -->
        <div v-if="activeTab === 'workable'" class="mb-4 flex justify-between items-center">
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
          </div>
        </div>
        
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
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 border-table responsive-table-labels">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shortcode
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
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
            <!-- Display saved jobs -->
            <template v-if="activeTab === 'our'">
              <tr v-for="job in jobStore.jobs.value" :key="job.id">
                <td data-column="Shortcode" class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ job.id }}</div>
                </td>
                <td data-column="Job Title" class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ job.title }}</div>
                </td>
                <td data-column="Created" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(job.created_at) }}
                </td>
                <td data-column="Actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end items-center space-x-4">
                    <!-- Copy button -->
                    <button 
                      @click="copyUrl(getJobUrl(job.id), job.id)" 
                      class="relative focus:outline-none flex items-center"
                      :aria-label="`Copy link to ${job.title}`"
                    >
                      <!-- Copy icon SVG -->
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        :class="[
                          'h-5 w-5 transition-colors duration-200',
                          jobStore.copiedUrls[job.id] ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'
                        ]"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          stroke-linecap="round" 
                          stroke-linejoin="round" 
                          stroke-width="2" 
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      
                      <!-- Copied tooltip -->
                      <span 
                        v-if="jobStore.copiedUrls[job.id]" 
                        class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-xs rounded shadow-lg"
                      >
                        Copied!
                      </span>
                    </button>
                    
                    <NuxtLink 
                      :to="`/jobs/${job.id}`" 
                      class="text-indigo-600 hover:text-indigo-900 flex items-center"
                    >
                      View
                    </NuxtLink>
                    <NuxtLink 
                      :to="`/admin/jobs/${job.id}`" 
                      class="text-green-600 hover:text-green-900 flex items-center"
                    >
                      Edit
                    </NuxtLink>
                    <button 
                      @click="confirmDelete(job)" 
                      class="text-red-600 hover:text-red-900 flex items-center"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            
            <!-- Display Workable jobs -->
            <template v-else>
              <tr v-for="job in jobStore.workableJobs.value" :key="job.shortcode || ''">
                <td data-column="Shortcode" class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ job.shortcode || 'N/A' }}</div>
                </td>
                <td data-column="Job Title" class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ job.title || 'Untitled Job' }}</div>
                </td>
                <td data-column="Created" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(job.created_at) }}
                </td>
                <td data-column="Actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button 
                      @click="saveJob(job)" 
                      class="text-green-600 hover:text-green-900"
                      :disabled="isJobSaved(job.shortcode)"
                    >
                      {{ isJobSaved(job.shortcode) ? 'Saved' : 'Save' }}
                    </button>
                    <a 
                      v-if="job.shortcode"
                      :href="`https://${runtimeConfig.public.workableSubDomain}.workable.com/jobs/${job.shortcode}`" 
                      target="_blank" 
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      View in Workable
                    </a>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useJobStore } from '../../../composables/useJobStore'
import { useRuntimeConfig } from '#app'

// Define types
interface Job {
  id: string;
  title: string;
  status: string;
  data: any;
  created_at?: string;
  updated_at?: string;
  last_synced_at?: string;
}

interface WorkableJob {
  shortcode: string;
  title: string;
  state: string;
  department?: {
    name: string;
  };
  created_at?: string;
  [key: string]: any;
}

// Authentication middleware
definePageMeta({
  middleware: ['auth']
})

// Setup
const jobStore = useJobStore()
const isLoading = ref(true)
const error = ref<string | null>(null)
const route = useRoute()
const activeTab = ref('workable')
const runtimeConfig = useRuntimeConfig()
const jobToDelete = ref<Job | null>(null)

// Set active tab based on query parameter if provided
onMounted(() => {
  if (route.query.tab === 'our') {
    activeTab.value = 'our'
  }
})

// Check if a Workable job is already saved
const isJobSaved = (shortcode: string) => {
  return jobStore.jobs.value.some(job => job.id === shortcode)
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

const saveJob = async (job: any) => {
  if (!job || !job.shortcode) {
    error.value = 'Job is missing a shortcode'
    return
  }
  
  if (isJobSaved(job.shortcode)) return
  
  try {
    await jobStore.saveWorkableJob(job)
  } catch (err: any) {
    error.value = err.message || 'Failed to save job'
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

const confirmDelete = (job: Job) => {
  jobToDelete.value = job
  
  // In a real app, you would show a confirmation dialog
  // For simplicity, we'll just confirm directly
  if (confirm(`Are you sure you want to delete the job "${job.title}"?`)) {
    deleteJob()
  }
}

// Get the full URL for a job (safe for SSR)
const getJobUrl = (jobId: string) => {
  // Check if we're in browser context
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.origin}/jobs/${jobId}`;
  }
  // Fallback for SSR context
  return `/jobs/${jobId}`;
}

// Copy URL to clipboard
const copyUrl = (url: string, jobId: string) => {
  jobStore.copyUrl(url, jobId)
}

const deleteJob = async () => {
  if (!jobToDelete.value) return
  
  try {
    await jobStore.deleteJob(jobToDelete.value.id)
    jobToDelete.value = null
  } catch (err: any) {
    error.value = err.message || 'Failed to delete job'
  }
}

// Fetch jobs
onMounted(async () => {
  isLoading.value = true
  error.value = null
  
  try {
    await jobStore.fetchJobs()
  } catch (err: any) {
    error.value = err.message || 'Failed to load jobs'
  } finally {
    isLoading.value = false
  }
})
</script>
