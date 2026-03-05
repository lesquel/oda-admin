import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../services/auth-api'
import type { AuthUser } from '../domain/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('admin_refresh_token'))
  const user = ref<AuthUser | null>(
    JSON.parse(localStorage.getItem('admin_user') ?? 'null'),
  )

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string) {
    const data = await authApi.login(email, password)
    token.value = data.access_token
    refreshToken.value = data.refresh_token ?? null
    user.value = { email }
    localStorage.setItem('admin_token', data.access_token)
    if (data.refresh_token) {
      localStorage.setItem('admin_refresh_token', data.refresh_token)
    }
    localStorage.setItem('admin_user', JSON.stringify({ email }))
  }

  function logout() {
    token.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_refresh_token')
    localStorage.removeItem('admin_user')
  }

  return { token, refreshToken, user, isAuthenticated, login, logout }
})
