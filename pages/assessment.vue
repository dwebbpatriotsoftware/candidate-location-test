<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-purple-800 mb-2">Careers</h1>
      <p class="text-gray-700">Making accounting and payroll fast, simple, and affordable for millions of American businesses and their accountants.</p>
    </div>
    
    <div class="bg-purple-50 rounded-lg shadow-sm p-8">  
      <ClientOnly>
        <div v-if="isSubmitted" class="p-6 space-y-4 text-center">
          <div class="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-purple-900">Assessment Completed</h2>
          <p class="text-gray-700">Thank you for completing the assessment.</p>
        </div>
        <form v-if="isLoaded && !isSubmitted" @submit.prevent="submitAssessment" class="space-y-8">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-purple-900 mb-2">
                Question 1: What is your favorite programming language?
              </label>
              <input 
                v-model="answers.q1" 
                type="text" 
                class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" 
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-bold text-purple-900 mb-2">
                Question 2: How many years of experience do you have?
              </label>
              <input 
                v-model="answers.q2" 
                type="number" 
                class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" 
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-bold text-purple-900 mb-2">
                Question 3: Have you ever worked with event-driven microservices?
              </label>
              <select 
                v-model="answers.q3" 
                class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" 
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
              class="w-full bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition duration-150 shadow-sm font-bold"
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
const answers = ref({
  q1: '',
  q2: '',
  q3: ''
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
