<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <!-- Card header with applicant info -->
    <div class="px-4 py-4 sm:px-6">
      <div>
        <div class="flex items-start">
          <p class="text-sm font-medium text-indigo-600 truncate">
            {{ getApplicantName(application) }}
          </p>
          <div class="flex items-center">
            <p 
              class="ml-2 px-2 inline-flex text-sm leading-5 font-semibold rounded-full"
              :class="[
                application.status === 'submitted' ? 'bg-green-100 text-green-800' : 
                application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 
                application.status === 'disqualified_by_location' ? 'bg-red-100 text-red-800' : 
                application.status === 'accepted' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              ]"
            >
              {{ application.status === 'disqualified_by_location' ? 'Rejected' : application.status.charAt(0).toUpperCase() + application.status.slice(1) }}
            </p>
            
            <!-- Workable status badge -->
            <p 
              v-if="application.workable_candidate_id" 
              class="ml-2 px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
              title="Candidate has been pushed to Workable"
            >
              Workable
            </p>
            
            <!-- Workable error badge -->
            <p 
              v-if="application.workable_error" 
              class="ml-2 px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800"
              :title="application.workable_error"
            >
              Workable Error
            </p>
          </div>
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
            @click="$emit('update-status', application.id, 'reviewed')"
          >
            Mark as Reviewed
          </button>
          <button 
            v-if="['submitted', 'reviewed'].includes(application.status)"
            class="px-2 py-1 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            @click="$emit('update-status', application.id, 'accepted')"
          >
            Accept
          </button>
          <button 
            v-if="['submitted', 'reviewed'].includes(application.status)"
            class="px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-gray-50"
            @click="$emit('update-status', application.id, 'disqualified_by_location')"
          >
            Reject
          </button>
        </div>
        
        <!-- View details link -->
        <button 
          @click="isExpanded = !isExpanded"
          class="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <span>{{ isExpanded ? 'Show less' : 'See more details' }}</span>
          <svg 
            class="ml-1 h-4 w-4 transition-transform" 
            :class="{ 'transform rotate-180': isExpanded }"
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
    <div v-if="isExpanded">
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
          
          <!-- Workable status section -->
          <div v-if="application.workable_candidate_id || application.workable_error" class="sm:col-span-2">
            <dt class="text-sm font-medium text-gray-500">Workable Status</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <div v-if="application.workable_candidate_id" class="flex items-center text-blue-600">
                <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Pushed to Workable (ID: {{ application.workable_candidate_id }})
              </div>
              <div v-if="application.workable_error" class="flex items-center text-red-600">
                <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Error: {{ application.workable_error }}
              </div>
              <div v-if="application.workable_status" class="mt-1">
                Status: <span class="font-medium">{{ application.workable_status }}</span>
              </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ResumeViewer from './ResumeViewer.vue'
import CoverLetterViewer from './CoverLetterViewer.vue'

// Define types
interface Job {
  id: string;
  title: string;
  [key: string]: any;
}

// Props
const props = defineProps({
  application: {
    type: Object,
    required: true
  },
  jobs: {
    type: Array as () => Job[],
    default: () => []
  }
})

// Emits
defineEmits(['update-status'])

// Local state
const isExpanded = ref(false)

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
  
  // Fallback: try to find the job in jobs prop
  const job = props.jobs.find((j: Job) => j.id === application.job_id)
  return job ? job.title : 'Unknown Job'
}

const getQuestionText = (questionId: string | number) => {
  // This would need to fetch the question text from somewhere
  // For now, just return a placeholder
  return `Question ${questionId}`
}
</script>
