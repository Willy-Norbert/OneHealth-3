"use client"
import { useEffect, useState } from 'react'

export default function EmergencyPage() {
  const [coords, setCoords] = useState<{lat:number,lng:number}|null>(null)
  const [desc, setDesc] = useState('')
  const [severity, setSeverity] = useState('moderate')
  const [submitted, setSubmitted] = useState<any>(null)

  useEffect(()=>{
    navigator.geolocation?.getCurrentPosition((pos)=> setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }))
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = document.cookie.split('token=')[1]?.split(';')[0]
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/emergencies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ emergencyType: 'medical', severity, quickCareType: 'ambulance', description: desc, location: { coordinates: coords } })
    })
    setSubmitted(await res.json())
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-navy">Emergency</h1>
      <form onSubmit={submit} className="card p-6 max-w-xl space-y-3">
        <div className="text-sm">Location: {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'detecting...'}</div>
        <label className="block text-sm font-medium">Severity</label>
        <select value={severity} onChange={e=>setSeverity(e.target.value)} className="rounded border px-3 py-2 w-full">
          <option value="mild">mild</option>
          <option value="moderate">moderate</option>
          <option value="severe">severe</option>
          <option value="critical">critical</option>
        </select>
        <label className="block text-sm font-medium">Description</label>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} className="rounded border px-3 py-2 w-full" />
        <button className="btn-primary w-fit">Send request</button>
      </form>
      {submitted && <pre className="card p-4 overflow-auto text-sm">{JSON.stringify(submitted, null, 2)}</pre>}
    </div>
  )
}

