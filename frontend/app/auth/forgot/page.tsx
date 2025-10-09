"use client"
import { useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.forgotPassword({ email })
      setSent(true)
      setTimeout(()=>router.push(`/auth/reset?email=${encodeURIComponent(email)}`), 500)
    } catch (err: any) {
      setError(err?.message || 'Failed to request reset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic background with brand green + dark blue */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-900">
        {/* Floating circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-32 right-32 w-48 h-48 bg-blue-500/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-32 w-56 h-56 bg-blue-400/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Central modal */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Key icon */}
          <div className="mx-auto mb-6 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Reset your Password</h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Enter your email address and we'll send you a code to reset your password
          </p>

          {/* Lock icon with checkmark */}
          <div className="mx-auto mb-8 w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="relative">
              <svg className="w-10 h-10 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Email Input Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required 
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {sent && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-green-600 text-sm">Reset code sent! Check your email.</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || !email} 
            className="w-full bg-gradient-to-r from-emerald-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Sending...' : 'Send reset code'}
            </button>
          </form>

          {/* Back to login link */}
          <button 
            type="button" 
            onClick={() => router.push('/auth/login')}
            className="mt-6 text-emerald-700 hover:text-emerald-600 font-medium transition-colors duration-200"
          >
            Back to login
          </button>
        </div>

        {/* Branding */}
        <div className="mt-8 flex justify-end">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">presented by</span>
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

