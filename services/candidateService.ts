import { supabase } from '../utils/supabase'

export const candidateService = {
  async saveCandidate(candidateId: string, timezone: string, ip: string) {
    const { error } = await supabase
      .from('candidate_info')
      .upsert(
        {
          candidate_id: candidateId,
          candidate_timezone: timezone,
          candidate_ip: ip
        },
        { onConflict: 'candidate_id' }
      )
    
    if (error) {
      console.error('Error saving candidate:', error)
      throw error
    }
  },

  async getCandidates() {
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
