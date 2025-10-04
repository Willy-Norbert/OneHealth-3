"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { apiFetch } from '@/lib/api'
import { useState, useEffect } from 'react'
import ScheduleEditor from '@/components/ScheduleEditor'

export default function DoctorSettingsPage() {
  const { data, mutate } = useSWR('doctor-settings', async () => {
    return await apiFetch('/doctors/settings', { auth: true })
  })

  const [form, setForm] = useState({ emailNotifications: true, inAppNotifications: true, timezone: 'UTC' })
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    const s = (data as any)?.data?.settings
    if (s) setForm({
      emailNotifications: s.emailNotifications ?? true,
      inAppNotifications: s.inAppNotifications ?? true,
      timezone: s.timezone || 'UTC',
    })
  }, [data])

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/doctors/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${require('js-cookie').get('token') || ''}` },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed to save settings')
      await mutate()
      setDirty(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell
      menu={[
        { href: '/doctor', label: 'Overview' },
        { href: '/doctor/appointments', label: 'Appointments' },
        { href: '/doctor/lab-results', label: 'Medical Records' },
        { href: '/doctor/settings', label: 'Settings' },
        { href: '/doctor/meetings', label: 'Teleconsultations' },
        { href: '/doctor/prescriptions', label: 'Prescriptions' },
        { href: '/doctor/records', label: 'Medical Records' },
        { href: '/doctor/profile', label: 'Profile' },
      ]}
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your notification and availability preferences.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-500">Choose how you want to be notified.</p>
          </div>
          <div className="card-body space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="toggle" checked={form.emailNotifications} onChange={(e)=>{ setForm({...form, emailNotifications: e.target.checked}); setDirty(true) }} />
              <span>Email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="toggle" checked={form.inAppNotifications} onChange={(e)=>{ setForm({...form, inAppNotifications: e.target.checked}); setDirty(true) }} />
              <span>In-app notifications</span>
            </label>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Timezone</h3>
            <p className="text-sm text-gray-500">Display times in your preferred timezone.</p>
          </div>
          <div className="card-body">
            <select className="input" value={form.timezone} onChange={(e)=>{ setForm({...form, timezone: e.target.value}); setDirty(true) }}>
              {Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone').map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              )) : (
                <>
                  <option value="UTC">UTC</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Calendar & Availability</h3>
            <p className="text-sm text-gray-500">Set recurring availability and block specific dates.</p>
          </div>
          <div className="card-body">
            <ScheduleEditor />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn-primary" disabled={!dirty || saving} onClick={save}>{saving ? 'Saving...' : 'Save changes'}</button>
        </div>
      </div>
    </AppShell>
  )
}


