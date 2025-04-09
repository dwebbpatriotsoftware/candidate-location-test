import { createClient } from '@supabase/supabase-js'

// Store the client instance
let supabaseInstance = null

export function useSupabase() {
  // If we already have an instance, return it
  if (supabaseInstance) {
    return supabaseInstance
  }
  
  // Otherwise create a new instance
  const runtimeConfig = useRuntimeConfig()
  
  supabaseInstance = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseKey
  )
  
  return supabaseInstance
}