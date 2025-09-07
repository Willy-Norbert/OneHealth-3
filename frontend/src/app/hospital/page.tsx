"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function HospitalDashboard() {
  const { data: hospitals } = useSWR('myHospital', () => api.hospitals.list() as any)

  return (
    <AppShell
      menu={[
        { href: '/hospital', label: 'Overview' },
        { href: '/hospital/doctors', label: 'Doctors' },
        { href: '/hospital/departments', label: 'Departments' },
        { href: '/hospital/appointments', label: 'Appointments' },
        { href: '/hospital/emergencies', label: 'Emergencies' },
        { href: '/hospital/insurance', label: 'Insurance' },
      ]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-navy">Hospitals</h2>
          <ul className="mt-3 list-disc pl-5 text-sm">
            {(hospitals as any)?.data?.hospitals?.slice(0,6)?.map((h: any)=> (
              <li key={h._id}>{h.name} — {h.location}</li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-navy">Quick Links</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <a href="/hospital/doctors" className="btn-primary">Manage doctors</a>
            <a href="/hospital/departments" className="btn-primary">Departments</a>
            <a href="/hospital/appointments" className="btn-primary">Appointments</a>
            <a href="/hospital/emergencies" className="btn-primary">Emergencies</a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

