import { useSupabase } from '../utils/supabase'

export const candidateService = {
  // async updateCandidateAnswers(candidateId: string, answers: any) {
  //   const supabase = useSupabase()
    
  //   const { data, error } = await supabase
  //     .from('candidate_info')
  //     .update({
  //       candidate_answers: answers
  //     })
  //     .eq('candidate_id', candidateId)
  //     .select()
  //     .single()
    
  //   if (error) {
  //     console.error('Error updating candidate answers:', error)
  //     throw error
  //   }
    
  //   return data
  // },
  
  async deleteCandidate(candidateId: string) {
    const supabase = useSupabase()
    const { error } = await supabase
      .from('candidate_info')
      .delete()
      .eq('candidate_id', candidateId)
    
    if (error) {
      console.error('Error deleting candidate:', error)
      throw error
    }
    
    return true
  },
  
  async saveCandidate(candidateId: string, timezone: string, ip: string, answers: any) {
    const supabase = useSupabase()
    
    // First check if candidate already exists
    const { data: existingCandidate, error: selectError } = await supabase
      .from('candidate_info')
      .select('*')
      .eq('candidate_id', candidateId)
      .single()
    
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
        candidate_ip: ip,
        candidate_answers: answers
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
