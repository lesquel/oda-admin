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
