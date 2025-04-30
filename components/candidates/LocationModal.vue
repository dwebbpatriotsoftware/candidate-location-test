<template>
  <div v-if="showLocationModal" class="fixed inset-0 bg-black bg-opacity-50 d-flex items-center justify-center z-50 !mt-0">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="p-6">
        <div class="d-flex justify-between items-center mb-4">
          <h3 class="font-size-medium font-bold color-gray-900">
            IP Location (Country/City)
          </h3>
          <button 
            @click="closeLocationModal" 
            class="color-gray-400 hover:color-gray-500 focus:outline-none"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label for="location" class="d-block font-size-small font-bold color-gray-700 mb-1">Location</label>
            <input
              id="location"
              v-model="localLocationInput"
              type="text"
              placeholder="Enter location (e.g. US/Chicago)"
              class="form-input w-full"
            >
          </div>
        </div>
        
        <div class="mt-6 d-flex justify-end space-x-3">
          <button 
            @click="closeLocationModal" 
            class="px-4 py-2 border-1 rounded-md color-gray-700 bg-white hover:bg-gray-100 focus:outline-none"
          >
            Cancel
          </button>
          <button 
            @click="saveLocation" 
            class="btn btn-primary px-4 py-2 rounded-md shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { candidateService } from '../../services/candidateService'
import type { Ref } from 'vue'

// Define types
interface CandidateAssessmentData {
  is_vpn: boolean;
  is_us_ip: boolean;
  is_us_timezone: boolean;
  ip_timezone_align?: boolean;
  ip_country_city?: string;
}

interface Candidate {
  candidate_id: string;
  is_new?: boolean;
  scheduled?: boolean;
  candidate_assessment?: {
    data?: CandidateAssessmentData;
    value?: string;
    reason?: string;
  };
  [key: string]: any;
}

// Props
const props = defineProps<{
  showLocationModal: boolean;
  currentLocationCandidate: Candidate | null;
  locationInput: string;
  candidateVpnStatus: Record<string, string>;
  candidateIpLocation: Record<string, string>;
  candidateIpTimeZoneAlign: Record<string, string>;
  allCandidates: Candidate[];
  isApprovedTimezone: (timezone?: string) => boolean;
}>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update:locationInput', value: string): void;
  (e: 'save'): void;
}>()

// Create a computed property for two-way binding
const localLocationInput = computed({
  get: () => props.locationInput,
  set: (value) => emit('update:locationInput', value)
})

// Methods
const closeLocationModal = () => {
  emit('close')
}

const saveLocation = async () => {
  if (props.currentLocationCandidate) {
    try {
      // Update the candidate with the new location
      const candidateId = props.currentLocationCandidate.candidate_id
      const index = props.allCandidates.findIndex(c => c.candidate_id === candidateId)
      
      if (index !== -1) {
        const candidate = props.allCandidates[index]
        
        // Get current assessment data
        const isVpn = props.candidateVpnStatus[candidateId] === 'Yes'
        const isUsIp = props.candidateIpLocation[candidateId] === 'Yes'
        // Use isApprovedTimezone function to determine if the timezone is a US timezone
        const isUsTimezone = props.isApprovedTimezone(
          candidate.candidate_answers?.timezone || candidate.candidate_timezone
        )
        const ipTimezoneAlign = props.candidateIpTimeZoneAlign[candidateId] === 'Yes'
        
        // Update the assessment with the new location
        await candidateService.updateCandidateAssessment(candidateId, {
          is_vpn: isVpn,
          is_us_ip: isUsIp,
          is_us_timezone: isUsTimezone,
          ip_timezone_align: ipTimezoneAlign,
          ip_country_city: localLocationInput.value
        })
      }
      
      // Emit save event
      emit('save')
    } catch (error) {
      console.error('Error saving location:', error)
    }
  }
}
</script>
