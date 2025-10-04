"use client"
import { AppShell } from '@/components/layout/AppShell'
import RoleGuard from '@/components/RoleGuard'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useParams } from 'next/navigation'

export default function HospitalLabResultDetailPage() {
  const params = useParams() as { id: string }
  const { data } = useSWR(params?.id ? ['lab-result', params.id] : null, () => api.labResults.get(params.id) as any)
  const r = data?.data

  return (
    <RoleGuard allow={['hospital','admin']}>
   <AppShell
      menu={[
        { href: '/hospital', label: 'Overview' },
        { href: '/hospital/doctors', label: 'Doctors' },
        { href: '/hospital/departments', label: 'Departments' },
        { href: '/hospital/appointments', label: 'Appointments' },
        { href: '/hospital/patients', label: 'Patients' },
        { href: '/hospital/lab-results', label: 'Medical Records' },
        { href: '/hospital/drug-interactions', label: 'Prescriptions' },
        { href: '/hospital/analytics', label: 'Analytics' },
        { href: '/hospital/profile', label: 'Profile' },
        { href: '/hospital/notifications', label: 'Notifications' },
        { href: '/hospital/emergency', label: 'Emergency' },
        
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab Result</h1>
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
                  <span className="text-gray-600">Patient</span>
                  <span className="text-gray-900">{r?.patient?.user?.name || r?.patient?.user?.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Doctor</span>
                  <span className="text-gray-900">{r?.doctor?.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Reported</span>
                  <span className="text-gray-900">{r?.reportedDate ? new Date(r.reportedDate).toLocaleString() : '-'}</span>
                </div>
              </div>
            </div>

            {(r?.interpretation || r?.recommendations) && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                </div>
                <div className="card-body space-y-3 text-sm">
                  {r?.interpretation && (
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Interpretation</div>
                      <div className="text-gray-700 whitespace-pre-wrap">{r.interpretation}</div>
                    </div>
                  )}
                  {r?.recommendations && (
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Recommendations</div>
                      <div className="text-gray-700 whitespace-pre-wrap">{r.recommendations}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
    </RoleGuard>
  )
}


