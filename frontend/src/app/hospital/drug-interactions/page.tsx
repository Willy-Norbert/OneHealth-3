"use client"
import { AppShell } from '@/components/layout/AppShell'
import RoleGuard from '@/components/RoleGuard'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function HospitalDrugInteractionsPage() {
  const { data: critical } = useSWR('drug-critical', () => api.drugInteractions.critical() as any)
  const [drug, setDrug] = useState('')
  const { data: byDrug } = useSWR(drug ? ['drug-by', drug] : null, () => api.drugInteractions.byDrug(drug) as any)

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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Drug Interactions</h1>
            <p className="text-gray-600">Check and monitor interactions</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Search by Drug</h3>
          </div>
          <div className="card-body space-y-4">
            <div className="flex gap-3">
              <input className="input flex-1" placeholder="e.g., amoxicillin" value={drug} onChange={(e)=>setDrug(e.target.value)} />
            </div>
            {byDrug?.data?.interactions?.length ? (
              <div className="space-y-3">
                {byDrug.data.interactions.map((i:any) => (
                  <div key={i._id} className="p-3 rounded-lg border">
                    <div className="font-medium text-gray-900">{i.drug1?.name} + {i.drug2?.name}</div>
                    <div className="text-sm text-gray-600">Severity: {i.severity} • Significance: {i.clinicalSignificance}</div>
                    <div className="text-sm text-gray-700 mt-1">{i.description}</div>
                  </div>
                ))}
              </div>
            ) : drug ? (
              <div className="text-sm text-gray-500">No interactions found</div>
            ) : null}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Critical Interactions</h3>
          </div>
          <div className="card-body">
            {critical?.data?.length ? (
              <div className="space-y-3">
                {critical.data.slice(0,10).map((i:any) => (
                  <div key={i._id} className="p-3 rounded-lg bg-red-50 border border-red-100">
                    <div className="font-medium text-red-800">{i.drug1?.name} + {i.drug2?.name}</div>
                    <div className="text-sm text-red-700">{i.severity} • {i.clinicalSignificance}</div>
                    <div className="text-sm text-red-700 mt-1">{i.description}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No critical interactions.</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
    </RoleGuard>
  )
}


