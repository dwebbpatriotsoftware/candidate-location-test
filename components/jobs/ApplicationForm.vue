<template>
  <div class="application-form">
    <div v-if="isSubmitted" class="p-6 space-y-4 text-center">
      <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-900">Application Submitted</h2>
      <p class="text-gray-700">Thank you for your application. We will review it and get back to you soon.</p>
    </div>
    
    <form v-else @submit.prevent="submitApplication" class="space-y-6">
      <!-- Common fields section -->
      <div class="bg-white px-6 pt-4 pb-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-lg font-medium text-gray-900 mb-2 mt-3">Personal Information</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="firstName"
            label="First Name"
            type="text"
            :value="formData.firstName"
            @update:value="formData.firstName = $event"
            required
          />
          
          <FormField
            id="lastName"
            label="Last Name"
            type="text"
            :value="formData.lastName"
            @update:value="formData.lastName = $event"
            required
          />
        </div>
        
        <FormField
          id="email"
          label="Email"
          type="email"
          :value="formData.email"
          @update:value="formData.email = $event"
          required
        />
        
        <FormField
          id="phone"
          label="Phone"
          type="phone"
          :value="formData.phone"
          @update:value="formData.phone = $event"
          required
        />
        
        <FormField
          id="address"
          label="Address"
          type="text"
          :value="formData.address"
          @update:value="formData.address = $event"
          required
        />
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            id="city"
            label="City"
            type="text"
            :value="formData.city"
            @update:value="formData.city = $event"
            required
          />
          
          <FormField
            id="state"
            label="State"
            type="select"
            :value="formData.state"
            @update:value="formData.state = $event"
            :options="usStates"
            required
          />
          
          <FormField
            id="zipCode"
            label="Zip Code"
            type="text"
            :value="formData.zipCode"
            @update:value="formData.zipCode = $event"
            required
          />
        </div>
      </div>
      
      <!-- Cover letter upload section -->
      <div class="bg-white px-6 pt-4 pb-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-lg font-medium text-gray-900 mb-2 mt-3">Cover Letter</h3>
        
        <CoverLetterUploader
          :candidate-id="candidateId"
          @upload-success="handleCoverLetterUpload"
          @upload-error="handleCoverLetterError"
          @file-removed="coverLetterPath = null"
        />
        
        <div v-if="coverLetterError" class="mt-2 text-sm text-red-600">
          {{ coverLetterError }}
        </div>
      </div>
      
      <!-- Resume upload section -->
      <div class="bg-white px-6 pt-4 pb-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-lg font-medium text-gray-900 mb-2 mt-3">Resume</h3>
        
        <ResumeUploader
          :candidate-id="candidateId"
          @upload-success="handleResumeUpload"
          @upload-error="handleResumeError"
          @file-removed="resumePath = null"
        />
        
        <div v-if="resumeError" class="mt-2 text-sm text-red-600">
          {{ resumeError }}
        </div>
      </div>
      
      <!-- Dynamic job questions section -->
      <div v-if="jobQuestions.length > 0" class="bg-white px-6 pt-4 pb-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-lg font-medium text-gray-900 mb-2 mt-3">Additional Questions</h3>
        
        <div v-for="question in jobQuestions" :key="question.id" class="mb-4">
          <FormField
            :id="`question-${question.id}`"
            :label="question.question_text"
            :type="question.question_type"
            :input-type="question.inputType"
            :value="formData.answers[question.id || ''] || ''"
            @update:value="updateAnswer(question.id || '', $event)"
            :required="question.required"
            :options="question.options"
          />
        </div>
      </div>
      
      <!-- Submit button and back link -->
      <div class="flex justify-between items-center">
        <!-- Back to Description link (left side) -->
        <NuxtLink 
          :to="`/jobs/${props.jobId}`" 
          class="text-indigo-600 hover:text-indigo-500 flex items-center"
          @click="saveFormData"
        >
          <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Description
        </NuxtLink>
        
        <!-- Submit button (right side) -->
        <button
          type="submit"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Submit Application</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useJobStore } from '../../composables/useJobStore'
import { useFormState } from '../../composables/useFormState'
import FormField from './FormField.vue'
import ResumeUploader from './ResumeUploader.vue'
import CoverLetterUploader from './CoverLetterUploader.vue'
import { useRoute } from 'vue-router'

// US States array for dropdown
const usStates = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" }
]

// Props
const props = defineProps({
  jobId: {
    type: String,
    required: true
  }
})

// Setup
const route = useRoute()
const jobStore = useJobStore()
const formState = useFormState()
const candidateId = ref(generateCandidateId())
const coverLetterPath = ref<string | null>(null)
const coverLetterError = ref<string | null>(null)
const resumePath = ref<string | null>(null)
const resumeError = ref<string | null>(null)
const isSubmitting = ref(false)
const isSubmitted = ref(false)

// Form data
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  answers: {} as Record<string, any>
})

// Save form data when navigating away or when form changes
const saveFormData = () => {
  const data = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    zipCode: formData.zipCode,
    answers: formData.answers,
    resumePath: resumePath.value,
    coverLetterPath: coverLetterPath.value
  }
  
  formState.saveFormData(props.jobId, data)
}

