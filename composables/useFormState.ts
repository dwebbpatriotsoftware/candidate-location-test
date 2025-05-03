import { useLocalStorage } from '@vueuse/core'

// Define the type for form data
interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  answers?: Record<string, any>;
  resumePath?: string | null;
  coverLetterPath?: string | null;
  [key: string]: any;
}

// Define the type for the forms collection
interface FormsCollection {
  [jobId: string]: FormData;
}

export function useFormState() {
  // Use useLocalStorage for persistence across sessions
  const applicationForms = useLocalStorage<FormsCollection>('applicationForms', {})
  
  // Save form data
  const saveFormData = (jobId: string, data: any) => {
    applicationForms.value[jobId] = data
    console.log('Form data saved for job:', jobId, data)
  }
  
  // Get form data
  const getFormData = (jobId: string) => {
    const data = applicationForms.value[jobId] || null
    console.log('Retrieved form data for job:', jobId, data)
    return data
  }
  
  // Clear form data (e.g., after submission)
  const clearFormData = (jobId: string) => {
    if (applicationForms.value[jobId]) {
      delete applicationForms.value[jobId]
      console.log('Cleared form data for job:', jobId)
    }
  }
  
  return {
    applicationForms,
    saveFormData,
    getFormData,
    clearFormData
  }
}
