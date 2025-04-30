<template>
  <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
      <div class="flex items-center">
        <NuxtLink to="/admin/jobs" class="text-indigo-600 hover:text-indigo-500 flex items-center">
          <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Jobs
        </NuxtLink>
      </div>
      
      <h1 class="mt-4 text-3xl font-bold text-gray-900">Create Job Posting</h1>
      <p class="mt-2 text-gray-600">Create a new job posting and add questions for candidates.</p>
    </div>
    
    <JobForm @submit="handleSubmit" @cancel="handleCancel" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import JobForm from '../../../components/admin/JobForm.vue'

// Authentication middleware
definePageMeta({
  middleware: ['auth']
})

const router = useRouter()

const handleSubmit = (jobId: string) => {
  router.push(`/admin/jobs/${jobId}`)
}

const handleCancel = () => {
  router.push('/admin/jobs')
}
</script>
