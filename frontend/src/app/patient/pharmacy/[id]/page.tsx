"use client"
import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { api } from '@/lib/api'
import useSWR from 'swr'

type MedicationItem = { name: string; dosage?: string; instructions?: string; quantity: number; unitPrice: number; totalPrice: number }

export default function PharmacyProfilePage() {
  const router = useRouter()
  const pharmacyId = (typeof window !== 'undefined') ? window.location.pathname.split('/').pop() || '' : ''
  const { data: pharmacyRes } = useSWR(pharmacyId ? `pharmacy-${pharmacyId}` : null, () => api.pharmacy.get(pharmacyId) as any)
  const { data: insuranceRes } = useSWR('insurance', () => api.insurance.list() as any)

  const pharmacy = pharmacyRes?.data?.pharmacy
  const insuranceOptions: any[] = Array.isArray(insuranceRes?.data?.insuranceProviders)
    ? insuranceRes.data.insuranceProviders
    : (Array.isArray(insuranceRes?.data) ? insuranceRes.data : [])

  const [step, setStep] = useState<number>(1)
  const [orderType, setOrderType] = useState<'prescription'|'over-the-counter'>('prescription')
  const [uploadedRx, setUploadedRx] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [medications, setMedications] = useState<MedicationItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'mobile-money'|'bank-transfer'|'cash'|'insurance'>('mobile-money')
  const [selectedInsurance, setSelectedInsurance] = useState<string>('')
  const [insuranceCoverage, setInsuranceCoverage] = useState<number>(0)
  const [deliveryType, setDeliveryType] = useState<'pickup'|'delivery'>('pickup')
  const [deliveryAddress, setDeliveryAddress] = useState<string>('')
  const [placing, setPlacing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const totalAmount = useMemo(() => {
    return medications.reduce((sum, m) => sum + (m.totalPrice || (m.unitPrice * m.quantity)), 0)
  }, [medications])

  const addMedication = () => {
    setMedications(prev => [...prev, { name: '', dosage: '', instructions: '', quantity: 1, unitPrice: 1000, totalPrice: 1000 }])
  }

  const updateMedication = (idx: number, field: keyof MedicationItem, value: any) => {
    setMedications(prev => prev.map((m, i) => {
      if (i !== idx) return m
      const next = { ...m, [field]: field === 'quantity' || field === 'unitPrice' ? Number(value) : value }
      next.totalPrice = (next.unitPrice || 0) * (next.quantity || 0)
      return next
    }))
  }

  const removeMedication = (idx: number) => {
    setMedications(prev => prev.filter((_, i) => i !== idx))
  }

  const uploadPrescription = async () => {
    if (!file) return
    setUploading(true)
    try {
      const res: any = await api.uploads.image(file)
      setUploadedRx(res)
      setOrderType('prescription')
      setStep(4)
    } catch (e) {
      console.error('Upload failed', e)
    } finally {
      setUploading(false)
    }
  }

  const placeOrder = async () => {
    if (!pharmacy?._id) return
    setPlacing(true)
    try {
      const body = {
        pharmacy: pharmacy._id,
        orderType,
        medications: medications.map(m => ({ name: m.name, quantity: m.quantity, unitPrice: m.unitPrice, totalPrice: m.totalPrice, dosage: m.dosage, instructions: m.instructions })),
        deliveryInfo: {
          type: deliveryType,
          address: deliveryType === 'delivery' ? deliveryAddress : undefined,
        },
        paymentInfo: {
          method: paymentMethod,
          insurance: paymentMethod === 'insurance' && selectedInsurance ? selectedInsurance : undefined,
          insuranceCoverage: paymentMethod === 'insurance' ? insuranceCoverage : 0,
        },
        specialInstructions: uploadedRx ? `E-Prescription: ${uploadedRx.url}` : undefined
      }
      const res = await api.orders.create(body as any)
      setResult(res)
      setStep(6)
    } catch (e) {
      console.error('Order failed', e)
      setResult({ error: 'Order failed. Please try again.' })
    } finally {
      setPlacing(false)
    }
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
            <h1 className="text-3xl font-bold text-gray-900">{pharmacy?.name || 'Pharmacy'}</h1>
            <p className="text-gray-600 mt-1">{pharmacy?.location?.address}</p>
          </div>
        </div>

        {/* Steps */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Order Medication</h3>
            <p className="text-sm text-gray-500">Step {step} of 6</p>
          </div>
          <div className="card-body space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div><span className="font-medium">Address:</span> {pharmacy?.location?.address}</div>
                  <div><span className="font-medium">City:</span> {pharmacy?.location?.city}</div>
                  <div><span className="font-medium">Phone:</span> {pharmacy?.contact?.phone}</div>
                  <div><span className="font-medium">Services:</span> {(pharmacy?.services || []).join(', ') || '—'}</div>
                </div>
                <div className="flex justify-end">
                  <button className="btn-primary" onClick={() => setStep(2)}>Continue</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-xl">
                    <h4 className="font-semibold mb-2">Upload E-Prescription</h4>
                    <input type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
                    <button className="btn-primary mt-3" disabled={!file || uploading} onClick={uploadPrescription}>
                      {uploading ? 'Uploading...' : 'Upload & Continue'}
                    </button>
                  </div>
                  <div className="p-4 border rounded-xl">
                    <h4 className="font-semibold mb-2">Enter Medication Manually</h4>
                    <button className="btn-outline" onClick={() => { setOrderType('over-the-counter'); setStep(3) }}>Add Medications</button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Medications</h4>
                  <button className="btn-outline btn-sm" onClick={addMedication}>Add</button>
                </div>
                <div className="space-y-3">
                  {medications.map((m, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <input className="input md:col-span-3" placeholder="Name" value={m.name} onChange={e => updateMedication(idx, 'name', e.target.value)} />
                      <input className="input md:col-span-2" placeholder="Dosage" value={m.dosage || ''} onChange={e => updateMedication(idx, 'dosage', e.target.value)} />
                      <input className="input md:col-span-1" placeholder="Qty" type="number" value={m.quantity} onChange={e => updateMedication(idx, 'quantity', e.target.value)} />
                      <input className="input md:col-span-2" placeholder="Unit Price" type="number" value={m.unitPrice} onChange={e => updateMedication(idx, 'unitPrice', e.target.value)} />
                      <div className="text-sm md:col-span-2">Total: <span className="font-semibold">{m.totalPrice}</span></div>
                      <button className="btn-outline btn-sm md:col-span-2" onClick={() => removeMedication(idx)}>Remove</button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-sm text-gray-700">Subtotal</div>
                  <div className="font-semibold">{totalAmount}</div>
                </div>
                <div className="flex justify-end">
                  <button className="btn-primary" disabled={!medications.length} onClick={() => setStep(4)}>Confirm & Continue</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Confirm Medication & Quantity</h4>
                <div className="space-y-2 text-sm">
                  {medications.map((m, i) => (
                    <div key={i} className="flex justify-between">
                      <div>{m.name} — {m.dosage} × {m.quantity}</div>
                      <div>{m.totalPrice}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <div>Total</div>
                  <div>{totalAmount}</div>
                </div>
                <div className="flex justify-end">
                  <button className="btn-primary" onClick={() => setStep(5)}>Continue</button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Payment Method</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['mobile-money','bank-transfer','cash','insurance'].map((m) => (
                      <button key={m} type="button" onClick={() => setPaymentMethod(m as any)} className={`p-3 rounded-lg border-2 text-center ${paymentMethod===m?'border-blue-500 bg-blue-50':'border-gray-200 hover:border-gray-300'}`}>{m}</button>
                    ))}
                  </div>
                </div>
                {paymentMethod === 'insurance' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select className="input" value={selectedInsurance} onChange={e => setSelectedInsurance(e.target.value)}>
                      <option value="">Select Insurance</option>
                      {insuranceOptions.map((ins:any) => (
                        <option key={ins._id} value={ins._id}>{ins.name}</option>
                      ))}
                    </select>
                    <input className="input" type="number" placeholder="Coverage Amount" value={insuranceCoverage} onChange={e => setInsuranceCoverage(Number(e.target.value))} />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold mb-2">Delivery or Pickup</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['pickup','delivery'].map((d) => (
                      <button key={d} type="button" onClick={() => setDeliveryType(d as any)} className={`p-3 rounded-lg border-2 text-center ${deliveryType===d?'border-emerald-500 bg-emerald-50':'border-gray-200 hover:border-gray-300'}`}>{d}</button>
                    ))}
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="mt-3">
                      <input className="input w-full" placeholder="Delivery address" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} />
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <button className="btn-primary" onClick={placeOrder} disabled={placing}>{placing?'Placing...':'Place Order'}</button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Order Confirmation</h4>
                {result?.success ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                    Order placed successfully. Status: {result?.data?.order?.status}. Order No: {result?.data?.order?.orderNumber}
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
                    {result?.error || 'Order failed. Please try again.'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

