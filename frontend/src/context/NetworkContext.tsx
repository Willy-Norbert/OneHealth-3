"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

interface NetworkContextType {
  isOnline: boolean
  isSlowConnection: boolean
  connectionType?: string
  showOfflinePage: boolean
  setShowOfflinePage: (show: boolean) => void
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isOnline, isSlowConnection, connectionType } = useNetworkStatus()
  const [showOfflinePage, setShowOfflinePage] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (!isOnline && !wasOffline) {
      // Just went offline
      setShowOfflinePage(true)
      setWasOffline(true)
    } else if (isOnline && wasOffline) {
      // Just came back online
      setShowOfflinePage(false)
      setWasOffline(false)
      // Redirect to home page after coming back online
      router.push('/')
    }
  }, [isOnline, wasOffline, router])

  // Don't show offline page if we're already on it
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      if (currentPath === '/offline') {
        setShowOfflinePage(false)
      }
    }
  }, [])

  const value: NetworkContextType = {
    isOnline,
    isSlowConnection,
    connectionType,
    showOfflinePage,
    setShowOfflinePage
  }

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider')
  }
  return context
}
