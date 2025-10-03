"use client"
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function SpecialistsPage() {
  const { data } = useSWR('doctors-public', () => api.doctors.list() as any)
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-navy">Specialists</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(data as any)?.data?.doctors?.map((d: any)=> (
          <li key={d._id} className="card p-4">
            <div className="font-medium">{d.user?.name || d.user?.email}</div>
            <div className="text-sm text-slate-600">{d.specialization}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

