"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function AdminDashboard() {
  const { data: insurance } = useSWR('insurance', () => api.insurance.list() as any)
  const { data: doctors } = useSWR('doctors', () => api.doctors.list() as any)
  const { data: hospitals } = useSWR('hospitals', () => api.hospitals.list() as any)
  const { data: users } = useSWR('users', () => api.users.list() as any)
  const { data: appointments } = useSWR('all-appointments', () => api.appointments as any)

  // Mock data for demonstration - in real app, this would come from API
  const stats = {
    totalUsers: users?.data?.users?.length || 0,
    totalDoctors: doctors?.data?.doctors?.length || 0,
    totalHospitals: hospitals?.data?.hospitals?.length || 0,
    totalAppointments: appointments?.data?.appointments?.length || 0,
    totalInsurance: insurance?.data?.insuranceProviders?.length || 0,
    activeUsers: users?.data?.users?.filter((u: any) => u.status === 'active').length || 0,
    pendingAppointments: appointments?.data?.appointments?.filter((a: any) => a.status === 'pending').length || 0,
    todayAppointments: appointments?.data?.appointments?.filter((a: any) => {
      const today = new Date()
      const appointmentDate = new Date(a.appointmentDate)
      return appointmentDate.toDateString() === today.toDateString()
    }).length || 0
  }

  return (
    <AppShell
      menu={[
        { href: '/admin', label: 'Overview' },
        { href: '/admin/users', label: 'Users' },
        { href: '/admin/hospitals', label: 'Hospitals' },
        { href: '/admin/departments', label: 'Departments' },
        { href: '/admin/insurance', label: 'Insurance' },
        { href: '/admin/emergencies', label: 'Emergencies' },
        { href: '/admin/payments', label: 'Payments' },
      ]}
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="card p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">System Administration</h1>
              <p className="text-blue-100 mt-2">Comprehensive healthcare system management dashboard</p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="stat-label">Total Users</p>
                <p className="stat-value">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Active Doctors</p>
                <p className="stat-value">{stats.totalDoctors}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 7.5h10.5m-10.5 6h10.5m-10.5 6h10.5" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Hospitals</p>
                <p className="stat-value">{stats.totalHospitals}</p>
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
                <p className="stat-label">Appointments</p>
                <p className="stat-value">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="/admin/users" className="card p-6 hover:shadow-lg transition-shadow group">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-500">User accounts and permissions</p>
              </div>
            </div>
          </a>

          <a href="/admin/hospitals" className="card p-6 hover:shadow-lg transition-shadow group">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 7.5h10.5m-10.5 6h10.5m-10.5 6h10.5" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Hospitals</h3>
                <p className="text-sm text-gray-500">Hospital management</p>
              </div>
            </div>
          </a>

          <a href="/admin/insurance" className="card p-6 hover:shadow-lg transition-shadow group">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Insurance</h3>
                <p className="text-sm text-gray-500">Insurance providers</p>
              </div>
            </div>
          </a>

          <a href="/admin/payments" className="card p-6 hover:shadow-lg transition-shadow group">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Payments</h3>
                <p className="text-sm text-gray-500">Payment management</p>
              </div>
            </div>
          </a>

          <a href="/admin/emergencies" className="card p-6 hover:shadow-lg transition-shadow group">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Emergencies</h3>
                <p className="text-sm text-gray-500">Emergency management</p>
              </div>
            </div>
          </a>

          <a href="/admin/departments" className="card p-6 hover:shadow-lg transition-shadow group">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 7.5h10.5m-10.5 6h10.5m-10.5 6h10.5" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Departments</h3>
                <p className="text-sm text-gray-500">Medical departments</p>
              </div>
            </div>
          </a>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Doctors */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Recent Doctors</h3>
            </div>
            <div className="card-body">
              {doctors?.data?.doctors?.length > 0 ? (
                <div className="space-y-3">
                  {doctors.data.doctors.slice(0, 5).map((doctor: any) => (
                    <div key={doctor._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {doctor.user?.name || 'Unknown Doctor'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {doctor.specialization || 'General Practice'}
                        </p>
                      </div>
                      <span className="badge badge-primary">Active</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">No doctors found</p>
                </div>
              )}
            </div>
          </div>

          {/* Insurance Providers */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Insurance Providers</h3>
            </div>
            <div className="card-body">
              {insurance?.data?.insuranceProviders?.length > 0 ? (
                <div className="space-y-3">
                  {insurance.data.insuranceProviders.slice(0, 5).map((provider: any) => (
                    <div key={provider._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{provider.name}</p>
                        <p className="text-sm text-gray-500">{provider.type || 'Health Insurance'}</p>
                      </div>
                      <span className="badge badge-success">Active</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">No insurance providers found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

