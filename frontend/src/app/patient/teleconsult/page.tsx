"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function TeleconsultationPage() {
  const { data: myTeleconsults } = useSWR('my-teleconsults', () => api.teleconsult.mine() as any)

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
    total: myTeleconsults?.data?.teleconsultations?.length || 0,
    scheduled: myTeleconsults?.data?.teleconsultations?.filter((t: any) => t.status === 'scheduled').length || 0,
    completed: myTeleconsults?.data?.teleconsultations?.filter((t: any) => t.status === 'completed').length || 0,
    today: myTeleconsults?.data?.teleconsultations?.filter((t: any) => {
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
        { href: '/patient/prescriptions', label: 'Prescriptions' },
        { href: '/patient/pharmacy', label: 'Pharmacy' },
        { href: '/patient/ai', label: 'AI Assistant' },
        { href: '/patient/emergency', label: 'Emergency' },
        { href: '/patient/records', label: 'Medical Records' },
        { href: '/patient/orders', label: 'My Orders' },
        { href: '/patient/profile', label: 'Profile' },
      ]}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teleconsultation</h1>
            <p className="text-gray-600 mt-1">View your video consultations and meeting links</p>
          </div>
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

        {/* My Teleconsultations */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">My Teleconsultations</h3>
            <p className="text-sm text-gray-500">View and manage your video consultations</p>
          </div>
          <div className="card-body">
            {myTeleconsults?.data?.teleconsultations?.length > 0 ? (
              <div className="space-y-4">
                {myTeleconsults.data.teleconsultations.map((teleconsult: any) => (
                  <div key={teleconsult._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {teleconsult.consultationType?.name || 'General Consultation'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {teleconsult.hospital?.name || 'Hospital not specified'}
                            </p>
                          </div>
                          <span className={`badge ${getStatusBadge(teleconsult.status)}`}>
                            {teleconsult.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><span className="font-medium">Date:</span> {new Date(teleconsult.preferredDate || teleconsult.createdAt).toLocaleDateString()}</p>
                            <p><span className="font-medium">Time:</span> {teleconsult.preferredTime || 'TBD'}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Type:</span> {teleconsult.consultationType?.name || 'General'}</p>
                            <p><span className="font-medium">Insurance:</span> {teleconsult.insurance?.name || 'Self-pay'}</p>
                          </div>
                        </div>

                        {teleconsult.notes && (
                          <div className="mt-3 p-3 bg-white rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Notes:</span> {teleconsult.notes}
                            </p>
                          </div>
                        )}

                        {/* Meeting Link */}
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
                <p className="mt-1 text-sm text-gray-500">You don't have any video consultations yet.</p>
                <div className="mt-6">
                  <a
                    href="/patient/appointments"
                    className="btn-primary"
                  >
                    Book Appointment
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}