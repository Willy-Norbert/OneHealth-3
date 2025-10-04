"use client"
import { AppShell } from '@/components/layout/AppShell'
import React, { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { api, apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import HealthSpinner from '@/components/ui/HealthSpinner'

export default function EmergencyPage() {
  const [coords, setCoords] = useState<{lat:number,lng:number}|null>(null)
  const [ambulanceCoords, setAmbulanceCoords] = useState<{lat:number,lng:number}|null>(null)
  const [address, setAddress] = useState('')
  const [desc, setDesc] = useState('')
  const [severity, setSeverity] = useState('moderate')
  const [emergencyType, setEmergencyType] = useState('medical')
  const [quickCareType, setQuickCareType] = useState<'ambulance'|'doctor-on-call'|'nurse-on-call'|'medication-delivery'|'telemedicine'>('ambulance')
  const { user } = useAuth()
  const [phone, setPhone] = useState<string>(user?.phone || '')
  const [submitted, setSubmitted] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [hospitalPins, setHospitalPins] = useState<any[]>([])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setCoords(newCoords)
          // Seed a mock ambulance 2km away to demonstrate routing
          setAmbulanceCoords({ lat: newCoords.lat + 0.018, lng: newCoords.lng + 0.018 })
          // Reverse geocoding to get address
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${newCoords.lat}&longitude=${newCoords.lng}&localityLanguage=en`)
            .then(res => res.json())
            .then(data => {
              setAddress(`${data.locality}, ${data.principalSubdivision}, ${data.countryName}`)
            })
            .catch(() => setAddress(`${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)}`))
        },
        (error) => {
          console.error('Geolocation error:', error)
          setAddress('Location access denied')
        }
      )
    } else {
      setAddress('Geolocation not supported')
    }
  }, [])

  // Lazy-load map components to avoid SSR issues
  const MapContainer = useMemo(() => dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false }), [])
  const TileLayer = useMemo(() => dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false }), [])
  const Marker = useMemo(() => dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false }), [])
  const Polyline = useMemo(() => dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false }), [])
  const Tooltip = useMemo(() => dynamic(() => import('react-leaflet').then(m => m.Tooltip), { ssr: false }), [])
  const CircleMarker = useMemo(() => dynamic(() => import('react-leaflet').then(m => m.CircleMarker), { ssr: false }), [])

  const etaMinutes = useMemo(() => {
    if (!coords || !ambulanceCoords) return null
    // Haversine distance approx and simple ETA at 40 km/h
    const R = 6371
    const toRad = (d:number)=>d*Math.PI/180
    const dLat = toRad(ambulanceCoords.lat - coords.lat)
    const dLng = toRad(ambulanceCoords.lng - coords.lng)
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(coords.lat))*Math.cos(toRad(ambulanceCoords.lat))*Math.sin(dLng/2)**2
    const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const km = R*c
    const minutes = Math.round((km/40)*60)
    return Math.max(1, minutes)
  }, [coords, ambulanceCoords])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!coords) throw new Error('Location required')
      const result = await api.emergencies.create({
        emergencyType,
        severity,
        quickCareType,
        description: desc,
        contactInfo: { primaryPhone: phone },
        location: { address, coordinates: { latitude: coords.lat, longitude: coords.lng } }
      })
      setSubmitted(result)
    } catch (error) {
      console.error('Emergency submission error:', error)
      setSubmitted({ error: 'Failed to submit emergency request. Please try again or call emergency services directly.' })
    } finally {
      setLoading(false)
    }
  }

  const findHospitals = async () => {
    if (!coords) return
    try {
      const data: any = await api.hospitals.list()
      const hospitals = data?.data?.hospitals || []
      const geocoded: any[] = []
      for (const h of hospitals.slice(0, 15)) {
        const q = encodeURIComponent(`${h.address || ''} ${h.location || ''}`.trim())
        if (!q) continue
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}`)
          const j = await r.json()
          if (j && j[0]) {
            geocoded.push({
              id: h._id,
              name: h.name,
              phone: h.contact?.phone,
              email: h.contact?.email,
              address: h.address,
              lat: parseFloat(j[0].lat),
              lng: parseFloat(j[0].lon)
            })
          }
        } catch {}
      }
      setHospitalPins(geocoded)
    } catch (e) {
      console.error('Find hospitals error:', e)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'severe': return 'text-orange-600 bg-orange-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'mild': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const emergencyTypes = [
    { value: 'medical', label: 'Medical Emergency', icon: '🏥' },
    { value: 'accident', label: 'Accident or Injury', icon: '🚗' },
    { value: 'maternal', label: 'Maternal Emergency', icon: '🧑‍🍼' },
    { value: 'respiratory', label: 'Breathing Issue', icon: '🫁' },
    { value: 'mental-health', label: 'Mental Health Crisis', icon: '🧠' },
    { value: 'covid', label: 'COVID-19 / Coronavirus', icon: '🦠' }
  ]

  return (
    <AppShell
      menu={[
        { href: '/patient', label: 'Overview' },
        { href: '/patient/appointments', label: 'Appointments' },
        { href: '/patient/teleconsult', label: 'Teleconsultation' },
        { href: '/patient/pharmacy', label: 'Pharmacy' },
        { href: '/patient/prescriptions', label: 'Prescriptions' },
        { href: '/patient/payments', label: 'Payments' },
        { href: '/patient/ai', label: 'AI Assistant' },
        { href: '/patient/emergency', label: 'Emergency' },
        { href: '/patient/records', label: 'Medical Records' },
        { href: '/patient/orders', label: 'My Orders' },
        { href: '/patient/profile', label: 'Profile' },
      ]}
    >
      <div className="space-y-8">
        {/* Emergency Alert Banner */}
        <div className="card p-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Emergency Services</h1>
              <p className="text-red-100 mt-2">Get immediate medical assistance when you need it most</p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Emergency</h3>
            <p className="text-sm text-gray-500 mb-4">For immediate life-threatening emergencies</p>
            <a href="tel:911" className="btn-danger w-full">
              Call 911
            </a>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Nearest Hospital</h3>
            <p className="text-sm text-gray-500 mb-4">Locate the closest medical facility</p>
            <button className="btn-primary w-full" onClick={findHospitals}>
              Find Hospitals
            </button>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Doctor</h3>
            <p className="text-sm text-gray-500 mb-4">Reach your primary care physician</p>
            <button className="btn-success w-full">
              Contact Doctor
            </button>
          </div>
        </div>

        {/* Emergency Request Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Emergency Request</h3>
            <p className="text-sm text-gray-500">Submit an emergency request for medical assistance</p>
          </div>
          <div className="card-body">
            <form onSubmit={submit} className="space-y-6">
              {/* Location */}
              <div className="form-group">
                <label className="form-label">Current Location</label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12z" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {address || 'Detecting location...'}
                  </span>
                  {coords && (
                    <span className="text-xs text-gray-400">
                      ({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})
                    </span>
                  )}
                </div>
              </div>

              {/* Emergency Type */}
              <div className="form-group">
                <label className="form-label">Emergency Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {emergencyTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setEmergencyType(type.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        emergencyType === type.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-sm font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Care Type */}
              <div className="form-group">
                <label className="form-label">Quick Care Needed</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { value: 'ambulance', label: 'Ambulance Dispatch' },
                    { value: 'doctor-on-call', label: 'Doctor on Call' },
                    { value: 'nurse-on-call', label: 'Nurse on Call' },
                    { value: 'medication-delivery', label: 'Emergency Meds Delivery' },
                    { value: 'telemedicine', label: 'Telemedicine' }
                  ].map((q: any) => (
                    <button
                      key={q.value}
                      type="button"
                      onClick={() => setQuickCareType(q.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        quickCareType === q.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium">{q.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div className="form-group">
                <label className="form-label">Severity Level</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'mild', label: 'Mild', color: 'green' },
                    { value: 'moderate', label: 'Moderate', color: 'yellow' },
                    { value: 'severe', label: 'Severe', color: 'orange' },
                    { value: 'critical', label: 'Critical', color: 'red' }
                  ].map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setSeverity(level.value)}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        severity === level.value
                          ? `border-${level.color}-500 bg-${level.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`text-sm font-medium ${
                        severity === level.value ? `text-${level.color}-700` : 'text-gray-700'
                      }`}>
                        {level.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Emergency Description</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Describe the emergency situation, symptoms, or what happened..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  required
                />
              </div>

              {/* Contact Phone */}
              <div className="form-group">
                <label className="form-label">Your Phone Number</label>
                <input
                  className="input"
                  type="tel"
                  placeholder="e.g., +2507..."
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <p>⚠️ This will alert emergency services and nearby hospitals</p>
                  <p>📞 For immediate life-threatening emergencies, call 911 directly</p>
                </div>
                <button
                  type="submit"
                  disabled={loading || !coords}
                  className="btn-primary"
                >
                  {loading ? (
                      <HealthSpinner />
                  ) : (
                    'Submit Emergency Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Emergency Map</h3>
            <p className="text-sm text-gray-500">Live view of your location and incoming ambulance route{etaMinutes?` • ETA ${etaMinutes} min`:''}</p>
          </div>
          <div className="card-body">
            {coords ? (
              <div className="h-96 rounded-lg overflow-hidden">
                <MapContainer center={[coords.lat, coords.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                  <Marker position={[coords.lat, coords.lng]}>{Tooltip ? <Tooltip>My Location</Tooltip> : null}</Marker>
                  {ambulanceCoords && <Marker position={[ambulanceCoords.lat, ambulanceCoords.lng]} />}
                  {ambulanceCoords && (
                    <Polyline positions={[[ambulanceCoords.lat, ambulanceCoords.lng],[coords.lat, coords.lng]]} color="#ef4444" />
                  )}
                  {hospitalPins.map((h:any) => (
                    <CircleMarker key={h.id} center={[h.lat, h.lng]} pathOptions={{ color: '#2563eb' }} radius={12}>
                      {Tooltip ? (
                        <Tooltip direction="top" opacity={1} permanent={false}>
                          <div className="text-xs">
                            <div className="font-semibold">{h.name}</div>
                            <div>{h.address}</div>
                            <div>{h.phone}</div>
                          </div>
                        </Tooltip>
                      ) : null}
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
            ) : (
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12z" />
                  </svg>
                  <p className="text-gray-600 mb-2">Detecting Location...</p>
                  <p className="text-sm text-gray-500">Please allow location access to view the map</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result Display */}
        {submitted && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Emergency Request Status</h3>
            </div>
            <div className="card-body">
              {submitted.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Error</h4>
                      <p className="text-sm text-red-700 mt-1">{submitted.error}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-green-800">Emergency Request Submitted</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your emergency request has been submitted successfully. Emergency services have been notified and will respond as soon as possible.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

