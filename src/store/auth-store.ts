import { create } from 'zustand'
import { setToken, removeToken, getToken } from '@/api/client'
import { login as loginApi, logout as logoutApi } from '@/api/admin-api'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  init: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,

  init: () => {
    const token = getToken()
    if (token) set({ token, isAuthenticated: true })
  },

  login: async (email, password) => {
    const data = await loginApi(email, password)

    if (data.user.role !== 'admin') {
      throw new Error('Access denied: not an admin account')
    }

    setToken(data.access_token, data.refresh_token)
    set({ token: data.access_token, isAuthenticated: true })
  },

  logout: () => {
    logoutApi()
    removeToken()
    set({ token: null, isAuthenticated: false })
  },
}))
