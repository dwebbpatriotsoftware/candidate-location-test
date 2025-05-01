import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Store the client instance
let supabaseInstance: SupabaseClient | null = null

export function useSupabase(): SupabaseClient {
  // If we already have an instance, return it
  if (supabaseInstance) {
    return supabaseInstance
  }
  
  // Otherwise create a new instance
  const runtimeConfig = useRuntimeConfig()
  
  const url = runtimeConfig.public.supabaseUrl.trim()
  const key = runtimeConfig.public.supabaseKey.trim()
  
  supabaseInstance = createClient(url, key)
  
  return supabaseInstance
}
