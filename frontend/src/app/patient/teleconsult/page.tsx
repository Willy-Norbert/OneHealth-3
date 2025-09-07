"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function TeleconsultationPage() {
  const { data: hospitals } = useSWR('hospitals', () => api.hospitals.list() as any)
  const { data: doctors } = useSWR('teleconsult-doctors', () => api.doctors.list() as any)
  const { data: types } = useSWR('consultTypes', () => api.teleconsult.consultationTypes() as any)
  const { data: ins } = useSWR('consultInsurance', () => api.teleconsult.insuranceOptions() as any)
  const { data: myTeleconsults } = useSWR('my-teleconsults', () => api.teleconsult.my() as any)
  
  const [state, setState] = useState({ 
    hospital: '', 
    doctor: '', 
    consultationType: '', 
    insurance: '', 
    notes: '',
    preferredDate: '',
    preferredTime: '',
    urgency: 'normal'
  })
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState<any>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await api.teleconsult.create({
        ...state,
        patientDetails: { fullName: 'Current User', email: 'user@example.com', phoneNumber: '000', age: 30, gender: 'Male' }
      } as any)
      setCreated(res)
      setShowBookingForm(false)
    } catch (error) {
      console.error('Teleconsultation booking error:', error)
    }
    setCreating(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'badge-primary'
      case 'ongoing':
        return 'badge-success'
      case 'completed':
        return 'badge-gray'
      case 'cancelled':
        return 'badge-danger'
      default:
        return 'badge-warning'
    }
  }

  const stats = {
    total: myTeleconsults?.data?.teleconsults?.length || 0,
    scheduled: myTeleconsults?.data?.teleconsults?.filter((t: any) => t.status === 'scheduled').length || 0,
    completed: myTeleconsults?.data?.teleconsults?.filter((t: any) => t.status === 'completed').length || 0,
    today: myTeleconsults?.data?.teleconsults?.filter((t: any) => {
      const today = new Date()
      const consultDate = new Date(t.preferredDate || t.createdAt)
      return consultDate.toDateString() === today.toDateString()
    }).length || 0
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
            <h1 className="text-3xl font-bold text-gray-900">Teleconsultation</h1>
            <p className="text-gray-600 mt-1">Book video consultations with healthcare professionals</p>
          </div>
          <button
            onClick={() => setShowBookingForm(!showBookingForm)}
            className="btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Book Teleconsultation
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Total Consultations</p>
                <p className="stat-value">{stats.total}</p>
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
                <p className="stat-label">Scheduled</p>
                <p className="stat-value">{stats.scheduled}</p>
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
                <p className="stat-label">Completed</p>
                <p className="stat-value">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
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

        {/* Available Doctors */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Available Doctors</h3>
            <p className="text-sm text-gray-500">Select a doctor for your teleconsultation</p>
          </div>
          <div className="card-body">
            {doctors?.data?.doctors?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.data.doctors.slice(0, 6).map((doctor: any) => (
                  <div key={doctor._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-blue-600">
                          {(doctor.user?.name || 'D').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {doctor.user?.name || 'Dr. Smith'}
                        </h4>
                        <p className="text-sm text-gray-500">{doctor.specialization || 'General Practice'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{doctor.experience || '5'} years experience</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Available for video calls</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setState({...state, doctor: doctor._id})}
                      className="btn-primary btn-sm w-full"
                    >
                      Select Doctor
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors available</h3>
                <p className="mt-1 text-sm text-gray-500">Please try again later or contact support.</p>
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        {showBookingForm && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Book Teleconsultation</h3>
              <p className="text-sm text-gray-500">Fill in the details for your video consultation</p>
            </div>
            <div className="card-body">
              <form onSubmit={create} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Hospital</label>
                    <select
                      className="input"
                      value={state.hospital}
                      onChange={e => setState({ ...state, hospital: e.target.value })}
                      required
                    >
                      <option value="">Select Hospital</option>
                      {hospitals?.data?.hospitals?.map((h: any) => (
                        <option key={h._id} value={h._id}>{h.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Doctor</label>
                    <select
                      className="input"
                      value={state.doctor}
                      onChange={e => setState({ ...state, doctor: e.target.value })}
                      required
                    >
                      <option value="">Select Doctor</option>
                      {doctors?.data?.doctors?.map((d: any) => (
                        <option key={d._id} value={d._id}>
                          {d.user?.name || 'Dr. Smith'} - {d.specialization || 'General Practice'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Consultation Type</label>
                    <select
                      className="input"
                      value={state.consultationType}
                      onChange={e => setState({ ...state, consultationType: e.target.value })}
                      required
                    >
                      <option value="">Select Type</option>
                      {types?.data?.consultationTypes?.map((t: any) => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Insurance</label>
                    <select
                      className="input"
                      value={state.insurance}
                      onChange={e => setState({ ...state, insurance: e.target.value })}
                    >
                      <option value="">Self-pay</option>
                      {ins?.data?.insuranceOptions?.map((i: any) => (
                        <option key={i._id} value={i._id}>{i.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Date</label>
                    <input
                      type="date"
                      className="input"
                      value={state.preferredDate}
                      onChange={e => setState({ ...state, preferredDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Time</label>
                    <select
                      className="input"
                      value={state.preferredTime}
                      onChange={e => setState({ ...state, preferredTime: e.target.value })}
                      required
                    >
                      <option value="">Select Time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Urgency Level</label>
                    <select
                      className="input"
                      value={state.urgency}
                      onChange={e => setState({ ...state, urgency: e.target.value })}
                    >
                      <option value="low">Low - Routine consultation</option>
                      <option value="normal">Normal - Standard consultation</option>
                      <option value="high">High - Urgent consultation</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes & Symptoms</label>
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Describe your symptoms, concerns, or questions for the doctor..."
                    value={state.notes}
                    onChange={e => setState({ ...state, notes: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <p>📹 Video consultation will be conducted via secure platform</p>
                    <p>⏰ You'll receive confirmation and meeting link via email</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="btn-primary"
                    >
                      {creating ? (
                        <div className="flex items-center">
                          <div className="loading-spinner mr-2"></div>
                          Booking...
                        </div>
                      ) : (
                        'Book Teleconsultation'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* My Teleconsultations */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">My Teleconsultations</h3>
            <p className="text-sm text-gray-500">View and manage your video consultations</p>
          </div>
          <div className="card-body">
            {myTeleconsults?.data?.teleconsults?.length > 0 ? (
              <div className="space-y-4">
                {myTeleconsults.data.teleconsults.map((teleconsult: any) => (
                  <div key={teleconsult._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {teleconsult.doctor?.user?.name || 'Dr. Smith'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {teleconsult.consultationType?.name || 'General Consultation'}
                            </p>
                          </div>
                          <span className={`badge ${getStatusBadge(teleconsult.status)}`}>
                            {teleconsult.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                            </svg>
                            <span>{new Date(teleconsult.preferredDate || teleconsult.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{teleconsult.preferredTime || 'TBD'}</span>
                          </div>
                        </div>

                        {teleconsult.notes && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Notes:</span> {teleconsult.notes}
                            </p>
                          </div>
                        )}

                        {teleconsult.meetingLink && (
                          <div className="mt-3">
                            <a
                              href={teleconsult.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-success btn-sm inline-flex items-center"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                              </svg>
                              Join Video Call
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <button className="btn-primary btn-sm">
                          View Details
                        </button>
                        {teleconsult.status === 'scheduled' && (
                          <button className="btn-danger btn-sm">
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No teleconsultations</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by booking your first video consultation.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="btn-primary"
                  >
                    Book Teleconsultation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result Display */}
        {created && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Booking Confirmation</h3>
            </div>
            <div className="card-body">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-green-800">Teleconsultation Booked Successfully!</h4>
                    <p className="text-sm text-green-700 mt-1">
                      You will receive a confirmation email with meeting details shortly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

