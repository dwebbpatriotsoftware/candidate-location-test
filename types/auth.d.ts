import 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    /**
     * Supabase access token
     */
    supabaseAccessToken?: string
    
    /**
     * Supabase refresh token
     */
    supabaseRefreshToken?: string
    
    /**
     * The user object
     */
    user?: {
      /**
       * User ID
       */
      id?: string
      
      /**
       * User name
       */
      name?: string | null
      
      /**
       * User email
       */
      email?: string | null
      
      /**
       * User image/avatar
       */
      image?: string | null
    }
  }
  
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    /**
     * Supabase access token
     */
    supabaseAccessToken?: string
    
    /**
     * Supabase refresh token
     */
    supabaseRefreshToken?: string
  }
}

declare module 'next-auth/jwt' {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT {
    /**
     * Supabase access token
     */
    supabaseAccessToken?: string
    
    /**
     * Supabase refresh token
     */
    supabaseRefreshToken?: string
  }
}
