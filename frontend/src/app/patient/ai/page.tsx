"use client"
import { useState } from 'react'
import { api } from '@/lib/api'

export default function AIPage() {
  const [symptoms, setSymptoms] = useState('')
  const [response, setResponse] = useState<any>(null)

  const run = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await api.ai.symptomChecker({ symptoms: symptoms.split(',').map(s=>s.trim()), severity: 'mild', duration: '2d', age: 30 })
    setResponse(res)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-navy">AI Assistant</h1>
      <form onSubmit={run} className="card p-6 space-y-4 max-w-2xl">
        <label className="block text-sm font-medium">Symptoms (comma separated)</label>
        <input className="w-full rounded border px-3 py-2" value={symptoms} onChange={e=>setSymptoms(e.target.value)} />
        <button className="btn-primary w-fit">Analyze</button>
      </form>
      {response && <pre className="card p-4 overflow-auto text-sm">{JSON.stringify(response, null, 2)}</pre>}
    </div>
  )
}

