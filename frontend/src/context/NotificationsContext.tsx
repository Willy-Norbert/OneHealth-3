"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from './AuthContext'

type Notification = { _id: string; message: string; isRead?: boolean }

const Ctx = createContext<{ notifications: Notification[]; refresh: ()=>void; markAll: ()=>Promise<void> }|undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { isAuthenticated, token } = useAuth()
  
  const fetchNotes = async () => {
    if (!isAuthenticated || !token) {
      setNotifications([])
      return
    }
    
    try {
      const res = await api.notifications.list() as any
      // Normalize various response shapes to an array
      const list = (res?.data?.notifications) || (Array.isArray(res?.data) ? res.data : [])
      setNotifications(list)
    } catch (error) {
      console.warn('Failed to fetch notifications:', error)
      setNotifications([])
    }
  }
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes()
      const id = setInterval(fetchNotes, 10000)
      return () => clearInterval(id)
    } else {
      setNotifications([])
    }
  }, [isAuthenticated, token])
  
  const markAll = async () => {
    try {
      await api.notifications.markRead('mark-all') as any
      await fetchNotes()
    } catch (e) {
      // ignore
    }
  }
  return <Ctx.Provider value={{ notifications, refresh: fetchNotes, markAll }}>{children}</Ctx.Provider>
}

export function useNotifications() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}

