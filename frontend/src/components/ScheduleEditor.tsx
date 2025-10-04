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

  // Enhanced data extraction with better defaults - all weekdays available by default
  const availability = (data as any)?.data?.availability || { 
    weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 
    timeRanges: [{ start: '08:00', end: '17:00' }], 
    exceptions: [] 
  }
  const locked = (data as any)?.data?.locked
  const doctorProfileExists = (data as any)?.data?.doctorProfileExists
  const doctorInfo = (data as any)?.data?.doctor

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [showDateForm, setShowDateForm] = useState(false)
  const [dateReason, setDateReason] = useState<string>('')
  const [dateAvailability, setDateAvailability] = useState<boolean>(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

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
    setSuccessMsg(null)
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
      setSuccessMsg('Availability settings updated successfully!')
      await mutate()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(null), 3000)
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
      {/* Success message display */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{successMsg}</p>
            </div>
          </div>
        </div>
      )}

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

      {/* Hospital admin controls */}
      {isHospital && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-800 font-medium">Hospital Admin View</p>
                <p className="text-xs text-amber-600">You can override doctor's availability settings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`btn btn-sm ${locked ? 'btn-warning' : 'btn-outline'}`}
                onClick={async () => {
                  try {
                    await setLock(!locked)
                    setErrorMsg(null)
                  } catch (error) {
                    setErrorMsg('Failed to update lock status')
                  }
                }}
              >
                {locked ? 'Unlock' : 'Lock'} Availability
              </button>
            </div>
          </div>
          {locked && (
            <div className="mt-3 p-3 bg-amber-100 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Availability is locked.</strong> The doctor cannot modify their availability settings. 
                Only hospital administrators can make changes.
              </p>
            </div>
          )}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available weekdays
          {locked && <span className="text-red-500 ml-2">(Locked by admin)</span>}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
            <label key={d} className={`flex items-center gap-2 text-sm p-2 rounded ${
              locked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-gray-50'
            }`}>
              <input 
                type="checkbox" 
                className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${
                  locked ? 'cursor-not-allowed' : ''
                }`}
                checked={availability.weekdays?.includes(d) || false} 
                disabled={locked}
                onChange={async (e)=>{
                  if (locked) return
                  const currentWeekdays = availability.weekdays || []
                  const next = { 
                    ...availability, 
                    weekdays: e.target.checked 
                      ? [...currentWeekdays, d] 
                      : currentWeekdays.filter((x:string) => x !== d) 
                  }
                  await save(next)
                }} 
              /> 
              <span className={`text-sm font-medium ${locked ? 'text-gray-500' : ''}`}>{d}</span>
            </label>
          ))}
        </div>
        {availability.weekdays?.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Selected: {availability.weekdays.join(', ')}
          </p>
        )}
        {locked && (
          <p className="text-xs text-red-500 mt-2">
            ⚠️ Weekday availability is locked by hospital administration. Only admins can modify these settings.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date Exceptions
          {locked && <span className="text-red-500 ml-2">(Locked by admin)</span>}
        </label>
        <p className="text-xs text-gray-500 mb-3">Mark specific dates as unavailable or available with reason</p>
        
        <div className="flex items-center gap-3 mb-4">
          <input 
            type="date" 
            className="input flex-1" 
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={locked}
          />
          <button 
            type="button"
            className="btn btn-sm"
            onClick={() => {
              if (locked) return
              if (!selectedDate) {
                setErrorMsg('Please select a date first')
                return
              }
              const date = new Date(selectedDate)
              const exists = (availability.exceptions||[]).find((x:any)=> new Date(x.date).toDateString() === date.toDateString())
              if (exists) {
                setErrorMsg('This date is already marked as an exception')
                return
              }
              setShowDateForm(true)
            }}
            disabled={locked}
          >
            Add Exception
          </button>
        </div>

        {/* Date Form Modal */}
        {showDateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Add Date Exception</h3>
              <p className="text-sm text-gray-600 mb-4">
                Date: {selectedDate ? new Date(selectedDate).toLocaleDateString() : ''}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="availability" 
                        value="available"
                        checked={dateAvailability === true}
                        onChange={() => setDateAvailability(true)}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-sm">Available</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="availability" 
                        value="unavailable"
                        checked={dateAvailability === false}
                        onChange={() => setDateAvailability(false)}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-sm">Unavailable</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                  <textarea
                    value={dateReason}
                    onChange={(e) => setDateReason(e.target.value)}
                    placeholder="Enter reason for this exception..."
                    className="input w-full h-20 resize-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  className="btn-outline flex-1"
                  onClick={() => {
                    setShowDateForm(false)
                    setSelectedDate('')
                    setDateReason('')
                    setDateAvailability(false)
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary flex-1"
                  onClick={async () => {
                    if (!dateReason.trim()) {
                      setErrorMsg('Please provide a reason')
                      return
                    }
                    
                    const date = new Date(selectedDate)
                    const next = { 
                      ...availability, 
                      exceptions: [ 
                        ...(availability.exceptions||[]), 
                        { 
                          date, 
                          available: dateAvailability,
                          reason: dateReason.trim()
                        } 
                      ] 
                    }
                    await save(next)
                    
                    setShowDateForm(false)
                    setSelectedDate('')
                    setDateReason('')
                    setDateAvailability(false)
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          {(availability.exceptions||[]).length === 0 ? (
            <p className="text-sm text-gray-500 italic">No date exceptions set</p>
          ) : (
            (availability.exceptions||[]).map((ex:any, idx:number) => (
              <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium">{new Date(ex.date).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ex.available === false 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {ex.available === false ? 'Unavailable' : 'Available'}
                    </span>
                  </div>
                  {ex.reason && (
                    <p className="text-xs text-gray-600 italic">"{ex.reason}"</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="btn-outline btn-xs text-red-600 hover:bg-red-50" 
                    onClick={async ()=>{
                      if (locked && !isHospital) return
                      const next = { ...availability, exceptions: (availability.exceptions||[]).filter((_:any,i:number)=>i!==idx) }
                      await save(next)
                    }}
                    disabled={locked && !isHospital}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {locked && (
          <p className="text-xs text-red-500 mt-2">
            ⚠️ Date exceptions are locked by hospital administration. Only admins can modify these settings.
          </p>
        )}
      </div>

      {/* Calendar View */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Calendar View</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const prevMonth = new Date(currentMonth)
                prevMonth.setMonth(prevMonth.getMonth() - 1)
                setCurrentMonth(prevMonth)
              }}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={locked}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => {
                const nextMonth = new Date(currentMonth)
                nextMonth.setMonth(nextMonth.getMonth() + 1)
                setCurrentMonth(nextMonth)
              }}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={locked}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              Today
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-3">View your availability schedule for the selected month</p>
        
        <div className="bg-white border rounded-lg p-4">
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 42 }, (_, i) => {
              const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
              const startDate = new Date(firstDay)
              startDate.setDate(startDate.getDate() - firstDay.getDay() + i)
              
              const isCurrentMonth = startDate.getMonth() === currentMonth.getMonth()
              const isToday = startDate.toDateString() === new Date().toDateString()
              const isException = (availability.exceptions || []).find((ex: any) => 
                new Date(ex.date).toDateString() === startDate.toDateString()
              )
              const weekdayName = startDate.toLocaleDateString('en-US', { weekday: 'long' })
              const isWeekdayAvailable = availability.weekdays?.includes(weekdayName)
              
              return (
                <div
                  key={i}
                  className={`p-2 text-center text-xs rounded cursor-pointer hover:bg-gray-100 ${
                    !isCurrentMonth 
                      ? 'text-gray-300' 
                      : isToday 
                        ? 'bg-blue-100 text-blue-800 font-semibold' 
                        : isException
                          ? isException.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          : isWeekdayAvailable
                            ? 'bg-gray-50 text-gray-700'
                            : 'bg-gray-200 text-gray-500'
                  }`}
                  onClick={() => {
                    if (locked || !isCurrentMonth) return
                    setSelectedDate(startDate.toISOString().split('T')[0])
                    setDateAvailability(!isWeekdayAvailable)
                    setShowDateForm(true)
                  }}
                  title={isCurrentMonth ? `${startDate.toLocaleDateString()} - ${weekdayName} - ${isWeekdayAvailable ? 'Available' : 'Unavailable'}` : ''}
                >
                  {startDate.getDate()}
                  {isException && (
                    <div className="text-xs mt-1">
                      {isException.available ? '✓' : '✗'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-50 border rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <span>Unavailable</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 rounded"></div>
              <span>Exception Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 rounded"></div>
              <span>Exception Unavailable</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 rounded"></div>
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {saving && (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Saving changes...</span>
            </>
          )}
        </div>
        {onDone && (
          <button 
            className="btn-primary" 
            onClick={onDone}
            disabled={saving}
          >
            Done
          </button>
        )}
      </div>
    </div>
  )
}






