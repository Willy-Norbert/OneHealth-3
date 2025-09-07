"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function AppointmentsPage() {
  const { data: hospitals } = useSWR('hospitals', () => api.hospitals.list() as any)
  const { data: myAppointments, mutate } = useSWR('myAppointments', () => api.appointments.my() as any)
  const [form, setForm] = useState<any>({ hospital: '', department: '', appointmentType: 'virtual', appointmentDate: '', appointmentTime: '', reasonForVisit: '' })
  const [departments, setDepartments] = useState<any[]>([])
  const [slots, setSlots] = useState<string[]>([])
  const [result, setResult] = useState<any>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)

  const loadDepartments = async (hospitalId: string) => {
    const res = await api.departments.byHospital(hospitalId) as any
    setDepartments(res?.data?.departments || [])
  }

  const loadSlots = async () => {
    if (!form.hospital || !form.department || !form.appointmentDate) return
    const q = new URLSearchParams({ date: form.appointmentDate, hospital: form.hospital, department: form.department })
    const res = await apiFetch(`/appointments/available-slots?${q.toString()}`)
    setSlots(res?.data?.availableSlots || [])
  }

  async function apiFetch(path: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${path}`, { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' })
    return res.json()
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      patientDetails: { fullName: 'Current User', email: 'user@example.com', phoneNumber: '000', age: 30, gender: 'Male' },
    }
    const res = await api.appointments.create(payload as any)
    setResult(res)
    mutate()
    setShowBookingForm(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'badge-success'
      case 'pending':
        return 'badge-warning'
      case 'cancelled':
        return 'badge-danger'
      default:
        return 'badge-gray'
    }
  }

  return (
    <AppShell
      menu={[
        { href: '/patient', label: 'Overview' },
        { href: '/patient/appointments', label: 'Appointments' },
        { href: '/patient/teleconsult', label: 'Teleconsultation' },
        { href: '/patient/pharmacy', label: 'Pharmacy' },
        { href: '/patient/ai', label: 'AI Assistant' },
        { href: '/patient/emergency', label: 'Emergency' },
        { href: '/patient/records', label: 'Medical Records' },
        { href: '/patient/orders', label: 'My Orders' },
      ]}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">Manage your medical appointments</p>
          </div>
          <button
            onClick={() => setShowBookingForm(!showBookingForm)}
            className="btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Book New Appointment
          </button>
        </div>

        {/* Booking Form */}
        {showBookingForm && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Book New Appointment</h3>
            </div>
            <div className="card-body">
              <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Hospital</label>
                    <select 
                      className="input" 
                      value={form.hospital} 
                      onChange={e => { setForm({ ...form, hospital: e.target.value }); loadDepartments(e.target.value) }} 
                      required
                    >
                      <option value="">Select Hospital</option>
                      {(hospitals as any)?.data?.hospitals?.map((h: any) => 
                        <option key={h._id} value={h._id}>{h.name}</option>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select 
                      className="input" 
                      value={form.department} 
                      onChange={e => setForm({ ...form, department: e.target.value })} 
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => 
                        <option key={d._id} value={d._id}>{d.name}</option>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Appointment Date</label>
                    <input 
                      type="date" 
                      className="input" 
                      value={form.appointmentDate} 
                      onChange={e => setForm({ ...form, appointmentDate: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Appointment Time</label>
                    <select 
                      className="input" 
                      value={form.appointmentTime} 
                      onChange={e => setForm({ ...form, appointmentTime: e.target.value })} 
                      required
                    >
                      <option value="">Select Time</option>
                      {slots.map((s) => 
                        <option key={s} value={s}>{s}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Reason for Visit</label>
                  <textarea 
                    className="input" 
                    rows={4}
                    placeholder="Please describe your symptoms or reason for the appointment"
                    value={form.reasonForVisit} 
                    onChange={e => setForm({ ...form, reasonForVisit: e.target.value })} 
                    required 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button 
                    type="button" 
                    onClick={loadSlots} 
                    className="btn-secondary"
                    disabled={!form.hospital || !form.department || !form.appointmentDate}
                  >
                    Load Available Slots
                  </button>
                  
                  <div className="flex space-x-3">
                    <button 
                      type="button" 
                      onClick={() => setShowBookingForm(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Book Appointment
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* My Appointments */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">My Appointments</h3>
            <p className="text-sm text-gray-500">View and manage your scheduled appointments</p>
          </div>
          <div className="card-body">
            {myAppointments?.data?.appointments?.length > 0 ? (
              <div className="space-y-4">
                {myAppointments.data.appointments.map((appointment: any) => (
                  <div key={appointment._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {appointment.hospital?.name} — {appointment.department?.name}
                          </h4>
                          <span className={`badge ${getStatusBadge(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                            </svg>
                            <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{appointment.appointmentTime}</span>
                          </div>
                        </div>

                        {appointment.reasonForVisit && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Reason:</span> {appointment.reasonForVisit}
                            </p>
                          </div>
                        )}

                        {appointment.meeting?.link && (
                          <div className="mt-3">
                            <a 
                              href={appointment.meeting.link} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-success btn-sm inline-flex items-center"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                              Join Meeting
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        {appointment.paymentStatus !== 'paid' && (
                          <PayButton appointmentId={appointment._id} />
                        )}
                        <button 
                          onClick={async () => { 
                            await api.appointments.cancel(appointment._id); 
                            mutate() 
                          }} 
                          className="btn-danger btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by booking your first appointment.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="btn-primary"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Booking Result</h3>
            </div>
            <div className="card-body">
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

function PayButton({ appointmentId }: { appointmentId: string }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string|undefined>()
  const checkout = async () => {
    setLoading(true)
    try {
      const res = await api.payments.checkout({ appointmentId, provider: 'DEV_FAKE' }) as any
      const paymentId = (res as any)?.data?.payment?._id
      // simulate redirect/return then verify
      const verify = await api.payments.verify({ paymentId }) as any
      setStatus(verify?.data?.payment?.status)
    } finally { setLoading(false) }
  }
  return <button onClick={checkout} disabled={loading} className="btn-primary">{status || (loading? 'Processing...' : 'Pay now')}</button>
}

