import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'

export default function PrivateRoute() {
  const { isAuthenticated, init } = useAuthStore()

  useEffect(() => { init() }, [init])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
