<template>
  <div>
    <!-- Job Information Section -->
    <div v-if="job" class="bg-white py-6">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ job.title }}</h1>
        
        <div class="flex justify-center space-x-6">
          <!-- Salary Range -->
          <div v-if="job.data?.salary?.salary_from && job.data?.salary?.salary_to" 
               class="flex items-center text-gray-700">
            <svg class="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              ${{ formatSalary(job.data.salary.salary_from) }} - 
              ${{ formatSalary(job.data.salary.salary_to) }} 
              {{ job.data.salary.salary_currency ? job.data.salary.salary_currency.toUpperCase() : 'USD' }}
            </span>
          </div>
          
          <!-- Workplace Type -->
          <div v-if="job.data?.location?.workplace_type" class="flex items-center text-gray-700">
            <svg class="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>
              {{ formatWorkplaceType(job.data.location.workplace_type) }}
              <!-- For On-site and Hybrid jobs with location_str -->
              <span v-if="['on_site', 'hybrid'].includes(job.data.location.workplace_type.toLowerCase()) && job.data.location.location_str">
                - {{ job.data.location.location_str }}
              </span>
              <!-- For Remote jobs -->
              <span v-else-if="job.data.location.workplace_type.toLowerCase() === 'remote'">
                , United States
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation (Centered) -->
    <div class="border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="-mb-px flex justify-center space-x-8" aria-label="Tabs">
          <NuxtLink 
            :to="`/jobs/${jobId}`" 
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="[
              isOverviewActive 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Overview
          </NuxtLink>
          <NuxtLink 
            :to="`/jobs/${jobId}/apply`" 
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="[
              isApplicationActive 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Application
          </NuxtLink>
        </nav>
      </div>
    </div>
    
    <!-- Page Content -->
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const jobId = computed(() => route.params.id);

// Accept job data as a prop
const props = defineProps({
  job: {
    type: Object,
    required: true
  }
});

const isOverviewActive = computed(() => {
  return route.path === `/jobs/${jobId.value}`;
});

const isApplicationActive = computed(() => {
  return route.path === `/jobs/${jobId.value}/apply`;
});

// Helper methods
const formatSalary = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const formatWorkplaceType = (type) => {
  switch (type.toLowerCase()) {
    case 'on_site':
      return 'On-site';
    case 'hybrid':
      return 'Hybrid';
    case 'remote':
      return 'Remote';
    default:
      return type;
  }
}
</script>
