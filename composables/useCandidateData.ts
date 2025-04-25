import { ref, computed } from 'vue'
import { candidateService } from '../services/candidateService'

// Define types for candidate data
interface CandidateAssessmentData {
  is_vpn: boolean;
  is_us_ip: boolean;
  is_us_timezone: boolean;
  ip_timezone_align?: boolean;
  ip_country_city?: string;
  has_shared_ip?: boolean;
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

export function useCandidateData() {
  const allCandidates = ref<Candidate[]>([])
  const isRefreshing = ref(false)
  
  // Computed properties for filtered candidates
  const newCandidates = computed(() => allCandidates.value.filter(c => c.is_new === true))
  const assessedCandidates = computed(() => allCandidates.value.filter(c => (c.is_new === false || c.is_new === undefined) && c.scheduled !== true))
  const scheduledCandidates = computed(() => allCandidates.value.filter(c => c.scheduled === true))
  
  // Track VPN, IP location, IP/Time Zone alignment, and shared IP status for each candidate
  const candidateVpnStatus = ref<Record<string, string>>({})
  const candidateIpLocation = ref<Record<string, string>>({})
  const candidateIpTimeZoneAlign = ref<Record<string, string>>({})
  const candidatesWithSharedIp = ref<Record<string, boolean>>({})
  
  // Store unwatch functions to clean up watchers
  const unwatchFunctions = ref([])
  
  // Function to detect shared IPs
  const detectSharedIps = () => {
    // Create a map to count occurrences of each IP
    const ipCounts: Record<string, string[]> = {}
    
    // Only check candidates in the "New" table
    newCandidates.value.forEach(candidate => {
      const ip = candidate.candidate_answers?.ip || candidate.candidate_ip
      if (ip) {
        if (!ipCounts[ip]) {
          ipCounts[ip] = []
        }
        ipCounts[ip].push(candidate.candidate_id)
      }
    })
    
    // Reset the shared IP status
    candidatesWithSharedIp.value = {}
    
    // Mark candidates with shared IPs
    Object.entries(ipCounts).forEach(([ip, candidateIds]) => {
      if (candidateIds.length > 1) {
        candidateIds.forEach(id => {
          candidatesWithSharedIp.value[id] = true
        })
      }
    })
  }
  
  // Fetch candidates from Supabase
  const fetchCandidates = async () => {
    try {
      allCandidates.value = await candidateService.getCandidates()
      // Set default values for all candidates
      allCandidates.value.forEach(candidate => {
        // Check if assessment data already exists
        if (candidate.candidate_assessment?.data) {
          candidateVpnStatus.value[candidate.candidate_id] = candidate.candidate_assessment.data.is_vpn ? 'Yes' : 'No'
          candidateIpLocation.value[candidate.candidate_id] = candidate.candidate_assessment.data.is_us_ip ? 'Yes' : 'No'
          candidateIpTimeZoneAlign.value[candidate.candidate_id] = candidate.candidate_assessment.data.ip_timezone_align ? 'Yes' : 'No'
        } else {
          // Default values if no assessment data - only set local state, don't update DB
          candidateVpnStatus.value[candidate.candidate_id] = 'No' // Default to No
          candidateIpLocation.value[candidate.candidate_id] = 'Yes' // Default to Yes
          candidateIpTimeZoneAlign.value[candidate.candidate_id] = 'Yes' // Default to Yes
        }
      })
      
      // Detect shared IPs after fetching candidates
      detectSharedIps()
    } catch (error) {
      console.error('Error fetching candidates:', error)
    }
  }
  
  // Refresh candidates function
  const refreshCandidates = async () => {
    isRefreshing.value = true
    try {
      await fetchCandidates()
    } catch (error) {
      console.error('Error refreshing candidates:', error)
    } finally {
      isRefreshing.value = false
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
  const isApprovedTimezone = (timezone: string | undefined): boolean => {
    if (!timezone) return false;
    return approvedTimezones.includes(timezone)
  }

  return {
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
    isApprovedTimezone,
    approvedTimezones
  }
}
