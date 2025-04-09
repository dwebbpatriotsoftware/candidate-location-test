import { useSupabase } from '../utils/supabase'

export const candidateService = {
  async saveCandidate(candidateId: string, timezone: string, ip: string) {
    const supabase = useSupabase()
    
    let error
  
      // Insert new record
    const { error: insertError } = await supabase
      .from('candidate_info')
      .insert({
        candidate_id: candidateId,
        candidate_timezone: timezone,
        candidate_ip: ip
      })
      
      error = insertError
    
    
    if (error) {
      console.error('Error saving candidate:', error)
      throw error
    }
  },

  async getCandidates() {
    const supabase = useSupabase()
    const { data, error } = await supabase
      .from('candidate_info')
      .select('*')
    
    if (error) {
      console.error('Error fetching candidates:', error)
      throw error
    }
    
    return data || []
  }
}
