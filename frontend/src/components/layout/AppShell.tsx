"use client"
import { Sidebar } from './Sidebar'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import { useNotifications } from '@/context/NotificationsContext'
import { useState } from 'react'
import Link from 'next/link'

export function AppShell({ children, menu }: { children: React.ReactNode, menu: { href: string; label: string }[] }) {
  const { user, logout } = useAuth()
  const { notifications } = useNotifications()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar items={menu} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                  <Image src="/logo.png" alt="OneHealthline" width={24} height={24} className="text-white" />
                </div>
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
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-xl">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-900">Notifications</div>
                      <Link href="/notifications" className="text-xs text-blue-600 hover:underline" onClick={()=>setNotifOpen(false)}>View all</Link>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      {notifications.length ? notifications.map((n)=> (
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
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">{user?.name || user?.email}</p>
                    <p className="text-xs text-gray-500">{user?.role?.toUpperCase()}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-semibold">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <button
                    onClick={logout}
                    className="btn-outline btn-sm"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Logout
                  </button>
                </div>
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

