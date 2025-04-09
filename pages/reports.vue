<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Assessment Reports</h1>
      <div class="flex gap-4 items-center">
        <button 
          @click="handleLogout" 
          class="text-indigo-600 hover:text-indigo-500 font-medium transition duration-150"
        >
          Logout
        </button>
      </div>
    </div>
    
    <!-- New candidate ID input and URL generation section -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-grow">
          <label class="block text-sm font-medium text-gray-700 mb-1">Candidate ID</label>
          <input
            v-model="customCandidateId"
            type="text"
            placeholder="Enter ID or leave empty to generate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
        </div>
        <div class="flex items-end">
          <button 
            @click="generateAssessmentUrl" 
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition duration-150 shadow-sm"
          >
            Generate Assessment URL
          </button>
        </div>
      </div>
      
      <!-- URL display and copy section (shown only when URL is generated) -->
      <div v-if="generatedUrl" class="mt-4 p-3 bg-gray-50 rounded-md">
        <div class="flex flex-col md:flex-row gap-2 items-center">
          <div class="flex-grow overflow-x-auto">
            <input
              ref="urlInput"
              v-model="generatedUrl"
              readonly
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            >
          </div>
          <button 
            @click="copyUrl" 
            class="whitespace-nowrap bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-150 border border-gray-300"
          >
            {{ copyStatus }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Candidate ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timezone
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="candidate in candidates" :key="candidate.candidate_id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ candidate.candidate_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ candidate.candidate_ip }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ candidate.candidate_timezone }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { candidateService } from '../services/candidateService'

definePageMeta({
  middleware: ['auth']
})

const router = useRouter()
const { logout } = useAuthStore()
const candidates = ref([])

// Fetch candidates from Supabase
onMounted(async () => {
  try {
    candidates.value = await candidateService.getCandidates()
  } catch (error) {
    console.error('Error fetching candidates:', error)
  }
})

// New reactive variables
const customCandidateId = ref('')
const generatedUrl = ref('')
const copyStatus = ref('Copy URL')
const urlInput = ref(null)

// Generate a random ID if needed
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15)
}

// Generate the full assessment URL
const generateAssessmentUrl = () => {
  // Use custom ID if provided, otherwise generate a new one
  const id = customCandidateId.value || generateRandomId()
  
  // If user didn't provide an ID, show the generated one
  if (!customCandidateId.value) {
    customCandidateId.value = id
  }
  
  // Get the base URL of the application
  const baseUrl = window.location.origin
  
  // Generate the full URL
  generatedUrl.value = `${baseUrl}/assessment?candidateId=${id}`
}

// Copy URL to clipboard
const copyUrl = () => {
  if (urlInput.value) {
    urlInput.value.select()
    document.execCommand('copy')
    
    // Provide feedback
    copyStatus.value = 'Copied!'
    setTimeout(() => {
      copyStatus.value = 'Copy URL'
    }, 2000)
  }
}

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>
