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
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: 'Male',
    nationalId: '',
    address: '',
    district: '',
    province: '',
    ubudehe: '1',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    insuranceType: 'None',
    insurerName: '',
    policyNumber: '',
    policyHolderName: '',
    policyExpiry: '',
    bloodGroup: 'B-',
    allergies: '',
    medications: '',
    pastMedicalHistory: '',
    chronicConditions: '',
    currentSymptoms: '',
  })
  const [files, setFiles] = useState<{profileImage?: File; idDocument?: File; insuranceFront?: File; insuranceBack?: File; medicalFiles: File[]}>({ medicalFiles: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const e164 = /^\+[1-9]\d{6,14}$/
      if (!e164.test(form.phone)) throw new Error('Phone must be in E.164 format e.g. +2507XXXXXXXX')
      if (!form.dob || new Date(form.dob) >= new Date()) throw new Error('Date of birth must be in the past')
      if (form.password !== form.confirmPassword) throw new Error('Passwords do not match')
      if (!files.profileImage) throw new Error('Profile image is required')
      if (!files.idDocument) throw new Error('National ID scan is required')
      if (form.insuranceType !== 'None' && !files.insuranceFront) throw new Error('Insurance card front is required')

      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, String(v ?? '')))
      if (files.profileImage) formData.append('profileImage', files.profileImage)
      if (files.idDocument) formData.append('idDocument', files.idDocument)
      if (files.insuranceFront) formData.append('insuranceFront', files.insuranceFront)
      if (files.insuranceBack) formData.append('insuranceBack', files.insuranceBack)
      files.medicalFiles.forEach(f => formData.append('medicalFiles', f))

      await (api as any).patients.register(formData)
      router.push(`/auth/verify?email=${encodeURIComponent(form.email)}`)
    } catch (err: any) {
      setError(err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-white dark:bg-gray-900 dark:text-gray-100">
      {/* Background image from public with subtle overlay */}
      <Image src="/bg_auth.png" alt="Background" fill priority sizes="100vw" className="object-cover opacity-60 z-0" />
      <div className="absolute inset-0 bg-emerald-600/30 z-10" />
      <div className="relative z-20 w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create Account</h1>
          </div>

          {/* Social login buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium">Sign up with Google</span>
            </button>
            
            <button className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-gray-700 font-medium">Sign up with Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
            <span className="px-4 text-gray-500 dark:text-gray-400 text-sm">-OR-</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          {/* Form fields */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First name" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.firstName} onChange={e=>setForm({...form, firstName: e.target.value})} required />
              <input type="text" placeholder="Last name" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.lastName} onChange={e=>setForm({...form, lastName: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="email" placeholder="Email" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required />
              <input type="tel" placeholder="Phone (+2507XXXXXXXX)" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="password" placeholder="Password" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} required />
              <input type="password" placeholder="Confirm password" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.confirmPassword} onChange={e=>setForm({...form, confirmPassword: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="date" placeholder="DOB" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.dob} onChange={e=>setForm({...form, dob: e.target.value})} required />
              <select className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.gender} onChange={e=>setForm({...form, gender: e.target.value})} required>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <input type="text" placeholder="National ID number" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.nationalId} onChange={e=>setForm({...form, nationalId: e.target.value})} required />
            <input type="text" placeholder="Home address (Street / Cell / Village)" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.address} onChange={e=>setForm({...form, address: e.target.value})} required />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="District" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.district} onChange={e=>setForm({...form, district: e.target.value})} required />
              <input type="text" placeholder="Province" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.province} onChange={e=>setForm({...form, province: e.target.value})} required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <select className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.ubudehe} onChange={e=>setForm({...form, ubudehe: e.target.value})} required>
                <option value="1">Ubudehe 1</option>
                <option value="2">Ubudehe 2</option>
                <option value="3">Ubudehe 3</option>
                <option value="4">Ubudehe 4</option>
              </select>
              <input type="text" placeholder="Emergency contact name" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.emergencyContactName} onChange={e=>setForm({...form, emergencyContactName: e.target.value})} required />
              <input type="text" placeholder="Relationship" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.emergencyContactRelation} onChange={e=>setForm({...form, emergencyContactRelation: e.target.value})} required />
            </div>
            <input type="tel" placeholder="Emergency contact phone (+250...)" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.emergencyContactPhone} onChange={e=>setForm({...form, emergencyContactPhone: e.target.value})} required />
            <div className="grid grid-cols-2 gap-4">
              <select className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.insuranceType} onChange={e=>setForm({...form, insuranceType: e.target.value})} required>
                <option>Mutuelle de Santé (CBHI)</option>
                <option>RSSB</option>
                <option>Private</option>
                <option>None</option>
              </select>
              <select className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.bloodGroup} onChange={e=>setForm({...form, bloodGroup: e.target.value})} required>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'].map(b=> <option key={b}>{b}</option>)}
              </select>
            </div>
            {form.insuranceType !== 'None' && (
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Insurer name" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.insurerName} onChange={e=>setForm({...form, insurerName: e.target.value})} required={form.insuranceType !== 'None'} />
                <input type="text" placeholder="Policy number" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.policyNumber} onChange={e=>setForm({...form, policyNumber: e.target.value})} required={form.insuranceType !== 'None'} />
                <input type="text" placeholder="Policy holder name" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.policyHolderName} onChange={e=>setForm({...form, policyHolderName: e.target.value})} required={form.insuranceType !== 'None'} />
                <input type="date" placeholder="Expiry date" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.policyExpiry} onChange={e=>setForm({...form, policyExpiry: e.target.value})} required={form.insuranceType !== 'None'} />
              </div>
            )}
            <textarea placeholder="Known allergies (enter None if none)" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.allergies} onChange={e=>setForm({...form, allergies: e.target.value})} required />
            <textarea placeholder="Current medications (enter None if none)" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.medications} onChange={e=>setForm({...form, medications: e.target.value})} required />
            <textarea placeholder="Past medical history / surgeries (enter None if none)" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.pastMedicalHistory} onChange={e=>setForm({...form, pastMedicalHistory: e.target.value})} required />
            <input type="text" placeholder="Chronic conditions (comma separated, enter None if none)" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.chronicConditions} onChange={e=>setForm({...form, chronicConditions: e.target.value})} required />
            <textarea placeholder="Current symptoms / reason for registration" className="w-full py-3 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent dark:text-gray-100" value={form.currentSymptoms} onChange={e=>setForm({...form, currentSymptoms: e.target.value})} required />

            <div className="grid grid-cols-2 gap-4">
              <input type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={e=>setFiles(prev=>({...prev, profileImage: e.target.files?.[0]}))} required />
              <input type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={e=>setFiles(prev=>({...prev, idDocument: e.target.files?.[0]}))} required />
            </div>
            {form.insuranceType !== 'None' && (
              <div className="grid grid-cols-2 gap-4">
                <input type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={e=>setFiles(prev=>({...prev, insuranceFront: e.target.files?.[0]}))} required={form.insuranceType !== 'None'} />
                <input type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={e=>setFiles(prev=>({...prev, insuranceBack: e.target.files?.[0]}))} />
              </div>
            )}
            <input type="file" accept=".png,.jpg,.jpeg,.pdf" multiple onChange={e=>setFiles(prev=>({...prev, medicalFiles: e.target.files ? Array.from(e.target.files) : []}))} />

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

