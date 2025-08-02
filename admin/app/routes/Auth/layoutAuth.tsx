import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '~/store/auth-store'

export default function layoutAuth() {
  const { token, isHydrated } = useAuthStore()
  if (!isHydrated) return null

  if (token) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}
