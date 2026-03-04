import { client } from './client'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface DashboardStats {
  total_users: number
  total_poems: number
  total_likes: number
  total_bookmarks: number
  total_emotions: number
}

export interface AdminUser {
  id: string
  username: string
  email: string
  role: string
  bio: string
  avatar_url: string
  is_active: boolean
  created_at: string
  deleted_at?: string
}

export interface AdminPoem {
  id: string
  title: string
  status: string
  author_id: string
  author_username: string
  created_at: string
}

export interface AdminEmotion {
  id: string
  name: string
  poem_id: string
  user_id: string
  created_at: string
}

export interface AdminLike {
  id: string
  poem_id: string
  user_id: string
  created_at: string
}

export interface AdminBookmark {
  id: string
  poem_id: string
  user_id: string
  created_at: string
}

export interface EmotionCatalogItem {
  id: string
  name: string
  emoji: string
  description: string
}

export const adminApi = {
  login: async (email: string, password: string) => {
    const { data } = await client.post('/auth/login', { email, password })
    return data as { access_token: string; refresh_token: string }
  },

  dashboard: async (): Promise<DashboardStats> => {
    const { data } = await client.get('/admin/dashboard')
    return data
  },

  // Users
  listUsers: async (page = 1, limit = 20): Promise<PaginatedResponse<AdminUser>> => {
    const { data } = await client.get('/admin/users', { params: { page, limit } })
    return data
  },
  getUser: async (id: string): Promise<AdminUser> => {
    const { data } = await client.get(`/admin/users/${id}`)
    return data
  },
  updateUser: async (id: string, body: Partial<AdminUser>): Promise<AdminUser> => {
    const { data } = await client.put(`/admin/users/${id}`, body)
    return data
  },
  deleteUser: async (id: string): Promise<void> => {
    await client.delete(`/admin/users/${id}`)
  },
  toggleUserBan: async (id: string, isActive: boolean): Promise<AdminUser> => {
    const { data } = await client.put(`/admin/users/${id}`, { is_active: isActive })
    return data
  },

  // Poems
  listPoems: async (page = 1, limit = 20): Promise<PaginatedResponse<AdminPoem>> => {
    const { data } = await client.get('/admin/poems', { params: { page, limit } })
    return data
  },
  deletePoem: async (id: string): Promise<void> => {
    await client.delete(`/admin/poems/${id}`)
  },

  // Emotions (tags on poems)
  listEmotions: async (page = 1, limit = 20): Promise<PaginatedResponse<AdminEmotion>> => {
    const { data } = await client.get('/admin/emotions', { params: { page, limit } })
    return data
  },

  // Emotion catalog
  listEmotionCatalog: async (): Promise<EmotionCatalogItem[]> => {
    const { data } = await client.get('/admin/emotion-catalog')
    return data
  },
  createEmotion: async (body: Omit<EmotionCatalogItem, 'id'>): Promise<EmotionCatalogItem> => {
    const { data } = await client.post('/admin/emotion-catalog', body)
    return data
  },
  deleteEmotionCatalog: async (id: string): Promise<void> => {
    await client.delete(`/admin/emotion-catalog/${id}`)
  },

  // Likes
  listLikes: async (page = 1, limit = 20): Promise<PaginatedResponse<AdminLike>> => {
    const { data } = await client.get('/admin/likes', { params: { page, limit } })
    return data
  },

  // Bookmarks
  listBookmarks: async (page = 1, limit = 20): Promise<PaginatedResponse<AdminBookmark>> => {
    const { data } = await client.get('/admin/bookmarks', { params: { page, limit } })
    return data
  },
}
