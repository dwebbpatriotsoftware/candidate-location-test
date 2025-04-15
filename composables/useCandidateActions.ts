import { ref } from 'vue'
import type { Ref } from 'vue'
import { candidateService } from '../services/candidateService'

// Define types for candidate data
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

export function useCandidateActions(
  allCandidates: Ref<Candidate[]>,
  candidateVpnStatus: Ref<Record<string, string>>,
  candidateIpLocation: Ref<Record<string, string>>,
  candidateIpTimeZoneAlign: Ref<Record<string, string>>,
  isApprovedTimezone: (timezone?: string) => boolean
) {
  // Track copied IDs
  const copiedIds = ref<Record<string, boolean>>({})

  // Update candidate assessment data
  const updateCandidateAssessment = async (candidateId: string) => {
    try {
      const candidate = allCandidates.value.find(c => c.candidate_id === candidateId)
      if (!candidate) return
      
      // Convert string values to boolean
      const isVpn = candidateVpnStatus.value[candidateId] === 'Yes'
      const isUsIp = candidateIpLocation.value[candidateId] === 'Yes'
      // Use isApprovedTimezone function to determine if the timezone is a US timezone
      const isUsTimezone = isApprovedTimezone(candidate.candidate_answers?.timezone || candidate.candidate_timezone)
      const ipTimezoneAlign = candidateIpTimeZoneAlign.value[candidateId] === 'Yes'
      const ipCountryCity = candidate.candidate_assessment?.data?.ip_country_city
      
      // Call the service function to update the assessment
      const updatedData = await candidateService.updateCandidateAssessment(candidateId, {
        is_vpn: isVpn,
        is_us_ip: isUsIp,
        is_us_timezone: isUsTimezone,
        ip_timezone_align: ipTimezoneAlign,
        ip_country_city: ipCountryCity // Use existing location or null
      })
      
      // Update the local candidate object with the new assessment value
      if (updatedData && updatedData.length > 0) {
        const candidateIndex = allCandidates.value.findIndex(c => c.candidate_id === candidateId)
        if (candidateIndex !== -1) {
          // Update the candidate_assessment property in the local state
          allCandidates.value[candidateIndex].candidate_assessment = updatedData[0].candidate_assessment
        }
      }
      
      console.log(`Updated assessment for candidate ${candidateId}`)
    } catch (error) {
      console.error(`Error updating assessment for candidate ${candidateId}:`, error)
    }
  }

  // Mark candidate as assessed function
  const markAsAssessed = async (candidate: Candidate) => {
    try {
      await candidateService.markCandidateAsAssessed(candidate.candidate_id)
      // Update the local state to reflect the change
      const index = allCandidates.value.findIndex(c => c.candidate_id === candidate.candidate_id)
      if (index !== -1) {
        allCandidates.value[index].is_new = false
      }
    } catch (error) {
      console.error('Error marking candidate as assessed:', error)
    }
  }

  // Mark candidate as new function
  const markAsNew = async (candidate: Candidate) => {
    try {
      await candidateService.markCandidateAsNew(candidate.candidate_id)
      // Update the local state to reflect the change
      const index = allCandidates.value.findIndex(c => c.candidate_id === candidate.candidate_id)
      if (index !== -1) {
        allCandidates.value[index].is_new = true
      }
    } catch (error) {
      console.error('Error marking candidate as new:', error)
    }
  }

  // Delete candidate function
  const deleteCandidate = async (id: string) => {
    try {
      await candidateService.deleteCandidate(id)
      // Remove the deleted candidate from the local array
      allCandidates.value = allCandidates.value.filter(c => c.candidate_id !== id)
    } catch (error) {
      console.error('Error deleting candidate:', error)
    }
  }

  // Mark candidate as scheduled function
  const markAsScheduled = async (candidate: Candidate) => {
    try {
      await candidateService.markCandidateAsScheduled(candidate.candidate_id)
      // Update the local state to reflect the change
      const index = allCandidates.value.findIndex(c => c.candidate_id === candidate.candidate_id)
      if (index !== -1) {
        allCandidates.value[index].scheduled = true
      }
    } catch (error) {
      console.error('Error marking candidate as scheduled:', error)
    }
  }

  // Unmark candidate as scheduled function
  const markAsUnscheduled = async (candidate: Candidate) => {
    try {
      await candidateService.markCandidateAsUnscheduled(candidate.candidate_id)
      // Update the local state to reflect the change
      const index = allCandidates.value.findIndex(c => c.candidate_id === candidate.candidate_id)
      if (index !== -1) {
        allCandidates.value[index].scheduled = false
      }
    } catch (error) {
      console.error('Error unmarking candidate as scheduled:', error)
    }
  }

  // Copy candidate ID to clipboard
  const copyId = (id: string, trackingKey: string) => {
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

  return {
    copiedIds,
    updateCandidateAssessment,
    markAsAssessed,
    markAsNew,
    deleteCandidate,
    markAsScheduled,
    markAsUnscheduled,
    copyId
  }
}
