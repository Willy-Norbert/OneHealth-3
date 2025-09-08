"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function HospitalNotificationsPage() {
  const { data, mutate } = useSWR('notifications', () => api.notifications.list() as any)
  const notes = data?.data || []

  return (
    <AppShell
      menu={[
        { href: '/hospital', label: 'Overview' },
        { href: '/hospital/doctors', label: 'Doctors' },
        { href: '/hospital/departments', label: 'Departments' },
        { href: '/hospital/appointments', label: 'Appointments' },
        { href: '/hospital/analytics', label: 'Analytics' },
        { href: '/hospital/profile', label: 'Profile' },
        { href: '/hospital/notifications', label: 'Notifications' },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">Latest updates for your hospital account</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {notes.length ? (
              <div className="divide-y divide-gray-100">
                {notes.map((n: any) => (
                  <div key={n._id} className="py-4 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-900">{n.message}</div>
                        <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    {!n.read && (
                      <button className="btn-outline btn-sm" onClick={async ()=>{ await api.notifications.markRead(n._id); mutate() }}>Mark read</button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">No notifications</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

