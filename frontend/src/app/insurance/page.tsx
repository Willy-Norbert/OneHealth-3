"use client"
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function InsurancePage() {
  const { data } = useSWR('insurance-public', () => api.insurance.list() as any)
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-navy">Insurance Providers</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(data as any)?.data?.insuranceProviders?.map((i: any)=> (
          <li key={i._id} className="card p-4">
            <div className="font-medium">{i.name}</div>
            <div className="text-sm text-slate-600">{i.type}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

