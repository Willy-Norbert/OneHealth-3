"use client"
import { useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await api.forgotPassword({ email })
      setSent(true)
      setTimeout(()=>router.push(`/auth/reset?email=${encodeURIComponent(email)}`), 500)
    } catch (err: any) {
      setError(err?.message || 'Failed to request reset')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold text-navy">Forgot password</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="mt-1 w-full rounded-lg border px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="btn-primary w-full">Send reset code</button>
          {sent && <p className="text-sm text-green-600">Reset code sent. Check your email.</p>}
        </form>
      </div>
    </main>
  )
}

