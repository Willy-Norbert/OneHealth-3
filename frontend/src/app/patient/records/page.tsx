"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

export default function RecordsPage() {
  const { user } = useAuth()
  const { data: records } = useSWR(() => user ? `records-${user.id}` : null, () => apiFetch(`/medical-records/patients/${user!.id}`))
  const { data: prescriptions } = useSWR('my-prescriptions', () => api.pharmacy.prescriptions() as any)
  const { data: appointments } = useSWR('my-appointments', () => api.appointments.my() as any)
  const [selectedCategory, setSelectedCategory] = useState('all')

  async function apiFetch(path: string) {
    const token = document.cookie.split('token=')[1]?.split(';')[0]
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'}${path}`, { headers: { Authorization: `Bearer ${token}` } })
    return res.json()
  }

  const categories = [
    { value: 'all', label: 'All Records', icon: '📋' },
    { value: 'diagnosis', label: 'Diagnoses', icon: '🩺' },
    { value: 'prescriptions', label: 'Prescriptions', icon: '💊' },
    { value: 'appointments', label: 'Appointments', icon: '📅' },
    { value: 'lab', label: 'Lab Results', icon: '🧪' },
    { value: 'imaging', label: 'Imaging', icon: '📷' }
  ]

  const stats = {
    totalRecords: records?.data?.history?.length || 0,
    totalPrescriptions: prescriptions?.data?.prescriptions?.length || 0,
    totalAppointments: appointments?.data?.appointments?.length || 0,
    recentRecords: records?.data?.history?.filter((r: any) => {
      const recordDate = new Date(r.date)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return recordDate >= thirtyDaysAgo
    }).length || 0
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'badge-success'
      case 'completed':
        return 'badge-primary'
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
            <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-gray-600 mt-1">View and manage your complete medical history</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Total Records</p>
                <p className="stat-value">{stats.totalRecords}</p>
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
                <p className="stat-label">Prescriptions</p>
                <p className="stat-value">{stats.totalPrescriptions}</p>
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
                <p className="stat-label">Appointments</p>
                <p className="stat-value">{stats.totalAppointments}</p>
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
                <p className="stat-label">Recent (30 days)</p>
                <p className="stat-value">{stats.recentRecords}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Filter Records</h3>
            <p className="text-sm text-gray-500">Select a category to view specific types of records</p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    selectedCategory === category.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium">{category.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Medical Records */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
            <p className="text-sm text-gray-500">Your complete medical record history</p>
          </div>
          <div className="card-body">
            {records?.data?.history?.length > 0 ? (
              <div className="space-y-4">
                {records.data.history
                  .filter((record: any) => selectedCategory === 'all' || record.type === selectedCategory)
                  .map((record: any) => (
                    <div key={record._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{record.diagnosis || 'Medical Record'}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(record.date).toLocaleDateString()} • {record.doctor?.name || 'Dr. Unknown'}
                              </p>
                            </div>
                            <span className={`badge ${getStatusBadge(record.status)}`}>
                              {record.status || 'Active'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><span className="font-medium">Type:</span> {record.type || 'General'}</p>
                              <p><span className="font-medium">Hospital:</span> {record.hospital?.name || 'Not specified'}</p>
                            </div>
                            <div>
                              <p><span className="font-medium">Department:</span> {record.department || 'General Medicine'}</p>
                              <p><span className="font-medium">Follow-up:</span> {record.followUp ? 'Required' : 'Not required'}</p>
                            </div>
                          </div>

                          {record.notes && (
                            <div className="mt-3 p-3 bg-white rounded-lg">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Notes:</span> {record.notes}
                              </p>
                            </div>
                          )}

                          {record.medications && record.medications.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">Prescribed Medications:</p>
                              <div className="flex flex-wrap gap-2">
                                {record.medications.map((med: string, index: number) => (
                                  <span key={index} className="badge badge-primary badge-sm">
                                    {med}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <button className="btn-primary btn-sm">
                            View Details
                          </button>
                          <button className="btn-outline btn-sm">
                            Download PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No medical records</h3>
                <p className="mt-1 text-sm text-gray-500">Your medical records will appear here after your first appointment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Records</h3>
            <p className="text-sm text-gray-500 mb-4">Download your complete medical history as PDF</p>
            <button className="btn-primary w-full">
              Download All Records
            </button>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Records</h3>
            <p className="text-sm text-gray-500 mb-4">Securely share your records with healthcare providers</p>
            <button className="btn-success w-full">
              Share Records
            </button>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Update</h3>
            <p className="text-sm text-gray-500 mb-4">Request updates to your medical records</p>
            <button className="btn-outline w-full">
              Request Update
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}