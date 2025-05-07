import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  // This plugin is just to make TypeScript happy with the #imports
  // The actual useAuth function is provided by @sidebase/nuxt-auth
})

// Add type augmentation for the #imports
declare module '#imports' {
  // Declare the useAuth function directly with more specific types
  function useAuth(): {
    status: import('vue').Ref<'authenticated' | 'unauthenticated' | 'loading'>;
    data: import('vue').Ref<{
      user?: {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
      supabaseAccessToken?: string;
      supabaseRefreshToken?: string;
    } | null>;
    signIn: (provider: string, options?: any) => Promise<any>;
    signOut: (options?: any) => Promise<any>;
  }
}
