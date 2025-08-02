import React from 'react'
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '~/store/auth-store'

export default function _layoutBusiness() {
    const user = useAuthStore(s => s.user);
    if (!user?.roles.includes("superadmin")) {
        return <Navigate to={"/admin"} />
    }
  return (
    <Outlet />
  )
}
