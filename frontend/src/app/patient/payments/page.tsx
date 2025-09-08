"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function PatientPaymentsPage() {
  const { data: myAppointments, mutate } = useSWR('myAppointments', () => api.appointments.my() as any)
  const [processingId, setProcessingId] = useState<string| null>(null)
  const [providerByAppointment, setProviderByAppointment] = useState<Record<string, string>>({})

  const unpaid = (myAppointments as any)?.data?.appointments?.filter((a: any) => a.appointmentType === 'virtual' && a.paymentStatus !== 'paid') || []

  const handlePay = async (appointmentId: string, fee: number) => {
    setProcessingId(appointmentId)
    try {
      const provider = providerByAppointment[appointmentId] || 'DEV_FAKE'
      // Initiate checkout (do not send breakdown; it's for UI only)
      const res = await api.payments.checkout({ appointmentId, provider }) as any
      const paymentId = res?.data?.payment?._id
      const checkoutUrl = res?.data?.payment?.checkoutUrl
      if (!paymentId) throw new Error('Payment init failed')
      // For non-sandbox providers, open checkout and poll verify briefly
      if (provider !== 'DEV_FAKE' && checkoutUrl) {
        window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
        for (let i = 0; i < 6; i++) {
          await new Promise(r=>setTimeout(r, 2000))
          const verify = await api.payments.verify({ paymentId }) as any
          const status = verify?.data?.payment?.status
          if (status === 'SUCCEEDED') break
        }
        await mutate()
      } else {
        // Sandbox: verify immediately
        await api.payments.verify({ paymentId })
        await mutate()
      }
    } catch (e) {
      console.error('Payment error', e)
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <AppShell
      menu={[
        { href: '/patient', label: 'Overview' },
        { href: '/patient/appointments', label: 'Appointments' },
        { href: '/patient/teleconsult', label: 'Teleconsultation' },
        { href: '/patient/prescriptions', label: 'Prescriptions' },
        { href: '/patient/payments', label: 'Payments' },
        { href: '/patient/pharmacy', label: 'Pharmacy' },
        { href: '/patient/ai', label: 'AI Assistant' },
        { href: '/patient/emergency', label: 'Emergency' },
        { href: '/patient/records', label: 'Medical Records' },
        { href: '/patient/orders', label: 'My Orders' },
        { href: '/patient/profile', label: 'Profile' },
      ]}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600">Pay for your virtual teleconsultations</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Unpaid Teleconsultations</h3>
          </div>
          <div className="card-body">
            {unpaid.length ? (
              <div className="space-y-4">
                {unpaid.map((a: any) => {
                  const fee = a.consultationFee || 0
                  const systemFee = Math.round(fee * 0.01)
                  const hospitalFee = fee - systemFee
                  return (
                  <div key={a._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-gray-900 font-semibold">{a.hospital?.name} — {a.department?.name}</div>
                        <div className="text-sm text-gray-600">{new Date(a.appointmentDate).toLocaleDateString()} at {a.appointmentTime}</div>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="p-3 rounded-lg bg-white border border-gray-200">
                            <div className="text-xs text-gray-500">Total</div>
                            <div className="text-gray-900 font-medium">RWF {fee.toLocaleString()}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white border border-gray-200">
                            <div className="text-xs text-gray-500">System (1%)</div>
                            <div className="text-gray-900">RWF {systemFee.toLocaleString()}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white border border-gray-200">
                            <div className="text-xs text-gray-500">Hospital (99%)</div>
                            <div className="text-gray-900">RWF {hospitalFee.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="text-xs text-gray-500 mb-1 block">Payment method</label>
                          <select
                            className="input"
                            value={providerByAppointment[a._id] || 'DEV_FAKE'}
                            onChange={(e)=>setProviderByAppointment(prev=>({ ...prev, [a._id]: e.target.value }))}
                          >
                            <option value="DEV_FAKE">Sandbox</option>
                            <option value="MTN">MTN Mobile Money</option>
                            <option value="IREMBO">Irembo</option>
                          </select>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button className="btn-primary" disabled={processingId===a._id} onClick={()=>handlePay(a._id, fee)}>
                          {processingId===a._id ? 'Processing...' : 'Pay now'}
                        </button>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">No unpaid teleconsultations</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

