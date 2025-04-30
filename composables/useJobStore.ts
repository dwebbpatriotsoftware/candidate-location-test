import { ref, computed } from 'vue'
import { jobService } from '../services/jobService'

// Define types
interface JobQuestion {
  id?: string;
  job_posting_id?: string;
  question_text: string;
  question_type: string;
  required: boolean;
  order_index: number;
  options?: any;
}

interface JobPosting {
  id?: string;
  title: string;
  description: string;
  department_id: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface JobApplication {
  id?: string;
  job_posting_id: string;
  candidate_id: string;
  resume_path?: string;
  status: string;
  created_at?: string;
  answers?: any;
}

export function useJobStore() {
  // State
  const jobPostings = ref<JobPosting[]>([])
  const currentJobPosting = ref<JobPosting | null>(null)
  const jobQuestions = ref<JobQuestion[]>([])
  const jobApplications = ref<JobApplication[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Computed properties
  const publishedJobs = computed(() => 
    jobPostings.value.filter(job => job.status === 'published')
  )
  
  const draftJobs = computed(() => 
    jobPostings.value.filter(job => job.status === 'draft')
  )
  
  const closedJobs = computed(() => 
    jobPostings.value.filter(job => job.status === 'closed')
  )
  
  // Methods
  const fetchJobPostings = async (status?: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      jobPostings.value = await jobService.getJobPostings(status)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch job postings'
      console.error('Error fetching job postings:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const fetchJobPosting = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      currentJobPosting.value = await jobService.getJobPosting(id)
      await fetchJobQuestions(id)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch job posting'
      console.error('Error fetching job posting:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const createJobPosting = async (jobData: JobPosting) => {
    isLoading.value = true
    error.value = null
    
    try {
      const newJob = await jobService.createJobPosting(jobData)
      jobPostings.value.push(newJob)
      return newJob
    } catch (err: any) {
      error.value = err.message || 'Failed to create job posting'
      console.error('Error creating job posting:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const updateJobPosting = async (id: string, jobData: Partial<JobPosting>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const updatedJob = await jobService.updateJobPosting(id, jobData)
      
      // Update the job in the local state
      const index = jobPostings.value.findIndex(job => job.id === id)
      if (index !== -1) {
        jobPostings.value[index] = updatedJob
      }
      
      if (currentJobPosting.value?.id === id) {
        currentJobPosting.value = updatedJob
      }
      
      return updatedJob
    } catch (err: any) {
      error.value = err.message || 'Failed to update job posting'
      console.error('Error updating job posting:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const fetchJobQuestions = async (jobPostingId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      jobQuestions.value = await jobService.getJobQuestions(jobPostingId)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch job questions'
      console.error('Error fetching job questions:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const addJobQuestion = async (question: JobQuestion) => {
    isLoading.value = true
    error.value = null
    
    try {
      const newQuestion = await jobService.addJobQuestion(question)
      jobQuestions.value.push(newQuestion)
      // Sort questions by order_index
      jobQuestions.value.sort((a, b) => a.order_index - b.order_index)
      return newQuestion
    } catch (err: any) {
      error.value = err.message || 'Failed to add job question'
      console.error('Error adding job question:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const submitApplication = async (applicationData: JobApplication) => {
    isLoading.value = true
    error.value = null
    
    try {
      const newApplication = await jobService.submitApplication(applicationData)
      return newApplication
    } catch (err: any) {
      error.value = err.message || 'Failed to submit application'
      console.error('Error submitting application:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const fetchJobApplications = async (jobPostingId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      jobApplications.value = await jobService.getJobApplications(jobPostingId)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch job applications'
      console.error('Error fetching job applications:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    // State
    jobPostings,
    currentJobPosting,
    jobQuestions,
    jobApplications,
    isLoading,
    error,
    
    // Computed
    publishedJobs,
    draftJobs,
    closedJobs,
    
    // Methods
    fetchJobPostings,
    fetchJobPosting,
    createJobPosting,
    updateJobPosting,
    fetchJobQuestions,
    addJobQuestion,
    submitApplication,
    fetchJobApplications
  }
}
