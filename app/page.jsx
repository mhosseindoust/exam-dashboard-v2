'use client'

import { useAuth } from '@/provider/AuthProvider'
import AdminDashboard from '@/AdminDashboard'
export default function Home() {
  const { user } = useAuth()
  if (user.is_staff) return <AdminDashboard user={user} />
  return <div></div>
}
