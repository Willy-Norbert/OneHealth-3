"use client"
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function InsuranceAdminPage() {
  const { data } = useSWR('insurance-admin', () => api.insurance.list() as any)
  return (
    <div className="card p-6">
      <h1 className="text-xl font-semibold text-navy">Insurance Providers</h1>
      <ul className="mt-3 list-disc pl-5 text-sm">
        {(data as any)?.data?.insuranceProviders?.map((i: any)=> <li key={i._id}>{i.name}</li>)}
      </ul>
    </div>
  )
}

