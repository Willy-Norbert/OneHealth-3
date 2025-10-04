"use client"
import useSWR from 'swr'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'

export default function ScheduleEditor({ doctorId, onDone }: { doctorId?: string; onDone?: ()=>void }) {
  const isHospital = !!doctorId
  
  const { data, mutate, error: swrError, isLoading } = useSWR(
    `${isHospital?'hosp':'doc'}-availability-${doctorId||'me'}`, 
    async () => {
      const path = isHospital ? `/doctors/${doctorId}/availability` : '/doctors/availability'
      
      try {
        const result = await apiFetch(path, { auth: true })
        console.log('Availability data loaded successfully:', result)
        return result
      } catch (fetchError) {
        console.error('Fetch error in ScheduleEditor:', fetchError)
        throw fetchError
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 1000
    }
  )

  // Enhanced data extraction with better defaults
  const availability = (data as any)?.data?.availability || { 
    weekdays: [], 
    timeRanges: [{ start: '08:00', end: '17:00' }], 
    exceptions: [] 
  }
  const locked = (data as any)?.data?.locked
  const doctorProfileExists = (data as any)?.data?.doctorProfileExists
  const doctorInfo = (data as any)?.data?.doctor

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading availability...</span>
        </div>
      </div>
    )
  }

  async function save(next: any) {
    setErrorMsg(null)
    setSaving(true)
    
    const path = isHospital ? `/doctors/${doctorId}/availability` : '/doctors/availability'
    
    // Enhanced data normalization with validation
    const normalized = {
      weekdays: Array.isArray(next?.weekdays) ? next.weekdays : [],
      timeRanges: Array.isArray(next?.timeRanges) ? next.timeRanges.map((t:any) => ({
        start: String(t.start || '08:00'),
        end: String(t.end || '17:00')
      })) : [{ start: '08:00', end: '17:00' }],
      exceptions: Array.isArray(next?.exceptions) ? next.exceptions.map((e:any) => ({
        date: new Date(e.date).toISOString(),
        available: e.available === false ? false : true
      })) : []
    }

    try {
      const result = await apiFetch(path, {
        method: 'PUT',
        body: JSON.stringify(normalized),
        auth: true
      })
      
      console.log('Availability saved successfully:', result)
      await mutate()
    } catch (err: any) {
      console.error('Save error:', err)
      let errorMsg = err?.message || 'Failed to save availability'
      
      // Handle specific error cases
      if (errorMsg.includes('404')) {
        errorMsg = 'Doctor profile not found. Please contact admin to create your profile.'
      } else if (errorMsg.includes('423')) {
        errorMsg = 'Availability is locked by hospital administration.'
      } else if (errorMsg.includes('400')) {
        errorMsg = 'Invalid data provided'
      }
      
      setErrorMsg(errorMsg)
    } finally {
      setSaving(false)
    }
  }

  async function setLock(locked: boolean) {
    if (!isHospital) return
    try {
      await apiFetch(`/doctors/${doctorId}/availability/lock`, {
        method: 'PUT',
        body: JSON.stringify({ locked }),
        auth: true
      })
      await mutate()
    } catch (error) {
      console.error('Failed to lock availability:', error)
      throw new Error('Failed to lock availability')
    }
  }

  return (
    <div className="space-y-4">
      {/* Enhanced error display */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{errorMsg}</p>
            </div>
          </div>
        </div>
      )}
      
      {swrError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">
                {swrError.message.includes('Doctor profile not found') 
                  ? 'Your doctor profile is missing. Please contact admin to create your profile.' 
                  : swrError.message}
              </p>
              {swrError.status === 404 && (
                <p className="text-xs text-red-600 mt-1">
                  This usually means your doctor account hasn't been properly set up yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Doctor info display */}
      {doctorInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                Managing availability for <strong>{doctorInfo.name}</strong>
                {doctorInfo.hospital && ` at ${doctorInfo.hospital}`}
                {doctorInfo.department && ` (${doctorInfo.department})`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lock status for hospital users */}
      {isHospital && (
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input 
              type="checkbox" 
              className="checkbox" 
              checked={!!locked} 
              onChange={(e) => setLock(e.target.checked)}
              disabled={saving}
            />
            Lock doctor from editing availability
          </label>
          {locked && (
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
              Doctor cannot modify availability
            </span>
          )}
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






