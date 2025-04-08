<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Assessment Reports</h1>
      <div class="flex gap-4 items-center">
        <button 
          @click="handleLogout" 
          class="text-indigo-600 hover:text-indigo-500 font-medium transition duration-150"
        >
          Logout
        </button>
        <ClientOnly>
          <NuxtLink 
            :to="'/assessment?candidateId=' + candidateId" 
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition duration-150 shadow-sm"
          >
            Create New Assessment
          </NuxtLink>
        </ClientOnly>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Candidate ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timezone
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="candidate in candidates" :key="candidate.candidate_id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ candidate.candidate_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ candidate.ip_address }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ candidate.timezone }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})

const router = useRouter()
const { logout } = useAuthStore()
const { getAssessments } = useAssessmentStore()
const candidates = computed(() => getAssessments())
const candidateId = useState('candidateId', () => Math.random().toString(36).substring(2, 15))

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>