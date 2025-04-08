<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-indigo-600 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <NuxtLink 
            to="/" 
            class="text-white font-semibold text-lg hover:text-indigo-100 transition duration-150"
          >
            Assessment
          </NuxtLink>
          <ClientOnly>
            <NuxtLink 
              :to="'/assessment?candidateId=' + candidateId" 
              class="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-400 transition duration-150 shadow-sm"
            >
              New Assessment
            </NuxtLink>
          </ClientOnly>
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
const candidateId = useState('candidateId', () => Math.random().toString(36).substring(2, 15))
</script>