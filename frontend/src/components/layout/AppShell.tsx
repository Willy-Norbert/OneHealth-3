"use client"
import { Sidebar } from './Sidebar'
import { useAuth } from '@/context/AuthContext'

export function AppShell({ children, menu }: { children: React.ReactNode, menu: { href: string; label: string }[] }) {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen flex">
      <Sidebar items={menu} />
      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4">
          <div className="font-semibold text-navy">{user?.role?.toUpperCase()} Portal</div>
          <div className="flex items-center gap-3 text-sm">
            <button onClick={logout} className="rounded-md border px-3 py-1">Logout</button>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

