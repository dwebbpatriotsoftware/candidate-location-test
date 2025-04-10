<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-8 text-center">
      <h1 class="text-3xl text-purple-800 mb-2">Making accounting and payroll fast, simple, and affordable for millions of American businesses and their accountants.</h1>
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
              <p class="block text-sm font-bold text-purple-900 mb-2">
                This interview requires you to have your camera enabled for the entirety of the session. 
                We also require that you do not use any virtual or blurred backgrounds. 
                This is to facilitate clear communication and a more personal interaction during the interview process.
              </p>
              <p class="block text-sm font-bold text-purple-900 mb-2">
                By clicking <span class="text-purple-600">Submit</span>, you are acknowledging these requirements.
              </p>
            </div>
          </div>

          <div class="pt-4">
            <button 
              type="submit" 
              class="w-full bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition duration-150 shadow-sm font-bold"
            >
              Submit
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
  q1: "Candidate submitted their assessment?",
  q2: "Browser information"
}

// Initialize answers with both questions and empty answers
const answers = ref({
  q1: {
    question: questions.q1,
    answer: 'No'
  },
  q2: {
    question: questions.q2,
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

    //Get browser info
    answers.value.q1.answer = 'Yes'
    answers.value.q2.answer = getBrowserInfo()

    // Store candidate info in Supabase
    const result = await candidateService.saveCandidate(candidateId, timezone, ipData.ip, answers.value)
    
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
  //try {
    // update answer 1
    //answers.value.q1.answer = 'Yes'
    //answers.value.q2.answer = getBrowserInfo()
    //await candidateService.updateCandidateAnswers(candidateId, answers.value)
    
    // Show confirmation
    isSubmitted.value = true
  // } catch (error) {
  //   console.error('Error submitting assessment:', error)
  // }
}


function getBrowserInfo() {
  const userAgent = navigator.userAgent

  const browserInfo = {
    name: 'Unknown',
    version: 'Unknown',
    language: navigator.language || navigator.userLanguage
  }

  if (userAgent.includes('Chrome')) {
    browserInfo.name = 'Chrome'
    browserInfo.version = userAgent.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/)[1]
  } else if (userAgent.includes('Firefox')) {
    browserInfo.name = 'Firefox'
    browserInfo.version = userAgent.match(/Firefox\/(\d+\.\d+)/)[1]
  } else if (userAgent.includes('Safari')) {
    browserInfo.name = 'Safari'
    browserInfo.version = userAgent.match(/Version\/(\d+\.\d+)/)[1]
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    browserInfo.name = 'Internet Explorer'
    browserInfo.version = userAgent.match(/(?:MSIE |rv:)(\d+\.\d+)/)[1]
  }

  return `${browserInfo.name} ${browserInfo.version} ${browserInfo.language}`
}

</script>