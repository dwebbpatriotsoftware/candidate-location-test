import { useSupabase } from '~/utils/supabase'
import { workableService } from './workableService'

// Define interfaces
interface JobForm {
  id?: string;
  job_id: string;
  visible_questions: string[];
  hidden_questions: string[];
  created_at?: string;
  updated_at?: string;
}

export const jobService = {
  // Get all jobs
  async getJobs() {
    try {
      const data = await $fetch('/api/jobs')
      return data || []
    } catch (error: any) {
      console.error('Error fetching jobs:', error)
      throw error
    }
  },
  
  // Get a specific job by ID (shortcode)
  async getJob(id: string) {
    try {
      const data = await $fetch(`/api/jobs/${id}`)
      return data
    } catch (error: any) {
      console.error('Error fetching job:', error)
      throw error
    }
  },
  
  // Save a Workable job to the database
  async saveWorkableJob(workableJob: any) {
    try {
      const supabase = useSupabase()
      
      // Debug the structure of the workableJob object
      console.log('Workable job structure:', JSON.stringify(workableJob, null, 2))
      
      // Make sure we're accessing the correct properties
      const id = workableJob.shortcode
      const title = workableJob.title || 'Untitled Job'
      const status = workableJob.state || 'draft'
      
      if (!id) {
        throw new Error('Job shortcode is missing')
      }
      
      // Fetch additional data from Workable API
      console.log(`Fetching additional data for job ${id}`)
      let questionsData = null
      
      try {
        questionsData = await workableService.getJobWithAllData(id)
        console.log('Successfully fetched job questions data')
      } catch (err) {
        console.error('Error fetching job questions data:', err)
        // Continue even if we couldn't fetch the questions data
      }
      
      // Insert or update the job
      const { data, error } = await supabase
        .from('jobs')
        .upsert({
          id,
          title,
          status,
          data: workableJob, // Store the complete job data as JSONB
          questions: questionsData, // Store the combined questions data in the new column
          updated_at: new Date().toISOString(),
          last_synced_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
      
      if (error) throw error
      return data
    } catch (error: any) {
      console.error('Error saving Workable job:', error)
      throw error
    }
  },
  
  // Delete a job
  async deleteJob(id: string) {
    try {
      const supabase = useSupabase()
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error: any) {
      console.error('Error deleting job:', error)
      throw error
    }
  },
  
  // Get job applications
  async getJobApplications(jobId: string) {
    try {
      const supabase = useSupabase()
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error: any) {
      console.error('Error fetching job applications:', error)
      throw error
    }
  },
  
  // Submit a job application
  async submitApplication(applicationData: any) {
    try {
      const data = await $fetch('/api/jobs/applications', {
        method: 'POST',
        body: applicationData,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      return data
    } catch (error: any) {
      console.error('Error submitting application:', error)
      throw error
    }
  },

  // Get job form by job ID
  async getJobForm(jobId: string) {
    try {
      const supabase = useSupabase()
      const { data, error } = await supabase
        .from('job_form')
        .select('*')
        .eq('job_id', jobId)
        .single()
      
      if (error) {
        // If no record found, return null instead of throwing an error
        if (error.code === 'PGRST116') {
          return null
        }
        
        // For 406 errors, log but don't throw
        // The error message or code might contain '406' for Not Acceptable errors
        if (error.message?.includes('406') || error.code?.includes('406') || error.details?.includes('406')) {
          console.warn('406 Not Acceptable error when fetching job form. This may indicate a permissions issue:', error)
          return null
        }
        
        throw error
      }
      
      return data as JobForm
    } catch (error: any) {
      console.error('Error fetching job form:', error)
      
      // Check for common network/API errors that we want to handle gracefully
      if (
        // Network errors
        error.message?.includes('network') || 
        error.message?.includes('connection') ||
        // 406 errors that might be caught here
        error.message?.includes('406') ||
        // Any other error that should be handled gracefully
        error.message?.includes('Not Acceptable')
      ) {
        console.warn('Handled error gracefully when fetching job form:', error.message)
        return null
      }
      
      // For unexpected errors, still throw to prevent silent failures
      throw error
    }
  },
  
  // Save job form
  async saveJobForm(jobForm: JobForm) {
    try {
      const supabase = useSupabase()
      
      // Insert or update the job form
      const { data, error } = await supabase
        .from('job_form')
        .upsert({
          job_id: jobForm.job_id,
          visible_questions: jobForm.visible_questions,
          hidden_questions: jobForm.hidden_questions,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'job_id'
        })
      
      if (error) throw error
      return data
    } catch (error: any) {
      console.error('Error saving job form:', error)
      throw error
    }
  },
  
  // Get all questions for a job (including form customizations)
  async getJobQuestions(jobId: string) {
    try {
      const data = await $fetch(`/api/jobs/questions/${jobId}`)
      return data || []
    } catch (error: any) {
      console.error('Error getting job questions:', error)
      // Return empty array instead of throwing to prevent application failure
      return []
    }
  }
}
