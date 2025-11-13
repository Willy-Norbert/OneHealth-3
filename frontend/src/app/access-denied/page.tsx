"use client"
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, Home, RefreshCw, Lock } from 'lucide-react'

export default function AccessDeniedPage() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      const r = (window as any).__next_router
      if (r?.refresh) r.refresh()
      else window.location.reload()
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-amber-500 to-orange-600">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Security Icons */}
        <div className="absolute top-20 left-20 w-8 h-8 opacity-20">
          <Lock className="w-full h-full text-white" />
        </div>
        <div className="absolute top-32 right-32 w-6 h-6 opacity-15">
          <Shield className="w-full h-full text-white" />
        </div>
        <div className="absolute top-40 left-1/2 w-4 h-4 opacity-10">
          <Lock className="w-full h-full text-white" />
        </div>
        
        {/* Security Lines */}
        <div className="absolute top-24 left-40 w-16 h-0.5 bg-amber-400 opacity-30 transform rotate-12"></div>
        <div className="absolute top-36 right-40 w-12 h-0.5 bg-amber-400 opacity-25 transform -rotate-12"></div>
        <div className="absolute top-48 left-1/3 w-20 h-0.5 bg-amber-400 opacity-20 transform rotate-6"></div>
        
        {/* Mountains */}
        <div className="absolute bottom-0 left-0 w-full h-64">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-orange-800 transform -skew-y-1"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-orange-700 transform -skew-y-2"></div>
          <div className="absolute bottom-0 left-0 w-full h-16 bg-orange-600 transform -skew-y-1"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl w-full flex flex-col lg:flex-row items-center justify-between">
          {/* Left Side - Access Denied Icon */}
          <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0">
            <div className="relative">
              <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto lg:mx-0 mb-6 relative">
                <Shield className="w-full h-full text-white drop-shadow-2xl" />
                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl"></div>
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl" 
                  style={{ 
                    textShadow: '8px 8px 0px rgba(0,0,0,0.3)',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                403
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
                  ACCESS DENIED!
                </h2>
                <p className="text-white text-lg mb-6 leading-relaxed">
                  You don't have permission to access this resource
                </p>
                
                {/* Access Details */}
                <div className="mb-6 p-4 bg-white/10 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">Access Status:</span>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-red-200 font-medium">Denied</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Required Role:</span>
                    <span className="text-white/70">Higher privileges</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={handleGoBack}
                    className="flex items-center text-white hover:text-amber-200 transition-colors duration-200 group"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Go Back
                  </button>
                  
                  <button
                    onClick={handleGoHome}
                    className="flex items-center text-white hover:text-amber-200 transition-colors duration-200 group ml-4"
                  >
                    <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Go Home
                  </button>
                  
                  <button
                    onClick={handleRefresh}
                    className="flex items-center text-white hover:text-amber-200 transition-colors duration-200 group ml-4"
                  >
                    <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-white font-semibold mb-3 text-center">Access Denied - What you can do:</h3>
          <ul className="space-y-2">
            <li className="flex items-center text-white/80 text-sm">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3"></div>
              Contact your administrator for access permissions
            </li>
            <li className="flex items-center text-white/80 text-sm">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3"></div>
              Check if you're logged in with the correct account
            </li>
            <li className="flex items-center text-white/80 text-sm">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3"></div>
              Try refreshing the page or going back to the previous page
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
