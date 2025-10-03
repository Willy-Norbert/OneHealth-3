"use client"
import useSWR from 'swr'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { api } from '@/lib/api'

export default function DoctorPublicProfile() {
  const { id } = useParams<{ id: string }>()
  const { data } = useSWR(() => (id ? `doctor-${id}` : null), () => api.doctors.get(id as string) as any)
  const doctor = (data as any)?.data?.doctor

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
          <p className="text-gray-600">Public doctor profile</p>
        </div>

        {doctor ? (
          <div className="card">
            <div className="card-body space-y-3">
              <div className="text-xl font-semibold text-gray-900">{doctor?.user?.name || 'Unknown'}</div>
              <div className="text-sm text-gray-600">{doctor?.user?.email}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Specialization</div>
                  <div>{doctor?.specialization || '—'}</div>
                </div>
                <div>
                  <div className="font-medium">Department</div>
                  <div>{doctor?.department?.name || '—'}</div>
                </div>
                <div>
                  <div className="font-medium">Hospital</div>
                  <div>{doctor?.hospital?.name || '—'}</div>
                </div>
              </div>
              {doctor?.bio && (
                <div>
                  <div className="font-medium">Bio</div>
                  <div className="text-gray-700">{doctor.bio}</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Loading...</div>
        )}
      </div>
    </AppShell>
  )
}




