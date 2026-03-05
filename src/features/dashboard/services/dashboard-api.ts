import { client } from '@/core/api/client'
import type { DashboardStats } from '../domain/types'

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await client.get('/admin/dashboard')
    return data
  },
}
