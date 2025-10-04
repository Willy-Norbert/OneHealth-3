"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useState } from 'react'
import HealthSpinner from '@/components/ui/HealthSpinner'
import useSWRImmutable from 'swr/immutable'

export default function DoctorPrescriptionsPage() {
  const { data: myPrescriptions, mutate } = useSWR('my-prescriptions', () => api.prescriptions.myAuthored() as any)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<any>({ appointment: '', patient: '', diagnosis: '', medications: [{ name: '', dosage: '', frequency: '', instructions: '' }], notes: '' })
  const { data: myAppts } = useSWR('doctor-appts-for-rx', () => api.appointments.myDoctor() as any)
  const { data: interactions, mutate: refetchInteractions, isLoading: loadingInteractions } = useSWRImmutable(
    form.medications?.filter((m:any)=>m.name).length >= 2 ? ['drug-check', form.medications.map((m:any)=>m.name).join(',')] : null,
    () => api.drugInteractions.check(form.medications.filter((m:any)=>m.name)) as any
  )

  const stats = {
    total: myPrescriptions?.data?.prescriptions?.length || 0,
    thisMonth: myPrescriptions?.data?.prescriptions?.filter((p: any) => {
      const thisMonth = new Date()
      const prescriptionDate = new Date(p.datePrescribed)
      return prescriptionDate.getMonth() === thisMonth.getMonth() && 
             prescriptionDate.getFullYear() === thisMonth.getFullYear()
    }).length || 0,
    thisWeek: myPrescriptions?.data?.prescriptions?.filter((p: any) => {
      const thisWeek = new Date()
      const prescriptionDate = new Date(p.datePrescribed)
      const weekAgo = new Date(thisWeek.getTime() - 7 * 24 * 60 * 60 * 1000)
      return prescriptionDate >= weekAgo
    }).length || 0,
    today: myPrescriptions?.data?.prescriptions?.filter((p: any) => {
      const today = new Date()
      const prescriptionDate = new Date(p.datePrescribed)
      return prescriptionDate.toDateString() === today.toDateString()
    }).length || 0
  }

  return (
    <AppShell
    menu={[
      { href: '/doctor', label: 'Overview' },
      { href: '/doctor/appointments', label: 'Appointments' },
      { href: '/doctor/lab-results', label: 'Medical Records' },
      { href: '/doctor/settings', label: 'Settings' },
      { href: '/doctor/meetings', label: 'Teleconsultations' },
      { href: '/doctor/prescriptions', label: 'Prescriptions' },
      { href: '/doctor/records', label: 'Medical Records' },
      { href: '/doctor/profile', label: 'Profile' },
    ]}
  >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
            <p className="text-gray-600 mt-1">Manage patient prescriptions and medication records</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Prescription
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Total Prescriptions</p>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">This Month</p>
                <p className="stat-value">{stats.thisMonth}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">This Week</p>
                <p className="stat-value">{stats.thisWeek}</p>
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
                <p className="stat-label">Today</p>
                <p className="stat-value">{stats.today}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">My Prescriptions</h3>
            <p className="text-sm text-gray-500">View and manage all your prescriptions</p>
          </div>
          <div className="card-body">
            {showCreateForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Create Prescription</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Appointment</label>
                    <select className="input" value={form.appointment} onChange={(e)=>{
                      const appt = (myAppts?.data?.appointments||[]).find((a:any)=>a._id===e.target.value)
                      setForm({ ...form, appointment: e.target.value, patient: appt?.patient?._id || appt?.patient || '' })
                    }} required>
                      <option value="">Select appointment</option>
                      {(myAppts?.data?.appointments||[]).filter((a:any)=>a.status==='confirmed' || a.status==='completed').map((a:any)=>(
                        <option key={a._id} value={a._id}>{new Date(a.appointmentDate).toLocaleString()} — {a.patient?.name || 'Patient'} ({a._id})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Patient</label>
                    <input className="input" value={form.patient} readOnly />
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label">Diagnosis</label>
                    <input className="input" value={form.diagnosis} onChange={(e)=>setForm({ ...form, diagnosis: e.target.value })} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label">Medications</label>
                    <div className="space-y-2">
                      {form.medications.map((m:any, idx:number)=>(
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2" key={idx}>
                          <input className="input" placeholder="Name" value={m.name} onChange={(e)=>{
                            const meds = [...form.medications]; meds[idx] = { ...meds[idx], name: e.target.value }; setForm({ ...form, medications: meds })
                          }} required />
                          <input className="input" placeholder="Dosage" value={m.dosage} onChange={(e)=>{
                            const meds = [...form.medications]; meds[idx] = { ...meds[idx], dosage: e.target.value }; setForm({ ...form, medications: meds })
                          }} required />
                          <input className="input" placeholder="Frequency" value={m.frequency} onChange={(e)=>{
                            const meds = [...form.medications]; meds[idx] = { ...meds[idx], frequency: e.target.value }; setForm({ ...form, medications: meds })
                          }} required />
                          <input className="input md:col-span-2" placeholder="Instructions (optional)" value={m.instructions} onChange={(e)=>{
                            const meds = [...form.medications]; meds[idx] = { ...meds[idx], instructions: e.target.value }; setForm({ ...form, medications: meds })
                          }} />
                        </div>
                      ))}
                      <button className="btn-outline btn-sm" onClick={()=> setForm({ ...form, medications: [...form.medications, { name: '', dosage: '', frequency: '', instructions: '' }] })}>+ Add medication</button>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label">Notes</label>
                    <textarea className="input" rows={3} value={form.notes} onChange={(e)=>setForm({ ...form, notes: e.target.value })} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button type="button" className="btn-outline" onClick={()=> refetchInteractions()} disabled={loading}>
                    {loadingInteractions ? 'Checking interactions...' : 'Check Interactions'}
                  </button>
                  <button className="btn-primary" disabled={loading} onClick={async ()=>{
                    try {
                      setLoading(true)
                      await api.prescriptions.create({ appointment: form.appointment, patient: form.patient, diagnosis: form.diagnosis, medications: form.medications, notes: form.notes })
                      setShowCreateForm(false)
                      setForm({ appointment: '', patient: '', diagnosis: '', medications: [{ name: '', dosage: '', frequency: '', instructions: '' }], notes: '' })
                      await mutate()
                    } catch (e) {
                      console.error('Create prescription failed', e)
                    } finally {
                      setLoading(false)
                    }
                  }}>{loading? <HealthSpinner /> : 'Save Prescription'}</button>
                  <button className="btn-outline" onClick={()=> setShowCreateForm(false)}>Cancel</button>
                </div>
                {interactions?.data && (
                  <div className="mt-4 p-3 bg-amber-50 rounded border border-amber-200">
                    <div className="font-medium text-amber-900 mb-1">Interaction Summary</div>
                    <div className="text-sm text-amber-800">Risk: {interactions.data.riskLevel}</div>
                    <div className="mt-2 space-y-2">
                      {(interactions.data.interactions||[]).slice(0,5).map((grp:any, idx:number)=> (
                        <div key={idx} className="text-sm text-amber-900">
                          {grp.drug1 || grp.drug} {grp.drug2? `+ ${grp.drug2}`: ''}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {myPrescriptions?.data?.prescriptions?.length > 0 ? (
              <div className="space-y-4">
                {myPrescriptions.data.prescriptions.map((prescription: any) => (
                  <div key={prescription._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {prescription.patient?.name || 'Unknown Patient'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {new Date(prescription.datePrescribed).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Diagnosis:</span> {prescription.diagnosis}
                          </p>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Medications:</p>
                          <div className="space-y-1">
                            {prescription.medications?.map((med: any, index: number) => (
                              <div key={index} className="text-sm text-gray-600 bg-white p-2 rounded">
                                <span className="font-medium">{med.name}</span> - {med.dosage} ({med.frequency})
                                {med.instructions && <div className="text-xs text-gray-500 mt-1">{med.instructions}</div>}
                              </div>
                            ))}
                          </div>
                        </div>

                        {prescription.notes && (
                          <div className="mt-3 p-3 bg-white rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Notes:</span> {prescription.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <button className="btn-primary btn-sm">
                          View Details
                        </button>
                        <button className="btn-outline btn-sm">
                          Edit
                        </button>
                        <button className="btn-danger btn-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions</h3>
                <p className="mt-1 text-sm text-gray-500">You haven't written any prescriptions yet.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn-primary"
                  >
                    Create First Prescription
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}