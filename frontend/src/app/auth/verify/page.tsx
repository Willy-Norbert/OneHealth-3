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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.verifyOtp({ email, code })
      router.push('/auth/login')
    } catch (err: any) {
      setError(err?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const resend = async () => {
    try { await api.resendOtp({ email }) } catch {}
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold text-navy">Verify Email</h1>
        <p className="mt-1 text-sm text-slate-600">A one-time code was sent to {email}</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">OTP Code</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={code} onChange={e=>setCode(e.target.value)} required />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">{loading? <HealthSpinner /> : 'Verify'}</button>
          <button type="button" onClick={resend} className="w-full rounded-lg border px-3 py-2 text-sm">Resend code</button>
        </form>
      </div>
    </main>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      {/* Match auth layout */}
      <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
        <img src="/bg_auth.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-emerald-600/30" />
        <div className="relative z-10 w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5">
          {/* Left curved panel */}
          <div className="relative hidden md:block md:col-span-2 bg-gradient-to-br from-emerald-500 to-green-600">
            <svg className="absolute left-0 top-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L0,100 Q50,50 0,0 Z" fill="#059669" />
            </svg>
          </div>
          {/* Right content */}
          <div className="md:col-span-3 p-10">
            <div className="flex items-center justify-between mb-8">
              <a href="/" className="text-emerald-700 hover:text-emerald-600 font-medium">Home</a>
              <span className="text-sm text-gray-500">Verify Email</span>
            </div>
            <VerifyInner />
          </div>
        </div>
      </div>
    </Suspense>
  )
}

