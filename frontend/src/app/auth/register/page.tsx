"use client"
import { useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.register(form)
      router.push(`/auth/verify?email=${encodeURIComponent(form.email)}`)
    } catch (err: any) {
      setError(err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          </div>

          {/* Social login buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium">Sign up with Google</span>
            </button>
            
            <button className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-gray-700 font-medium">Sign up with Facebook</span>
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
                type="text" 
                placeholder="Full Name:" 
                className="w-full py-3 border-b border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors"
                value={form.name} 
                onChange={e=>setForm({...form, name: e.target.value})} 
                required 
              />
            </div>
            
            <div>
              <input 
                type="email" 
                placeholder="Email:" 
                className="w-full py-3 border-b border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors"
                value={form.email} 
                onChange={e=>setForm({...form, email: e.target.value})} 
                required 
              />
            </div>
            
            <div className="relative">
              <input 
                type="password" 
                placeholder="Password:" 
                className="w-full py-3 border-b border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors pr-10"
                value={form.password} 
                onChange={e=>setForm({...form, password: e.target.value})} 
                required 
              />
              <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>

            <div>
              <select 
                className="w-full py-3 border-b border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent"
                value={form.role} 
                onChange={e=>setForm({...form, role: e.target.value})}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="hospital">Hospital</option>
              </select>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-lg font-medium hover:from-emerald-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? <HealthSpinner /> : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-600">
            Already have an Account? <a href="/auth/login" className="text-emerald-600 hover:text-emerald-500 font-medium">Log in</a>
          </div>
        </div>
      </div>
    </div>
  )
}

