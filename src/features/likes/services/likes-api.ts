import { client } from '@/core/api/client'
import { normalizePaginated } from '@/core/api/pagination'
import type { PaginatedResponse } from '@/core/types/pagination'
import type { AdminLike } from '../domain/types'

export const likesApi = {
  list: async (page = 1, limit = 20): Promise<PaginatedResponse<AdminLike>> => {
    const { data } = await client.get('/admin/likes', { params: { page, limit } })
    return normalizePaginated<AdminLike>(data, page, limit)
  },
}
