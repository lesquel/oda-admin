import { apiClient } from './client'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user: { id: string; email: string; username: string; role: string }
}

export interface DashboardStats {
  total_users: number
  total_poems: number
  published_poems: number
  draft_poems: number
  total_likes: number
  total_views: number
  new_users_week: number
  new_poems_week: number
}

export interface AdminUser {
  id: string
  email: string
  username: string
  name: string
  role: string
  poem_count: number
  created_at: string
  deleted_at?: string
}

export interface AdminPoem {
  id: string
  title: string
  status: string
  author_id: string
  author_name: string
  author_username: string
  like_count: number
  view_count: number
  created_at: string
  deleted_at?: string
}

export interface AdminLike {
  poem_id: string
  user_id: string
  poem_title: string
  username: string
  created_at: string
}

export interface AdminBookmark {
  poem_id: string
  user_id: string
  poem_title: string
  username: string
  created_at: string
}

export interface AdminEmotion {
  id: string
  poem_id: string
  user_id: string
  emotion: string
  poem_title: string
  username: string
  created_at: string
}

export interface EmotionCatalogEntry {
  id: string
  slug: string
  label: string
  emoji: string
  description: string
  display_order: number
}

export interface Paginated<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface ListParams {
  page?: number
  limit?: number
  q?: string
  status?: string
  poem_id?: string
  user_id?: string
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const login = (email: string, password: string) =>
  apiClient.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data)

// ── Admin endpoints ───────────────────────────────────────────────────────────

export const getStats = () =>
  apiClient.get<DashboardStats>('/admin/stats').then((r) => r.data)

// ── Users ─────────────────────────────────────────────────────────────────────

export const listUsers = (params: ListParams = {}) =>
  apiClient.get<Paginated<AdminUser>>('/admin/users', { params }).then((r) => r.data)

export const getUser = (id: string) =>
  apiClient.get<AdminUser>(`/admin/users/${id}`).then((r) => r.data)

export const createUser = (data: { email: string; username: string; password: string; name: string; role: string }) =>
  apiClient.post('/admin/users', data).then((r) => r.data)

export const updateUser = (id: string, data: { email?: string; username?: string; name?: string; bio?: string; role?: string }) =>
  apiClient.put(`/admin/users/${id}`, data).then((r) => r.data)

export const changeUserRole = (id: string, role: string) =>
  apiClient.put(`/admin/users/${id}/role`, { role }).then((r) => r.data)

export const deleteUser = (id: string) =>
  apiClient.delete(`/admin/users/${id}`)

// ── Poems ─────────────────────────────────────────────────────────────────────

export const listPoems = (params: ListParams = {}) =>
  apiClient.get<Paginated<AdminPoem>>('/admin/poems', { params }).then((r) => r.data)

export const getPoem = (id: string) =>
  apiClient.get<AdminPoem>(`/admin/poems/${id}`).then((r) => r.data)

export const updatePoem = (id: string, data: { title?: string; content?: string; status?: string }) =>
  apiClient.put(`/admin/poems/${id}`, data).then((r) => r.data)

export const changePoemStatus = (id: string, status: string) =>
  apiClient.put(`/admin/poems/${id}/status`, { status }).then((r) => r.data)

export const deletePoem = (id: string) =>
  apiClient.delete(`/admin/poems/${id}`)

// ── Likes / Bookmarks / Emotions ──────────────────────────────────────────────

export const listLikes = (params: ListParams = {}) =>
  apiClient.get<Paginated<AdminLike>>('/admin/likes', { params }).then((r) => r.data)

export const deleteLike = (id: string) =>
  apiClient.delete(`/admin/likes/${id}`)

export const listBookmarks = (params: ListParams = {}) =>
  apiClient.get<Paginated<AdminBookmark>>('/admin/bookmarks', { params }).then((r) => r.data)

export const deleteBookmark = (id: string) =>
  apiClient.delete(`/admin/bookmarks/${id}`)

export const listEmotions = (params: ListParams = {}) =>
  apiClient.get<Paginated<AdminEmotion>>('/admin/emotions', { params }).then((r) => r.data)

export const deleteEmotion = (id: string) =>
  apiClient.delete(`/admin/emotions/${id}`)

// ── Emotion Catalog ───────────────────────────────────────────────────────────

export const getEmotionCatalog = () =>
  apiClient.get<EmotionCatalogEntry[]>('/admin/emotions-catalog').then((r) => r.data)

export const createEmotionCatalog = (data: { slug: string; label: string; emoji: string; description: string; display_order: number }) =>
  apiClient.post('/admin/emotions-catalog', data).then((r) => r.data)

export const updateEmotionCatalog = (id: string, data: Partial<{ slug: string; label: string; emoji: string; description: string; display_order: number }>) =>
  apiClient.put(`/admin/emotions-catalog/${id}`, data).then((r) => r.data)

export const deleteEmotionCatalog = (id: string) =>
  apiClient.delete(`/admin/emotions-catalog/${id}`)

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('admin_refresh_token')
    if (refreshToken) {
      await apiClient.post('/auth/logout', { refresh_token: refreshToken })
    }
  } catch {
    // best-effort
  }
}
