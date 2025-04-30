<template>
  <div class="resume-uploader">
    <!-- File drop area -->
    <div 
      class="upload-area border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
      :class="{ 
        'border-indigo-300 bg-indigo-50': isDragging, 
        'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50': !isDragging 
      }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleFileDrop"
      @click="triggerFileInput"
    >
      <input 
        ref="fileInput"
        type="file"
        class="hidden"
        @change="handleFileSelect"
        accept=".pdf,.doc,.docx,.txt,.rtf"
      >
      
      <div v-if="!selectedFile && !uploadedFilePath">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="mt-2 text-sm text-gray-600">
          <span class="font-medium text-indigo-600 hover:text-indigo-500">
            Upload a file
          </span>
          or drag and drop
        </p>
        <p class="mt-1 text-xs text-gray-500">
          PDF, DOC, DOCX, TXT, RTF up to 10MB
        </p>
      </div>
      
      <div v-else-if="selectedFile && !isUploading && !uploadedFilePath" class="text-left">
        <div class="flex items-center">
          <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="ml-2 text-sm font-medium text-gray-900">{{ selectedFile.name }}</span>
        </div>
        <p class="mt-1 text-xs text-gray-500">
          {{ formatFileSize(selectedFile.size) }}
        </p>
        <div class="mt-2 flex space-x-2">
          <button 
            @click.stop="uploadFile" 
            class="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-500"
          >
            Upload
          </button>
          <button 
            @click.stop="cancelUpload" 
            class="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
      
      <div v-else-if="isUploading" class="text-center">
        <svg class="animate-spin h-6 w-6 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-sm font-medium text-gray-900">Uploading...</p>
        <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div class="bg-indigo-600 h-1.5 rounded-full" :style="{ width: `${uploadProgress}%` }"></div>
        </div>
      </div>
      
      <div v-else-if="uploadedFilePath" class="text-left">
        <div class="flex items-center">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="ml-2 text-sm font-medium text-gray-900">{{ uploadedFileName }}</span>
        </div>
        <p class="mt-1 text-xs text-gray-500">
          Successfully uploaded
        </p>
        <div class="mt-2">
          <button 
            @click.stop="removeUploadedFile" 
            class="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
    
    <!-- Error message -->
    <div v-if="errorMessage" class="mt-2 text-sm text-red-600">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { documentService } from '../../services/documentService'

// Props
const props = defineProps({
  candidateId: {
    type: String,
    required: true
  },
  maxSizeMB: {
    type: Number,
    default: 10
  }
})

// Emits
const emit = defineEmits(['upload-success', 'upload-error', 'file-removed'])

// State
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadedFilePath = ref<string | null>(null)
const uploadedFileName = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

// Methods
const triggerFileInput = () => {
  if (fileInput.value && !isUploading.value && !uploadedFilePath.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    validateAndSetFile(file)
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file: File) => {
  errorMessage.value = null
  
  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/rtf'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = 'Invalid file type. Please upload a PDF, DOC, DOCX, TXT, or RTF file.'
    return
  }
  
  // Check file size
  const maxSizeBytes = props.maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    errorMessage.value = `File is too large. Maximum size is ${props.maxSizeMB}MB.`
    return
  }
  
  selectedFile.value = file
}

const uploadFile = async () => {
  if (!selectedFile.value) return
  
  isUploading.value = true
  uploadProgress.value = 0
  errorMessage.value = null
  
  try {
    // Simulate upload progress (in a real app, you might use XMLHttpRequest to track progress)
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 300)
    
    // Upload the file to Supabase storage
    const filePath = await documentService.uploadResume(selectedFile.value, props.candidateId)
    
    // Clear the interval and set progress to 100%
    clearInterval(progressInterval)
    uploadProgress.value = 100
    
    // Set the uploaded file path and name
    uploadedFilePath.value = filePath
    uploadedFileName.value = selectedFile.value.name
    
    // Emit success event with the file path
    emit('upload-success', filePath)
    
    // Reset the selected file
    selectedFile.value = null
    
    // Reset the file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to upload file. Please try again.'
    emit('upload-error', error)
  } finally {
    isUploading.value = false
  }
}

const cancelUpload = () => {
  selectedFile.value = null
  errorMessage.value = null
  
  // Reset the file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeUploadedFile = () => {
  uploadedFilePath.value = null
  uploadedFileName.value = null
  emit('file-removed')
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' bytes'
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB'
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }
}
</script>
