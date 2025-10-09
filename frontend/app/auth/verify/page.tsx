"use client"
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import HealthSpinner from '@/components/ui/HealthSpinner'

function VerifyInner() {
  const email = useSearchParams().get('email') || ''
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.verifyOtp({ email, code })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const resend = async () => {
    setResendLoading(true)
    setResendSuccess(false)
    try { 
      await api.resendOtp({ email })
      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 3000)
    } catch (err) {
      setError('Failed to resend code. Please try again.')
    } finally {
      setResendLoading(false)
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
          {/* Rocket icon */}
          <div className="mx-auto mb-6 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Verify your Email</h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Account activation link has been sent to the e-mail address you provided
          </p>

          {/* Email icon with checkmark */}
          <div className="mx-auto mb-8 w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="relative">
              <svg className="w-10 h-10 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter verification code</label>
              <input 
                type="text" 
                value={code} 
                onChange={e => setCode(e.target.value)} 
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
                required 
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {resendSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-green-600 text-sm">Verification code sent!</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || code.length !== 6} 
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          {/* Resend link */}
          <button 
            type="button" 
            onClick={resend} 
            disabled={resendLoading}
            className="mt-6 text-emerald-700 hover:text-emerald-600 font-medium transition-colors duration-200 disabled:opacity-50"
          >
            {resendLoading ? 'Sending...' : "Didn't get the mail? Send it again"}
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

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyInner />
    </Suspense>
  )
}

