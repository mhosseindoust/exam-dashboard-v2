'use client'

import { useAuth } from '@/provider/AuthProvider'
import AdminDashboard from '@/AdminDashboard'
import StudentDashboard from '@/StudentDashboard'

export default function Home() {
  const { user } = useAuth()
  if (user.is_staff) return <AdminDashboard user={user} />
  if (!user.is_staff) return <StudentDashboard user={user} />
  return <div></div>
}
