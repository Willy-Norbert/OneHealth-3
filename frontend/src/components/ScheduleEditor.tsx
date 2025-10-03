"use client"
import useSWR from 'swr'
import { useState } from 'react'

export default function ScheduleEditor({ doctorId, onDone }: { doctorId?: string; onDone?: ()=>void }) {
  const isHospital = !!doctorId
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  const token = require('js-cookie').get('token') || ''
  const { data, mutate, error: swrError } = useSWR(`${isHospital?'hosp':'doc'}-availability-${doctorId||'me'}`, async ()=>{
    const path = isHospital ? `/doctors/${doctorId}/availability` : '/doctors/availability'
    const res = await fetch(`${base}${path}`, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, credentials: 'include' })
    if (!res.ok) {
      let msg = 'Failed to load availability'
      try { const json = await res.json(); msg = json?.message || msg } catch {}
      throw new Error(msg)
    }
    return res.json()
  })

  const availability = (data as any)?.data?.availability || { weekdays: [], timeRanges: [], exceptions: [] }
  const locked = (data as any)?.data?.locked

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  async function save(next: any) {
    setErrorMsg(null)
    const path = isHospital ? `/doctors/${doctorId}/availability` : '/doctors/availability'
    // Always send all fields as arrays, and validate structure
    const normalized = {
      weekdays: Array.isArray(next?.weekdays) ? next.weekdays : [],
      timeRanges: Array.isArray(next?.timeRanges) ? next.timeRanges.map((t:any)=>({ start: String(t.start||'08:00'), end: String(t.end||'17:00') })) : [],
      exceptions: Array.isArray(next?.exceptions) ? next.exceptions.map((e:any)=>({ date: new Date(e.date).toISOString(), available: e.available===false?false:true })) : []
    }
    try {
      const res = await fetch(`${base}${path}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, credentials: 'include', body: JSON.stringify(normalized) })
      if (!res.ok) {
        let msg = 'Failed to save'
        try {
          const json = await res.json()
          msg = json?.data?.details?.join(', ') || json?.message || msg
        } catch {}
        setErrorMsg(msg)
        throw new Error(msg)
      }
      await mutate()
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save')
    }
  }

  async function setLock(locked: boolean) {
    if (!isHospital) return
    const res = await fetch(`${base}/doctors/${doctorId}/availability/lock`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, credentials: 'include', body: JSON.stringify({ locked }) })
    if (!res.ok) throw new Error('Failed to lock')
    await mutate()
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="alert alert-error text-sm">{errorMsg}</div>
      )}
      {swrError && (
        <div className="alert alert-error text-sm">{swrError.message.includes('Doctor profile not found') ? 'Your doctor profile is missing. Please contact admin.' : swrError.message}</div>
      )}
      {isHospital && (
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" className="checkbox" checked={!!locked} onChange={(e)=>setLock(e.target.checked)} />
            Lock doctor from editing availability
          </label>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Available weekdays</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
            <label key={d} className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="checkbox" checked={availability.weekdays?.includes(d)} onChange={(e)=>{
                const next = { ...availability, weekdays: e.target.checked ? [...(availability.weekdays||[]), d] : (availability.weekdays||[]).filter((x:string)=>x!==d) }
                save(next)
              }} /> {d}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Exceptions (mark date unavailable)</label>
        <div className="flex items-center gap-2">
          <input type="date" className="input" onChange={async (e)=>{
            if (!e.target.value) return
            const date = new Date(e.target.value)
            const exists = (availability.exceptions||[]).find((x:any)=> new Date(x.date).toDateString() === date.toDateString())
            const next = { ...availability, exceptions: exists ? availability.exceptions : [ ...(availability.exceptions||[]), { date, available: false } ] }
            await save(next)
          }} />
        </div>
        <div className="mt-3 space-y-2">
          {(availability.exceptions||[]).map((ex:any, idx:number) => (
            <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
              <span>{new Date(ex.date).toDateString()} — {ex.available===false ? 'Unavailable' : 'Available'}</span>
              <div className="flex items-center gap-2">
                <button className="btn-outline btn-xs" onClick={async ()=>{
                  const next = { ...availability, exceptions: (availability.exceptions||[]).filter((_:any,i:number)=>i!==idx) }
                  await save(next)
                }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {onDone && (<div className="text-right"><button className="btn-primary" onClick={onDone}>Done</button></div>)}
    </div>
  )
}






