"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, ArrowLeft, Home, RefreshCw } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // You can implement search functionality here
      console.log('Searching for:', searchQuery)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handleRefresh = () => {
    // prefer Next.js navigation refresh when possible
    try { (window as any).__next_router?.refresh?.() } catch { window.location.reload() }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-teal-500 to-blue-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Stars */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full opacity-80"></div>
        <div className="absolute top-32 left-40 w-1 h-1 bg-white rounded-full opacity-60"></div>
        <div className="absolute top-24 left-60 w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>
        <div className="absolute top-40 left-80 w-1 h-1 bg-white rounded-full opacity-50"></div>
        <div className="absolute top-28 left-96 w-2 h-2 bg-white rounded-full opacity-80"></div>
        <div className="absolute top-36 left-64 w-1 h-1 bg-white rounded-full opacity-60"></div>
        <div className="absolute top-44 left-72 w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>
        
        {/* More stars scattered */}
        <div className="absolute top-16 right-32 w-1 h-1 bg-white rounded-full opacity-60"></div>
        <div className="absolute top-24 right-48 w-2 h-2 bg-white rounded-full opacity-80"></div>
        <div className="absolute top-32 right-24 w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>
        <div className="absolute top-40 right-40 w-1 h-1 bg-white rounded-full opacity-50"></div>
        <div className="absolute top-48 right-56 w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>
        
        {/* Crescent Moon */}
        <div className="absolute top-16 left-16 w-12 h-12 bg-white rounded-full opacity-90">
          <div className="absolute top-1 right-1 w-10 h-10 bg-teal-500 rounded-full"></div>
        </div>
        
        {/* Mountains */}
        <div className="absolute bottom-0 left-0 w-full h-64">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-slate-700 transform -skew-y-1"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-slate-600 transform -skew-y-2"></div>
          <div className="absolute bottom-0 left-0 w-full h-16 bg-slate-500 transform -skew-y-1"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl w-full flex flex-col lg:flex-row items-center justify-between">
          {/* Left Side - 404 */}
          <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0">
            <div className="relative">
              <h1 className="text-8xl lg:text-9xl font-bold text-white mb-4 drop-shadow-2xl" 
                  style={{ 
                    textShadow: '8px 8px 0px rgba(0,0,0,0.3)',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                404
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
                  SORRY!
                </h2>
                <p className="text-white text-lg mb-6 leading-relaxed">
                  The Page You're Looking For Was Not Found
                </p>
                
                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={handleGoBack}
                    className="flex items-center text-white hover:text-teal-200 transition-colors duration-200 group"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Go Back
                  </button>
                  
                  <button
                    onClick={handleGoHome}
                    className="flex items-center text-white hover:text-teal-200 transition-colors duration-200 group ml-4"
                  >
                    <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Go Home
                  </button>
                  
                  <button
                    onClick={handleRefresh}
                    className="flex items-center text-white hover:text-teal-200 transition-colors duration-200 group ml-4"
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

      {/* Search Bar */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-2xl"
               style={{ 
                 boxShadow: '8px 8px 0px rgba(0,0,0,0.3)'
               }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="How Can We Help?"
              className="w-full px-4 py-3 bg-transparent text-white placeholder-white/70 focus:outline-none rounded-xl"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-slate-600 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              <Search className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
