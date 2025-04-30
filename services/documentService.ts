import { useSupabase } from '../utils/supabase'

export const documentService = {
  /**
   * Upload a resume file to Supabase storage
   * @param file The file to upload
   * @param candidateId The ID of the candidate
   * @returns The file path in storage
   */
  async uploadResume(file: File, candidateId: string) {
    const supabase = useSupabase()
    const fileExt = file.name.split('.').pop()
    const fileName = `${candidateId}-resume-${Date.now()}.${fileExt}`
    
    // Upload the file to the 'docs' bucket in the 'resumes' folder
    const { data, error } = await supabase
      .storage
      .from('docs')
      .upload(`resumes/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      })
      
    if (error) {
      console.error('Error uploading resume:', error)
      throw error
    }
    
    // Return the file path for storing in the application record
    return data.path
  },

  /**
   * Get a public URL for a resume file
   * @param path The file path in storage
   * @returns The public URL for the file
   */
  getResumeUrl(path: string) {
    const supabase = useSupabase()
    const { data } = supabase
      .storage
      .from('docs')
      .getPublicUrl(path)
    
    return data.publicUrl
  }
}
