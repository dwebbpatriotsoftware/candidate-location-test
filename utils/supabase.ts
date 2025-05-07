import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Store the client instance
let supabaseInstance: SupabaseClient | null = null

export function useSupabase(): SupabaseClient {
  try {
    // If we already have an instance, return it
    if (supabaseInstance) {
      return supabaseInstance
    }
    
    // Otherwise create a new instance
    const runtimeConfig = useRuntimeConfig()
    
    // Safely get and trim URL and key
    let url = '';
    let key = '';
    
    try {
      url = runtimeConfig.public.supabaseUrl?.trim() || '';
      key = runtimeConfig.public.supabaseKey?.trim() || '';
    } catch (configError) {
      console.error('Error accessing Supabase config:', configError);
    }
    
    if (!url || !key) {
      console.error('Supabase URL or key is missing');
      // Create a client with minimal config that will fail gracefully
      return createClient('https://example.com', 'fallback-key');
    }
    
    // Add persistence configuration
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        storageKey: 'supabase-auth-token',
        storage: {
          getItem: (key) => {
            if (process.client) {
              try {
                return localStorage.getItem(key)
              } catch (e) {
                console.error('Error accessing localStorage:', e);
                return null;
              }
            }
            return null
          },
          setItem: (key, value) => {
            if (process.client) {
              try {
                localStorage.setItem(key, value)
              } catch (e) {
                console.error('Error setting localStorage:', e);
              }
            }
          },
          removeItem: (key) => {
            if (process.client) {
              try {
                localStorage.removeItem(key)
              } catch (e) {
                console.error('Error removing from localStorage:', e);
              }
            }
          },
        },
      }
    })
    
    return supabaseInstance
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    // Create a client with minimal config that will fail gracefully
    return createClient('https://example.com', 'fallback-key');
  }
}
