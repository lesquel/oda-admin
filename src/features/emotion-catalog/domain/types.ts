export interface EmotionCatalogItem {
  id: string
  name: string
  emoji: string
  description: string
}

export type CreateEmotionDto = Omit<EmotionCatalogItem, 'id'>
