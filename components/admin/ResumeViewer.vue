<template>
  <div class="resume-viewer">
    <!-- PDF Viewer -->
    <div v-if="isPdf" class="w-full h-[600px] border border-gray-300 rounded-md overflow-hidden">
      <iframe 
        :src="resumeUrl" 
        class="w-full h-full" 
        frameborder="0"
      ></iframe>
    </div>
    
    <!-- Document Viewer (for non-PDF files) -->
    <div v-else class="w-full border border-gray-300 rounded-md p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="ml-2 text-sm font-medium text-gray-900">{{ fileName }}</span>
        </div>
        <a 
          :href="resumeUrl" 
          target="_blank" 
          class="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
        >
          Open in new tab
        </a>
      </div>
      <p class="text-gray-500 text-sm">
        This document type cannot be previewed directly. Please open in a new tab to view.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { documentService } from '../../services/documentService'

const props = defineProps({
  resumePath: {
    type: String,
    required: true
  }
})

const resumeUrl = ref('')
const fileName = ref('')
const isPdf = computed(() => {
  return fileName.value.toLowerCase().endsWith('.pdf')
})

onMounted(() => {
  // Get the file name from the path
  const pathParts = props.resumePath.split('/')
  fileName.value = pathParts[pathParts.length - 1]
  
  // Get the public URL for the resume
  resumeUrl.value = documentService.getResumeUrl(props.resumePath)
})
</script>
