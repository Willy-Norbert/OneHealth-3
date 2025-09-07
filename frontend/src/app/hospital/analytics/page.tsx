"use client"
import useSWR from 'swr'

export default function HospitalAnalyticsPage() {
  const { data } = useSWR('hospital-stats', () => apiFetch('/appointments/hospital-stats'))

  async function apiFetch(path: string) {
    const token = document.cookie.split('token=')[1]?.split(';')[0]
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${path}`, { headers: { Authorization: `Bearer ${token}` } })
    return res.json()
  }

  const stats = (data as any)?.data
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-navy">Hospital Analytics</h1>
      <div className="card p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Appointments (Total)" value={stats?.appointments?.total} />
          <Stat label="Appointments (Today)" value={stats?.appointments?.today} />
          <Stat label="Patients" value={stats?.patients} />
          <Stat label="Doctors" value={stats?.doctors} />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-1 text-xl font-semibold text-navy">{value ?? '-'}</div>
    </div>
  )
}

