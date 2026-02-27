import { create } from 'zustand'
import { setToken, removeToken, getToken } from '@/api/client'
import { login as loginApi } from '@/api/admin-api'

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
    setToken(data.access_token)
    set({ token: data.access_token, isAuthenticated: true })
  },

  logout: () => {
    removeToken()
    set({ token: null, isAuthenticated: false })
  },
}))
