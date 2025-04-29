<template>
  <div class="space-y-6">
    <div class="d-flex justify-between items-center">
      <h1 class="font-size-largest font-bold color-gray-900">Assessment Reports</h1>
      <div class="d-flex items-center">
        <button 
          @click="refreshCandidates" 
          class="color-primary hover:color-primary-800 font-bold transition duration-150 d-flex items-center gap-1"
          :disabled="isRefreshing"
        >
          <span v-if="isRefreshing">Refreshing...</span>
          <span v-else>Refresh Candidates</span>
        </button>
      </div>
    </div>
    
    <!-- URL Generator Component -->
    <UrlGenerator />
    
    <!-- Candidate Tables -->
    <CandidateTable
      title="New"
      tableType="new"
      :candidates="newCandidates"
      :candidateVpnStatus="candidateVpnStatus"
      :candidateIpLocation="candidateIpLocation"
      :candidateIpTimeZoneAlign="candidateIpTimeZoneAlign"
      :candidatesWithSharedIp="candidatesWithSharedIp"
      :copiedIds="copiedIds"
      :isApprovedTimezone="isApprovedTimezone"
      @openQuestionsModal="openQuestionsModal"
      @openLocationModal="openLocationModal"
      @markAsAssessed="markAsAssessed"
      @deleteCandidate="deleteCandidate"
      @copyId="copyId"
    />
    
    <CandidateTable
      title="Reviewed"
      tableType="assessed"
      :candidates="assessedCandidates"
      :candidateVpnStatus="candidateVpnStatus"
      :candidateIpLocation="candidateIpLocation"
      :candidateIpTimeZoneAlign="candidateIpTimeZoneAlign"
      :copiedIds="copiedIds"
      :isApprovedTimezone="isApprovedTimezone"
      @openQuestionsModal="openQuestionsModal"
      @openLocationModal="openLocationModal"
      @markAsNew="markAsNew"
      @markAsScheduled="markAsScheduled"
      @deleteCandidate="deleteCandidate"
      @copyId="copyId"
    />
    
    <CandidateTable
      title="Scheduled"
      tableType="scheduled"
      :candidates="scheduledCandidates"
      :candidateVpnStatus="candidateVpnStatus"
      :candidateIpLocation="candidateIpLocation"
      :candidateIpTimeZoneAlign="candidateIpTimeZoneAlign"
      :copiedIds="copiedIds"
      :isApprovedTimezone="isApprovedTimezone"
      @openQuestionsModal="openQuestionsModal"
      @openLocationModal="openLocationModal"
      @markAsUnscheduled="markAsUnscheduled"
      @deleteCandidate="deleteCandidate"
      @copyId="copyId"
    />
    
    <!-- Modals -->
    <LocationModal
      :showLocationModal="showLocationModal"
      :currentLocationCandidate="currentLocationCandidate"
      :locationInput="locationInput"
      :candidateVpnStatus="candidateVpnStatus"
      :candidateIpLocation="candidateIpLocation"
      :candidateIpTimeZoneAlign="candidateIpTimeZoneAlign"
      :allCandidates="allCandidates"
      :isApprovedTimezone="isApprovedTimezone"
      @close="closeLocationModal"
      @update:locationInput="locationInput = $event"
      @save="saveLocation"
    />
    
    <QuestionsModal
      :showQuestionsModal="showQuestionsModal"
      :currentCandidateQuestions="currentCandidateQuestions"
      @close="closeQuestionsModal"
    />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useCandidateData } from '../composables/useCandidateData'
import { useCandidateActions } from '../composables/useCandidateActions'
import { useModalState } from '../composables/useModalState'
import UrlGenerator from '../components/candidates/UrlGenerator.vue'
import CandidateTable from '../components/candidates/CandidateTable.vue'
import LocationModal from '../components/candidates/LocationModal.vue'
import QuestionsModal from '../components/candidates/QuestionsModal.vue'

definePageMeta({
  middleware: ['auth']
})

// Use composables
const {
  allCandidates,
  newCandidates,
  assessedCandidates,
  scheduledCandidates,
  isRefreshing,
  candidateVpnStatus,
  candidateIpLocation,
  candidateIpTimeZoneAlign,
  candidatesWithSharedIp,
  unwatchFunctions,
  fetchCandidates,
  refreshCandidates,
  detectSharedIps,
  isApprovedTimezone
} = useCandidateData()

const {
  copiedIds,
  updateCandidateAssessment,
  markAsAssessed,
  markAsNew,
  deleteCandidate,
  markAsScheduled,
  markAsUnscheduled,
  copyId
} = useCandidateActions(
  allCandidates,
  candidateVpnStatus,
  candidateIpLocation,
  candidateIpTimeZoneAlign,
  candidatesWithSharedIp,
  isApprovedTimezone
)

const {
  showQuestionsModal,
  currentCandidateQuestions,
  showLocationModal,
  currentLocationCandidate,
  locationInput,
  openQuestionsModal,
  closeQuestionsModal,
  openLocationModal,
  closeLocationModal
} = useModalState()

// Setup individual watchers for each candidate
const setupIndividualWatchers = () => {
  // Clear any existing watchers
  if (unwatchFunctions.value.length > 0) {
    unwatchFunctions.value.forEach(unwatch => unwatch())
    unwatchFunctions.value = []
  }
  
  // Set up individual watchers for each candidate
  allCandidates.value.forEach(candidate => {
    const id = candidate.candidate_id
    
    // Watch VPN status for this specific candidate
    const unwatchVpn = watch(
      () => candidateVpnStatus.value[id],
      async (newValue, oldValue) => {
        if (newValue !== oldValue) {
          await updateCandidateAssessment(id)
        }
      }
    )
    
    // Watch IP location for this specific candidate
    const unwatchIp = watch(
      () => candidateIpLocation.value[id],
      async (newValue, oldValue) => {
        if (newValue !== oldValue) {
          await updateCandidateAssessment(id)
        }
      }
    )
    
    // Watch IP/Time Zone alignment for this specific candidate
    const unwatchIpTimeZone = watch(
      () => candidateIpTimeZoneAlign.value[id],
      async (newValue, oldValue) => {
        if (newValue !== oldValue) {
          await updateCandidateAssessment(id)
        }
      }
    )
    
    // Watch shared IP status for this specific candidate
    const unwatchSharedIp = watch(
      () => candidatesWithSharedIp.value[id],
      async (newValue, oldValue) => {
        if (newValue !== oldValue) {
          await updateCandidateAssessment(id)
        }
      }
    )
    
    // Store unwatch functions to clean up later
    unwatchFunctions.value.push(unwatchVpn, unwatchIp, unwatchIpTimeZone, unwatchSharedIp)
  })
}

// Save location function
const saveLocation = async () => {
  await closeLocationModal()
  // Refresh candidates to get updated data
  await refreshCandidates()
}

// Fetch candidates on mount
onMounted(async () => {
  await fetchCandidates()
  setupIndividualWatchers()
})

// Reset watchers after refreshing candidates
watch(allCandidates, () => {
  setupIndividualWatchers()
})
</script>
