"use client"
import { useState, useEffect, useRef } from 'react'
// Google Identity Services and Facebook JS SDK will be used directly
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'

import { Suspense } from 'react'
import HealthSpinner from '@/components/ui/HealthSpinner'

function CurvedDivider() {
  return (
    <svg className="absolute left-0 top-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M0,0 L0,100 Q50,50 0,0 Z" fill="#059669" />
    </svg>
  )
}

function StethoscopeIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="text-white">
      <defs>
        <linearGradient id="stethoscopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      {/* Stethoscope body */}
      <path d="M20 40 Q30 30 40 40 L80 40 Q90 30 100 40" stroke="url(#stethoscopeGrad)" strokeWidth="8" fill="none" strokeLinecap="round"/>
      {/* Chest piece */}
      <circle cx="100" cy="40" r="12" fill="url(#stethoscopeGrad)"/>
      {/* Earpieces */}
      <circle cx="20" cy="40" r="6" fill="url(#stethoscopeGrad)"/>
      <circle cx="15" cy="35" r="4" fill="url(#stethoscopeGrad)"/>
      <circle cx="25" cy="35" r="4" fill="url(#stethoscopeGrad)"/>
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="text-white">
      <rect x="3" y="3" width="6" height="6" fill="currentColor" rx="1"/>
      <rect x="13" y="3" width="6" height="6" fill="currentColor" rx="1"/>
      <rect x="3" y="13" width="6" height="6" fill="currentColor" rx="1"/>
      <rect x="13" y="13" width="6" height="6" fill="currentColor" rx="1"/>
    </svg>
  )
}

