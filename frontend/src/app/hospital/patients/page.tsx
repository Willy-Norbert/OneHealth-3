"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function HospitalPatientsPage() {
  const { data: patients } = useSWR('hospital-patients', () => api.patients.list() as any)
  const { data: appointments } = useSWR('hospital-appointments', () => api.appointments.my() as any)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [recordsModal, setRecordsModal] = useState<{ open: boolean; patient: any; records: any[] }>({ open: false, patient: null, records: [] })
  const [viewModal, setViewModal] = useState<{ open: boolean; patient: any }>({ open: false, patient: null })
  const [editModal, setEditModal] = useState<{ open: boolean; patient: any; saving: boolean }>({ open: false, patient: null, saving: false })

  const filteredPatients = patients?.data?.patients?.filter((patient: any) => {
    const matchesSearch = patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone?.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const stats = {
    total: patients?.data?.patients?.length || 0,
    active: patients?.data?.patients?.filter((p: any) => p.isActive).length || 0,
    new: patients?.data?.patients?.filter((p: any) => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(p.createdAt) > weekAgo
    }).length || 0,
    appointments: appointments?.data?.appointments?.length || 0
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600 mt-1">Manage hospital patients and their records</p>
          </div>
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
                <p className="stat-label">Total Patients</p>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Active Patients</p>
                <p className="stat-value">{stats.active}</p>
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
                <p className="stat-label">New This Week</p>
                <p className="stat-value">{stats.new}</p>
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
                <p className="stat-label">Total Appointments</p>
                <p className="stat-value">{stats.appointments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search patients by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Patients List */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Patient Records</h3>
            <p className="text-sm text-gray-500">View and manage patient information</p>
          </div>
          <div className="card-body">
            {filteredPatients.length > 0 ? (
              <div className="space-y-4">
                {filteredPatients.map((patient: any) => (
                  <div key={patient._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-blue-600">
                            {patient.name?.charAt(0)?.toUpperCase() || 'P'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{patient.name}</h4>
                            <span className={`badge ${patient.isActive ? 'badge-success' : 'badge-gray'}`}>
                              {patient.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><span className="font-medium">Email:</span> {patient.email}</p>
                              <p><span className="font-medium">Phone:</span> {patient.phone || 'N/A'}</p>
                            </div>
                            <div>
                              <p><span className="font-medium">Role:</span> {patient.role}</p>
                              <p><span className="font-medium">Joined:</span> {new Date(patient.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {patient.address && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Address:</span> {patient.address}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <button className="btn-primary btn-sm" onClick={()=> setViewModal({ open: true, patient })}>
                          View Details
                        </button>
                        <button className="btn-outline btn-sm" onClick={()=> setEditModal({ open: true, patient: { ...patient }, saving: false })}>
                          Edit
                        </button>
                        <button className="btn-outline btn-sm" onClick={async ()=>{
                          try {
                            const token = require('js-cookie').get('token') || ''
                            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/medical-records?patient=${patient._id}`, { headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` } })
                            const j = await res.json()
                            setRecordsModal({ open: true, patient, records: j?.data?.records || [] })
                          } catch (e) {
                            console.error('Load records failed', e)
                            setRecordsModal({ open: true, patient, records: [] })
                          }
                        }}>
                          Medical Records
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search criteria.' : 'No patients have been registered yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
