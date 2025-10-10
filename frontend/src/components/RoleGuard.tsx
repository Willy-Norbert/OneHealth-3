"use client"
import { useAuth } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function RoleGuard({ allow, children }: { allow: Array<'admin'|'hospital'|'doctor'|'patient'>, children: React.ReactNode }) {
  const { user, loading } = useAuth() as any
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/auth/login')
      return
    }
    if (!allow.includes(user.role)) {
      // Redirect to the correct portal root
      const dest = user.role === 'hospital' ? '/hospital' : user.role === 'doctor' ? '/doctor' : user.role === 'patient' ? '/patient' : '/'
      if (pathname !== dest) router.replace(dest)
    }
  }, [user, loading, pathname, router, allow])

  if (loading || !user) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-72 bg-gray-200 rounded" />
          <div className="h-24 w-full bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!allow.includes(user.role)) return null
  return <>{children}</>
}



































