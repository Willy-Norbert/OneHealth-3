"use client"
import { AppShell } from '@/components/layout/AppShell'
import RoleGuard from '@/components/RoleGuard'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useParams } from 'next/navigation'

export default function PatientLabResultDetailPage() {
  const params = useParams() as { id: string }
  const { data } = useSWR(params?.id ? ['lab-result', params.id] : null, () => api.labResults.get(params.id) as any)
  const r = data?.data

  return (
    <RoleGuard allow={['patient','admin']}>
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Lab Result</h1>
          <p className="text-gray-600">{r?.testName} • {r?.testType}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card lg:col-span-2">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Parameters</h3>
            </div>
            <div className="card-body">
              {r?.results?.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="py-2 pr-4">Parameter</th>
                        <th className="py-2 pr-4">Value</th>
                        <th className="py-2 pr-4">Unit</th>
                        <th className="py-2 pr-4">Reference</th>
                        <th className="py-2 pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.results.map((p:any, idx:number)=>(
                        <tr key={idx} className="border-t">
                          <td className="py-2 pr-4">{p.parameter}</td>
                          <td className="py-2 pr-4">{p.value}</td>
                          <td className="py-2 pr-4">{p.unit || '-'}</td>
                          <td className="py-2 pr-4">{p.referenceRange || '-'}</td>
                          <td className="py-2 pr-4"><span className={`badge ${p.status==='critical'?'badge-danger': p.status==='abnormal' || p.status==='high' || p.status==='low'?'badge-warning':'badge-success'}`}>{p.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No parameters provided.</div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
              </div>
              <div className="card-body space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall Status</span>
                  <span className={`badge ${r?.overallStatus==='critical'?'badge-danger': r?.overallStatus==='abnormal'?'badge-warning':'badge-success'}`}>{r?.overallStatus}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Reported</span>
                  <span className="text-gray-900">{r?.reportedDate ? new Date(r.reportedDate).toLocaleString() : '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
    </RoleGuard>
  )
}
























