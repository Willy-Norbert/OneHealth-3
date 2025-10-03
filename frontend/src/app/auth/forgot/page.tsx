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
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <img src="/bg_auth.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-emerald-600/30" />
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5">
        <div className="relative hidden md:block md:col-span-2 bg-gradient-to-br from-emerald-500 to-green-600">
          <svg className="absolute left-0 top-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L0,100 Q50,50 0,0 Z" fill="#059669" />
          </svg>
        </div>
        <div className="md:col-span-3 p-10">
          <div className="flex items-center justify-between mb-8">
            <a href="/" className="text-emerald-700 hover:text-emerald-600 font-medium">Home</a>
            <span className="text-sm text-gray-500">Forgot password</span>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" className="mt-1 w-full rounded-lg border px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-lg">Send reset code</button>
            {sent && <p className="text-sm text-green-600">Reset code sent. Check your email.</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

