import { NuxtAuthHandler } from '#auth'
import { JWT } from 'next-auth/jwt'
import { Session } from 'next-auth'
import { createServerSupabaseClient, handleApiError } from '~/server/utils/supabase'

// Extend the types for NextAuth
declare module 'next-auth' {
  interface Session {
    supabaseAccessToken?: string
    supabaseRefreshToken?: string
    user?: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
  
  interface User {
    supabaseAccessToken?: string
    supabaseRefreshToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    supabaseAccessToken?: string
    supabaseRefreshToken?: string
  }
}

// Define the auth handler
export default NuxtAuthHandler({
  secret: useRuntimeConfig().auth.secret,
  pages: {
    signIn: '/login'
  },
  providers: [
    // Credentials provider for Supabase email/password
    {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        try {
          // Use existing Supabase auth
          const supabase = createServerSupabaseClient()
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
          })
          
          if (error || !data.user) {
            return null
          }
          
          // Return user in the format expected by NextAuth
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email,
            // Store Supabase tokens for later use
            supabaseAccessToken: data.session.access_token,
            supabaseRefreshToken: data.session.refresh_token
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    },
    
    // Google provider (commented out for future implementation)
    /* {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    } */
  ],
  
  // Include Supabase tokens in the session
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.supabaseAccessToken = user.supabaseAccessToken
        token.supabaseRefreshToken = user.supabaseRefreshToken
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        // Add Supabase tokens to the session
        session.supabaseAccessToken = token.supabaseAccessToken
        session.supabaseRefreshToken = token.supabaseRefreshToken
        
        // Add user ID to the session
        if (session.user) {
          session.user.id = token.sub
        }
      }
      return session
    }
  }
})
