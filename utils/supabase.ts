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
  
  // Add persistence configuration
  supabaseInstance = createClient(url, key, {
    auth: {
      persistSession: true,
      storageKey: 'supabase-auth-token',
      storage: {
        getItem: (key) => {
          if (process.client) {
            return localStorage.getItem(key)
          }
          return null
        },
        setItem: (key, value) => {
          if (process.client) {
            localStorage.setItem(key, value)
          }
        },
        removeItem: (key) => {
          if (process.client) {
            localStorage.removeItem(key)
          }
        },
      },
    }
  })
  
  return supabaseInstance
}
