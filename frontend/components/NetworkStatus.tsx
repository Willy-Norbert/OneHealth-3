"use client"
import { useNetwork } from '@/context/NetworkContext'
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function NetworkStatus() {
  const { isOnline, isSlowConnection, connectionType } = useNetwork()
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (!isOnline || isSlowConnection) {
      setShowBanner(true)
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowBanner(false)
      }, 5000)
      return () => clearTimeout(timer)
    } else {
      setShowBanner(false)
    }
  }, [isOnline, isSlowConnection])

  if (!showBanner) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className={`p-3 text-center text-white font-medium ${
        !isOnline 
          ? 'bg-red-500' 
          : isSlowConnection 
            ? 'bg-yellow-500' 
            : 'bg-green-500'
      }`}>
        <div className="flex items-center justify-center space-x-2">
          {!isOnline ? (
            <>
              <WifiOff className="w-4 h-4" />
              <span>No internet connection</span>
            </>
          ) : isSlowConnection ? (
            <>
              <AlertTriangle className="w-4 h-4" />
              <span>Slow connection detected ({connectionType})</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4" />
              <span>Connection restored</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
