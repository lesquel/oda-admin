import { client } from '@/core/api/client'
import { normalizePaginated } from '@/core/api/pagination'
import type { PaginatedResponse } from '@/core/types/pagination'
import type { AdminBookmark } from '../domain/types'

export const bookmarksApi = {
  list: async (page = 1, limit = 20): Promise<PaginatedResponse<AdminBookmark>> => {
    const { data } = await client.get('/admin/bookmarks', { params: { page, limit } })
    return normalizePaginated<AdminBookmark>(data, page, limit)
  },
}
