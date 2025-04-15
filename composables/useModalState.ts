import { ref } from 'vue'
import type { Ref } from 'vue'

// Define types for candidate data
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

export function useModalState() {
  // Modal state
  const showQuestionsModal = ref(false)
  const currentCandidateQuestions = ref<Candidate | null>(null)
  const showLocationModal = ref(false)
  const currentLocationCandidate = ref<Candidate | null>(null)
  const locationInput = ref('')

  // Questions modal functions
  const openQuestionsModal = (candidate: Candidate) => {
    currentCandidateQuestions.value = candidate
    showQuestionsModal.value = true
  }

  const closeQuestionsModal = () => {
    showQuestionsModal.value = false
  }

  // Location modal functions
  const openLocationModal = (candidate: Candidate) => {
    currentLocationCandidate.value = candidate
    // Pre-fill with existing location if available
    locationInput.value = candidate.candidate_location || ''
    showLocationModal.value = true
  }

  const closeLocationModal = () => {
    showLocationModal.value = false
    locationInput.value = ''
  }

  return {
    showQuestionsModal,
    currentCandidateQuestions,
    showLocationModal,
    currentLocationCandidate,
    locationInput,
    openQuestionsModal,
    closeQuestionsModal,
    openLocationModal,
    closeLocationModal
  }
}
