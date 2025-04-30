<template>
  <div class="job-form">
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Job title -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Job Title</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
      </div>
      
      <!-- Department -->
      <div>
        <label for="department" class="block text-sm font-medium text-gray-700">Department</label>
        <select
          id="department"
          v-model="formData.department_id"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="" disabled>Select a department</option>
          <option v-for="dept in departments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
          </option>
        </select>
      </div>
      
      <!-- Job description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Job Description</label>
        <textarea
          id="description"
          v-model="formData.description"
          rows="8"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
      
      <!-- Status -->
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          v-model="formData.status"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      
      <!-- Questions section -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Job Questions</h3>
        
        <div v-if="formData.questions.length === 0" class="text-center py-4 bg-gray-50 rounded-md">
          <p class="text-gray-500">No questions added yet.</p>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="(question, index) in formData.questions" 
            :key="index"
            class="bg-gray-50 p-4 rounded-md relative"
          >
            <button 
              type="button" 
              @click="removeQuestion(index)"
              class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              aria-label="Remove question"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div class="mb-3">
              <label :for="`question-${index}`" class="block text-sm font-medium text-gray-700">Question Text</label>
              <input
                :id="`question-${index}`"
                v-model="question.question_text"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label :for="`question-type-${index}`" class="block text-sm font-medium text-gray-700">Question Type</label>
                <select
                  :id="`question-type-${index}`"
                  v-model="question.question_type"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Long Text</option>
                  <option value="select">Dropdown</option>
                  <option value="radio">Radio Buttons</option>
                  <option value="checkbox">Checkboxes</option>
                </select>
              </div>
              
              <div>
                <div class="flex items-center h-full mt-6">
                  <input
                    :id="`question-required-${index}`"
                    v-model="question.required"
                    type="checkbox"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  >
                  <label :for="`question-required-${index}`" class="ml-2 block text-sm text-gray-700">
                    Required
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Options for select, radio, checkbox -->
            <div v-if="['select', 'radio', 'checkbox'].includes(question.question_type)" class="mt-3">
              <label :for="`question-options-${index}`" class="block text-sm font-medium text-gray-700">Options</label>
              <div class="mt-1 space-y-2">
                <div 
                  v-for="(option, optIndex) in question.options" 
                  :key="optIndex"
                  class="flex items-center"
                >
                  <input
                    :id="`question-option-${index}-${optIndex}`"
                    v-model="question.options[optIndex].label"
                    type="text"
                    placeholder="Option label"
                    required
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                  <button 
                    type="button" 
                    @click="removeOption(question, optIndex)"
                    class="ml-2 text-gray-400 hover:text-gray-600"
                    aria-label="Remove option"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <button 
                  type="button" 
                  @click="addOption(question)"
                  class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Option
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-4">
          <button 
            type="button" 
            @click="addQuestion"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </button>
        </div>
      </div>
      
      <!-- Form actions -->
      <div class="flex justify-end space-x-3">
        <button 
          type="button" 
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Saving...</span>
          <span v-else>{{ jobId ? 'Update Job' : 'Create Job' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useJobStore } from '../../composables/useJobStore'

// Props
const props = defineProps({
  jobId: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits(['submit', 'cancel'])

// Setup
const jobStore = useJobStore()
const isSubmitting = ref(false)

// Mock departments (in a real app, these would come from an API)
const departments = ref([
  { id: 'dept_1', name: 'Engineering' },
  { id: 'dept_2', name: 'Marketing' },
  { id: 'dept_3', name: 'Sales' },
  { id: 'dept_4', name: 'Human Resources' },
  { id: 'dept_5', name: 'Finance' }
])

// Form data
const formData = reactive({
  title: '',
  description: '',
  department_id: '',
  status: 'draft',
  questions: [] as any[]
})

// Load existing job data if editing
onMounted(async () => {
  if (props.jobId) {
    try {
      await jobStore.fetchJobPosting(props.jobId)
      const job = jobStore.currentJobPosting.value
      
      if (job) {
        formData.title = job.title
        formData.description = job.description
        formData.department_id = job.department_id
        formData.status = job.status
        
        // Load questions
        await jobStore.fetchJobQuestions(props.jobId)
        formData.questions = jobStore.jobQuestions.value.map(q => ({
          id: q.id,
          question_text: q.question_text,
          question_type: q.question_type,
          required: q.required,
          order_index: q.order_index,
          options: q.options || []
        }))
      }
    } catch (error) {
      console.error('Error loading job data:', error)
    }
  }
})

// Methods
function addQuestion() {
  formData.questions.push({
    question_text: '',
    question_type: 'text',
    required: false,
    order_index: formData.questions.length,
    options: []
  })
}

function removeQuestion(index: number) {
  formData.questions.splice(index, 1)
  
  // Update order_index for remaining questions
  formData.questions.forEach((q, i) => {
    q.order_index = i
  })
}

function addOption(question: any) {
  if (!question.options) {
    question.options = []
  }
  
  const newValue = `option_${question.options.length + 1}`
  question.options.push({
    value: newValue,
    label: `Option ${question.options.length + 1}`
  })
}

function removeOption(question: any, index: number) {
  question.options.splice(index, 1)
}

async function submitForm() {
  isSubmitting.value = true
  
  try {
    let jobData = {
      title: formData.title,
      description: formData.description,
      department_id: formData.department_id,
      status: formData.status
    }
    
    let jobId = props.jobId
    
    // Create or update job posting
    if (props.jobId) {
      await jobStore.updateJobPosting(props.jobId, jobData)
    } else {
      const newJob = await jobStore.createJobPosting(jobData)
      jobId = newJob.id
    }
    
    // Save questions
    if (jobId) {
      // In a real app, we would handle updating existing questions and deleting removed ones
      // For simplicity, we'll just add new questions here
      for (const question of formData.questions) {
        if (!question.id) {
          question.job_posting_id = jobId
          await jobStore.addJobQuestion(question)
        }
      }
    }
    
    emit('submit', jobId)
  } catch (error) {
    console.error('Error saving job:', error)
    alert('Failed to save job. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
