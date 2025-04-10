<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Making accounting and payroll fast, simple, and affordable for millions of American businesses and their accountants.</h1>
    </div>
    
    <div class="bg-white rounded-lg shadow p-4">  
      <ClientOnly>
        <div v-if="isSubmitted" class="p-6 space-y-4 text-center">
          <div class="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900">Assessment Completed</h2>
          <p class="text-gray-700">Thank you for completing the assessment.</p>
        </div>
        <form v-if="isLoaded && !isSubmitted" @submit.prevent="submitAssessment" class="space-y-6">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Question 1: What is your favorite programming language?
              </label>
              <input 
                v-model="answers.q1.answer" 
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Question 2: How many years of experience do you have?
              </label>
              <input 
                v-model="answers.q2.answer" 
                type="number" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Question 3: Have you ever worked with event-driven microservices?
              </label>
              <select 
                v-model="answers.q3.answer" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          
          <div class="pt-4">
            <button 
              type="submit" 
              class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition duration-150 shadow-sm"
            >
              Submit Assessment
            </button>
          </div>
        </form>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { candidateService } from '../services/candidateService'

const route = useRoute()
const router = useRouter()

const candidateId = route.query.candidateId
const isLoaded = ref(false)
const isSubmitted = ref(false)
// Define the questions
const questions = {
  q1: "What is your favorite programming language?",
  q2: "How many years of experience do you have?",
  q3: "Have you ever worked with event-driven microservices?"
}

// Initialize answers with both questions and empty answers
const answers = ref({
  q1: {
    question: questions.q1,
    answer: ''
  },
  q2: {
    question: questions.q2,
    answer: ''
  },
  q3: {
    question: questions.q3,
    answer: ''
  }
})

onMounted(async () => {
  if (!candidateId) {
    return
  }

  try {
    // Get IP address
    const ipResponse = await fetch('https://api.ipify.org?format=json')
    const ipData = await ipResponse.json()
    
    // Get timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Store candidate info in Supabase
    const result = await candidateService.saveCandidate(candidateId, timezone, ipData.ip)
    
    // If candidate already exists, show the completion message
    if (result.isExisting) {
      isSubmitted.value = true
    }
    
    isLoaded.value = true
  } catch (error) {
    console.error('Error:', error)
  }
})

const submitAssessment = async () => {
  try {
    // Save the answers to Supabase
    await candidateService.updateCandidateAnswers(candidateId, answers.value)
    
    // Show confirmation
    isSubmitted.value = true
  } catch (error) {
    console.error('Error submitting assessment:', error)
  }
}
</script>
