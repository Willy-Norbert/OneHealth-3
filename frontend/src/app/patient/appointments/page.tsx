"use client"
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function AppointmentsPage() {
  const { data: hospitals } = useSWR('hospitals', () => api.hospitals.list() as any)
  const { data: myAppointments, mutate } = useSWR('myAppointments', () => api.appointments.my() as any)
  const [form, setForm] = useState<any>({ hospital: '', department: '', appointmentType: 'virtual', appointmentDate: '', appointmentTime: '', reasonForVisit: '' })
  const [departments, setDepartments] = useState<any[]>([])
  const [slots, setSlots] = useState<string[]>([])
  const [result, setResult] = useState<any>(null)

  const loadDepartments = async (hospitalId: string) => {
    const res = await api.departments.byHospital(hospitalId) as any
    setDepartments(res?.data?.departments || [])
  }

  const loadSlots = async () => {
    if (!form.hospital || !form.department || !form.appointmentDate) return
    const q = new URLSearchParams({ date: form.appointmentDate, hospital: form.hospital, department: form.department })
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/appointments/available-slots?${q.toString()}`, { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' })
    const json = await res.json()
    setSlots(json?.data?.availableSlots || [])
  }

  

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      patientDetails: { fullName: 'Current User', email: 'user@example.com', phoneNumber: '000', age: 30, gender: 'Male' },
    }
    const res = await api.appointments.create(payload as any)
    setResult(res)
    mutate()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-navy">Book Appointment</h1>
      <form onSubmit={submit} className="card p-6 space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm">Hospital</label>
          <select className="mt-1 w-full rounded border px-3 py-2" value={form.hospital} onChange={e=>{ setForm({ ...form, hospital: e.target.value }); loadDepartments(e.target.value) }} required>
            <option value="">Select</option>
            {(hospitals as any)?.data?.hospitals?.map((h: any)=> <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm">Department</label>
          <select className="mt-1 w-full rounded border px-3 py-2" value={form.department} onChange={e=> setForm({ ...form, department: e.target.value })} required>
            <option value="">Select</option>
            {departments.map((d)=> <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Date</label>
            <input type="date" className="mt-1 w-full rounded border px-3 py-2" value={form.appointmentDate} onChange={e=> setForm({ ...form, appointmentDate: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm">Time</label>
            <select className="mt-1 w-full rounded border px-3 py-2" value={form.appointmentTime} onChange={e=> setForm({ ...form, appointmentTime: e.target.value })} required>
              <option value="">Select</option>
              {slots.map((s)=> <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <button type="button" onClick={loadSlots} className="rounded border px-3 py-2 text-sm">Load available slots</button>
        </div>
        <div>
          <label className="block text-sm">Reason</label>
          <textarea className="mt-1 w-full rounded border px-3 py-2" value={form.reasonForVisit} onChange={e=> setForm({ ...form, reasonForVisit: e.target.value })} required />
        </div>
        <button className="btn-primary">Book appointment</button>
      </form>
      {result && <pre className="card p-4 overflow-auto text-sm">{JSON.stringify(result, null, 2)}</pre>}
      <div className="card p-6">
        <h2 className="font-semibold text-navy">My Appointments</h2>
        <ul className="mt-3 divide-y">
          {(myAppointments as any)?.data?.appointments?.map((a: any)=> (
            <li key={a._id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{a.hospital?.name} — {a.department?.name}</div>
                <div className="text-sm text-slate-600">{new Date(a.appointmentDate).toLocaleDateString()} {a.appointmentTime} — {a.status}</div>
                {a.meeting?.link && <a href={a.meeting.link} className="text-primary text-sm">Join meeting</a>}
              </div>
              <div className="flex gap-2">
                {a.paymentStatus !== 'paid' && <PayButton appointmentId={a._id} />}
                <button onClick={async()=>{ await api.appointments.cancel(a._id); mutate() }} className="rounded border px-3 py-1 text-sm">Cancel</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PayButton({ appointmentId }: { appointmentId: string }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string|undefined>()
  const checkout = async () => {
    setLoading(true)
    try {
      const res = await api.payments.checkout({ appointmentId, provider: 'DEV_FAKE' }) as any
      const paymentId = (res as any)?.data?.payment?._id
      // simulate redirect/return then verify
      const verify = await api.payments.verify({ paymentId }) as any
      setStatus(verify?.data?.payment?.status)
    } finally { setLoading(false) }
  }
  return <button onClick={checkout} disabled={loading} className="btn-primary">{status || (loading? 'Processing...' : 'Pay now')}</button>
}

