import { client } from '@/core/api/client'
import type { AuthTokens } from '../domain/types'

export const authApi = {
  login: async (email: string, password: string): Promise<AuthTokens> => {
    const { data } = await client.post('/auth/login', { email, password })
    return data as AuthTokens
  },
}
