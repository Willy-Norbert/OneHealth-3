"use client"
import { AppShell } from '@/components/layout/AppShell'
import RoleGuard from '@/components/RoleGuard'
import useSWR from 'swr'
import { api } from '@/lib/api'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function HospitalLabResultsPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [status, setStatus] = useState<string>('')
  const [type, setType] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const params = useMemo(() => {
    const p: Record<string,string|number> = { page, limit }
    if (status) p.overallStatus = status
    if (type) p.testType = type
    if (startDate) p.startDate = startDate
    if (endDate) p.endDate = endDate
    return p
  }, [page, limit, status, type, startDate, endDate])

  const { data: results, isLoading, error } = useSWR(['hospital-lab-results', params], () => api.labResults.list(params) as any)
  const { data: critical, isLoading: loadingCritical } = useSWR('hospital-lab-critical', () => api.labResults.critical() as any)

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
      ]}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lab Results</h1>
            <p className="text-gray-600">Recent results and critical alerts</p>
          </div>
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
            <input type="date" className="input" value={startDate} onChange={e=>{ setStartDate(e.target.value); setPage(1) }} />
            <input type="date" className="input" value={endDate} onChange={e=>{ setEndDate(e.target.value); setPage(1) }} />
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Critical Alerts</h3>
          </div>
          <div className="card-body">
            {loadingCritical ? (
              <div className="animate-pulse h-20 bg-red-50 rounded" />
            ) : critical?.data?.length ? (
              <div className="space-y-3">
                {critical.data.slice(0,5).map((r:any)=> (
                  <div key={r._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-700">{r.testName}</p>
                      <p className="text-sm text-red-600">Patient: {r.patient?.user?.name || r.patient?.user?.email}</p>
                    </div>
                    <Link href={`/hospital/lab-results/${r._id}`} className="btn-outline btn-sm">View</Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No critical results.</div>
            )}
          </div>
        </div>

        {/* Recent Results */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Recent Results</h3>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="space-y-2">
                <div className="animate-pulse h-8 bg-gray-100 rounded" />
                <div className="animate-pulse h-8 bg-gray-100 rounded" />
                <div className="animate-pulse h-8 bg-gray-100 rounded" />
              </div>
            ) : error ? (
              <div className="text-sm text-red-600">Failed to load results.</div>
            ) : results?.data?.docs?.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2 pr-4">Patient</th>
                      <th className="py-2 pr-4">Test</th>
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Reported</th>
                      <th className="py-2 pr-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.data.docs.map((r:any)=> (
                      <tr key={r._id} className="border-t">
                        <td className="py-2 pr-4">{r.patient?.user?.name || r.patient?.user?.email}</td>
                        <td className="py-2 pr-4">{r.testName}</td>
                        <td className="py-2 pr-4">{r.testType}</td>
                        <td className="py-2 pr-4">
                          <span className={`badge ${r.overallStatus==='critical'?'badge-danger': r.overallStatus==='abnormal'?'badge-warning':'badge-success'}`}>{r.overallStatus}</span>
                        </td>
                        <td className="py-2 pr-4">{r.reportedDate ? new Date(r.reportedDate).toLocaleDateString(): '-'}</td>
                        <td className="py-2 pr-4 text-right">
                          <Link href={`/hospital/lab-results/${r._id}`} className="btn-outline btn-sm">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              </div>
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


