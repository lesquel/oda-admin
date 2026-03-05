import { client } from '@/core/api/client'
import type { PaginatedResponse } from '@/core/types/pagination'
import type { AdminUser } from '../domain/types'

export const usersApi = {
  list: async (page = 1, limit = 20): Promise<PaginatedResponse<AdminUser>> => {
    const { data } = await client.get('/admin/users', { params: { page, limit } })
    return data
  },

  getById: async (id: string): Promise<AdminUser> => {
    const { data } = await client.get(`/admin/users/${id}`)
    return data
  },

  update: async (id: string, body: Partial<AdminUser>): Promise<AdminUser> => {
    const { data } = await client.put(`/admin/users/${id}`, body)
    return data
  },

  remove: async (id: string): Promise<void> => {
    await client.delete(`/admin/users/${id}`)
  },

  toggleBan: async (id: string, isActive: boolean): Promise<AdminUser> => {
    const { data } = await client.put(`/admin/users/${id}`, { is_active: isActive })
    return data
  },
}
