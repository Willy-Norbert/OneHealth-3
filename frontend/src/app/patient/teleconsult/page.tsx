"use client"
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function TeleconsultationFlow() {
  const { data: hospitals } = useSWR('hospitals', () => api.hospitals.list() as any)
  const { data: types } = useSWR('consultTypes', () => api.teleconsult.consultationTypes() as any)
  const { data: ins } = useSWR('consultInsurance', () => api.teleconsult.insuranceOptions() as any)
  const [state, setState] = useState({ hospital: '', consultationType: '', insurance: '', notes: '' })
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState<any>(null)

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await api.teleconsult.create(state as any)
      setCreated(res)
    } catch {}
    setCreating(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-navy">Teleconsultation</h1>
      <form onSubmit={create} className="card p-6 space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium">Hospital</label>
          <select className="mt-1 w-full rounded-lg border px-3 py-2" value={state.hospital} onChange={e=>setState({...state, hospital: e.target.value})} required>
            <option value="">Select hospital</option>
            {hospitals?.data?.hospitals?.map((h: any)=> <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Consultation type</label>
          <select className="mt-1 w-full rounded-lg border px-3 py-2" value={state.consultationType} onChange={e=>setState({...state, consultationType: e.target.value})} required>
            <option value="">Select type</option>
            {types?.data?.consultationTypes?.map((t: any)=> <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Insurance</label>
          <select className="mt-1 w-full rounded-lg border px-3 py-2" value={state.insurance} onChange={e=>setState({...state, insurance: e.target.value})}>
            <option value="">Self-pay</option>
            {ins?.data?.insuranceOptions?.map((i: any)=> <option key={i._id} value={i._id}>{i.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Notes</label>
          <textarea className="mt-1 w-full rounded-lg border px-3 py-2" value={state.notes} onChange={e=>setState({...state, notes: e.target.value})} />
        </div>
        <button className="btn-primary" disabled={creating}>{creating? 'Submitting...' : 'Create request'}</button>
      </form>
      {created && <pre className="card p-4 overflow-auto text-sm">{JSON.stringify(created, null, 2)}</pre>}
    </div>
  )
}

