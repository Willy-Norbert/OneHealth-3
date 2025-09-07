"use client"
import { Sidebar } from './Sidebar'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import { useNotifications } from '@/context/NotificationsContext'

export function AppShell({ children, menu }: { children: React.ReactNode, menu: { href: string; label: string }[] }) {
  const { user, logout } = useAuth()
  const { notifications } = useNotifications()
  return (
    <div className="min-h-screen flex">
      <Sidebar items={menu} />
      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="OneHealthline" width={28} height={28} />
            <div className="font-semibold text-navy">{user?.role?.toUpperCase()} Portal</div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="relative">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{notifications.length} Notifications</span>
            </div>
            <button onClick={logout} className="rounded-md border px-3 py-1">Logout</button>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

