import { createServerSupabaseClient, handleApiError } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.job_id) {
      throw createError({
        statusCode: 400,
        message: 'Job ID is required'
      })
    }
    
    if (!body.candidate_id) {
      throw createError({
        statusCode: 400,
        message: 'Candidate ID is required'
      })
    }
    
    // Get the server-captured IP data from the event context
    const reqIpData = event.context.reqIpData || { 'direct-ip': 'unknown' }
    const reqIp = event.context.reqIp || 'unknown'
    
    // Add server-side IP data to candidate_info
    if (body.candidate_info) {
      body.candidate_info.req_ip = reqIp
      body.candidate_info.req_ip_data = reqIpData
    } else {
      body.candidate_info = { 
        req_ip: reqIp,
        req_ip_data: reqIpData
      }
    }
    
    // Create server-side Supabase client
    const supabase = createServerSupabaseClient(event)
    
    // Insert the application into the job_applications table
    const { data, error } = await supabase
      .from('job_applications')
      .insert(body)
      .select()
    
    // Handle database errors
    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message
      })
    }
    
    // Return the inserted application data
    return data
  } catch (error) {
    return handleApiError(error)
  }
})
