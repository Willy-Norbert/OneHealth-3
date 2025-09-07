"use client"
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

import { Suspense } from 'react'

function LoginInner() {
  const { login } = useAuth()
  const router = useRouter()
  const search = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      const redirect = (search.get('redirect') as string) || '/dashboard'
      router.push(redirect as any)
    } catch (err: any) {
      console.error('Login error:', err)
      // Extract error message from different possible response formats
      let errorMessage = 'Login failed'
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err?.data?.message) {
        errorMessage = err.data.message
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold text-navy">Login</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="mt-1 w-full rounded-lg border px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" className="mt-1 w-full rounded-lg border px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">{loading? 'Signing in...' : 'Sign in'}</button>
          <div className="flex items-center justify-between text-sm">
            <a href="/auth/forgot" className="text-primary">Forgot password?</a>
            <a href="/auth/register" className="text-navy">Create account</a>
          </div>
        </form>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  )
}

