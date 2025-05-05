<template>
  <div class="cover-letter-viewer">
    <!-- Error state -->
    <div v-if="error || !coverLetterUrl" class="p-4 bg-red-50 text-red-700 rounded-md">
      Unable to load cover letter. Please try again later.
    </div>
    
    <!-- PDF Viewer -->
    <div v-else-if="isPdf" class="w-full h-[600px] border border-gray-300 rounded-md overflow-hidden">
      <iframe 
        :src="coverLetterUrl" 
        class="w-full h-full" 
        frameborder="0"
      ></iframe>
    </div>
    
    <!-- Document Viewer (for non-PDF files) -->
    <div v-else-if="coverLetterUrl" class="w-full border border-gray-300 rounded-md p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="ml-2 text-sm font-medium text-gray-900">{{ fileName }}</span>
        </div>
        <a 
          :href="coverLetterUrl" 
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
  coverLetterPath: {
    type: String,
    required: true
  }
})

const coverLetterUrl = ref('')
const fileName = ref('')
const isPdf = computed(() => {
  return fileName.value.toLowerCase().endsWith('.pdf')
})

const error = ref(false)

onMounted(async () => {
  try {
    // Get the file name from the path
    const pathParts = props.coverLetterPath.split('/')
    fileName.value = pathParts[pathParts.length - 1]
    
    console.log('Cover letter path:', props.coverLetterPath) // Log the path
    
    // Get the signed URL for the cover letter
    coverLetterUrl.value = await documentService.getCoverLetterUrl(props.coverLetterPath)
    
    console.log('Generated URL:', coverLetterUrl.value) // Log the generated URL
  } catch (err) {
    error.value = true
    console.error('Error in CoverLetterViewer:', err)
  }
})
</script>
