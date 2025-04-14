<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Assessment Reports</h1>
      <div class="flex items-center">
        <button 
          @click="refreshCandidates" 
          class="text-indigo-600 hover:text-indigo-500 font-medium transition duration-150 flex items-center gap-1"
          :disabled="isRefreshing"
        >
          <span v-if="isRefreshing">Refreshing...</span>
          <span v-else>Refresh Candidates</span>
        </button>
      </div>
    </div>
    
    <!-- New candidate ID input and URL generation section -->
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
    
    <!-- To Assess Table -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-3">New</h2>
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VPN?</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">US IP?</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">US TIME ZONE?</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP/TIME ZONE?</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="candidate in newCandidates" 
              :key="candidate.candidate_id" 
              class="hover:bg-gray-50"
            > 
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="{
                      'bg-red-100': candidate.candidate_assessment?.value === 'Exit',
                      'bg-yellow-100': candidate.candidate_assessment?.value === 'Caution',
                      'bg-green-100': candidate.candidate_assessment?.value === 'Proceed'
                    }">
                  <div class="flex items-center">
                    <div class="relative">
                      <button 
                        @click="copyId(candidate.candidate_id, candidate.candidate_id)" 
                        class="focus:outline-none mr-2"
                        :aria-label="`Copy ${candidate.candidate_id}`"
                      >
                      <!-- Copy icon SVG -->
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        :class="[
                          'h-5 w-5 transition-colors duration-200',
                          copiedIds[candidate.candidate_id] ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'
                        ]"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          stroke-linecap="round" 
                          stroke-linejoin="round" 
                          stroke-width="2" 
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      
                      <!-- Copied tooltip -->
                      <span 
                        v-if="copiedIds[candidate.candidate_id]" 
                        class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-xs rounded shadow-lg"
                      >
                        Copied!
                      </span>
                    </button>
                  </div>
                  <span>{{ candidate.candidate_id }}</span>
                </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="{
                      'bg-red-100': candidate.candidate_assessment?.value === 'Exit',
                      'bg-yellow-100': candidate.candidate_assessment?.value === 'Caution',
                      'bg-green-100': candidate.candidate_assessment?.value === 'Proceed'
                    }">
                  <div class="flex items-center">
                    <div class="relative group flex items-center mr-2">
                      <button 
                        @click="openQuestionsModal(candidate)"
                        class="text-gray-500 hover:text-gray-700 focus:outline-none flex items-center"
                        aria-label="View candidate responses"
                      >
                        <!-- Information icon SVG -->
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          class="h-5 w-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            stroke-width="2" 
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                      </button>
                      <!-- Tooltip -->
                      <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        View Candidate Data
                      </span>
                    </div>
                    <div class="flex flex-col">
                      <div>{{ candidate.candidate_assessment?.value || 'Not assessed' }}</div>
                      <div v-if="candidate.candidate_assessment?.reason" class="text-xs text-gray-500 white-space: pre-wrap">
                        {{ candidate.candidate_assessment.reason }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="candidateVpnStatus[candidate.candidate_id] === 'Yes' ? 'bg-yellow-100' : 'bg-green-100'">
                  <select 
                    v-model="candidateVpnStatus[candidate.candidate_id]" 
                    class="bg-transparent border-0 focus:ring-0 focus:outline-none"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="candidateIpLocation[candidate.candidate_id] === 'Yes' ? 'bg-green-100' : 'bg-red-100'">
                  <div class="flex items-center">
                    <div class="relative group flex items-center mr-2">
                      <button 
                        @click="openLocationModal(candidate)"
                        class="text-gray-500 hover:text-gray-700 focus:outline-none flex items-center"
                        aria-label="Set IP location"
                      >
                        <!-- Location pin icon SVG -->
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          class="h-5 w-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            stroke-width="2" 
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                          />
                          <path 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            stroke-width="2" 
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                          />
                        </svg>
                      </button>
                      <!-- Tooltip -->
                      <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        Set IP Location
                      </span>
                    </div>
    <div class="flex flex-col">
      <select 
        v-model="candidateIpLocation[candidate.candidate_id]" 
        class="bg-transparent border-0 focus:ring-0 focus:outline-none"
      >
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      <!-- IP Location sub-text -->
      <div class="text-xs text-gray-500">
        ({{ candidate.candidate_assessment?.data?.ip_country_city || 'Unknown location' }})
      </div>
    </div>
  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="isApprovedTimezone(candidate.candidate_answers?.timezone || candidate.candidate_timezone) ? 'bg-green-100' : 'bg-red-100'">
                  {{ isApprovedTimezone(candidate.candidate_answers?.timezone || candidate.candidate_timezone) ? 'Yes' : 'No' }}
                  <div class="text-xs text-gray-500">
                    ({{ candidate.candidate_answers?.timezone || candidate.candidate_timezone || 'Unknown timezone' }})
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="candidateIpTimeZoneAlign[candidate.candidate_id] === 'Yes' ? 'bg-green-100' : 'bg-yellow-100'">
                  <select 
                    v-model="candidateIpTimeZoneAlign[candidate.candidate_id]" 
                    class="bg-transparent border-0 focus:ring-0 focus:outline-none"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td class="px-6 py-4 text-sm font-medium text-center bg-gray-50">
                  <div class="flex justify-center items-center h-full">
                    <!-- Mark as assessed button -->
                    <div class="relative group inline-flex items-center justify-center mr-2">
                    <button 
                      @click="markAsAssessed(candidate)"
                      class="text-green-600 hover:text-green-500 focus:outline-none flex items-center justify-center"
                      aria-label="Mark as assessed"
                    >
                      <!-- Checked checkbox icon SVG -->
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-5 w-5 text-gray-500" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </button>
                    <!-- Tooltip -->
                    <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      Mark as Reviewed
                    </span>
                    </div>
                    <button 
                      @click="deleteCandidate(candidate.candidate_id)" 
                      class="text-red-600 hover:text-red-900 focus:outline-none flex items-center justify-center"
                      aria-label="Delete candidate"
                    >
                    <!-- Trashcan icon SVG -->
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Assessed Table -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-3">Reviewed</h2>
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VPN?</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">US IP?</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">US TIME ZONE?</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP/TIME ZONE?</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="candidate in assessedCandidates" 
                :key="candidate.candidate_id" 
                class="hover:bg-gray-50"
              > 
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="{
                      'bg-red-100': candidate.candidate_assessment?.value === 'Exit',
                      'bg-yellow-100': candidate.candidate_assessment?.value === 'Caution',
                      'bg-green-100': candidate.candidate_assessment?.value === 'Proceed'
                    }">
                  <div class="flex items-center">
                    <div class="relative">
                      <button 
                        @click="copyId(candidate.candidate_id, candidate.candidate_id)" 
                        class="focus:outline-none mr-2"
                        :aria-label="`Copy ${candidate.candidate_id}`"
                      >
                      <!-- Copy icon SVG -->
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        :class="[
                          'h-5 w-5 transition-colors duration-200',
                          copiedIds[candidate.candidate_id] ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'
                        ]"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          stroke-linecap="round" 
                          stroke-linejoin="round" 
                          stroke-width="2" 
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      
                      <!-- Copied tooltip -->
                      <span 
                        v-if="copiedIds[candidate.candidate_id]" 
                        class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-xs rounded shadow-lg"
                      >
                        Copied!
                      </span>
                    </button>
                  </div>
                  <span>{{ candidate.candidate_id }}</span>
                </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="{
                      'bg-red-100': candidate.candidate_assessment?.value === 'Exit',
                      'bg-yellow-100': candidate.candidate_assessment?.value === 'Caution',
                      'bg-green-100': candidate.candidate_assessment?.value === 'Proceed'
                    }">
                  <div class="flex items-center">
                    <div class="relative group flex items-center mr-2">
                      <button 
                        @click="openQuestionsModal(candidate)"
                        class="text-gray-500 hover:text-gray-700 focus:outline-none flex items-center"
                        aria-label="View candidate responses"
                      >
                        <!-- Information icon SVG -->
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          class="h-5 w-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            stroke-width="2" 
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                      </button>
                      <!-- Tooltip -->
                      <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        View Assessment Responses
                      </span>
                    </div>
                    <div class="flex flex-col">
                      <div>{{ candidate.candidate_assessment?.value || 'Not assessed' }}</div>
                      <div v-if="candidate.candidate_assessment?.reason" class="text-xs text-gray-500">
                        {{ candidate.candidate_assessment.reason }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="candidate.candidate_assessment?.data?.is_vpn ? 'bg-yellow-100' : 'bg-green-100'">
                  {{ candidate.candidate_assessment?.data?.is_vpn ? 'Yes' : 'No' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="candidate.candidate_assessment?.data?.is_us_ip ? 'bg-green-100' : 'bg-red-100'">
                  {{ candidate.candidate_assessment?.data?.is_us_ip ? 'Yes' : 'No' }}
                  <!-- IP Location sub-text -->
                  <div class="text-xs text-gray-500">
                    ({{ candidate.candidate_assessment?.data?.ip_country_city || 'Unknown location' }})
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="isApprovedTimezone(candidate.candidate_answers?.timezone || candidate.candidate_timezone) ? 'bg-green-100' : 'bg-red-100'">
                  {{ isApprovedTimezone(candidate.candidate_answers?.timezone || candidate.candidate_timezone) ? 'Yes' : 'No' }}
                  <div class="text-xs text-gray-500">
                    ({{ candidate.candidate_answers?.timezone || candidate.candidate_timezone || 'Unknown timezone' }})
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="candidate.candidate_assessment?.data?.ip_timezone_align ? 'bg-green-100' : 'bg-yellow-100'">
                  {{ candidate.candidate_assessment?.data?.ip_timezone_align ? 'Yes' : 'No' }}
                </td>
                <td class="px-6 py-4 text-sm font-medium text-center bg-gray-50">
                  <div class="flex justify-center items-center h-full">
                    <!-- Mark as new button -->
                    <div class="relative group inline-flex items-center justify-center mr-2">
                    <button 
                      @click="markAsNew(candidate)"
                      class="text-red-600 hover:text-red-500 focus:outline-none flex items-center justify-center"
                      aria-label="Unmark"
                    >
                      <!-- Checked checkbox icon SVG -->
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-5 w-5 text-green-500" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </button>
                    <!-- Tooltip -->
                    <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      Unmark (Set as New)
                    </span>
                    </div>
                    <button 
                      @click="deleteCandidate(candidate.candidate_id)" 
                      class="text-red-600 hover:text-red-900 focus:outline-none flex items-center justify-center"
                      aria-label="Delete candidate"
                    >
                    <!-- Trashcan icon SVG -->
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Location Modal -->
    <div v-if="showLocationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              IP Location (Country/City)
            </h3>
            <button 
              @click="closeLocationModal" 
              class="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                id="location"
                v-model="locationInput"
                type="text"
                placeholder="Enter location (e.g. US/Chicago)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              @click="closeLocationModal" 
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button 
              @click="saveLocation" 
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Questions Modal -->
    <div v-if="showQuestionsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              More Information
            </h3>
            <button 
              @click="closeQuestionsModal" 
              class="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div v-if="currentCandidateQuestions" class="space-y-4">
            <div class="border-b pb-3">
              <p class="text-sm font-medium text-gray-500">Candidate ID</p>
              <p class="text-base text-gray-900">{{ currentCandidateQuestions.candidate_id }}</p>
            </div>
            
            <div class="space-y-4">
              <!-- IP Address -->
              <div>
                <p class="text-sm font-medium text-gray-500">IP Address</p>
                <p class="text-base text-gray-900">
                  <a 
                    v-if="currentCandidateQuestions.candidate_answers?.ip || currentCandidateQuestions.candidate_ip"
                    :href="`https://www.ipqualityscore.com/vpn-ip-address-check/lookup/${currentCandidateQuestions.candidate_answers?.ip || currentCandidateQuestions.candidate_ip}`" 
                    target="_blank" 
                    class="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {{ currentCandidateQuestions.candidate_answers?.ip || currentCandidateQuestions.candidate_ip }}
                  </a>
                  <span v-else>Not available</span>
                </p>
              </div>
              
              <!-- Time Zone -->
              <div>
                <p class="text-sm font-medium text-gray-500">Time Zone</p>
                <p class="text-base text-gray-900">{{ currentCandidateQuestions.candidate_answers?.timezone || currentCandidateQuestions.candidate_timezone || 'Not available' }}</p>
              </div>
              
              <div>
                <p class="text-sm font-medium text-gray-500">{{ currentCandidateQuestions.candidate_answers?.q1?.question || 'Question 1' }}</p>
                <p class="text-base text-gray-900 whitespace-pre-line">{{ currentCandidateQuestions.candidate_answers?.q1?.answer || 'No response' }}</p>
              </div>
              
              <div>
                <p class="text-sm font-medium text-gray-500">{{ currentCandidateQuestions.candidate_answers?.q2?.question || 'Question 2' }}</p>
                <p class="text-base text-gray-900 whitespace-pre-line">{{ currentCandidateQuestions.candidate_answers?.q2?.answer || 'No response' }}</p>
              </div>
              
              <!-- Assessment Values Section -->
              <div class="border-t pt-3 mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Assessment</h4>
                
                <!-- VPN Status -->
                <div class="mb-2">
                  <p class="text-sm font-medium text-gray-500">VPN?</p>
                  <p class="text-base text-gray-900"
                     :class="currentCandidateQuestions.candidate_assessment?.data?.is_vpn ? 'bg-yellow-100 px-2 py-1 rounded' : 'bg-green-100 px-2 py-1 rounded'">
                    {{ currentCandidateQuestions.candidate_assessment?.data?.is_vpn ? 'Yes' : 'No' }}
                  </p>
                </div>
                
                <!-- US IP Status -->
                <div class="mb-2">
                  <p class="text-sm font-medium text-gray-500">US IP?</p>
                  <p class="text-base text-gray-900"
                     :class="currentCandidateQuestions.candidate_assessment?.data?.is_us_ip ? 'bg-green-100 px-2 py-1 rounded' : 'bg-red-100 px-2 py-1 rounded'">
                    {{ currentCandidateQuestions.candidate_assessment?.data?.is_us_ip ? 'Yes' : 'No' }}
                  </p>
                </div>
                
                <!-- US Time Zone Status -->
                <div class="mb-2">
                  <p class="text-sm font-medium text-gray-500">US Time Zone?</p>
                  <p class="text-base text-gray-900"
                     :class="currentCandidateQuestions.candidate_assessment?.data?.is_us_timezone ? 'bg-green-100 px-2 py-1 rounded' : 'bg-red-100 px-2 py-1 rounded'">
                    {{ currentCandidateQuestions.candidate_assessment?.data?.is_us_timezone ? 'Yes' : 'No' }}
                  </p>
                </div>
                
                <!-- IP Location -->
                <div class="mb-2">
                  <p class="text-sm font-medium text-gray-500">IP Location</p>
                  <p class="text-base text-gray-900 px-2 py-1 rounded bg-gray-100">
                    {{ currentCandidateQuestions.candidate_assessment?.data?.ip_country_city || 'Unknown location' }}
                  </p>
                </div>
                
                <!-- IP/TIME ZONE Alignment -->
                <div class="mb-2">
                  <p class="text-sm font-medium text-gray-500">IP/TIME ZONE?</p>
                  <p class="text-base text-gray-900"
                     :class="currentCandidateQuestions.candidate_assessment?.data?.ip_timezone_align ? 'bg-green-100 px-2 py-1 rounded' : 'bg-yellow-100 px-2 py-1 rounded'">
                    {{ currentCandidateQuestions.candidate_assessment?.data?.ip_timezone_align ? 'Yes' : 'No' }}
                  </p>
                </div>
                
                <!-- Assessment Value -->
                <div class="mb-2">
                  <p class="text-sm font-medium text-gray-500">Assessment</p>
                  <p class="text-base text-gray-900"
                     :class="{
                       'text-red-600': currentCandidateQuestions.candidate_assessment?.value === 'Exit',
                       'text-yellow-600': currentCandidateQuestions.candidate_assessment?.value === 'Caution',
                       'text-green-600': currentCandidateQuestions.candidate_assessment?.value === 'Proceed'
                     }">
                    {{ currentCandidateQuestions.candidate_assessment?.value || 'Not assessed' }}
                  </p>
                </div>
                
                <!-- Assessment Reason -->
                <div v-if="currentCandidateQuestions.candidate_assessment?.reason">
                  <p class="text-sm font-medium text-gray-500">Reason</p>
                  <p class="text-base text-gray-900 white-space: pre-wrap">
                    {{ currentCandidateQuestions.candidate_assessment?.reason }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <button 
              @click="closeQuestionsModal" 
              class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition duration-150"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { candidateService } from '../services/candidateService'

definePageMeta({
  middleware: ['auth']
})

const router = useRouter()
const allCandidates = ref([])
const newCandidates = computed(() => allCandidates.value.filter(c => c.is_new === true))
const assessedCandidates = computed(() => allCandidates.value.filter(c => c.is_new === false || c.is_new === undefined))
const isRefreshing = ref(false)
// Track VPN, IP location, and IP/Time Zone alignment status for each candidate
const candidateVpnStatus = ref({})
const candidateIpLocation = ref({})
const candidateIpTimeZoneAlign = ref({})

// Modal state
const showQuestionsModal = ref(false)
const currentCandidateQuestions = ref(null)
const showLocationModal = ref(false)
const currentLocationCandidate = ref(null)
const locationInput = ref('')

// Modal functions
const openQuestionsModal = (candidate) => {
  currentCandidateQuestions.value = candidate
  showQuestionsModal.value = true
}

const closeQuestionsModal = () => {
  showQuestionsModal.value = false
}

// Location modal functions
const openLocationModal = (candidate) => {
  currentLocationCandidate.value = candidate
  // Pre-fill with existing location if available
  locationInput.value = candidate.candidate_location || ''
  showLocationModal.value = true
}

const closeLocationModal = () => {
  showLocationModal.value = false
  locationInput.value = ''
}

const saveLocation = async () => {
  if (currentLocationCandidate.value) {
    try {
      // Update the candidate with the new location
      const candidateId = currentLocationCandidate.value.candidate_id
      const index = allCandidates.value.findIndex(c => c.candidate_id === candidateId)
      
      if (index !== -1) {
        const candidate = allCandidates.value[index]
        
        // Get current assessment data
        const isVpn = candidateVpnStatus.value[candidateId] === 'Yes'
        const isUsIp = candidateIpLocation.value[candidateId] === 'Yes'
        const isUsTimezone = isApprovedTimezone(
          candidate.candidate_answers?.timezone || candidate.candidate_timezone
        )
        const ipTimezoneAlign = candidateIpTimeZoneAlign.value[candidateId] === 'Yes'
        
        // Update the assessment with the new location
        const updatedData = await candidateService.updateCandidateAssessment(candidateId, {
          is_vpn: isVpn,
          is_us_ip: isUsIp,
          is_us_timezone: isUsTimezone,
          ip_timezone_align: ipTimezoneAlign,
          ip_country_city: locationInput.value
        })
        
        // Update the local candidate object with the new assessment value
        if (updatedData && updatedData.length > 0) {
          allCandidates.value[index].candidate_assessment = updatedData[0].candidate_assessment
        }
      }
      
      // Close the modal
      closeLocationModal()
    } catch (error) {
      console.error('Error saving location:', error)
    }
  }
}

// Function to update assessment data
const updateCandidateAssessment = async (candidateId) => {
  try {
    const candidate = allCandidates.value.find(c => c.candidate_id === candidateId)
    if (!candidate) return
    
    // Convert string values to boolean
    const isVpn = candidateVpnStatus.value[candidateId] === 'Yes'
    const isUsIp = candidateIpLocation.value[candidateId] === 'Yes'
    const isUsTimezone = isApprovedTimezone(
      candidate.candidate_answers?.timezone || candidate.candidate_timezone
    )
    const ipTimezoneAlign = candidateIpTimeZoneAlign.value[candidateId] === 'Yes'
    const ipCountryCity = candidate.candidate_assessment?.data?.ip_country_city
    
    // Call the service function to update the assessment
    const updatedData = await candidateService.updateCandidateAssessment(candidateId, {
      is_vpn: isVpn,
      is_us_ip: isUsIp,
      is_us_timezone: isUsTimezone,
      ip_timezone_align: ipTimezoneAlign,
      ip_country_city: ipCountryCity // Use existing location or null
    })
    
    // Update the local candidate object with the new assessment value
    if (updatedData && updatedData.length > 0) {
      const candidateIndex = allCandidates.value.findIndex(c => c.candidate_id === candidateId)
      if (candidateIndex !== -1) {
        // Update the candidate_assessment property in the local state
        allCandidates.value[candidateIndex].candidate_assessment = updatedData[0].candidate_assessment
      }
    }
    
    console.log(`Updated assessment for candidate ${candidateId}`)
  } catch (error) {
    console.error(`Error updating assessment for candidate ${candidateId}:`, error)
  }
}

// Store unwatch functions to clean up watchers
const unwatchFunctions = ref([])

// Setup individual watchers for each candidate
const setupIndividualWatchers = () => {
  // Clear any existing watchers
  if (unwatchFunctions.value.length > 0) {
    unwatchFunctions.value.forEach(unwatch => unwatch())
    unwatchFunctions.value = []
  }
  
  // Set up individual watchers for each candidate
  allCandidates.value.forEach(candidate => {
    const id = candidate.candidate_id
    
    // Watch VPN status for this specific candidate
    const unwatchVpn = watch(
      () => candidateVpnStatus.value[id],
      async (newValue, oldValue) => {
        if (newValue !== oldValue) {
          await updateCandidateAssessment(id)
        }
      }
    )
    
    // Watch IP location for this specific candidate
    const unwatchIp = watch(
      () => candidateIpLocation.value[id],
      async (newValue, oldValue) => {
        if (newValue !== oldValue) {
          await updateCandidateAssessment(id)
        }
      }
    )
    
    // Watch IP/Time Zone alignment for this specific candidate
    const unwatchIpTimeZone = watch(
      () => candidateIpTimeZoneAlign.value[id],
      async (newValue, oldValue) => {
        if (newValue !== oldValue) {
          await updateCandidateAssessment(id)
        }
      }
    )
    
    // Store unwatch functions to clean up later
    unwatchFunctions.value.push(unwatchVpn, unwatchIp, unwatchIpTimeZone)
  })
}

// Fetch candidates from Supabase
onMounted(async () => {
  try {
    allCandidates.value = await candidateService.getCandidates()
    // Set default values for all candidates
    allCandidates.value.forEach(candidate => {
      // Check if assessment data already exists
      if (candidate.candidate_assessment?.data) {
        candidateVpnStatus.value[candidate.candidate_id] = candidate.candidate_assessment.data.is_vpn ? 'Yes' : 'No'
        candidateIpLocation.value[candidate.candidate_id] = candidate.candidate_assessment.data.is_us_ip ? 'Yes' : 'No'
        candidateIpTimeZoneAlign.value[candidate.candidate_id] = candidate.candidate_assessment.data.ip_timezone_align ? 'Yes' : 'No'
      } else {
        // Default values if no assessment data - only set local state, don't update DB
        candidateVpnStatus.value[candidate.candidate_id] = 'No' // Default to No
        candidateIpLocation.value[candidate.candidate_id] = 'Yes' // Default to Yes
        candidateIpTimeZoneAlign.value[candidate.candidate_id] = 'Yes' // Default to Yes
        
        // Don't automatically update the database on page load
        // updateCandidateAssessment(candidate.candidate_id)
      }
    })
    
    // Set up individual watchers after candidates are loaded
    setupIndividualWatchers()
  } catch (error) {
    console.error('Error fetching candidates:', error)
  }
})

// Refresh candidates function
const refreshCandidates = async () => {
  isRefreshing.value = true
  try {
    allCandidates.value = await candidateService.getCandidates()
    // Set default values for any new candidates
    allCandidates.value.forEach(candidate => {
      // Check if assessment data already exists
      if (candidate.candidate_assessment?.data) {
        candidateVpnStatus.value[candidate.candidate_id] = candidate.candidate_assessment.data.is_vpn ? 'Yes' : 'No'
        candidateIpLocation.value[candidate.candidate_id] = candidate.candidate_assessment.data.is_us_ip ? 'Yes' : 'No'
        candidateIpTimeZoneAlign.value[candidate.candidate_id] = candidate.candidate_assessment.data.ip_timezone_align ? 'Yes' : 'No'
      } else {
        // Default values if no assessment data - only set local state, don't update DB
        if (!candidateVpnStatus.value[candidate.candidate_id]) {
          candidateVpnStatus.value[candidate.candidate_id] = 'No'
        }
        if (!candidateIpLocation.value[candidate.candidate_id]) {
          candidateIpLocation.value[candidate.candidate_id] = 'Yes'
        }
        if (!candidateIpTimeZoneAlign.value[candidate.candidate_id]) {
          candidateIpTimeZoneAlign.value[candidate.candidate_id] = 'Yes'
        }
        
        // Don't automatically update the database on refresh
        // updateCandidateAssessment(candidate.candidate_id)
      }
    })
    
    // Reset watchers after refreshing candidates
    setupIndividualWatchers()
  } catch (error) {
    console.error('Error refreshing candidates:', error)
  } finally {
    isRefreshing.value = false
  }
}

// New reactive variables
const customCandidateId = ref('')
const generatedUrl = ref('')
const copyStatus = ref('Copy URL')
const urlInput = ref(null)
// Track copied IDs
const copiedIds = ref({})

// Generate a random ID if needed
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15)
}

// Generate the full assessment URL
const generateAssessmentUrl = () => {
  // Use custom ID if provided, otherwise generate a new one
  const id = customCandidateId.value || generateRandomId()
  
  // If user didn't provide an ID, show the generated one
  if (!customCandidateId.value) {
    customCandidateId.value = id
  }
  
  // Get the base URL of the application
  const baseUrl = window.location.origin
  
  // Generate the full URL
  generatedUrl.value = `${baseUrl}/assessment?candidateId=${id}`
}

// Copy URL to clipboard
const copyUrl = () => {
  if (urlInput.value) {
    urlInput.value.select()
    document.execCommand('copy')
    
    // Provide feedback
    copyStatus.value = 'Copied!'
    setTimeout(() => {
      copyStatus.value = 'Copy URL'
    }, 2000)

    // Clear the customCandidateId field
    customCandidateId.value = ''
  }
}

// Copy candidate ID to clipboard
const copyId = (id, trackingKey) => {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea')
  textarea.value = id
  textarea.style.position = 'fixed' // Prevent scrolling to bottom
  document.body.appendChild(textarea)
  
  // Select and copy the text
  textarea.select()
  document.execCommand('copy')
  
  // Remove the temporary element
  document.body.removeChild(textarea)
  
  // Update the copied status for this specific ID
  copiedIds.value = {
    ...copiedIds.value,
    [trackingKey]: true
  }
  
  // Reset after 2 seconds
  setTimeout(() => {
    copiedIds.value = {
      ...copiedIds.value,
      [trackingKey]: false
    }
  }, 2000)
}

// Mark candidate as assessed function
const markAsAssessed = async (candidate) => {
  try {
    await candidateService.markCandidateAsAssessed(candidate.candidate_id)
    // Update the local state to reflect the change
    const index = allCandidates.value.findIndex(c => c.candidate_id === candidate.candidate_id)
    if (index !== -1) {
      allCandidates.value[index].is_new = false
    }
  } catch (error) {
    console.error('Error marking candidate as assessed:', error)
    // Optionally add error handling UI feedback here
  }
}

// Mark candidate as new function
const markAsNew = async (candidate) => {
  try {
    await candidateService.markCandidateAsNew(candidate.candidate_id)
    // Update the local state to reflect the change
    const index = allCandidates.value.findIndex(c => c.candidate_id === candidate.candidate_id)
    if (index !== -1) {
      allCandidates.value[index].is_new = true
    }
  } catch (error) {
    console.error('Error marking candidate as new:', error)
    // Optionally add error handling UI feedback here
  }
}

// Delete candidate function
const deleteCandidate = async (id) => {
  try {
    await candidateService.deleteCandidate(id)
    // Remove the deleted candidate from the local array
    allCandidates.value = allCandidates.value.filter(c => c.candidate_id !== id)
  } catch (error) {
    console.error('Error deleting candidate:', error)
    // Optionally add error handling UI feedback here
  }
}

// List of approved timezones that should be colored green
const approvedTimezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Boise',
  'America/Detroit',
  'America/Indianapolis',
  'America/Kentucky/Louisville',
  'America/Kentucky/Monticello',
  'America/Knox_IN',
  'America/Marengo',
  'America/Petersburg',
  'America/Tell_City',
  'America/Vevay',
  'America/Vincennes',
  'America/Winamac',
  'America/Menominee',
  'America/North_Dakota/Beulah',
  'America/North_Dakota/Center',
  'America/North_Dakota/New_Salem'
]

// Function to check if a timezone is in the approved list
const isApprovedTimezone = (timezone) => {
  return approvedTimezones.includes(timezone)
}
</script>
