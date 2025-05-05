import { ref, computed } from 'vue'
import { jobService } from '../services/jobService'
import { workableService } from '../services/workableService'
import { useSupabase } from '../utils/supabase'

export function useJobStore() {
  // Define types
  interface Job {
    id: string;
    title: string;
    status: string;
    data: any;
    questions?: any;
    created_at?: string;
    updated_at?: string;
    last_synced_at?: string;
  }

  interface WorkableJob {
    shortcode: string;
    title: string;
    state: string;
    department?: {
      name: string;
    };
    created_at?: string;
    [key: string]: any;
  }

  interface JobForm {
    id?: string;
    job_id: string;
    visible_questions: string[];
    hidden_questions: string[];
    created_at?: string;
    updated_at?: string;
  }

  // State
  const jobs = ref<Job[]>([])
  const currentJob = ref<Job | null>(null)
  const workableJobs = ref<WorkableJob[]>([])
  const jobQuestions = ref<any[]>([])
  const jobApplications = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref(null)
  const copiedUrls = ref<Record<string, boolean>>({})
  const workablePagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    limit: 10
  })
  
  // Computed properties
  const publishedJobs = computed(() => 
    jobs.value.filter(job => job.status === 'published')
  )
  
  const draftJobs = computed(() => 
    jobs.value.filter(job => job.status === 'draft')
  )
  
  const closedJobs = computed(() => 
    jobs.value.filter(job => job.status === 'closed')
  )
  
  const archivedJobs = computed(() => 
    jobs.value.filter(job => job.status === 'archived')
  )
  
  // Methods
  const fetchJobs = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      jobs.value = await jobService.getJobs()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch jobs'
      console.error('Error fetching jobs:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const fetchJob = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      currentJob.value = await jobService.getJob(id)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch job'
      console.error('Error fetching job:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  // Workable integration methods
  const fetchWorkableJobs = async (page = 1) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Get total count first (if we're on page 1)
      if (page === 1) {
        workablePagination.value.totalJobs = await workableService.getTotalJobsCount()
        workablePagination.value.totalPages = Math.ceil(
          workablePagination.value.totalJobs / workablePagination.value.limit
        )
      }
      
      // Fetch jobs for the current page
      const result = await workableService.getJobs(page, workablePagination.value.limit)
      workableJobs.value = result.jobs || []
      workablePagination.value.currentPage = page
      return workableJobs.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch Workable jobs'
      console.error('Error fetching Workable jobs:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const saveWorkableJob = async (workableJob: any) => {
    isLoading.value = true
    error.value = null
    
    try {
      await jobService.saveWorkableJob(workableJob)
      // Refresh the jobs list
      await fetchJobs()
    } catch (err: any) {
      error.value = err.message || 'Failed to save Workable job'
      console.error('Error saving Workable job:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const deleteJob = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      await jobService.deleteJob(id)
      // Remove from local state
      jobs.value = jobs.value.filter(job => job.id !== id)
      if (currentJob.value?.id === id) {
        currentJob.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete job'
      console.error('Error deleting job:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  // Job application methods
  const fetchJobQuestions = async (jobId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Fetch questions with form customizations applied
      jobQuestions.value = await jobService.getJobQuestions(jobId)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch job questions'
      console.error('Error fetching job questions:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const submitApplication = async (applicationData: any) => {
    isLoading.value = true
    error.value = null
    
    try {
      return await jobService.submitApplication(applicationData)
    } catch (err: any) {
      error.value = err.message || 'Failed to submit application'
      console.error('Error submitting application:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Job form methods
  const jobForm = ref<JobForm | null>(null)
  
  const fetchJobForm = async (jobId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      jobForm.value = await jobService.getJobForm(jobId)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch job form'
      console.error('Error fetching job form:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const saveJobForm = async (form: JobForm) => {
    isLoading.value = true
    error.value = null
    
    try {
      await jobService.saveJobForm(form)
      jobForm.value = form
    } catch (err: any) {
      error.value = err.message || 'Failed to save job form'
      console.error('Error saving job form:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Application form data persistence
  const applicationFormData = ref<Record<string, any>>({})

  // Save form data
  const saveApplicationFormData = (jobId: string, data: any) => {
    applicationFormData.value[jobId] = data
  }

  // Get form data
  const getApplicationFormData = (jobId: string) => {
    return applicationFormData.value[jobId] || null
  }

  // Fetch all job applications across all jobs
  const fetchAllApplications = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Fetch all applications from the database
      const supabase = useSupabase()
      const { data, error: supabaseError } = await supabase
        .from('job_applications')
        .select('*, jobs:job_id(title)')
        .order('created_at', { ascending: false })
      
      if (supabaseError) throw supabaseError
      jobApplications.value = data || []
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch applications'
      console.error('Error fetching applications:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Fetch applications for a specific job
  const fetchJobApplications = async (jobId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      jobApplications.value = await jobService.getJobApplications(jobId)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch job applications'
      console.error('Error fetching job applications:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Update application status
  const updateApplicationStatus = async (applicationId: string, status: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const supabase = useSupabase()
      const { error: supabaseError } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', applicationId)
      
      if (supabaseError) throw supabaseError
      
      // Update local state
      const index = jobApplications.value.findIndex(app => app.id === applicationId)
      if (index !== -1) {
        jobApplications.value[index].status = status
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to update application status'
      console.error('Error updating application status:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Copy URL to clipboard
  const copyUrl = (url: string, jobId: string) => {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea')
    textarea.value = url
    textarea.style.position = 'fixed' // Prevent scrolling to bottom
    document.body.appendChild(textarea)
    
    // Select and copy the text
    textarea.select()
    document.execCommand('copy')
    
    // Remove the temporary element
    document.body.removeChild(textarea)
    
    // Update the copied status for this specific URL
    // Use Vue's reactivity system more explicitly
    const newCopiedUrls = { ...copiedUrls.value }
    newCopiedUrls[jobId] = true
    copiedUrls.value = newCopiedUrls
    
    // Reset after 2 seconds
    setTimeout(() => {
      const resetCopiedUrls = { ...copiedUrls.value }
      resetCopiedUrls[jobId] = false
      copiedUrls.value = resetCopiedUrls
    }, 2000)
  }

  return {
    // State
    jobs,
    currentJob,
    workableJobs,
    jobQuestions,
    jobApplications,
    workablePagination,
    isLoading,
    error,
    jobForm,
    applicationFormData,
    copiedUrls,
    
    // Computed
    publishedJobs,
    draftJobs,
    closedJobs,
    archivedJobs,
    
    // Methods
    fetchJobs,
    fetchJob,
    fetchWorkableJobs,
    fetchJobQuestions,
    saveWorkableJob,
    deleteJob,
    submitApplication,
    fetchJobForm,
    saveJobForm,
    saveApplicationFormData,
    getApplicationFormData,
    fetchAllApplications,
    fetchJobApplications,
    updateApplicationStatus,
    copyUrl
  }
}
