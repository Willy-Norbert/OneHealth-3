"use client"
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

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
          <button disabled={loading} className="btn-primary w-full">{loading? 'Verifying...' : 'Verify'}</button>
          <button type="button" onClick={resend} className="w-full rounded-lg border px-3 py-2 text-sm">Resend code</button>
        </form>
      </div>
    </main>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyInner />
    </Suspense>
  )
}

