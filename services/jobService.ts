import { useSupabase } from '../utils/supabase'

// Define types for job-related data
interface JobQuestion {
  id?: string;
  job_posting_id?: string;
  question_text: string;
  question_type: string; // 'text', 'select', 'multiselect', etc.
  required: boolean;
  order_index: number;
  options?: any; // For select/multiselect questions
}

interface JobPosting {
  id?: string;
  title: string;
  description: string;
  department_id: string;
  status: string; // 'draft', 'published', 'closed'
  created_at?: string;
  updated_at?: string;
}

interface JobApplication {
  id?: string;
  job_posting_id: string;
  candidate_id: string;
  resume_path?: string;
  status: string; // 'submitted', 'reviewed', 'rejected', 'accepted'
  created_at?: string;
  answers?: any;
}

export const jobService = {
  /**
   * Create a new job posting
   * @param jobData The job posting data
   * @returns The created job posting
   */
  async createJobPosting(jobData: JobPosting) {
    const supabase = useSupabase()
    
    // Add timestamps
    jobData.created_at = new Date().toISOString()
    jobData.updated_at = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('job_postings')
      .insert(jobData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating job posting:', error)
      throw error
    }
    
    return data
  },
  
  /**
   * Update an existing job posting
   * @param id The job posting ID
   * @param jobData The updated job posting data
   * @returns The updated job posting
   */
  async updateJobPosting(id: string, jobData: Partial<JobPosting>) {
    const supabase = useSupabase()
    
    // Update timestamp
    jobData.updated_at = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('job_postings')
      .update(jobData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating job posting:', error)
      throw error
    }
    
    return data
  },
  
  /**
   * Get all job postings
   * @param status Optional status filter
   * @returns Array of job postings
   */
  async getJobPostings(status?: string) {
    const supabase = useSupabase()
    
    let query = supabase
      .from('job_postings')
      .select('*')
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching job postings:', error)
      throw error
    }
    
    return data || []
  },
  
  /**
   * Get a specific job posting by ID
   * @param id The job posting ID
   * @returns The job posting
   */
  async getJobPosting(id: string) {
    const supabase = useSupabase()
    
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching job posting:', error)
      throw error
    }
    
    return data
  },
  
  /**
   * Add a question to a job posting
   * @param question The question data
   * @returns The created question
   */
  async addJobQuestion(question: JobQuestion) {
    const supabase = useSupabase()
    
    const { data, error } = await supabase
      .from('job_questions')
      .insert(question)
      .select()
      .single()
    
    if (error) {
      console.error('Error adding job question:', error)
      throw error
    }
    
    return data
  },
  
  /**
   * Get all questions for a job posting
   * @param jobPostingId The job posting ID
   * @returns Array of questions
   */
  async getJobQuestions(jobPostingId: string) {
    const supabase = useSupabase()
    
    const { data, error } = await supabase
      .from('job_questions')
      .select('*')
      .eq('job_posting_id', jobPostingId)
      .order('order_index', { ascending: true })
    
    if (error) {
      console.error('Error fetching job questions:', error)
      throw error
    }
    
    return data || []
  },
  
  /**
   * Submit a job application
   * @param applicationData The application data
   * @returns The created application
   */
  async submitApplication(applicationData: JobApplication) {
    const supabase = useSupabase()
    
    // Add timestamp
    applicationData.created_at = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('job_applications')
      .insert(applicationData)
      .select()
      .single()
    
    if (error) {
      console.error('Error submitting application:', error)
      throw error
    }
    
    return data
  },
  
  /**
   * Get all applications for a job posting
   * @param jobPostingId The job posting ID
   * @returns Array of applications
   */
  async getJobApplications(jobPostingId: string) {
    const supabase = useSupabase()
    
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('job_posting_id', jobPostingId)
    
    if (error) {
      console.error('Error fetching job applications:', error)
      throw error
    }
    
    return data || []
  }
}
