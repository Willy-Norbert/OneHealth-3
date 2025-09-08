"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'
import React, { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'

export default function PharmacyPage() {
  const { data: pharmacies } = useSWR('pharmacies', () => api.pharmacy.list() as any)
  const { data: prescriptions } = useSWR('my-prescriptions', () => api.pharmacy.prescriptions() as any)
  const [file, setFile] = useState<File | null>(null)
  const [uploadRes, setUploadRes] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null)
  const [mapPharmacy, setMapPharmacy] = useState<any>(null)

  // Lazy-load map to avoid SSR issues
  const MapContainer = useMemo(() => dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false }), [])
  const TileLayer = useMemo(() => dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false }), [])
  const Marker = useMemo(() => dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false }), [])

  const upload = async () => {
    if (!file) return
    setUploading(true)
    try {
      const res = await api.uploads.image(file)
      setUploadRes(res)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadRes({ error: 'Failed to upload prescription. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  const stats = {
    totalPharmacies: pharmacies?.data?.pharmacies?.length || 0,
    totalPrescriptions: prescriptions?.data?.prescriptions?.length || 0,
    pendingOrders: prescriptions?.data?.prescriptions?.filter((p: any) => p.status === 'pending').length || 0,
    completedOrders: prescriptions?.data?.prescriptions?.filter((p: any) => p.status === 'completed').length || 0
  }

  return (
    <AppShell
      menu={[
        { href: '/patient', label: 'Overview' },
        { href: '/patient/appointments', label: 'Appointments' },
        { href: '/patient/teleconsult', label: 'Teleconsultation' },
        { href: '/patient/pharmacy', label: 'Pharmacy' },
        { href: '/patient/ai', label: 'AI Assistant' },
        { href: '/patient/emergency', label: 'Emergency' },
        { href: '/patient/records', label: 'Medical Records' },
        { href: '/patient/orders', label: 'My Orders' },
      ]}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pharmacy</h1>
            <p className="text-gray-600 mt-1">Find pharmacies and manage your prescriptions</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Nearby Pharmacies</p>
                <p className="stat-value">{stats.totalPharmacies}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Total Prescriptions</p>
                <p className="stat-value">{stats.totalPrescriptions}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Pending Orders</p>
                <p className="stat-value">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Completed</p>
                <p className="stat-value">{stats.completedOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Prescription */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Upload Prescription</h3>
            <p className="text-sm text-gray-500">Upload your prescription for processing and delivery</p>
          </div>
          <div className="card-body">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <div className="mt-4">
                  <label htmlFor="prescription-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {file ? file.name : 'Click to upload prescription'}
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      PNG, JPG, PDF up to 10MB
                    </span>
                  </label>
                  <input
                    id="prescription-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="sr-only"
                  />
                </div>
              </div>

              {file && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={upload}
                    disabled={uploading}
                    className="btn-primary"
                  >
                    {uploading ? (
                      <div className="flex items-center">
                        <div className="loading-spinner mr-2"></div>
                        Uploading...
                      </div>
                    ) : (
                      'Upload Prescription'
                    )}
                  </button>
                </div>
              )}

              {uploadRes && (
                <div className={`p-4 rounded-lg ${
                  uploadRes.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex">
                    {uploadRes.error ? (
                      <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <div>
                      <h4 className={`text-sm font-medium ${
                        uploadRes.error ? 'text-red-800' : 'text-green-800'
                      }`}>
                        {uploadRes.error ? 'Upload Failed' : 'Upload Successful'}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        uploadRes.error ? 'text-red-700' : 'text-green-700'
                      }`}>
                        {uploadRes.error || 'Your prescription has been uploaded successfully and is being processed.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nearby Pharmacies */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Nearby Pharmacies</h3>
            <p className="text-sm text-gray-500">Find pharmacies in your area</p>
          </div>
          <div className="card-body">
            {pharmacies?.data?.pharmacies?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pharmacies.data.pharmacies.map((pharmacy: any) => (
                  <div key={pharmacy._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{pharmacy.name}</h4>
                          <p className="text-sm text-gray-500">{pharmacy.location?.address || 'Address not available'}</p>
                        </div>
                      </div>
                      <span className="badge badge-success">Open</span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Mon-Fri: 9:00 AM - 9:00 PM</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        <span>{pharmacy.phone || 'Phone not available'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button className="btn-primary btn-sm flex-1" onClick={() => setSelectedPharmacy(pharmacy)}>
                        View Details
                      </button>
                      <a className="btn-outline btn-sm" href={`/patient/pharmacy/${pharmacy._id}`}>
                        Open Profile
                      </a>
                      <button className="btn-outline btn-sm" onClick={() => setMapPharmacy(pharmacy)}>
                        Directions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pharmacies found</h3>
                <p className="mt-1 text-sm text-gray-500">No pharmacies are available in your area.</p>
              </div>
            )}
          </div>
        </div>

        {/* My Prescriptions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">My Prescriptions</h3>
            <p className="text-sm text-gray-500">View and manage your prescription orders</p>
          </div>
          <div className="card-body">
            {prescriptions?.data?.prescriptions?.length > 0 ? (
              <div className="space-y-4">
                {prescriptions.data.prescriptions.map((prescription: any) => (
                  <div key={prescription._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              Prescription #{prescription._id?.slice(-6)}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {new Date(prescription.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`badge ${
                            prescription.status === 'completed' ? 'badge-success' :
                            prescription.status === 'pending' ? 'badge-warning' :
                            'badge-gray'
                          }`}>
                            {prescription.status}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p><span className="font-medium">Medications:</span> {prescription.medications?.join(', ') || 'Not specified'}</p>
                          <p><span className="font-medium">Pharmacy:</span> {prescription.pharmacy?.name || 'Not assigned'}</p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <button className="btn-primary btn-sm">
                          View Details
                        </button>
                        {prescription.status === 'pending' && (
                          <button className="btn-outline btn-sm">
                            Track Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions</h3>
                <p className="mt-1 text-sm text-gray-500">Upload a prescription to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pharmacy Details Modal */}
        {selectedPharmacy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedPharmacy.name}</h3>
                <button className="btn-outline btn-sm" onClick={() => setSelectedPharmacy(null)}>Close</button>
              </div>
              <div className="p-4 space-y-3 text-sm text-gray-700">
                <div><span className="font-medium">Address:</span> {selectedPharmacy.location?.address}</div>
                <div><span className="font-medium">City:</span> {selectedPharmacy.location?.city}</div>
                <div><span className="font-medium">Phone:</span> {selectedPharmacy.contact?.phone}</div>
                <div><span className="font-medium">Services:</span> {(selectedPharmacy.services || []).join(', ') || '—'}</div>
                <div><span className="font-medium">Insurance:</span> {(selectedPharmacy.insuranceAccepted || []).map((i:any)=>i.name).join(', ') || '—'}</div>
                <div className="pt-2">
                  <button className="btn-primary w-full">Start Order</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Directions Map Modal */}
        {mapPharmacy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">Directions to {mapPharmacy.name}</h3>
                <button className="btn-outline btn-sm" onClick={() => setMapPharmacy(null)}>Close</button>
              </div>
              <div className="h-96">
                {MapContainer && TileLayer && Marker ? (
                  <MapContainer center={[mapPharmacy.location?.coordinates?.latitude || 0, mapPharmacy.location?.coordinates?.longitude || 0]} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                    {mapPharmacy.location?.coordinates && (
                      <Marker position={[mapPharmacy.location.coordinates.latitude, mapPharmacy.location.coordinates.longitude]} />
                    )}
                  </MapContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">Loading map...</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

