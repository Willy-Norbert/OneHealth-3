"use client"
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function DoctorAppointmentsPage() {
  const { data, mutate } = useSWR('doctor-appts', () => api.appointments.myDoctor() as any)

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}` },
      body: JSON.stringify({ status })
    })
    mutate()
  }

  return (
    <div className="card p-6">
      <h1 className="text-xl font-semibold text-navy">Appointments</h1>
      <div className="mt-4 divide-y">
        {(data as any)?.data?.appointments?.map((a: any)=> (
          <div key={a._id} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{a.patient?.name}</div>
              <div className="text-sm text-slate-600">{new Date(a.appointmentDate).toLocaleDateString()} {a.appointmentTime} — {a.status}</div>
              {a.meeting?.link && <a href={a.meeting.link} className="text-primary text-sm">Join meeting</a>}
            </div>
            <div className="flex gap-2">
              <button onClick={()=>updateStatus(a._id,'confirmed')} className="rounded border px-3 py-1 text-sm">Accept</button>
              <button onClick={()=>updateStatus(a._id,'declined')} className="rounded border px-3 py-1 text-sm">Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

