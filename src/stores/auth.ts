import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminApi } from '@/api/admin'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const user   = ref<{ email: string } | null>(
    JSON.parse(localStorage.getItem('admin_user') ?? 'null')
  )

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string) {
    const data = await adminApi.login(email, password)
    token.value = data.access_token
    user.value  = { email }
    localStorage.setItem('admin_token', data.access_token)
    localStorage.setItem('admin_user', JSON.stringify({ email }))
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }

  return { token, user, isAuthenticated, login, logout }
})
