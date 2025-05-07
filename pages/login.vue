<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow p-4">
      <h2 class="text-2xl font-bold text-center mb-6">Login to Reports</h2>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
        </div>
        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition duration-150 shadow-sm"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
const router = useRouter()
const { login, error: authError, isLoading } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')

// Sync error from auth store
watch(authError, (newError) => {
  if (newError) {
    error.value = newError
  }
})

const handleLogin = async () => {
  if (await login(email.value, password.value)) {
    try {
      // Use a more explicit navigation approach
      const currentPath = window.location.pathname;
      const basePath = currentPath.endsWith('/login') 
        ? currentPath.substring(0, currentPath.length - 6) 
        : '';
      
      router.push(`${basePath}/reports`)
    } catch (e) {
      console.error('Navigation error:', e);
      // Fallback to simple string-based navigation
      router.push('/reports');
    }
  } else {
    error.value = 'Invalid email or password'
  }
}
</script>
