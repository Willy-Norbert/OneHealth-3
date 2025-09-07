"use client"
import useSWR from 'swr'
import Cookies from 'js-cookie'

async function fetcher(path: string) {
  const token = Cookies.get('token')
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: 'no-store'
  })
  return res.json()
}

export default function HospitalPatientsPage() {
  const { data: myHospital } = useSWR('/hospitals/me', fetcher)
  const hospitalId = (myHospital as any)?.data?.hospital?._id
  const { data } = useSWR(() => hospitalId ? `/patients/hospital/${hospitalId}` : null, fetcher)

  return (
    <div className="card p-6">
      <h1 className="text-xl font-semibold text-navy">Hospital Patients</h1>
      <div className="mt-4 divide-y">
        {(data as any)?.data?.patients?.map((p: any)=> (
          <div key={p._id} className="py-3">
            <div className="font-medium">{p.user?.name || p.user?.email}</div>
            <div className="text-sm text-slate-600">Visits: {p.visitedHospitals?.reduce((acc: number, v: any)=> acc + (v.totalVisits||0), 0) || 0}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

