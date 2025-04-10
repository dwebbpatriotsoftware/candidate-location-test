export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  const { username, password } = body
  
  if (username === config.authUsername && password === config.authPassword) {
    return { success: true }
  }
  
  return { success: false }
})
