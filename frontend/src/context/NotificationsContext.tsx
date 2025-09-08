"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { api } from '@/lib/api'
import { useAuth } from './AuthContext'

type Notification = { _id: string; message: string; isRead?: boolean }

const Ctx = createContext<{ notifications: Notification[]; refresh: ()=>void; markAll: ()=>Promise<void> }|undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { isAuthenticated, token } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([])
  
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
      // Setup socket for real-time notifications
      try {
        const s = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
          transports: ['websocket'],
          auth: { token }
        })
        s.on('connect', () => setSocket(s))
        s.on('notification:new', (payload: any) => {
          fetchNotes()
          const toastId = `${Date.now()}-${Math.random().toString(36).slice(-6)}`
          setToasts((prev) => [...prev, { id: toastId, message: payload?.message || 'New notification' }])
          setTimeout(() => {
            setToasts((prev) => prev.filter(t => t.id !== toastId))
          }, 4000)
        })
        return () => { clearInterval(id); s.disconnect() }
      } catch {
        return () => clearInterval(id)
      }
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
  return (
    <Ctx.Provider value={{ notifications, refresh: fetchNotes, markAll }}>
      {children}
      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 shadow px-4 py-3 w-80">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <div className="text-sm">{t.message}</div>
            </div>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}

