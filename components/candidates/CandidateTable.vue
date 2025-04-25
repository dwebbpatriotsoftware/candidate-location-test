<template>
  <div class="mb-8">
    <h2 class="text-xl font-semibold text-gray-800 mb-3">{{ title }}</h2>
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
              v-for="candidate in candidates" 
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
              
              <!-- VPN Status Cell -->
              <template v-if="tableType === 'new'">
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
              </template>
              <template v-else>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="candidate.candidate_assessment?.data?.is_vpn ? 'bg-yellow-100' : 'bg-green-100'">
                  {{ candidate.candidate_assessment?.data?.is_vpn ? 'Yes' : 'No' }}
                </td>
              </template>
              
              <!-- US IP Status Cell -->
              <template v-if="tableType === 'new'">
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
              </template>
              <template v-else>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="candidate.candidate_assessment?.data?.is_us_ip ? 'bg-green-100' : 'bg-red-100'">
                  {{ candidate.candidate_assessment?.data?.is_us_ip ? 'Yes' : 'No' }}
                  <!-- IP Location sub-text -->
                  <div class="text-xs text-gray-500">
                    ({{ candidate.candidate_assessment?.data?.ip_country_city || 'Unknown location' }})
                  </div>
                </td>
              </template>
              
              <!-- US Time Zone Status Cell -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  :class="isApprovedTimezone(candidate.candidate_answers?.timezone || candidate.candidate_timezone) ? 'bg-green-100' : 'bg-red-100'">
                {{ isApprovedTimezone(candidate.candidate_answers?.timezone || candidate.candidate_timezone) ? 'Yes' : 'No' }}
                <div class="text-xs text-gray-500">
                  ({{ candidate.candidate_answers?.timezone || candidate.candidate_timezone || 'Unknown timezone' }})
                </div>
              </td>
              
              <!-- IP/Time Zone Alignment Cell -->
              <template v-if="tableType === 'new'">
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
              </template>
              <template v-else>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :class="candidate.candidate_assessment?.data?.ip_timezone_align ? 'bg-green-100' : 'bg-yellow-100'">
                  {{ candidate.candidate_assessment?.data?.ip_timezone_align ? 'Yes' : 'No' }}
                </td>
              </template>
              
              <!-- Actions Cell -->
              <td class="px-6 py-4 text-sm font-medium text-center bg-gray-50">
                <div class="flex justify-center items-center h-full">
                  <!-- New table actions -->
                  <template v-if="tableType === 'new'">
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
                  </template>
                  
                  <!-- Assessed table actions -->
                  <template v-if="tableType === 'assessed'">
                    <!-- Mark as scheduled button -->
                    <div class="relative group inline-flex items-center justify-center mr-2">
                      <button 
                        @click="markAsScheduled(candidate)"
                        class="text-gray-500 hover:text-gray-700 focus:outline-none flex items-center justify-center"
                        aria-label="Mark as scheduled"
                      >
                        <!-- Calendar icon SVG -->
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          class="h-5 w-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </button>
                      <!-- Tooltip -->
                      <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        Mark as Scheduled
                      </span>
                    </div>
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
                  </template>
                  
                  <!-- Scheduled table actions -->
                  <template v-if="tableType === 'scheduled'">
                    <!-- Unmark as scheduled button -->
                    <div class="relative group inline-flex items-center justify-center mr-2">
                      <button 
                        @click="markAsUnscheduled(candidate)"
                        class="text-green-500 hover:text-green-700 focus:outline-none flex items-center justify-center"
                        aria-label="Unmark as scheduled"
                      >
                        <!-- Calendar icon SVG -->
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          class="h-5 w-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </button>
                      <!-- Tooltip -->
                      <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        Unmark as Scheduled
                      </span>
                    </div>
                  </template>
                  
                  <!-- Delete button (common to all tables) -->
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
</template>

<script setup lang="ts">
import type { Ref } from 'vue'

// Define types
interface CandidateAssessmentData {
  is_vpn?: boolean;
  is_us_ip?: boolean;
  is_us_timezone?: boolean;
  ip_timezone_align?: boolean;
  ip_country_city?: string;
}

interface CandidateAssessment {
  data?: CandidateAssessmentData;
  value?: string;
  reason?: string;
}

interface CandidateAnswer {
  question?: string;
  answer?: string;
}

interface CandidateAnswers {
  q1?: CandidateAnswer;
  q2?: CandidateAnswer;
  timezone?: string;
  ip?: string;
  capture_time?: string;
  [key: string]: any;
}

interface Candidate {
  candidate_id: string;
  is_new?: boolean;
  scheduled?: boolean;
  candidate_assessment?: CandidateAssessment;
  candidate_answers?: CandidateAnswers;
  candidate_timezone?: string;
  candidate_ip?: string;
  candidate_location?: string;
  [key: string]: any;
}

// Props
const props = defineProps<{
  title: string;
  tableType: 'new' | 'assessed' | 'scheduled';
  candidates: Candidate[];
  candidateVpnStatus: Record<string, string>;
  candidateIpLocation: Record<string, string>;
  candidateIpTimeZoneAlign: Record<string, string>;
  copiedIds: Record<string, boolean>;
  isApprovedTimezone: (timezone?: string) => boolean;
}>()

// Emits
const emit = defineEmits<{
  (e: 'openQuestionsModal', candidate: Candidate): void;
  (e: 'openLocationModal', candidate: Candidate): void;
  (e: 'markAsAssessed', candidate: Candidate): void;
  (e: 'markAsNew', candidate: Candidate): void;
  (e: 'markAsScheduled', candidate: Candidate): void;
  (e: 'markAsUnscheduled', candidate: Candidate): void;
  (e: 'deleteCandidate', id: string): void;
  (e: 'copyId', id: string, trackingKey: string): void;
}>()

// Methods
const openQuestionsModal = (candidate: Candidate) => {
  emit('openQuestionsModal', candidate)
}

const openLocationModal = (candidate: Candidate) => {
  emit('openLocationModal', candidate)
}

const markAsAssessed = (candidate: Candidate) => {
  emit('markAsAssessed', candidate)
}

const markAsNew = (candidate: Candidate) => {
  emit('markAsNew', candidate)
}

const markAsScheduled = (candidate: Candidate) => {
  emit('markAsScheduled', candidate)
}

const markAsUnscheduled = (candidate: Candidate) => {
  emit('markAsUnscheduled', candidate)
}

const deleteCandidate = (id: string) => {
  emit('deleteCandidate', id)
}

const copyId = (id: string, trackingKey: string) => {
  emit('copyId', id, trackingKey)
}
</script>
