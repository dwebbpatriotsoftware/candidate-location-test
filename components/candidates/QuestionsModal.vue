<template>
  <div v-if="showQuestionsModal" class="fixed inset-0 bg-black bg-opacity-50 d-flex items-center justify-center z-50 !mt-0">
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="d-flex justify-between items-center mb-4">
          <h3 class="font-size-medium font-bold color-gray-900">
            More Information
          </h3>
          <button 
            @click="closeQuestionsModal" 
            class="color-gray-400 hover:color-gray-500 focus:outline-none"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div v-if="currentCandidateQuestions" class="space-y-4">
          <div class="border-1-b pb-3">
            <p class="font-size-small font-bold color-gray-500">Candidate ID</p>
            <p class="font-size-normal color-gray-900">{{ currentCandidateQuestions.candidate_id }}</p>
          </div>
          
          <div class="space-y-4">
            <!-- IP Address -->
            <div>
              <p class="font-size-small font-bold color-gray-500">IP Address</p>
              <p class="font-size-normal color-gray-900">
                <a 
                  v-if="currentCandidateQuestions.candidate_answers?.ip || currentCandidateQuestions.candidate_ip"
                  :href="`https://www.ipqualityscore.com/vpn-ip-address-check/lookup/${currentCandidateQuestions.candidate_answers?.ip || currentCandidateQuestions.candidate_ip}`" 
                  target="_blank" 
                  class="color-primary hover:color-primary-800 hover:underline"
                >
                  {{ currentCandidateQuestions.candidate_answers?.ip || currentCandidateQuestions.candidate_ip }}
                </a>
                <span v-else>Not available</span>
              </p>
            </div>
            
            <!-- Time Zone -->
            <div>
              <p class="font-size-small font-bold color-gray-500">Time Zone</p>
              <p class="font-size-normal color-gray-900">{{ currentCandidateQuestions.candidate_answers?.timezone || currentCandidateQuestions.candidate_timezone || 'Not available' }}</p>
            </div>
            
            <!-- Capture Time -->
            <div>
              <p class="font-size-small font-bold color-gray-500">Capture Time</p>
              <p class="font-size-normal color-gray-900">{{ formatCaptureTime(currentCandidateQuestions.candidate_answers?.capture_time) }}</p>
            </div>
            
            <div>
              <p class="font-size-small font-bold color-gray-500">{{ currentCandidateQuestions.candidate_answers?.q1?.question || 'Question 1' }}</p>
              <p class="font-size-normal color-gray-900 whitespace-pre-line">{{ currentCandidateQuestions.candidate_answers?.q1?.answer || 'No response' }}</p>
            </div>
            
            <div>
              <p class="font-size-small font-bold color-gray-500">{{ currentCandidateQuestions.candidate_answers?.q2?.question || 'Question 2' }}</p>
              <p class="font-size-normal color-gray-900 whitespace-pre-line">{{ currentCandidateQuestions.candidate_answers?.q2?.answer || 'No response' }}</p>
            </div>
            
            <!-- Assessment Values Section -->
            <div class="border-1-t pt-3 mt-4">
              <h4 class="font-size-small font-bold color-gray-700 mb-2">Assessment</h4>
              
              <!-- VPN Status -->
              <div class="mb-2">
                <p class="font-size-small font-bold color-gray-500">VPN?</p>
                <p class="font-size-normal color-gray-900"
                   :class="currentCandidateQuestions.candidate_assessment?.data?.is_vpn ? 'bg-attention-light px-2 py-1 rounded' : 'bg-confirm-light px-2 py-1 rounded'">
                  {{ currentCandidateQuestions.candidate_assessment?.data?.is_vpn ? 'Yes' : 'No' }}
                </p>
              </div>
              
              <!-- US IP Status -->
              <div class="mb-2">
                <p class="font-size-small font-bold color-gray-500">US IP?</p>
                <p class="font-size-normal color-gray-900"
                   :class="currentCandidateQuestions.candidate_assessment?.data?.is_us_ip ? 'bg-confirm-light px-2 py-1 rounded' : 'bg-alert-light px-2 py-1 rounded'">
                  {{ currentCandidateQuestions.candidate_assessment?.data?.is_us_ip ? 'Yes' : 'No' }}
                </p>
              </div>
              
              <!-- US Time Zone Status -->
              <div class="mb-2">
                <p class="font-size-small font-bold color-gray-500">US Time Zone?</p>
                <p class="font-size-normal color-gray-900"
                   :class="currentCandidateQuestions.candidate_assessment?.data?.is_us_timezone ? 'bg-confirm-light px-2 py-1 rounded' : 'bg-alert-light px-2 py-1 rounded'">
                  {{ currentCandidateQuestions.candidate_assessment?.data?.is_us_timezone ? 'Yes' : 'No' }}
                </p>
              </div>
              
              <!-- IP Location -->
              <div class="mb-2">
                <p class="font-size-small font-bold color-gray-500">IP Location</p>
                <p class="font-size-normal color-gray-900 px-2 py-1 rounded bg-gray-100">
                  {{ currentCandidateQuestions.candidate_assessment?.data?.ip_country_city || 'Unknown location' }}
                </p>
              </div>
              
              <!-- IP/TIME ZONE Alignment -->
              <div class="mb-2">
                <p class="font-size-small font-bold color-gray-500">IP/TIME ZONE?</p>
                <p class="font-size-normal color-gray-900"
                   :class="currentCandidateQuestions.candidate_assessment?.data?.ip_timezone_align ? 'bg-confirm-light px-2 py-1 rounded' : 'bg-attention-light px-2 py-1 rounded'">
                  {{ currentCandidateQuestions.candidate_assessment?.data?.ip_timezone_align ? 'Yes' : 'No' }}
                </p>
              </div>
              
              <!-- Assessment Value -->
              <div class="mb-2">
                <p class="font-size-small font-bold color-gray-500">Assessment</p>
                <p class="font-size-normal color-gray-900"
                   :class="{
                     'color-alert': currentCandidateQuestions.candidate_assessment?.value === 'Exit',
                     'color-attention': currentCandidateQuestions.candidate_assessment?.value === 'Caution',
                     'color-confirm': currentCandidateQuestions.candidate_assessment?.value === 'Proceed'
                   }">
                  {{ currentCandidateQuestions.candidate_assessment?.value || 'Not assessed' }}
                </p>
              </div>
              
              <!-- Assessment Reason -->
              <div v-if="currentCandidateQuestions.candidate_assessment?.reason">
                <p class="font-size-small font-bold color-gray-500">Reason</p>
                <p class="font-size-normal color-gray-900 white-space: pre-wrap">
                  {{ currentCandidateQuestions.candidate_assessment?.reason }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <button 
            @click="closeQuestionsModal" 
            class="w-full btn btn-primary px-4 py-2 rounded-md hover:bg-primary-800 transition duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define types
interface CandidateAssessmentData {
  is_vpn?: boolean;
  is_us_ip?: boolean;
  is_us_timezone?: boolean;
  ip_timezone_align?: boolean;
  ip_country_city?: string;
}

interface CandidateAssessment {
  data?: CandidateAssessmentData;
  value?: string;
  reason?: string;
}

interface CandidateAnswer {
  question?: string;
  answer?: string;
}

interface CandidateAnswers {
  q1?: CandidateAnswer;
  q2?: CandidateAnswer;
  timezone?: string;
  ip?: string;
  capture_time?: string;
  [key: string]: any;
}

interface Candidate {
  candidate_id: string;
  is_new?: boolean;
  scheduled?: boolean;
  candidate_assessment?: CandidateAssessment;
  candidate_answers?: CandidateAnswers;
  candidate_timezone?: string;
  candidate_ip?: string;
  candidate_location?: string;
  [key: string]: any;
}

// Props
const props = defineProps<{
  showQuestionsModal: boolean;
  currentCandidateQuestions: Candidate | null;
}>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
}>()

// Methods
const closeQuestionsModal = () => {
  emit('close')
}

// Format the capture time to a readable local time
const formatCaptureTime = (isoTimeString: string | undefined) => {
  if (!isoTimeString) return 'Not available';
  
  try {
    const date = new Date(isoTimeString);
    return date.toLocaleString(); // Simple and effective!
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoTimeString; // Fallback to original string if there's an error
  }
}
</script>
