"use client"
import { useState, Suspense } from 'react'
import Image from 'next/image'
import { api } from '@/lib/api'
import { useRouter, useSearchParams } from 'next/navigation'

function ResetInner() {
  const router = useRouter()
  const email = useSearchParams().get('email') || ''
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      await api.resetPassword({ email, code, newPassword: password })
      router.push('/auth/login')
    } catch (err: any) {
      setError(err?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic background with brand green only */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700">
        {/* Floating circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-32 right-32 w-48 h-48 bg-emerald-500/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-32 w-56 h-56 bg-emerald-400/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Central modal */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Shield icon */}
          <div className="mx-auto mb-6 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Create new Password</h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Enter the verification code and your new password to complete the reset
          </p>

          {/* Shield icon with checkmark */}
          <div className="mx-auto mb-8 w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="relative">
              <svg className="w-10 h-10 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Reset Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                value={email} 
                disabled 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification code</label>
              <input 
                type="text" 
                value={code} 
                onChange={e => setCode(e.target.value)} 
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter new password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="Confirm new password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required 
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || !code || !password || !confirmPassword} 
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Resetting...' : 'Reset password'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetInner />
    </Suspense>
  )
}

