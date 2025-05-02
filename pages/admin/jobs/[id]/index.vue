<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8 flex justify-between items-center">
      <div>
        <div class="flex items-center">
          <NuxtLink to="/admin/jobs" class="text-indigo-600 hover:text-indigo-500 flex items-center mr-4">
            <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Jobs
          </NuxtLink>
          <h1 class="text-3xl font-bold text-gray-900">Edit Job Form</h1>
        </div>
        <p v-if="job" class="mt-2 text-gray-600">{{ job.title }}</p>
      </div>
      
      <div class="flex space-x-2">
        <button 
          @click="saveForm" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isSaving"
        >
          <svg v-if="!isSaving" class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else class="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </button>
        
        <NuxtLink 
          :to="`/jobs/${jobId}`" 
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Job
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
    
    <div v-else-if="job && allQuestions.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Job Application Questions</h2>
        <p class="text-gray-600 mb-6">
          Drag and drop questions to reorder them. Toggle the visibility to show or hide questions on the application form.
        </p>
        
        <!-- Draggable questions list -->
        <draggable 
          v-model="visibleQuestions" 
          group="questions"
          item-key="id"
          handle=".drag-handle"
          ghost-class="bg-indigo-50"
          class="space-y-4"
        >
          <template #item="{ element }">
            <div class="bg-gray-50 p-4 rounded-md border border-gray-200 flex items-start">
              <div class="drag-handle cursor-move mr-3 mt-1 text-gray-400 hover:text-gray-600">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                </svg>
              </div>
              
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ element.body || element.label }}</div>
                <div class="text-sm text-gray-500 mt-1">
                  Type: {{ formatQuestionType(element.type) }}
                  <span v-if="element.required" class="ml-2 text-red-500">Required</span>
                </div>
                
                <!-- Show choices for multiple choice questions -->
                <div v-if="element.choices && element.choices.length > 0" class="mt-2">
                  <div class="text-sm text-gray-700">Options:</div>
                  <ul class="mt-1 pl-5 text-sm text-gray-600 list-disc">
                    <li v-for="choice in element.choices" :key="choice.id">
                      {{ choice.body }}
                    </li>
                  </ul>
                </div>
              </div>
              
              <button 
                @click="toggleQuestionVisibility(element)" 
                type="button"
                class="ml-4 p-1 rounded-md hover:bg-gray-200"
                :title="isQuestionHidden(element) ? 'Show question' : 'Hide question'"
              >
                <svg v-if="isQuestionHidden(element)" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </template>
        </draggable>
        
        <!-- Hidden questions section -->
        <div v-if="hiddenQuestions.length > 0" class="mt-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Hidden Questions</h3>
          <div class="space-y-4">
            <div 
              v-for="question in hiddenQuestions" 
              :key="question.id"
              class="bg-gray-50 p-4 rounded-md border border-gray-200 flex items-start opacity-60"
            >
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ question.body || question.label }}</div>
                <div class="text-sm text-gray-500 mt-1">
                  Type: {{ formatQuestionType(question.type) }}
                  <span v-if="question.required" class="ml-2 text-red-500">Required</span>
                </div>
              </div>
              
              <button 
                @click="toggleQuestionVisibility(question)" 
                type="button"
                class="ml-4 p-1 rounded-md hover:bg-gray-200"
                title="Show question"
              >
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="job" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
      <div class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No questions found</h3>
        <p class="mt-1 text-gray-500">This job doesn't have any application questions.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useJobStore } from '../../../../composables/useJobStore'
import draggable from 'vuedraggable'

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
const isSaving = ref(false)
const error = ref<string | null>(null)

// Job and questions data
const job = computed(() => jobStore.currentJob.value)
const allQuestions = ref<any[]>([])
const visibleQuestions = ref<any[]>([])
const hiddenQuestions = ref<any[]>([])

// Helper methods
const formatQuestionType = (type: string) => {
  switch (type) {
    case 'free_text':
      return 'Long Text'
    case 'short_text':
      return 'Short Text'
    case 'multiple_choice':
      return 'Multiple Choice'
    case 'dropdown':
      return 'Dropdown'
    case 'boolean':
      return 'Yes/No'
    case 'file':
      return 'File Upload'
    case 'date':
      return 'Date'
    case 'numeric':
      return 'Number'
    default:
      return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
  }
}

const isQuestionHidden = (question: any) => {
  return hiddenQuestions.value.some(q => q.id === question.id)
}

const toggleQuestionVisibility = (question: any) => {
  if (isQuestionHidden(question)) {
    // Move from hidden to visible
    hiddenQuestions.value = hiddenQuestions.value.filter(q => q.id !== question.id)
    visibleQuestions.value.push(question)
  } else {
    // Move from visible to hidden
    visibleQuestions.value = visibleQuestions.value.filter(q => q.id !== question.id)
    hiddenQuestions.value.push(question)
  }
}

// Save form changes
const saveForm = async () => {
  isSaving.value = true
  error.value = null
  
  try {
    // Create job form data
    const formData = {
      job_id: jobId.value,
      visible_questions: visibleQuestions.value.map(q => q.id),
      hidden_questions: hiddenQuestions.value.map(q => q.id)
    }
    
    // Save to database
    await jobStore.saveJobForm(formData)
    
    // Show success message
    alert('Job form saved successfully')
  } catch (err: any) {
    error.value = err.message || 'Failed to save job form'
  } finally {
    isSaving.value = false
  }
}

// Initialize questions from job data
const initializeQuestions = () => {
  if (!job.value || !job.value.questions || !job.value.questions.questions_map) {
    allQuestions.value = []
    visibleQuestions.value = []
    hiddenQuestions.value = []
    return
  }
  
  // Get all questions from the job data
  const questionsMap = job.value.questions.questions_map
  allQuestions.value = Object.values(questionsMap)
  
  // Check if we have a saved form
  if (jobStore.jobForm.value) {
    // Use the saved form's visible and hidden questions
    const visibleIds = jobStore.jobForm.value.visible_questions
    const hiddenIds = jobStore.jobForm.value.hidden_questions
    
    visibleQuestions.value = visibleIds
      .map(id => allQuestions.value.find(q => q.id === id))
      .filter(q => q) // Filter out any undefined questions
    
    hiddenQuestions.value = hiddenIds
      .map(id => allQuestions.value.find(q => q.id === id))
      .filter(q => q) // Filter out any undefined questions
    
    // Add any questions that aren't in either list to visible questions
    const trackedIds = [...visibleIds, ...hiddenIds]
    const untrackedQuestions = allQuestions.value.filter(q => !trackedIds.includes(q.id))
    visibleQuestions.value = [...visibleQuestions.value, ...untrackedQuestions]
  } else {
    // No saved form, so all questions are visible by default
    visibleQuestions.value = [...allQuestions.value]
    hiddenQuestions.value = []
  }
}

// Watch for changes in job data
watch(() => job.value, () => {
  initializeQuestions()
}, { deep: true })

// Fetch job data
onMounted(async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Fetch job data
    await jobStore.fetchJob(jobId.value)
    
    // Fetch job form if it exists
    await jobStore.fetchJobForm(jobId.value)
    
    // Initialize questions
    initializeQuestions()
  } catch (err: any) {
    error.value = err.message || 'Failed to load job data'
  } finally {
    isLoading.value = false
  }
})
</script>
