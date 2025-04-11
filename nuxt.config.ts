// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    // Server-side environment variables (not exposed to the client)
    public: {
      supabaseUrl: process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL',
      supabaseKey: process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
    }
  }
})
