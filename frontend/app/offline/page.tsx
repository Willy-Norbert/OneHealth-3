"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WifiOff, RefreshCw, Home, ArrowLeft, Wifi } from 'lucide-react'

export default function OfflinePage() {
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Check initial status
    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    if (navigator.onLine) {
      router.refresh()
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push('/')
  }

  if (isOnline) {
    // If back online, redirect to home
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-orange-500 to-red-600">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Network Signal Icons */}
        <div className="absolute top-20 left-20 w-8 h-8 opacity-20">
          <WifiOff className="w-full h-full text-white" />
        </div>
        <div className="absolute top-32 right-32 w-6 h-6 opacity-15">
          <WifiOff className="w-full h-full text-white" />
        </div>
        <div className="absolute top-40 left-1/2 w-4 h-4 opacity-10">
          <WifiOff className="w-full h-full text-white" />
        </div>
        
        {/* Disconnected Lines */}
        <div className="absolute top-24 left-40 w-16 h-0.5 bg-white opacity-20 transform rotate-12"></div>
        <div className="absolute top-36 right-40 w-12 h-0.5 bg-white opacity-15 transform -rotate-12"></div>
        <div className="absolute top-48 left-1/3 w-20 h-0.5 bg-white opacity-10 transform rotate-6"></div>
        
        {/* Mountains */}
        <div className="absolute bottom-0 left-0 w-full h-64">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-red-800 transform -skew-y-1"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-red-700 transform -skew-y-2"></div>
          <div className="absolute bottom-0 left-0 w-full h-16 bg-red-600 transform -skew-y-1"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl w-full flex flex-col lg:flex-row items-center justify-between">
          {/* Left Side - Offline Icon */}
          <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0">
            <div className="relative">
              <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto lg:mx-0 mb-6 relative">
                <WifiOff className="w-full h-full text-white drop-shadow-2xl" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl" 
                  style={{ 
                    textShadow: '8px 8px 0px rgba(0,0,0,0.3)',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                OFFLINE
              </h1>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 max-w-md">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              {/* Vertical Separator */}
              <div className="w-px h-16 bg-white absolute left-0 top-8"></div>
              
              <div className="ml-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  NO INTERNET!
                </h2>
                <p className="text-white text-lg mb-6 leading-relaxed">
                  Please Check Your Internet Connection
                </p>
                
                {/* Connection Status */}
                <div className="mb-6 p-4 bg-white/10 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Connection Status:</span>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-red-200 font-medium">Disconnected</span>
                    </div>
                  </div>
                  {retryCount > 0 && (
                    <div className="mt-2 text-sm text-white/70">
                      Retry attempts: {retryCount}
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={handleRetry}
                    className="flex items-center text-white hover:text-orange-200 transition-colors duration-200 group"
                  >
                    <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform" />
                    Try Again
                  </button>
                  
                  <button
                    onClick={handleGoBack}
                    className="flex items-center text-white hover:text-orange-200 transition-colors duration-200 group ml-4"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Go Back
                  </button>
                  
                  <button
                    onClick={handleGoHome}
                    className="flex items-center text-white hover:text-orange-200 transition-colors duration-200 group ml-4"
                  >
                    <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
          <p className="text-white/80 text-sm">
            Make sure you're connected to the internet and try again
          </p>
        </div>
      </div>
    </div>
  )
}
