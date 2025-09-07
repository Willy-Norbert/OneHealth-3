"use client"
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardIndex() {
  const { user } = useAuth()
  const router = useRouter()
  useEffect(()=>{
    if (!user) return
    const roleToPath: Record<string,string> = { patient: '/patient', doctor: '/doctor', hospital: '/hospital', admin: '/admin' }
    router.replace(roleToPath[user.role] as any)
  }, [user, router])
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="card w-full max-w-xl p-8 text-center">
        <h1 className="text-2xl font-semibold text-navy">Dashboard</h1>
        <p className="mt-2 text-slate-600">Choose your portal</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link href="/patient" className="btn-primary">Patient</Link>
          <Link href="/doctor" className="btn-primary">Doctor</Link>
          <Link href="/hospital" className="btn-primary">Hospital</Link>
          <Link href="/admin" className="btn-primary">Admin</Link>
        </div>
      </div>
    </main>
  )
}

