"use client"
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import HealthSpinner from '@/components/ui/HealthSpinner'

export default function DashboardIndex() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (isLoading) return // Wait for auth to load
    
    if (!isAuthenticated || !user) {
      router.replace('/auth/login')
      return
    }
    
    const roleToPath: Record<string, string> = { 
      patient: '/patient', 
      doctor: '/doctor', 
      hospital: '/hospital', 
      admin: '/admin' 
    }
    
    const redirectPath = roleToPath[user.role]
    if (redirectPath) {
      router.replace(redirectPath)
    } else {
      // Fallback for unknown roles
      router.replace('/')
    }
  }, [user, isAuthenticated, isLoading, router])
  
  // Show loading while auth is loading or redirecting
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="card w-full max-w-xl p-8 text-center">
        <HealthSpinner />
        <p className="mt-4 text-slate-600">
          {isLoading ? 'Loading...' : 'Redirecting to your dashboard...'}
        </p>
      </div>
    </main>
  )
}

