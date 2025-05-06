// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@sidebase/nuxt-auth'
  ],
  auth: {
    baseURL: 'http://localhost:3000/api/auth',
    originEnvKey: 'AUTH_ORIGIN', // Add this to fix recursion issue with /session
    provider: {
      type: 'authjs'
    },
    globalAppMiddleware: {
      isEnabled: false // We'll handle middleware ourselves for compatibility
    }
  },
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
    // Auth configuration
    auth: {
      secret: process.env.AUTH_SECRET || 'your-secret-here'
    },
    public: {
      supabaseUrl: process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL',
      supabaseKey: process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY',
      workableSubDomain: process.env.WORKABLE_SUB_DOMAIN || '',
      authOrigin: process.env.AUTH_ORIGIN || 'http://localhost:3000'
    }
  }
})
