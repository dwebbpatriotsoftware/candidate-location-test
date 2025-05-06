import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  // This plugin is just to make TypeScript happy with the #imports
  // The actual useAuth function is provided by @sidebase/nuxt-auth
})

// Add type augmentation for the #imports
declare module '#imports' {
  export { useAuth } from '@sidebase/nuxt-auth/client'
}
