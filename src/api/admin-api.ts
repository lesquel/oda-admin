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

export const listUsers = (params: ListParams = {}) =>
  apiClient.get<Paginated<AdminUser>>('/admin/users', { params }).then((r) => r.data)

export const getUser = (id: string) =>
  apiClient.get<AdminUser>(`/admin/users/${id}`).then((r) => r.data)

export const changeUserRole = (id: string, role: string) =>
  apiClient.put(`/admin/users/${id}/role`, { role }).then((r) => r.data)

export const deleteUser = (id: string) =>
  apiClient.delete(`/admin/users/${id}`)

export const listPoems = (params: ListParams = {}) =>
  apiClient.get<Paginated<AdminPoem>>('/admin/poems', { params }).then((r) => r.data)

export const getPoem = (id: string) =>
  apiClient.get<AdminPoem>(`/admin/poems/${id}`).then((r) => r.data)

export const changePoemStatus = (id: string, status: string) =>
  apiClient.put(`/admin/poems/${id}/status`, { status }).then((r) => r.data)

export const deletePoem = (id: string) =>
  apiClient.delete(`/admin/poems/${id}`)

export const listLikes = (params: ListParams = {}) =>
  apiClient.get<Paginated<AdminLike>>('/admin/likes', { params }).then((r) => r.data)

export const listBookmarks = (params: ListParams = {}) =>
  apiClient.get<Paginated<AdminBookmark>>('/admin/bookmarks', { params }).then((r) => r.data)

export const listEmotions = (params: ListParams = {}) =>
  apiClient.get<Paginated<AdminEmotion>>('/admin/emotions', { params }).then((r) => r.data)
