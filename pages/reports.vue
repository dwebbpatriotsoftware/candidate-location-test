<template>
  <div class="space-y-6">
      <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Assessment Reports</h1>
      <div class="flex items-center">
        <button 
          @click="refreshCandidates" 
          class="text-indigo-600 hover:text-indigo-500 font-medium transition duration-150 flex items-center gap-1"
          :disabled="isRefreshing"
        >
          <span v-if="isRefreshing">Refreshing...</span>
          <span v-else>Refresh Candidates</span>
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question 1
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question 2
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question 3
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="candidate in candidates" 
              :key="candidate.candidate_id" 
              class="hover:bg-gray-50"
            > 
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                <div class="relative mr-2">
                  <button 
                    @click="copyId(candidate.candidate_id, candidate.candidate_id)" 
                    class="focus:outline-none"
                    :aria-label="`Copy ${candidate.candidate_id}`"
                  >
                    <!-- Copy icon SVG -->
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      :class="[
                        'h-5 w-5 transition-colors duration-200',
                        copiedIds[candidate.candidate_id] ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'
                      ]"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    
                    <!-- Copied tooltip -->
                    <span 
                      v-if="copiedIds[candidate.candidate_id]" 
                      class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-xs rounded shadow-lg"
                    >
                      Copied!
                    </span>
                  </button>
                </div>
                {{ candidate.candidate_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <a 
                  :href="`https://www.ipqualityscore.com/vpn-ip-address-check/lookup/${candidate.candidate_ip}`" 
                  target="_blank" 
                  class="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {{ candidate.candidate_ip }}
                </a>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  :class="isApprovedTimezone(candidate.candidate_timezone) ? 'bg-green-100' : 'bg-red-100'">
                {{ candidate.candidate_timezone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ candidate.candidate_answers?.q1 || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ candidate.candidate_answers?.q2 || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ candidate.candidate_answers?.q3 || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="deleteCandidate(candidate.candidate_id)" 
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
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
const candidates = ref([])
const isRefreshing = ref(false)

// Fetch candidates from Supabase
onMounted(async () => {
  try {
    candidates.value = await candidateService.getCandidates()
  } catch (error) {
    console.error('Error fetching candidates:', error)
  }
})

// Refresh candidates function
const refreshCandidates = async () => {
  isRefreshing.value = true
  try {
    candidates.value = await candidateService.getCandidates()
  } catch (error) {
    console.error('Error refreshing candidates:', error)
  } finally {
    isRefreshing.value = false
  }
}

// New reactive variables
const customCandidateId = ref('')
const generatedUrl = ref('')
const copyStatus = ref('Copy URL')
const urlInput = ref(null)
// Track copied IDs
const copiedIds = ref({})

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

    // Clear the customCandidateId field
    customCandidateId.value = ''
  }
}

// Copy candidate ID to clipboard
const copyId = (id, trackingKey) => {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea')
  textarea.value = id
  textarea.style.position = 'fixed' // Prevent scrolling to bottom
  document.body.appendChild(textarea)
  
  // Select and copy the text
  textarea.select()
  document.execCommand('copy')
  
  // Remove the temporary element
  document.body.removeChild(textarea)
  
  // Update the copied status for this specific ID
  copiedIds.value = {
    ...copiedIds.value,
    [trackingKey]: true
  }
  
  // Reset after 2 seconds
  setTimeout(() => {
    copiedIds.value = {
      ...copiedIds.value,
      [trackingKey]: false
    }
  }, 2000)
}

// Delete candidate function
const deleteCandidate = async (id) => {
  try {
    await candidateService.deleteCandidate(id)
    // Remove the deleted candidate from the local array
    candidates.value = candidates.value.filter(c => c.candidate_id !== id)
  } catch (error) {
    console.error('Error deleting candidate:', error)
    // Optionally add error handling UI feedback here
  }
}

// List of approved timezones that should be colored green
const approvedTimezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Boise',
  'America/Detroit',
  'America/Indianapolis',
  'America/Kentucky/Louisville',
  'America/Kentucky/Monticello',
  'America/Knox_IN',
  'America/Marengo',
  'America/Petersburg',
  'America/Tell_City',
  'America/Vevay',
  'America/Vincennes',
  'America/Winamac',
  'America/Menominee',
  'America/North_Dakota/Beulah',
  'America/North_Dakota/Center',
  'America/North_Dakota/New_Salem'
]

// Function to check if a timezone is in the approved list
const isApprovedTimezone = (timezone) => {
  return approvedTimezones.includes(timezone)
}
</script>
