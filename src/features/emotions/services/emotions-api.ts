import { client } from '@/core/api/client'
import { normalizePaginated } from '@/core/api/pagination'
import type { PaginatedResponse } from '@/core/types/pagination'
import type { AdminEmotion } from '../domain/types'

export const emotionsApi = {
  list: async (page = 1, limit = 20): Promise<PaginatedResponse<AdminEmotion>> => {
    const { data } = await client.get('/admin/emotions', { params: { page, limit } })
    return normalizePaginated<AdminEmotion>(data, page, limit)
  },
}
