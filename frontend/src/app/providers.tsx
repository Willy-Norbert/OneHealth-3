"use client"
import { AuthProvider } from '@/context/AuthContext'
import { NotificationsProvider } from '@/context/NotificationsContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationsProvider>
        {children}
      </NotificationsProvider>
    </AuthProvider>
  )
}

