import { useSupabase } from '../utils/supabase'

export const candidateService = {
  async saveCandidate(candidateId: string, timezone: string, ip: string) {
    const supabase = useSupabase()
    
    // First check if candidate already exists
    const { data: existingCandidate, error: selectError } = await supabase
      .from('candidate_info')
      .select('*')
      .eq('candidate_id', candidateId)
      .single()
    
    // If there was an error other than "no rows found", handle it
    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking for existing candidate:', selectError)
      throw selectError
    }
    
    // If candidate already exists, return with a flag indicating it's existing
    if (existingCandidate) {
      return { 
        candidate: existingCandidate, 
        isExisting: true 
      }
    }
    
    // Otherwise insert new record
    const { data: newCandidate, error: insertError } = await supabase
      .from('candidate_info')
      .insert({
        candidate_id: candidateId,
        candidate_timezone: timezone,
        candidate_ip: ip
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Error saving candidate:', insertError)
      throw insertError
    }
    
    return { 
      candidate: newCandidate, 
      isExisting: false 
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
