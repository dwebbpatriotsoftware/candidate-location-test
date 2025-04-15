import { ref } from 'vue'

export function useUrlGenerator() {
  const customCandidateId = ref('')
  const generatedUrl = ref('')
  const copyStatus = ref('Copy URL')
  const urlInput = ref<HTMLInputElement | null>(null)

  // Generate a random ID if needed
  const generateRandomId = (): string => {
    return Math.random().toString(36).substring(2, 15)
  }

  // Generate the full assessment URL
  const generateAssessmentUrl = (): void => {
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
  const copyUrl = (): void => {
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

  return {
    customCandidateId,
    generatedUrl,
    copyStatus,
    urlInput,
    generateAssessmentUrl,
    copyUrl
  }
}
