"use client"
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function DoctorPrescriptionsPage() {
  const { data } = useSWR('myAuthoredRx', () => api.prescriptions.myAuthored() as any)
  return (
    <div className="card p-6">
      <h1 className="text-xl font-semibold text-navy">My Prescriptions</h1>
      <ul className="mt-3 space-y-3">
        {(data as any)?.data?.prescriptions?.map((p: any)=> (
          <li key={p._id} className="rounded border p-3">
            <div className="font-medium">{p.diagnosis}</div>
            <div className="text-sm text-slate-600">Patient: {p.patient?.name || p.patient}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

