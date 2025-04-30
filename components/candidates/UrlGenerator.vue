<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="d-flex flex-col md:flex-row gap-4">
      <div class="flex-grow">
        <label class="d-block font-size-small font-bold color-gray-700 mb-1">Candidate ID</label>
        <input
          v-model="customCandidateId"
          type="text"
          placeholder="Enter ID or leave empty to generate"
          class="form-input w-full"
        >
      </div>
      <div class="d-flex items-end">
        <button 
          @click="generateAssessmentUrl" 
          class="btn btn-primary px-4 py-2 rounded-md hover:bg-primary-800 transition duration-150 shadow-sm"
        >
          Generate Assessment URL
        </button>
      </div>
    </div>
    
    <!-- URL display and copy section (shown only when URL is generated) -->
    <div v-if="generatedUrl" class="mt-4 p-3 bg-gray-100 rounded-md">
      <div class="d-flex flex-col md:flex-row gap-2 items-center">
        <div class="flex-grow overflow-x-auto">
          <input
            ref="urlInput"
            v-model="generatedUrl"
            readonly
            class="form-input w-full"
          >
        </div>
        <button 
          @click="copyUrl" 
          class="whitespace-nowrap bg-gray-200 color-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-150 border-1"
        >
          {{ copyStatus }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUrlGenerator } from '../../composables/useUrlGenerator'

const {
  customCandidateId,
  generatedUrl,
  copyStatus,
  urlInput,
  generateAssessmentUrl,
  copyUrl
} = useUrlGenerator()
</script>
