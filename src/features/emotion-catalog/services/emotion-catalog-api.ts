import { client } from '@/core/api/client'
import type { EmotionCatalogItem, CreateEmotionDto } from '../domain/types'

export const emotionCatalogApi = {
  list: async (): Promise<EmotionCatalogItem[]> => {
    const { data } = await client.get('/admin/emotion-catalog')
    return data
  },

  create: async (body: CreateEmotionDto): Promise<EmotionCatalogItem> => {
    const { data } = await client.post('/admin/emotion-catalog', body)
    return data
  },

  remove: async (id: string): Promise<void> => {
    await client.delete(`/admin/emotion-catalog/${id}`)
  },
}
