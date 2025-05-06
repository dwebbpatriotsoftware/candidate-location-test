// Re-export the useAuth function from @sidebase/nuxt-auth
// This is a workaround for TypeScript issues with #imports

import { useAuth as useSidebaseAuth } from '@sidebase/nuxt-auth/client'

export function useNuxtAuth() {
  return useSidebaseAuth()
}
