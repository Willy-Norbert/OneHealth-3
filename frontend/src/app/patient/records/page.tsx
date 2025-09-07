"use client"
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function RecordsPage() {
  const { user } = useAuth()
  const { data } = useSWR(() => user ? `records-${user.id}` : null, () => apiFetch(`/medical-records/patients/${user!.id}`))

  async function apiFetch(path: string) {
    const token = document.cookie.split('token=')[1]?.split(';')[0]
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${path}`, { headers: { Authorization: `Bearer ${token}` } })
    return res.json()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-navy">Medical Records</h1>
      <div className="card p-6">
        {(data as any)?.data?.history?.length ? (
          <ul className="space-y-3">
            {(data as any).data.history.map((r: any)=> (
              <li key={r._id} className="rounded border p-3">
                <div className="font-medium">{r.diagnosis}</div>
                <div className="text-sm text-slate-600">{new Date(r.date).toLocaleDateString()} — {r.doctor?.name}</div>
              </li>
            ))}
          </ul>
        ) : <div className="text-sm text-slate-600">No records yet.</div>}
      </div>
    </div>
  )
}

