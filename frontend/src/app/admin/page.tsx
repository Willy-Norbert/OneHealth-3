"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function AdminDashboard() {
  const { data: insurance } = useSWR('insurance', () => api.insurance.list() as any)
  const { data: doctors } = useSWR('doctors', () => api.doctors.list() as any)

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
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-navy">Insurance Providers</h2>
          <ul className="mt-3 list-disc pl-5 text-sm">
            {(insurance as any)?.data?.insuranceProviders?.slice(0,6)?.map((i: any)=> (
              <li key={i._id}>{i.name}</li>
            ))}
          </ul>
        </div>
        <div className="card p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-navy">Doctors</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {(doctors as any)?.data?.doctors?.slice(0,8)?.map((d: any)=> (
              <div key={d._id} className="rounded-lg border p-3">
                <div className="font-medium">{d.user?.name || d.user?.email}</div>
                <div className="text-slate-600">{d.specialization}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

