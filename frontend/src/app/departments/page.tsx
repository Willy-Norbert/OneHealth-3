"use client"
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function DepartmentsPage() {
  const { data } = useSWR('departments-public', () => api.departments.list() as any)
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-navy">Departments</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(data as any)?.data?.departments?.map((d: any)=> (
          <li key={d._id} className="card p-4">
            <div className="font-medium">{d.name}</div>
            <div className="text-sm text-slate-600">{d.description}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

