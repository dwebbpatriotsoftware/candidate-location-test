<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center text-center">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Assessment Portal</h1>
    <p class="text-lg text-gray-600 mb-8">Take an assessment or view reports</p>
    <div class="space-x-4">
      <ClientOnly>
        <NuxtLink 
          :to="'/assessment?candidateId=' + candidateId" 
          class="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-500 transition duration-150 shadow-sm inline-block"
        >
          Take Assessment
        </NuxtLink>
      </ClientOnly>
      <NuxtLink 
        to="/reports" 
        class="bg-white text-indigo-600 px-6 py-3 rounded-md hover:bg-gray-50 transition duration-150 shadow-sm border border-indigo-600 inline-block"
      >
        View Reports
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const candidateId = useState('candidateId', () => Math.random().toString(36).substring(2, 15))
</script>