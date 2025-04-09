<template>
  <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
    <div class="p-6 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Assessment</h1>
        <NuxtLink 
          to="/" 
          class="text-indigo-600 hover:text-indigo-500 font-medium transition duration-150"
        >
          Back to Reports
        </NuxtLink>
      </div>
    </div>
    
    <ClientOnly>
      <form v-if="isLoaded" @submit.prevent="submitAssessment" class="p-6 space-y-6">
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
              Question 3: What is your preferred work environment?
            </label>
            <select 
              v-model="answers.q3" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
              required
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="office">Office</option>
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
    await candidateService.saveCandidate(candidateId, timezone, ipData.ip)
    
    isLoaded.value = true
  } catch (error) {
    console.error('Error:', error)
  }
})

const submitAssessment = async () => {
  try {
    // Redirect to thank you page or home
    router.push('/')
  } catch (error) {
    console.error('Error submitting assessment:', error)
  }
}
</script>
