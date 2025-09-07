"use client"
import useSWR from 'swr'

export default function HospitalAppointmentsPage() {
  const { data } = useSWR('hospital-appts', () => apiFetch('/appointments/hospital'))

  async function apiFetch(path: string) {
    const token = document.cookie.split('token=')[1]?.split(';')[0]
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${path}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
    return res.json()
  }

  return (
    <div className="card p-6">
      <h1 className="text-xl font-semibold text-navy">Hospital Appointments</h1>
      <div className="mt-4 divide-y">
        {(data as any)?.data?.appointments?.map((a: any)=> (
          <div key={a._id} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{a.patient?.name}</div>
              <div className="text-sm text-slate-600">{new Date(a.appointmentDate).toLocaleDateString()} {a.appointmentTime} — {a.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

