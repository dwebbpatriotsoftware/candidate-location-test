import { useSupabase } from '../utils/supabase'

export const candidateService = {
  
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
  
  async candidateExists(candidateId: string): Promise<boolean> {
    const supabase = useSupabase()
    
    try {
      // Check if candidate already exists using count
      const { count, error } = await supabase
        .from('candidate_info')
        .select('*', { count: 'exact', head: true })
        .eq('candidate_id', candidateId)
      
      if (error) {
        return false
      }
      
      return count ? count > 0 : false
    } catch (err) {
      return false
    }
  },
  
  async saveCandidate(candidateId: string, answers: any) {
    const supabase = useSupabase()
    
    // Check if candidate exists using the new function
    const exists = await this.candidateExists(candidateId)
    
    // If candidate already exists, return with a flag indicating it's existing
    if (exists) {
      return { 
        isExisting: true 
      }
    }
    
    try {
      // Otherwise insert new record
      const { data: newCandidate, error: insertError } = await supabase
        .from('candidate_info')
        .insert({
          candidate_id: candidateId,
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
    } catch (insertErr) {
      console.error('Exception saving candidate:', insertErr)
      // Return a default response instead of throwing
      return {
        candidate: {
          candidate_id: candidateId,
          candidate_timezone: timezone,
          candidate_ip: ip,
          candidate_answers: answers
        },
        isExisting: false
      }
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
  },
  
  async markCandidateAsAssessed(candidateId: string) {
    const supabase = useSupabase()
    const { data, error } = await supabase
      .from('candidate_info')
      .update({ is_new: false })
      .eq('candidate_id', candidateId)
      .select()
    
    if (error) {
      console.error('Error marking candidate as assessed:', error)
      throw error
    }
    
    return data || []
  },
  
  async markCandidateAsNew(candidateId: string) {
    const supabase = useSupabase()
    const { data, error } = await supabase
      .from('candidate_info')
      .update({ is_new: true })
      .eq('candidate_id', candidateId)
      .select()
    
    if (error) {
      console.error('Error marking candidate as new:', error)
      throw error
    }
    
    return data || []
  }
}
