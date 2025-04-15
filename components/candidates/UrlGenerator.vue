<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-grow">
        <label class="block text-sm font-medium text-gray-700 mb-1">Candidate ID</label>
        <input
          v-model="customCandidateId"
          type="text"
          placeholder="Enter ID or leave empty to generate"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
      </div>
      <div class="flex items-end">
        <button 
          @click="generateAssessmentUrl" 
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition duration-150 shadow-sm"
        >
          Generate Assessment URL
        </button>
      </div>
    </div>
    
    <!-- URL display and copy section (shown only when URL is generated) -->
    <div v-if="generatedUrl" class="mt-4 p-3 bg-gray-50 rounded-md">
      <div class="flex flex-col md:flex-row gap-2 items-center">
        <div class="flex-grow overflow-x-auto">
          <input
            ref="urlInput"
            v-model="generatedUrl"
            readonly
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          >
        </div>
        <button 
          @click="copyUrl" 
          class="whitespace-nowrap bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-150 border border-gray-300"
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
