"use client"
import { Sidebar } from './Sidebar'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import { useNotifications } from '@/context/NotificationsContext'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import HealthSpinner from '@/components/ui/HealthSpinner'
import { useRouter } from 'next/navigation'
import { MedicalTexture } from '@/components/ui/MedicalTexture'

export function AppShell({ children, menu }: { children: React.ReactNode, menu?: { href: string; label: string }[] }) {
  const { user, logout, loading: authLoading } = useAuth() as any
  const { notifications, markAll } = useNotifications()
  const unreadCount = notifications.filter((n:any)=>!(n?.read ?? n?.isRead)).length
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement|null>(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!userMenuRef.current) return
      const target = e.target as Node
      if (!userMenuRef.current.contains(target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  // Centralized sidebar menu per role (fallback if a page does not provide one)
  const defaultMenuByRole = (role?: string): { href: string; label: string }[] => {
    switch ((role || '').toLowerCase()) {
      case 'patient':
        return [
          { href: '/patient', label: 'Overview' },
          { href: '/patient/appointments', label: 'Appointments' },
          { href: '/patient/teleconsult', label: 'Teleconsultation' },
          { href: '/patient/pharmacy', label: 'Pharmacy' },
          { href: '/patient/prescriptions', label: 'Prescriptions' },
          { href: '/patient/payments', label: 'Payments' },
          { href: '/patient/ai', label: 'AI Assistant' },
          { href: '/patient/emergency', label: 'Emergency' },
          { href: '/patient/records', label: 'Medical Records' },
          { href: '/patient/orders', label: 'My Orders' },
          { href: '/patient/profile', label: 'Profile' },
        ]
      case 'doctor':
        return [
          { href: '/doctor', label: 'Overview' },
          { href: '/doctor/appointments', label: 'Appointments' },
          { href: '/doctor/records', label: 'Medical Records' },
          { href: '/doctor/lab-results', label: 'Lab Results' },
          { href: '/doctor/meetings', label: 'Meetings' },
          { href: '/doctor/notifications', label: 'Notifications' },
          { href: '/doctor/settings', label: 'Profile' },
        ]
      case 'hospital':
        return [
          { href: '/hospital', label: 'Overview' },
          { href: '/hospital/appointments', label: 'Appointments' },
          { href: '/hospital/patients', label: 'Patients' },
          { href: '/hospital/departments', label: 'Departments' },
          { href: '/hospital/doctors', label: 'Doctors' },
          { href: '/hospital/lab-results', label: 'Lab Results' },
          { href: '/hospital/analytics', label: 'Analytics' },
          { href: '/hospital/profile', label: 'Profile' },
        ]
      case 'admin':
        return [
          { href: '/admin', label: 'Overview' },
          { href: '/admin/notifications', label: 'Notifications' },
          { href: '/admin/profile', label: 'Profile' },
        ]
      default:
        return [
          { href: '/', label: 'Overview' },
          { href: '/notifications', label: 'Notifications' },
          { href: '/patient/profile', label: 'Profile' },
        ]
    }
  }
  const items = Array.isArray(menu) && menu.length ? menu : defaultMenuByRole(user?.role)

  return (
    <div className={`min-h-screen bg-gray-50 ${loggingOut ? 'blur-sm' : ''}`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar items={items} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="header sticky top-0 z-30">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden -m-2.5 p-2.5 text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Header content */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="OneHealthline" width={28} height={28} className="h-7 w-7" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Portal
                  </h1>
                  <p className="text-sm text-gray-500">OneHealthline Connect</p>
                </div>
              </div>
            </div>

            {/* Header actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button onClick={()=>setNotifOpen(!notifOpen)} className="relative rounded-xl bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors">
                  <span className="sr-only">View notifications</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {unreadCount as number}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-emerald-200 bg-emerald-50/98 backdrop-blur-sm shadow-xl relative overflow-hidden">
                    <MedicalTexture pattern="healthcare" opacity={0.04} className="text-emerald-600" />
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-900">Notifications</div>
                      <div className="flex items-center gap-3">
                        <button className="text-xs text-emerald-600 hover:underline" onClick={async()=>{ await markAll(); }}>{'Mark all'}</button>
                        <Link href="/notifications" className="text-xs text-emerald-600 hover:underline" onClick={()=>setNotifOpen(false)}>View all</Link>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      {notifications.length ? notifications.slice(0,4).map((n:any)=> (
                        <div key={n._id} className="px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-50">
                          {n.message}
                        </div>
                      )) : (
                        <div className="px-4 py-6 text-sm text-gray-500">You're all caught up.</div>
                      )}
                    </div>
                    <div className="px-4 py-3 text-right">
                      <Link href="/notifications" className="btn-outline btn-sm" onClick={()=>setNotifOpen(false)}>Open Notifications</Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <button type="button" onClick={()=>setUserMenuOpen(o=>!o)} className="flex items-center gap-3 cursor-pointer">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">{user?.name || user?.email}</p>
                    <p className="text-xs text-gray-500">{user?.role?.toUpperCase()}</p>
                  </div>
                  {(() => {
                    const photo = (user as any)?.profileImageUrl || (user as any)?.profileImage
                    if (photo) {
                      return <Image src={photo} alt={user?.name || 'User'} width={40} height={40} className="h-10 w-10 rounded-xl object-cover" />
                    }
                    return (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-semibold">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </div>
                    )
                  })()}
                </button>
                {userMenuOpen && (
                <div className="absolute right-0 z-40 mt-2 w-48 rounded-xl border border-emerald-200 bg-emerald-50/98 backdrop-blur-sm shadow-xl relative overflow-hidden">
                  <MedicalTexture pattern="medical-cross" opacity={0.04} className="text-emerald-600" />
                  <div className="py-1">
                    <Link href="/" onClick={()=>setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Home</Link>
                    <Link href="/patient/profile" onClick={()=>setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                    <button onClick={async ()=>{
                      setUserMenuOpen(false)
                      setLoggingOut(true)
                      try { await logout() } catch {}
                      router.push('/auth/login')
                    }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      {authLoading ? (
                        <HealthSpinner />
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                          </svg>
                          Logout
                        </>
                      )}
                    </button>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6 lg:p-8">
          <div className="fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

// Loading overlay displayed above when logging out
export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-50/80 backdrop-blur-sm relative">
      <MedicalTexture pattern="medical-cross" opacity={0.05} className="text-emerald-600" />
      <div className="flex flex-col items-center">
        <Image src="/logo.png" alt="Loading" width={96} height={96} className="h-24 w-24 animate-pulse" />
        <p className="mt-3 text-sm text-gray-600">Loading…</p>
      </div>
    </div>
  )
}


  )
}

