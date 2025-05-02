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
      const supabase = useSupabase()
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('updated_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching jobs:', error)
      throw error
    }
  },
  
  // Get a specific job by ID (shortcode)
  async getJob(id: string) {
    try {
      const supabase = useSupabase()
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      console.error('Error fetching job applications:', error)
      throw error
    }
  },
  
  // Submit a job application
  async submitApplication(applicationData: any) {
    try {
      const supabase = useSupabase()
      const { data, error } = await supabase
        .from('job_applications')
        .insert(applicationData)
      
      if (error) throw error
      return data
    } catch (error) {
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
        throw error
      }
      
      return data as JobForm
    } catch (error) {
      console.error('Error fetching job form:', error)
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
    } catch (error) {
      console.error('Error saving job form:', error)
      throw error
    }
  },
  
  // Get all questions for a job (including form customizations)
  async getJobQuestions(jobId: string) {
    try {
      // First get the job data
      const job = await this.getJob(jobId)
      if (!job || !job.questions) {
        return []
      }
      
      // Then get any form customizations
      const jobForm = await this.getJobForm(jobId)
      
      // If no customizations exist, return all questions from the job data
      if (!jobForm) {
        // Extract questions from the job.questions data
        const allQuestions = job.questions.questions_map || {}
        return Object.values(allQuestions)
      }
      
      // If customizations exist, apply them
      const questionsMap = job.questions.questions_map || {}
      const visibleQuestions = jobForm.visible_questions
        .map(id => questionsMap[id])
        .filter(q => q) // Filter out any undefined questions
      
      return visibleQuestions
    } catch (error) {
      console.error('Error getting job questions:', error)
      throw error
    }
  }
}
