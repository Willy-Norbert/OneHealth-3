"use client"
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function HospitalDoctorsPage() {
  const { data } = useSWR('doctors-list', () => api.doctors.list() as any)
  return (
    <div className="card p-6">
      <h1 className="text-xl font-semibold text-navy">Doctors</h1>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {(data as any)?.data?.doctors?.map((d: any)=> (
          <div key={d._id} className="rounded border p-3">
            <div className="font-medium">{d.user?.name || d.user?.email}</div>
            <div className="text-sm text-slate-600">{d.specialization}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

