"use client"
import { AppShell } from '@/components/layout/AppShell'
import RoleGuard from '@/components/RoleGuard'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function PatientDrugInteractionsPage() {
  const [drug, setDrug] = useState('')
  const { data: byDrug } = useSWR(drug ? ['drug-by', drug] : null, () => api.drugInteractions.byDrug(drug) as any)

  return (
    <RoleGuard allow={['patient','admin']}>
    <AppShell
      menu={[
        { href: '/patient', label: 'Overview' },
        { href: '/patient/appointments', label: 'Appointments' },
        { href: '/patient/teleconsult', label: 'Teleconsultation' },
        { href: '/patient/prescriptions', label: 'Prescriptions' },
        { href: '/patient/pharmacy', label: 'Pharmacy' },
        { href: '/patient/ai', label: 'AI Assistant' },
        { href: '/patient/emergency', label: 'Emergency' },
        { href: '/patient/records', label: 'Medical Records' },
        { href: '/patient/orders', label: 'My Orders' },
      ]}
    >
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">Drug Interactions</h1>
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Search by Drug</h3>
          </div>
          <div className="card-body space-y-4">
            <div className="flex gap-3">
              <input className="input flex-1" placeholder="e.g., ibuprofen" value={drug} onChange={(e)=>setDrug(e.target.value)} />
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
            ) : (
              <div className="text-sm text-gray-500">Search a medicine to see interactions.</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
    </RoleGuard>
  )
}


