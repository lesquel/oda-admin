import { client } from '@/core/api/client'
import type { PaginatedResponse } from '@/core/types/pagination'
import type { AdminPoem } from '../domain/types'

export const poemsApi = {
  list: async (page = 1, limit = 20): Promise<PaginatedResponse<AdminPoem>> => {
    const { data } = await client.get('/admin/poems', { params: { page, limit } })
    return data
  },

  remove: async (id: string): Promise<void> => {
    await client.delete(`/admin/poems/${id}`)
  },
}
