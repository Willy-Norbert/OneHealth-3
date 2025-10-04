"use client"
import useSWR from 'swr'

export default function AdminHospitalsPage() {
  const { data, mutate } = useSWR('admin-hospitals', () => apiFetch('/hospitals?approved=false'))

  async function apiFetch(path: string, init?: RequestInit) {
    const token = document.cookie.split('token=')[1]?.split(';')[0]
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${path}`, { ...init, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } })
    return res.json()
  }
  const approve = async (id: string, isApproved: boolean) => {
    await apiFetch(`/hospitals/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ isApproved }) })
    mutate()
  }

  return (
    <div className="card p-6">
      <h1 className="text-xl font-semibold text-navy">Pending Hospitals</h1>
      <ul className="mt-3 space-y-3">
        {(data as any)?.data?.hospitals?.map((h: any)=> (
          <li key={h._id} className="rounded border p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{h.name}</div>
              <div className="text-sm text-slate-600">{h.location}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>approve(h._id, true)} className="btn-primary">Approve</button>
              <button onClick={()=>approve(h._id, false)} className="rounded border px-3 py-1 text-sm">Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

