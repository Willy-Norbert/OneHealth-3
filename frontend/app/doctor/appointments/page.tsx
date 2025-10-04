"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function DoctorAppointmentsPage() {
  const { user } = useAuth()
  const { data, mutate } = useSWR('doctor-appts', () => api.appointments.myDoctor() as any)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'}/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}` },
        body: JSON.stringify({ status })
      })
      mutate()
    } catch (error) {
      console.error('Failed to update appointment status:', error)
    } finally {
      setUpdating(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'badge-success'
      case 'pending':
        return 'badge-warning'
      case 'declined':
      case 'cancelled':
        return 'badge-danger'
      case 'completed':
        return 'badge-primary'
      default:
        return 'badge-gray'
    }
  }

  const filteredAppointments = (data as any)?.data?.appointments?.filter((appointment: any) => {
    if (filter === 'all') return true
    if (filter === 'today') {
      const today = new Date()
      const appointmentDate = new Date(appointment.appointmentDate)
      return appointmentDate.toDateString() === today.toDateString()
    }
    return appointment.status?.toLowerCase() === filter
  }) || []

  const stats = {
    total: (data as any)?.data?.appointments?.length || 0,
    pending: (data as any)?.data?.appointments?.filter((a: any) => a.status === 'pending').length || 0,
    confirmed: (data as any)?.data?.appointments?.filter((a: any) => a.status === 'confirmed').length || 0,
    today: (data as any)?.data?.appointments?.filter((a: any) => {
      const today = new Date()
      const appointmentDate = new Date(a.appointmentDate)
      return appointmentDate.toDateString() === today.toDateString()
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
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">Manage your patient appointments</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Total</p>
                <p className="stat-value">{stats.total}</p>
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
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Confirmed</p>
                <p className="stat-value">{stats.confirmed}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
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

        {/* Filters */}
        <div className="card">
          <div className="card-body">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'} btn-sm`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('today')}
                className={`btn ${filter === 'today' ? 'btn-primary' : 'btn-outline'} btn-sm`}
              >
                Today ({stats.today})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'} btn-sm`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('confirmed')}
                className={`btn ${filter === 'confirmed' ? 'btn-primary' : 'btn-outline'} btn-sm`}
              >
                Confirmed ({stats.confirmed})
              </button>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
            <p className="text-sm text-gray-500">Manage and update appointment statuses</p>
          </div>
          <div className="card-body">
            {filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map((appointment: any) => (
                  <div key={appointment._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {(appointment.patient?.name || 'P').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {appointment.patient?.name || 'Unknown Patient'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {appointment.patient?.email || 'No email provided'}
                            </p>
                          </div>
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

                        {/* Teleconsultation Join or Create */}
                        {appointment.appointmentType === 'virtual' && (
                          <div className="mt-3">
                            {(() => {
                              const meetingLink = appointment.meeting?.meetingLink || appointment.meeting?.link
                              const meetingId = appointment.meeting?.meeting_id || (meetingLink ? String(meetingLink).split('/').pop() : null)
                              const href = meetingLink || (meetingId ? `/meeting/${meetingId}` : null)
                              // Gate join until patient has paid
                              if (href && appointment.paymentStatus === 'paid') {
                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary btn-sm inline-flex items-center"
                                  >
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                    </svg>
                                    Join Teleconsultation
                                  </a>
                                )
                              }
                              if (href && appointment.paymentStatus !== 'paid') {
                                return (
                                  <a href="/patient/payments" className="btn-outline btn-sm inline-flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>
                                    Awaiting Payment
                                  </a>
                                )
                              }
                              // If no meeting exists yet, allow creating one then open
                              return (
                                <button
                                  className="btn-primary btn-sm inline-flex items-center"
                                  onClick={async ()=>{
                                    try {
                                      const res = await api.meetings.create({
                                        doctor: user?.id,
                                        patient: appointment.patient?._id || appointment.patient,
                                        appointment: appointment._id,
                                        startTime: new Date().toISOString(),
                                        endTime: new Date(Date.now()+30*60000).toISOString(),
                                        title: 'Teleconsultation',
                                      }) as any
                                      const link = res?.data?.meeting?.link || res?.data?.meeting?.meetingLink
                                      mutate()
                                      if (link) window.open(link, '_blank', 'noopener,noreferrer')
                                    } catch (e) {
                                      console.error('Failed to create meeting', e)
                                    }
                                  }}
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                  </svg>
                                  Create & Join Teleconsultation
                                </button>
                              )
                            })()}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(appointment._id, 'confirmed')}
                              disabled={updating === appointment._id}
                              className="btn-success btn-sm"
                            >
                              {updating === appointment._id ? 'Updating...' : 'Accept'}
                            </button>
                            <button
                              onClick={() => updateStatus(appointment._id, 'declined')}
                              disabled={updating === appointment._id}
                              className="btn-danger btn-sm"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(appointment._id, 'completed')}
                            disabled={updating === appointment._id}
                            className="btn-primary btn-sm"
                          >
                            {updating === appointment._id ? 'Updating...' : 'Mark Complete'}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === 'all' ? 'You have no appointments scheduled.' : `No ${filter} appointments found.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

