"use client"
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function PharmacyPage() {
  const { data: pharmacies } = useSWR('pharmacies', () => api.pharmacy.list() as any)
  const [file, setFile] = useState<File | null>(null)
  const [uploadRes, setUploadRes] = useState<any>(null)

  const upload = async () => {
    if (!file) return
    const res = await api.uploads.image(file)
    setUploadRes(res)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-navy">Pharmacy</h1>
      <div className="card p-6">
        <h2 className="font-semibold">Nearby Pharmacies</h2>
        <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          {(pharmacies as any)?.data?.pharmacies?.map((p: any)=> (
            <li key={p._id} className="rounded border p-3">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-slate-600">{p.location?.address}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="card p-6 max-w-xl space-y-3">
        <h2 className="font-semibold">Upload Prescription</h2>
        <input type="file" onChange={e=> setFile(e.target.files?.[0] || null)} />
        <button onClick={upload} className="btn-primary w-fit">Upload</button>
        {uploadRes && <pre className="overflow-auto text-sm">{JSON.stringify(uploadRes, null, 2)}</pre>}
      </div>
    </div>
  )
}

