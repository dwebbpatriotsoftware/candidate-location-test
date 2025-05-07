<script setup>
// Direct redirect instead of using middleware
const router = useRouter()
onMounted(() => {
  router.push('/login')
})
</script>

<template>
  <div>Redirecting to login...</div>
</template>
