// Re-export the useAuth function
// This is kept for backward compatibility

export function useNuxtAuth() {
  // Using useAuth directly
  return useAuth()
}
