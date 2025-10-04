"use client"
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { AppShell } from '@/components/layout/AppShell'
import { useState, useEffect } from 'react'

export default function HospitalDoctorEditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data } = useSWR(() => (id ? `doctor-${id}` : null), async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'}/doctors/${id}`, { headers: { 'Content-Type': 'application/json' }})
    if (!res.ok) throw new Error('Failed to load doctor')
    return res.json()
  })
  const doctor = (data as any)?.data?.doctor
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>({ name:'', email:'', phoneNumber:'', profileImage:'', licenseNumber:'', specialization:'', consultationFee:'', experience:'', languages:'', bio:'' })

  useEffect(() => {
    if (!doctor) return
    setForm({
      name: doctor?.user?.name || '',
      email: doctor?.user?.email || '',
      phoneNumber: doctor?.user?.phoneNumber || '',
      profileImage: doctor?.user?.profileImage || '',
      licenseNumber: doctor?.licenseNumber || '',
      specialization: doctor?.specialization || '',
      consultationFee: doctor?.consultationFee || '',
      experience: doctor?.experience || '',
      languages: (doctor?.languages||[]).join(', '),
      bio: doctor?.bio || ''
    })
  }, [doctor])

  async function save() {
    setSaving(true)
    try {
      const token = require('js-cookie').get('token') || ''
      const payload:any = {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        profileImage: form.profileImage,
        licenseNumber: form.licenseNumber,
        specialization: form.specialization,
        consultationFee: Number(form.consultationFee||0),
        experience: Number(form.experience||0),
        languages: String(form.languages||'').split(',').map((s:string)=>s.trim()).filter(Boolean),
        bio: form.bio,
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'}/doctors/${id}/hospital-update`, {
        method:'PUT',
        headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(await res.text())
      router.push('/hospital/doctors')
    } catch (e) {
      console.error('Save doctor failed', e)
      alert('Failed to save doctor')
    } finally { setSaving(false) }
  }

  return (
    <AppShell
    menu={[
      { href: '/hospital', label: 'Overview' },
      { href: '/hospital/doctors', label: 'Doctors' },
      { href: '/hospital/departments', label: 'Departments' },
      { href: '/hospital/appointments', label: 'Appointments' },
      { href: '/hospital/patients', label: 'Patients' },
      { href: '/hospital/lab-results', label: 'Medical Records' },
      { href: '/hospital/drug-interactions', label: 'Prescriptions' },
      { href: '/hospital/analytics', label: 'Analytics' },
      { href: '/hospital/profile', label: 'Profile' },
      { href: '/hospital/notifications', label: 'Notifications' },
      { href: '/hospital/emergency', label: 'Emergency' },
      
    ]}
  >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Doctor</h1>
          <p className="text-gray-600">Update doctor profile information</p>
        </div>

        <div className="card">
          <div className="card-body space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Name</label>
                <input className="input" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input className="input" type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input className="input" value={form.phoneNumber} onChange={(e)=>setForm({...form, phoneNumber:e.target.value})} />
              </div>
              <div>
                <label className="form-label">Profile Image URL</label>
                <input className="input" value={form.profileImage} onChange={(e)=>setForm({...form, profileImage:e.target.value})} />
              </div>
              <div>
                <label className="form-label">License Number</label>
                <input className="input" value={form.licenseNumber} onChange={(e)=>setForm({...form, licenseNumber:e.target.value})} />
              </div>
              <div>
                <label className="form-label">Specialization</label>
                <input className="input" value={form.specialization} onChange={(e)=>setForm({...form, specialization:e.target.value})} />
              </div>
              <div>
                <label className="form-label">Consultation Fee</label>
                <input className="input" type="number" value={form.consultationFee} onChange={(e)=>setForm({...form, consultationFee:e.target.value})} />
              </div>
              <div>
                <label className="form-label">Experience (years)</label>
                <input className="input" type="number" value={form.experience} onChange={(e)=>setForm({...form, experience:e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Languages (comma separated)</label>
                <input className="input" value={form.languages} onChange={(e)=>setForm({...form, languages:e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Bio</label>
                <textarea className="input" rows={3} value={form.bio} onChange={(e)=>setForm({...form, bio:e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <a href="/hospital/doctors" className="btn-outline">Cancel</a>
              <button className="btn-primary" disabled={saving} onClick={save}>{saving? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}




