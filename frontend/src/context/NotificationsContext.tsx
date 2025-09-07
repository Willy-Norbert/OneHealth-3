"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'

type Notification = { _id: string; message: string; isRead?: boolean }

const Ctx = createContext<{ notifications: Notification[]; refresh: ()=>void }|undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const fetchNotes = async () => {
    try {
      const res = await api.notifications.list() as any
      setNotifications(res?.data?.notifications || [])
    } catch {}
  }
  useEffect(()=>{ fetchNotes(); const id = setInterval(fetchNotes, 10000); return ()=> clearInterval(id) }, [])
  return <Ctx.Provider value={{ notifications, refresh: fetchNotes }}>{children}</Ctx.Provider>
}

export function useNotifications() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}

