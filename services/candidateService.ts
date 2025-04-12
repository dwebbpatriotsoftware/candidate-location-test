import { useSupabase } from '../utils/supabase'

export const candidateService = {
  
  async updateCandidateAssessment(candidateId: string, assessmentData: {
    is_vpn: boolean,
    is_us_ip: boolean,
    is_us_timezone: boolean
  }) {
    const supabase = useSupabase()
    
    // Determine the value string based on the combination of booleans
    let value = ""
    let reason = ""
    if (!assessmentData.is_us_ip || !assessmentData.is_us_timezone) {
      value = "Exit",
      reason = "Candidate is not in the US"
    }
    else if (!assessmentData.is_vpn && assessmentData.is_us_ip && assessmentData.is_us_timezone) {
      value = "Proceed"
      reason = "Candidate appears to be in the US"
    } 
    else if (assessmentData.is_vpn){
      value = "Caution",
      reason = "Candidate is using a VPN"
    } 
    else{
      value = "Caution",
      reason = "Candidate may be using a VPN or is not in the US"
    }
    
    // Create the assessment object with the specified structure
    const candidate_assessment = {
      data: {
        is_vpn: assessmentData.is_vpn,
        is_us_ip: assessmentData.is_us_ip,
        is_us_timezone: assessmentData.is_us_timezone
      },
      value: value,
      reason: reason
    }
    
    // Update the candidate record
    const { data, error } = await supabase
      .from('candidate_info')
      .update({ candidate_assessment })
      .eq('candidate_id', candidateId)
      .select()
    
    if (error) {
      console.error('Error updating candidate assessment:', error)
      throw error
    }
    
    return data || []
  },
  
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
          candidate_timezone: answers.timezone,
          candidate_ip: answers.ip,
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
