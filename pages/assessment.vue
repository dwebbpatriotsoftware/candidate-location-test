<template>
  <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">  
    <ClientOnly>
      <div v-if="isSubmitted" class="p-6 space-y-4 text-center">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">Assessment Completed</h2>
        <p class="text-gray-600">Thank you for completing the assessment.</p>
      </div>
      <form v-if="isLoaded && !isSubmitted" @submit.prevent="submitAssessment" class="p-6 space-y-6">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Question 1: What is your favorite programming language?
            </label>
            <input 
              v-model="answers.q1" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
              required
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Question 2: How many years of experience do you have?
            </label>
            <input 
              v-model="answers.q2" 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
              required
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Question 3: Have you ever worked with event-driven microservices?
            </label>
            <select 
              v-model="answers.q3" 
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
            class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 shadow-sm"
          >
            Submit Assessment
          </button>
        </div>
      </form>
    </ClientOnly>
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
    // Show confirmation instead of redirecting
    isSubmitted.value = true
  } catch (error) {
    console.error('Error submitting assessment:', error)
  }
}
</script>
