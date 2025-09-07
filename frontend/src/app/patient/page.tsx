"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function PatientDashboard() {
  const { data: hospitals } = useSWR('hospitals', () => api.hospitals.list() as any)
  const { data: insurance } = useSWR('insurance', () => api.insurance.list() as any)
  const { data: slots } = useSWR('slots', () => api.appointments.availableSlots() as any)

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
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-navy">Hospitals</h2>
          <ul className="mt-3 list-disc pl-5 text-sm">
            {(hospitals as any)?.data?.hospitals?.slice(0,5)?.map((h: any) => (
              <li key={h._id}><Link href={`/hospitals/${h._id}` as any} className="text-primary">{h.name}</Link></li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-navy">Insurance Providers</h2>
          <ul className="mt-3 list-disc pl-5 text-sm">
            {(insurance as any)?.data?.insuranceProviders?.slice(0,5)?.map((i: any) => (
              <li key={i._id}>{i.name}</li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-navy">Next Slots</h2>
          <ul className="mt-3 list-disc pl-5 text-sm">
            {Array.isArray(slots) && slots.slice(0,5).map((s: any, idx: number) => (<li key={idx}>{s}</li>))}
          </ul>
        </div>
      </div>
    </AppShell>
  )
}