// Debounce helper function
function debounce(fn: Function, delay: number) {
  let timeout: number | null = null
  return function(this: any, ...args: any[]) {
    const context = this
    if (timeout !== null) clearTimeout(timeout)
    timeout = window.setTimeout(() => fn.apply(context, args), delay)
  }
}

// Auto-save form data when it changes
const debouncedSave = debounce(saveFormData, 500)

// Watch for changes in form data and save automatically
watch(
  [
    () => formData.firstName,
    () => formData.lastName,
    () => formData.email,
    () => formData.phone,
    () => formData.address,
    () => formData.city,
    () => formData.state,
    () => formData.zipCode,
    () => formData.answers,
    () => resumePath.value,
    () => coverLetterPath.value
  ],
  () => {
    debouncedSave()
  },
  { deep: true }
)

// Fetch job questions and load saved form data if available
onMounted(async () => {
  await jobStore.fetchJobQuestions(props.jobId)
  
  // Try to load saved form data
  const savedData = formState.getFormData(props.jobId)
  if (savedData) {
    // Restore form data
    formData.firstName = savedData.firstName || ''
    formData.lastName = savedData.lastName || ''
    formData.email = savedData.email || ''
    formData.phone = savedData.phone || ''
    formData.address = savedData.address || ''
    formData.city = savedData.city || ''
    formData.state = savedData.state || ''
    formData.zipCode = savedData.zipCode || ''
    formData.answers = savedData.answers || {}
    resumePath.value = savedData.resumePath || null
    coverLetterPath.value = savedData.coverLetterPath || null
  } else {
    // No saved form data found
  }
})

// Computed
const jobQuestions = computed(() => {
  // Use the questions from the job store, which now includes form customizations
  return jobStore.jobQuestions.value.map(question => {
    // Base question object
    const mappedQuestion = {
      id: question.id,
      question_text: question.body || question.label,
      required: question.required,
    };

    // Map Workable question types to our form field types
    switch (question.type) {
      case 'free_text':
        return {
          ...mappedQuestion,
          question_type: 'textarea',
        };
      case 'short_text':
        return {
          ...mappedQuestion,
          question_type: 'text',
        };
      case 'multiple_choice':
        return {
          ...mappedQuestion,
          question_type: question.single_answer ? 'radio' : 'checkbox',
          options: question.choices?.map((choice: { id: string; body: string }) => ({
            value: choice.id,
            label: choice.body
          })) || []
        };
      case 'boolean':
        return {
          ...mappedQuestion,
          question_type: 'radio',
          options: [
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' }
          ]
        };
      case 'dropdown':
        return {
          ...mappedQuestion,
          question_type: 'select',
          options: question.choices?.map((choice: { id: string; body: string }) => ({
            value: choice.id,
            label: choice.body
          })) || []
        };
      case 'numeric':
        return {
          ...mappedQuestion,
          question_type: 'text', // Using text with number validation for now
          inputType: 'number', // Additional property for input type
        };
      case 'date':
        return {
          ...mappedQuestion,
          question_type: 'date',
        };
      default:
        return {
          ...mappedQuestion,
          question_type: 'text', // Default fallback
        };
    }
  });
})

// Methods
function generateCandidateId() {
  return 'candidate_' + Math.random().toString(36).substring(2, 15)
}

function updateAnswer(questionId: string, value: any) {
  formData.answers[questionId] = value
}

function handleCoverLetterUpload(path: string) {
  coverLetterPath.value = path
  coverLetterError.value = null
}

function handleCoverLetterError(error: any) {
  coverLetterError.value = error.message || 'Failed to upload cover letter'
}

function handleResumeUpload(path: string) {
  resumePath.value = path
  resumeError.value = null
}

function handleResumeError(error: any) {
  resumeError.value = error.message || 'Failed to upload resume'
}

async function submitApplication() {
  // Validate resume
  if (!resumePath.value) {
    resumeError.value = 'Please upload your resume'
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Get IP address
    const ipResponse = await fetch('https://api.ipify.org?format=json')
    const ipData = await ipResponse.json()
    
    // Get timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    // Add capture_time
    const capture_time = new Date().toISOString()
    
    // Create candidate_info object
    const candidate_info = {
      ip: ipData.ip,
      timezone,
      capture_time
    }
    
    // Prepare application data
    const applicationData = {
      job_id: props.jobId,
      candidate_id: candidateId.value,
      resume_path: resumePath.value,
      cover_letter_path: coverLetterPath.value,
      status: 'submitted',
      candidate_info, // Add the new candidate_info object
      answers: {
        personal_info: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        job_questions: formData.answers
      }
    }
    
    // Submit application
    await jobStore.submitApplication(applicationData)
    
    // Clear saved form data after successful submission
    formState.clearFormData(props.jobId)
    
    // Show success message
    isSubmitted.value = true
  } catch (error: any) {
    console.error('Error submitting application:', error)
    alert('Failed to submit application. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