function LoginInner() {
  const { login } = useAuth()
  const router = useRouter()
  const search = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Google Identity Services loader (robust)
  const googleInitedRef = useRef(false)
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const mountBtn = () => {
      const g = (window as any).google
      if (!g?.accounts?.id || typeof g.accounts.id.initialize !== 'function') return false
      if (googleInitedRef.current) return true
      if (!clientId) return true // skip init if no client id configured
      g.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          setLoading(true)
          setError(null)
          try {
            const idToken = response.credential
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/google`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken })
            })
            if (!res.ok) throw new Error('Google login failed')
            const data = await res.json()
            await socialComplete(data?.data?.token)
          } catch (e:any) {
            setError(e?.message || 'Google login failed')
          } finally {
            setLoading(false)
          }
        }
      })
      const btnContainer = document.getElementById('google-signin-btn')
      if (btnContainer) {
        g.accounts.id.renderButton(btnContainer, { theme: 'outline', size: 'large', width: 300 })
      }
      googleInitedRef.current = true
      return true
    }

    if ((window as any).google) {
      if (mountBtn()) return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => { mountBtn() }
    document.body.appendChild(script)

      if (!(window as any).FB) {
        const script = document.createElement('script')
        script.src = 'https://connect.facebook.net/en_US/sdk.js'
        script.async = true
        script.defer = true
        script.onload = () => {
          (window as any).fbAsyncInit = function () {
            (window as any).FB.init({
              appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
              cookie: true,
              xfbml: false,
              version: 'v19.0',
            })
          }
        }
        document.body.appendChild(script)
      }
  }, [])

    async function handleFacebookLogin() {
      setError(null); setLoading(true)
      try {
        if (!(window as any).FB) throw new Error('Facebook SDK not loaded')
      ;(window as any).FB.login(async (response: any) => {
          if (response.authResponse) {
            const accessToken = response.authResponse.accessToken
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/facebook`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accessToken })
            })
            if (!res.ok) throw new Error('Facebook login failed')
            const data = await res.json()
            await socialComplete(data?.data?.token)
          } else {
            setError('Facebook login failed')
          }
          setLoading(false)
        }, { scope: 'public_profile,email' })
      } catch (e: any) {
        setError(e?.message || 'Facebook login failed')
        setLoading(false)
      }
    }
  async function socialComplete(token: string) {
    document.cookie = `token=${token}; path=/; max-age=${7*24*3600}`
    try { await (useAuth() as any).refreshProfile?.() } catch {}
    const redirect = (search.get('redirect') as string) || '/dashboard'
    router.push(redirect as any)
  }

  const handleGoogleSuccess = async (response: any) => {
    setError(null); setLoading(true)
    try {
      const idToken = response.tokenId
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/google`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken })
      })
      if (!res.ok) throw new Error('Google login failed')
      const data = await res.json()
      await socialComplete(data?.data?.token)
    } catch (e:any) {
      setError(e?.message || 'Google login failed')
    } finally { setLoading(false) }
  }

  const handleGoogleFailure = (_error: any) => {
    setError('Google login failed')
  }

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
      let errorMessage = 'Login failed'
      if (err?.message) errorMessage = err.message
      else if (err?.response?.data?.message) errorMessage = err.response.data.message
      else if (err?.data?.message) errorMessage = err.data.message
      setError(errorMessage)
    } finally { setLoading(false) }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* Background image from public with subtle overlay */}
      <Image src="/bg_auth.png" alt="Background" fill priority sizes="100vw" className="object-cover opacity-60 z-0" />
      <div className="absolute inset-0 bg-emerald-600/30 z-10" />
      <div className="relative z-20 w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Curved divider */}
        <div className="absolute left-0 top-0 w-2/5 h-full bg-gradient-to-br from-emerald-500 to-green-600 z-10">
          <CurvedDivider />
        </div>
        
        {/* Left panel content */}
        <div className="absolute left-0 top-0 w-2/5 h-full bg-gradient-to-br from-emerald-500 to-green-600 z-20 flex flex-col justify-between p-8">
          {/* Top icon */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-lg p-2">
              <GridIcon />
            </div>
          </div>
          
          {/* Middle content */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="bg-white/15 rounded-full p-6 md:p-8 mb-6 backdrop-blur-sm shadow-xl">
              <Image
                src="https://static.vecteezy.com/system/resources/previews/020/801/603/non_2x/doctor-friendly-and-caring-medical-worker-illustration-vector.jpg"
                alt="Doctor Illustration"
                width={220}
                height={220}
                className="rounded-full object-contain"
              />
            </div>
            <p className="text-white text-lg text-center leading-relaxed">
              We at OneHealthline Connect are always fully focused on helping your health journey.
        </p>
      </div>

          {/* Bottom spacing */}
          <div></div>
        </div>

        {/* Right panel - form */}
        <div className="ml-auto w-3/5 p-12">
          {/* Top bar: Home link + Language selector */}
          <div className="flex items-center justify-between mb-8">
            <a href="/" className="text-emerald-700 hover:text-emerald-600 font-medium">Home</a>
            <select className="text-sm text-gray-600 bg-transparent border-none outline-none">
              <option>English (US)</option>
            </select>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-600">Welcome back to OneHealthline Connect</p>
          </div>

          {/* Social login buttons */}
          <div className="space-y-3 mb-6">
            <div id="google-signin-btn" className="w-full flex justify-center" />
            
            <button type="button" className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" onClick={handleFacebookLogin} disabled={loading}>
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-gray-700 font-medium">Sign in with Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">-OR-</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Form fields */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <input
                  type="email"
                placeholder="Email:" 
                className="w-full py-3 border-b border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                required 
                />
            </div>
            
            <div className="relative">
                <input
                  type="password"
                placeholder="Password:" 
                className="w-full py-3 border-b border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            
            <button 
                type="submit"
                disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-lg font-medium hover:from-emerald-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
              >
              {loading ? 'Signing in...' : 'Sign In'}
              </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-600">
            Don't have an Account? <a href="/auth/register" className="text-emerald-600 hover:text-emerald-500 font-medium">Create Account</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  )
}

