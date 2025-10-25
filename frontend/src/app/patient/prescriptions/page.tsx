"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'

export default function PatientPrescriptionsPage() {
  const { data, isLoading, error } = useSWR('my-prescriptions', () => api.pharmacy.prescriptions() as any)
  const list = data?.data?.prescriptions || []

  const statusBadge = (d: any) => 'badge-primary'

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
            <p className="text-gray-600 mt-1">Prescriptions written by your doctor</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {isLoading && <div className="text-gray-500">Loading prescriptions...</div>}
            {error && <div className="text-red-600">Failed to load prescriptions</div>}
            {!isLoading && !error && (
              list.length ? (
                <div className="space-y-4">
                  {list.map((rx: any) => (
                    <div key={rx._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{rx.diagnosis || 'Prescription'}</h4>
                              <p className="text-sm text-gray-500">Prescribed on {rx.datePrescribed ? new Date(rx.datePrescribed).toLocaleDateString() : '—'}</p>
                            </div>
                          </div>
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Medications</p>
                            <div className="space-y-1">
                              {rx.medications?.map((m: any, i: number) => (
                                <div key={i} className="text-sm text-gray-700 bg-white p-2 rounded">
                                  <span className="font-medium">{m.name}</span> — {m.dosage} ({m.frequency})
                                  {m.instructions && <div className="text-xs text-gray-500 mt-1">{m.instructions}</div>}
                                </div>
                              ))}
                            </div>
                          </div>
                          {rx.notes && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Notes:</span> {rx.notes}
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex flex-col gap-2">
                          <a href={`${ ' https://api.onehealthline.com'}/prescriptions/${rx._id}/pdf`} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">Download PDF</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions</h3>
                  <p className="mt-1 text-sm text-gray-500">Prescriptions issued by your doctor will appear here.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

