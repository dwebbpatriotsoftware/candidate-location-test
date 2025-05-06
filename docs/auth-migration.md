# Authentication System Migration

This document outlines the authentication system used in the application and the migration path from Supabase Auth to Sidebase Auth.

## Current Authentication System

The application uses a hybrid authentication system that combines:

1. **Supabase Authentication** - For email/password authentication
2. **Sidebase Auth** - For session management and future Google OAuth integration

### Key Components

- **server/api/auth/[...].ts** - The main auth handler for Sidebase Auth that integrates with Supabase
- **composables/useAuthStore.ts** - The main authentication store that handles login, logout, and session management
- **middleware/auth.ts** - Route protection middleware
- **plugins/auth-sync.ts** - Plugin to ensure auth state is properly initialized

## How It Works

1. **Login Flow**:
   - User enters email and password on the login page
   - The credentials are sent to the Sidebase Auth handler
   - The auth handler verifies the credentials with Supabase
   - Upon successful authentication, Supabase tokens are stored in the session
   - The user is redirected to the protected route

2. **Session Persistence**:
   - Sidebase Auth handles session persistence using HTTP-only cookies
   - The auth-sync plugin ensures the Supabase client is properly initialized with the session
   - This ensures the user remains logged in after page refreshes

3. **Route Protection**:
   - The auth middleware checks if the user is authenticated
   - If not, they are redirected to the login page
   - Admin routes and reports are protected

## Future Google Auth Integration

To add Google Auth:

1. Uncomment the Google provider in `server/api/auth/[...].ts`
2. Add Google OAuth credentials to the `.env` file
3. Update the login page to include a Google login button
4. Implement account linking if needed

## Troubleshooting

If you encounter authentication issues:

1. Check browser cookies to ensure the session is being stored
2. Verify that the AUTH_SECRET is properly set in the .env file
3. Check the server logs for any authentication errors
4. Ensure the Supabase URL and key are correctly configured
