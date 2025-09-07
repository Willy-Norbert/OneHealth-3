"use client"
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function MeetingsPage() {
  const { user } = useAuth()
  const { data } = useSWR(() => user ? `meetings-${user.id}` : null, () => api.meetings.user(user!.id) as any)
  return (
    <div className="card p-6">
      <h1 className="text-xl font-semibold text-navy">My Meetings</h1>
      <ul className="mt-3 space-y-3">
        {(data as any)?.data?.meetings?.map((m: any)=> (
          <li key={m._id} className="rounded border p-3">
            <div className="font-medium">{m.title || 'Consultation'}</div>
            <div className="text-sm text-slate-600">{new Date(m.startTime).toLocaleString()} — {m.status}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

