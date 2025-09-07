"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function DoctorDashboard() {
  const { data: appointments, mutate } = useSWR('myDoctorAppointments', () => api.appointments.myDoctor() as any)

  const reassign = async (appointmentId: string) => {
    const newDoctorId = prompt('Enter new doctor userId to reassign to:')
    if (!newDoctorId) return
    await api.appointments.reassign(appointmentId, { newDoctorId })
    mutate()
  }

  return (
    <AppShell
      menu={[
        { href: '/doctor', label: 'Overview' },
        { href: '/doctor/appointments', label: 'Appointments' },
        { href: '/doctor/meetings', label: 'Teleconsultations' },
        { href: '/doctor/prescriptions', label: 'Prescriptions' },
        { href: '/doctor/records', label: 'Medical Records' },
      ]}
    >
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-navy">My Appointments</h2>
        <div className="mt-4 divide-y">
          {(appointments as any)?.data?.appointments?.map((a: any) => (
            <div key={a._id} className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium">{a.patient?.name || a.patient?.email}</div>
                <div className="text-sm text-slate-600">{new Date(a.date).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>reassign(a._id)} className="rounded-md border px-3 py-1 text-sm">Reassign</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

