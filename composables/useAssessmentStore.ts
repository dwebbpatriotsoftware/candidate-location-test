import { ref } from 'vue'

export const useAssessmentStore = () => {
  const assessments = useState('assessments', () => [])

  const addAssessment = (assessment) => {
    const existingIndex = assessments.value.findIndex(
      a => a.candidate_id === assessment.candidate_id
    )
    
    if (existingIndex !== -1) {
      // Update existing assessment
      assessments.value[existingIndex] = {
        ...assessments.value[existingIndex],
        ...assessment
      }
    } else {
      // Add new assessment
      assessments.value.push(assessment)
    }
  }

  const getAssessments = () => {
    return assessments.value
  }

  return {
    assessments,
    addAssessment,
    getAssessments
  }
}