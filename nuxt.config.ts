// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-auth-utils'],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  tailwindcss: {
    configPath: '~/tailwind.config.js',
    cssPath: '~/tailwind/styles.css',
    exposeConfig: true,
  },
  runtimeConfig: {
    // Server-side environment variables (not exposed to the client)
    workableSubDomain: process.env.WORKABLE_SUB_DOMAIN || '',
    workableApiKey: process.env.WORKABLE_API_KEY || '',
    public: {
      supabaseUrl: process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL',
      supabaseKey: process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY',
      workableSubDomain: process.env.WORKABLE_SUB_DOMAIN || ''
    }
  }
})
