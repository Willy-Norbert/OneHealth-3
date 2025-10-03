"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import ScheduleEditor from '@/components/ScheduleEditor'

export default function HospitalDoctorsPage() {
  const { data, mutate } = useSWR('doctors-list', () => api.doctors.list() as any)
  const { data: departmentsRes } = useSWR('departments', () => api.departments.list() as any)
  const { data: usersRes } = useSWR('users-hospital', () => api.users.list({ role: 'doctor', limit: 100 }) as any)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<any>({
    user: '',
    licenseNumber: '',
    specialization: '',
    department: '',
    consultationFee: '',
    experience: '',
    languages: '',
    consultationModes: ['in-person'],
    bio: ''
  })
  const [createUser, setCreateUser] = useState<boolean>(false)
  const [newUser, setNewUser] = useState<any>({ name: '', email: '', password: '', profileImage: '' })
  const [schedule, setSchedule] = useState<any>(null)
  const [editDoctor, setEditDoctor] = useState<any>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'badge-success'
      case 'inactive':
        return 'badge-danger'
      case 'pending':
        return 'badge-warning'
      default:
        return 'badge-gray'
    }
  }

  const filteredDoctors = (data as any)?.data?.doctors?.filter((doctor: any) => {
    const matchesSearch = !searchTerm || 
      (doctor.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       doctor.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filter === 'all' || doctor.status?.toLowerCase() === filter
    
    return matchesSearch && matchesFilter
  }) || []

  const stats = {
    total: (data as any)?.data?.doctors?.length || 0,
    active: (data as any)?.data?.doctors?.filter((d: any) => d.status === 'active').length || 0,
    inactive: (data as any)?.data?.doctors?.filter((d: any) => d.status === 'inactive').length || 0,
    pending: (data as any)?.data?.doctors?.filter((d: any) => d.status === 'pending').length || 0
  }

  return (
    <AppShell
      menu={[
        { href: '/hospital', label: 'Overview' },
        { href: '/hospital/doctors', label: 'Doctors' },
        { href: '/hospital/departments', label: 'Departments' },
        { href: '/hospital/appointments', label: 'Appointments' },
        { href: '/hospital/patients', label: 'Patients' },
        { href: '/hospital/analytics', label: 'Analytics' },
      ]}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
            <p className="text-gray-600 mt-1">Manage hospital medical staff</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Doctor
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Total Doctors</p>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Active</p>
                <p className="stat-value">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Pending</p>
                <p className="stat-value">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Inactive</p>
                <p className="stat-value">{stats.inactive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Doctor */}
        {showCreate && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Add Doctor</h3>
              <p className="text-sm text-gray-500">Create a doctor profile for an existing user, or create a new user account.</p>
            </div>
            <div className="card-body">
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setSubmitting(true)
                  try {
                    const usingExisting = !createUser
                    const payload: any = {
                      user: usingExisting ? form.user : undefined,
                      doctorInfo: !usingExisting ? newUser : undefined,
                      licenseNumber: form.licenseNumber,
                      specialization: form.specialization,
                      department: form.department,
                      consultationFee: Number(form.consultationFee || 0),
                      experience: Number(form.experience || 0),
                      languages: form.languages ? String(form.languages).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
                      consultationModes: form.consultationModes,
                      bio: form.bio,
                    }
                    // Call hospital-specific endpoint so backend infers hospital and validates department linkage
                    // NOTE: hospitalId is derived server-side from auth; if you need explicit hospital id, supply it here.
                    const me: any = await api.me()
                    const hospitalId = me?.data?.user?.hospital || me?.data?.user?.hospitalId || me?.data?.user?.hospital?._id
                    await api.hospitals.createDoctor(hospitalId, payload)
                    await mutate()
                    setShowCreate(false)
                    setForm({ user: '', licenseNumber: '', specialization: '', department: '', consultationFee: '', experience: '', languages: '', consultationModes: ['in-person'], bio: '' })
                    setNewUser({ name: '', email: '', password: '', profileImage: '' })
                  } catch (err) {
                    console.error('Create doctor error', err)
                  } finally {
                    setSubmitting(false)
                  }
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Link to Existing User?</label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={!createUser} onChange={(e) => setCreateUser(!e.target.checked)} />
                        <span>Use existing user with role "doctor"</span>
                      </label>
                    </div>
                  </div>
                  {!createUser && (
                    <div className="form-group">
                      <label className="form-label">Existing User (role: doctor)</label>
                      <select className="input" value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} required>
                        <option value="">Select User</option>
                        {usersRes?.data?.users?.map((u: any) => (
                          <option value={u._id} key={u._id}>{u.name} - {u.email}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {createUser && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Name</label>
                        <input className="input" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" className="input" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" className="input" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Profile Image (optional)</label>
                        <input className="input" value={newUser.profileImage} onChange={(e) => setNewUser({ ...newUser, profileImage: e.target.value })} placeholder="https://..." />
                      </div>
                    </>
                  )}
                  <div className="form-group">
                    <label className="form-label">License Number</label>
                    <input className="input" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Specialization</label>
                    <select className="input" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} required>
                      <option value="">Select Specialization</option>
                      {[
                        'General Medicine','Cardiology','Pediatrics','Gynecology','Orthopedics','Dermatology','Neurology','Psychiatry','Emergency Medicine','Surgery','Oncology','Ophthalmology','ENT','Urology','Endocrinology','Mental Health','Dentistry'
                      ].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required>
                      <option value="">Select Department</option>
                      {departmentsRes?.data?.departments?.map((d: any) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Consultation Fee (RWF)</label>
                    <input type="number" className="input" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience (years)</label>
                    <input type="number" className="input" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="form-label">Languages (comma separated)</label>
                    <input className="input" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} placeholder="Kinyarwanda, English, French" />
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="form-label">Consultation Modes</label>
                    <div className="flex flex-wrap gap-3">
                      {['in-person','video-call','phone-call'].map((m) => (
                        <label key={m} className="inline-flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" checked={form.consultationModes.includes(m)} onChange={(e) => {
                            const next = e.target.checked
                              ? [...form.consultationModes, m]
                              : form.consultationModes.filter((x: string) => x !== m)
                            setForm({ ...form, consultationModes: next })
                          }} />
                          <span>{m}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="form-label">Bio</label>
                    <textarea className="input" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" className="btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Doctor'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="card">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search doctors by name, email, or specialization..."
                  className="input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                >
                  Active ({stats.active})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                >
                  Pending ({stats.pending})
                </button>
                <button
                  onClick={() => setFilter('inactive')}
                  className={`btn ${filter === 'inactive' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                >
                  Inactive ({stats.inactive})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Medical Staff</h3>
            <p className="text-sm text-gray-500">Manage and monitor doctor profiles</p>
          </div>
          <div className="card-body">
            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor: any) => (
                  <div key={doctor._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {doctor.user?.profileImage ? (
                          <Image src={doctor.user.profileImage} alt={doctor.user?.name||'Doctor'} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-semibold text-blue-600">{(doctor.user?.name || doctor.user?.email || 'D').charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {doctor.user?.name || 'Unknown Doctor'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {doctor.user?.email || 'No email provided'}
                          </p>
                        </div>
                      </div>
                      <span className={`badge ${getStatusBadge(doctor.status)}`}>
                        {doctor.status || 'Unknown'}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                        </svg>
                        <span>{doctor.specialization || 'General Practice'}</span>
                      </div>
                      
                      {doctor.experience && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{doctor.experience} years experience</span>
                        </div>
                      )}
                      
                      {doctor.qualification && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                          </svg>
                          <span>{doctor.qualification}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <a href={`/doctors/${doctor._id}`} className="btn-primary btn-sm flex-1">View Profile</a>
                      <button className="btn-outline btn-sm" onClick={()=>setEditDoctor(doctor)}>Edit</button>
                      <button className="btn-outline btn-sm" onClick={()=>setSchedule({ open: true, doctor })}>Schedule</button>
                      <button className="btn-danger btn-sm" disabled={deletingId===doctor._id} onClick={async ()=>{
                        if (!confirm('Delete this doctor?')) return;
                        try {
                          setDeletingId(doctor._id)
                          await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/doctors/${doctor._id}`, {
                            method:'DELETE',
                            headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${require('js-cookie').get('token') || ''}` }
                          })
                          await mutate()
                        } finally { setDeletingId(null) }
                      }}>{deletingId===doctor._id? 'Deleting...' : 'Delete'}</button>
      {/* Edit Doctor Modal */}
      {editDoctor && (
        <div className="modal-overlay">
          <div className="modal max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Edit Doctor</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setEditLoading(true);
                try {
                  const token = require('js-cookie').get('token') || '';
                  const payload = {
                    name: editDoctor.user?.name,
                    email: editDoctor.user?.email,
                    phoneNumber: editDoctor.user?.phoneNumber,
                    profileImage: editDoctor.user?.profileImage,
                    licenseNumber: editDoctor.licenseNumber,
                    specialization: editDoctor.specialization,
                    consultationFee: Number(editDoctor.consultationFee||0),
                    experience: Number(editDoctor.experience||0),
                    languages: (editDoctor.languages||[]).join(', '),
                    bio: editDoctor.bio,
                  };
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/doctors/${editDoctor._id}/hospital-update`, {
                    method:'PUT',
                    headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload)
                  });
                  if (!res.ok) throw new Error(await res.text());
                  await mutate();
                  setEditDoctor(null);
                } catch (e) {
                  alert('Failed to save doctor');
                } finally {
                  setEditLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="form-label">Name</label>
                <input
                  className="input w-full"
                  type="text"
                  value={editDoctor.user?.name || ''}
                  onChange={e => setEditDoctor((d: any) => ({ ...d, user: { ...d.user, name: e.target.value } }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input
                  className="input w-full"
                  type="email"
                  value={editDoctor.user?.email || ''}
                  onChange={e => setEditDoctor((d: any) => ({ ...d, user: { ...d.user, email: e.target.value } }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <input
                  className="input w-full"
                  type="tel"
                  value={editDoctor.user?.phoneNumber || ''}
                  onChange={e => setEditDoctor((d: any) => ({ ...d, user: { ...d.user, phoneNumber: e.target.value } }))}
                />
              </div>
              <div>
                <label className="form-label">Profile Image</label>
                <input
                  className="input w-full"
                  type="text"
                  value={editDoctor.user?.profileImage || ''}
                  onChange={e => setEditDoctor((d: any) => ({ ...d, user: { ...d.user, profileImage: e.target.value } }))}
                />
              </div>
              <div>
                <label className="form-label">License Number</label>
                <input
                  className="input w-full"
                  type="text"
                  value={editDoctor.licenseNumber || ''}
                  onChange={e => setEditDoctor((d: any) => ({ ...d, licenseNumber: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Specialization</label>
                <input
                  className="input w-full"
                  type="text"
                  value={editDoctor.specialization || ''}
                  onChange={e => setEditDoctor((d: any) => ({ ...d, specialization: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Consultation Fee (RWF)</label>
                <input
                  className="input w-full"
                  type="number"
                  value={editDoctor.consultationFee || ''}
                  onChange={e => setEditDoctor((d: any) => ({ ...d, consultationFee: e.target.value }))}
                  min={0}
                />
              </div>
              <div>
                <label className="form-label">Experience (years)</label>
                <input
                  className="input w-full"
                  type="number"
                  value={editDoctor.experience || ''}
                  onChange={e => setEditDoctor((d: any) => ({ ...d, experience: e.target.value }))}
                  min={0}
                />
              </div>
              <div>
                <label className="form-label">Languages (comma separated)</label>
                <input
                  className="input w-full"
                  type="text"
                  value={Array.isArray(editDoctor.languages) ? editDoctor.languages.join(', ') : editDoctor.languages || ''}
                  onChange={e => setEditDoctor((d: any) => ({ ...d, languages: e.target.value.split(',').map((s: string) => s.trim()) }))}
                />
              </div>
              <div>
                <label className="form-label">Bio</label>
                <textarea
                  className="input w-full"
                  rows={2}
                  value={editDoctor.bio || ''}
                  onChange={e => setEditDoctor((d: any) => ({ ...d, bio: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <button type="submit" className="btn-primary" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn-outline" onClick={()=>setEditDoctor(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'No doctors match your search criteria.' : 'Get started by adding your first doctor.'}
                </p>
                <div className="mt-6">
                  <button className="btn-primary">
                    Add Doctor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {schedule?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Manage Availability — {schedule.doctor?.user?.name}</h3>
              <button className="btn-outline btn-sm" onClick={()=>setSchedule(null)}>Close</button>
            </div>
            <ScheduleEditor doctorId={schedule.doctor._id} onDone={()=>{ setSchedule(null); mutate(); }} />
          </div>
        </div>
      )}
    </AppShell>
  )
}

