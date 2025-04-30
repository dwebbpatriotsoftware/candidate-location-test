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
   * Get a signed URL for a resume file
   * @param path The file path in storage
   * @returns The signed URL for the file
   */
  async getResumeUrl(path: string) {
    const supabase = useSupabase()
    
    // Ensure path doesn't start with a slash
    const cleanPath = path.startsWith('/') ? path.substring(1) : path
    
    console.log('Getting URL for path:', cleanPath)
    
    try {
      // Use signed URL instead of public URL
      const { data, error } = await supabase
        .storage
        .from('docs')
        .createSignedUrl(cleanPath, 60 * 60) // 1 hour expiration
      
      if (error) {
        console.error('Error creating signed URL:', error)
        throw error
      }
      
      console.log('Generated signed URL:', data.signedUrl)
      return data.signedUrl
    } catch (error) {
      console.error('Error getting resume URL:', error)
      
      // Return empty string as fallback
      return ''
    }
  }
}
