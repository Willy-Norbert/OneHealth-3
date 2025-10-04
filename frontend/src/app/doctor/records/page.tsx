"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function DoctorRecordsPage() {
  const { data: myPrescriptions } = useSWR('my-prescriptions', () => api.prescriptions.myAuthored() as any)
  const { data: myAppointments } = useSWR('my-appointments', () => api.appointments.myDoctor() as any)
  const [activeTab, setActiveTab] = useState('prescriptions')

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'badge-success'
      case 'pending':
        return 'badge-warning'
      case 'cancelled':
        return 'badge-danger'
      default:
        return 'badge-gray'
    }
  }

  const stats = {
    prescriptions: myPrescriptions?.data?.prescriptions?.length || 0,
    appointments: myAppointments?.data?.appointments?.length || 0,
    completed: myAppointments?.data?.appointments?.filter((a: any) => a.status === 'completed').length || 0,
    today: myAppointments?.data?.appointments?.filter((a: any) => {
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
            <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-gray-600 mt-1">Manage your prescriptions and patient records</p>
          </div>
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
                <p className="stat-value">{stats.prescriptions}</p>
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
                <p className="stat-label">Total Appointments</p>
                <p className="stat-value">{stats.appointments}</p>
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

        {/* Tabs */}
        <div className="card">
          <div className="card-header">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'prescriptions'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Prescriptions
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'appointments'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Appointments
              </button>
            </div>
          </div>
          <div className="card-body">
            {activeTab === 'prescriptions' ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">My Prescriptions</h3>
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
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">My Appointments</h3>
                {myAppointments?.data?.appointments?.length > 0 ? (
                  <div className="space-y-4">
                    {myAppointments.data.appointments.map((appointment: any) => (
                      <div key={appointment._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {appointment.patient?.name || 'Unknown Patient'}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                                </p>
                              </div>
                              <span className={`badge ${getStatusBadge(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <p><span className="font-medium">Type:</span> {appointment.appointmentType}</p>
                                <p><span className="font-medium">Department:</span> {appointment.department?.name || 'N/A'}</p>
                              </div>
                              <div>
                                <p><span className="font-medium">Hospital:</span> {appointment.hospital?.name || 'N/A'}</p>
                                <p><span className="font-medium">Reason:</span> {appointment.reasonForVisit}</p>
                              </div>
                            </div>

                            {appointment.meeting?.link && (
                              <div className="mt-3">
                                <a
                                  href={appointment.meeting.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-success btn-sm inline-flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                  </svg>
                                  Join Meeting
                                </a>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col space-y-2 ml-4">
                            <button className="btn-primary btn-sm">
                              View Details
                            </button>
                            {appointment.status === 'pending' && (
                              <button className="btn-success btn-sm">
                                Accept
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                    <p className="mt-1 text-sm text-gray-500">You don't have any appointments yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}