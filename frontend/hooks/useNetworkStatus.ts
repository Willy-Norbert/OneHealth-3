"use client"
import { useState, useEffect } from 'react'

interface NetworkStatus {
  isOnline: boolean
  isSlowConnection: boolean
  connectionType?: string
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: true,
    isSlowConnection: false,
    connectionType: undefined
  })

  useEffect(() => {
    // Check initial status
    const updateNetworkStatus = () => {
      const isOnline = navigator.onLine
      let isSlowConnection = false
      let connectionType: string | undefined

      // Check connection type and speed if available
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        connectionType = connection.effectiveType || connection.type
        
        // Consider 2g and slow-2g as slow connections
        isSlowConnection = connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g'
      }

      setNetworkStatus({
        isOnline,
        isSlowConnection,
        connectionType
      })
    }

    // Initial check
    updateNetworkStatus()

    // Listen for online/offline events
    const handleOnline = () => updateNetworkStatus()
    const handleOffline = () => updateNetworkStatus()

    // Listen for connection changes
    const handleConnectionChange = () => updateNetworkStatus()

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      connection.addEventListener('change', handleConnectionChange)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        connection.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [])

  return networkStatus
}
