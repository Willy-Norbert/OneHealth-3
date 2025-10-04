"use client"
import { AppShell } from '@/components/layout/AppShell'
import RoleGuard from '@/components/RoleGuard'
import useSWR from 'swr'
import { api } from '@/lib/api'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function PatientLabResultsPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [status, setStatus] = useState<string>('')
  const [type, setType] = useState<string>('')

  const params = useMemo(() => {
    const p: Record<string,string|number> = { page, limit }
    if (status) p.overallStatus = status
    if (type) p.testType = type
    return p
  }, [page, limit, status, type])

  const { data: results, isLoading, error } = useSWR(['patient-lab-results', params], () => api.labResults.list(params) as any)

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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Lab Results</h1>
          <div className="flex gap-2">
            <select className="input" value={type} onChange={e=>{ setType(e.target.value); setPage(1) }}>
              <option value="">All types</option>
              <option value="blood_test">Blood</option>
              <option value="urine_test">Urine</option>
              <option value="stool_test">Stool</option>
              <option value="imaging">Imaging</option>
            </select>
            <select className="input" value={status} onChange={e=>{ setStatus(e.target.value); setPage(1) }}>
              <option value="">Any status</option>
              <option value="normal">Normal</option>
              <option value="abnormal">Abnormal</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Recent Results</h3>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="space-y-2">
                <div className="animate-pulse h-8 bg-gray-100 rounded" />
                <div className="animate-pulse h-8 bg-gray-100 rounded" />
              </div>
            ) : error ? (
              <div className="text-sm text-red-600">Failed to load results.</div>
            ) : results?.data?.docs?.length ? (
              <>
                <div className="space-y-3">
                  {results.data.docs.map((r:any)=>(
                    <div key={r._id} className="p-3 rounded-lg border flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{r.testName}</div>
                        <div className="text-sm text-gray-600">{r.testType}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${r.overallStatus==='critical'?'badge-danger': r.overallStatus==='abnormal'?'badge-warning':'badge-success'}`}>{r.overallStatus}</span>
                        <Link href={`/patient/lab-results/${r._id}`} className="btn-outline btn-sm">View</Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">Page {results.data.page} of {results.data.totalPages} • {results.data.totalDocs} results</div>
                  <div className="flex items-center gap-2">
                    <button className="btn-outline btn-sm" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Previous</button>
                    <button className="btn-outline btn-sm" disabled={results.data.page>=results.data.totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
                    <select className="input" value={limit} onChange={e=>{ setLimit(Number(e.target.value)); setPage(1) }}>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500">No lab results found.</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
    </RoleGuard>
  )
}


