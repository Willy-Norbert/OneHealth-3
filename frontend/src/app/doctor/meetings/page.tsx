"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

export default function MeetingsPage() {
  const { user } = useAuth()
  const { data, mutate } = useSWR(() => user ? `meetings-${user.id}` : null, () => api.meetings.user(user!.id) as any)
  const [filter, setFilter] = useState('all')

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'badge-primary'
      case 'ongoing':
        return 'badge-success'
      case 'completed':
        return 'badge-gray'
      case 'cancelled':
        return 'badge-danger'
      default:
        return 'badge-gray'
    }
  }

  const filteredMeetings = (data as any)?.data?.meetings?.filter((meeting: any) => {
    if (filter === 'all') return true
    if (filter === 'today') {
      const today = new Date()
      const meetingDate = new Date(meeting.startTime)
      return meetingDate.toDateString() === today.toDateString()
    }
    return meeting.status?.toLowerCase() === filter
  }) || []

  const stats = {
    total: (data as any)?.data?.meetings?.length || 0,
    scheduled: (data as any)?.data?.meetings?.filter((m: any) => m.status === 'scheduled').length || 0,
    ongoing: (data as any)?.data?.meetings?.filter((m: any) => m.status === 'ongoing').length || 0,
    today: (data as any)?.data?.meetings?.filter((m: any) => {
      const today = new Date()
      const meetingDate = new Date(m.startTime)
      return meetingDate.toDateString() === today.toDateString()
    }).length || 0
  }

  return (
    <AppShell
      menu={[
        { href: '/doctor', label: 'Overview' },
        { href: '/doctor/appointments', label: 'Appointments' },
        { href: '/doctor/meetings', label: 'Teleconsultations' },
        { href: '/doctor/prescriptions', label: 'Prescriptions' },
        { href: '/doctor/records', label: 'Medical Records' },
      ]}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teleconsultations</h1>
            <p className="text-gray-600 mt-1">Manage your video consultations and meetings</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Total Meetings</p>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Scheduled</p>
                <p className="stat-value">{stats.scheduled}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Ongoing</p>
                <p className="stat-value">{stats.ongoing}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Today</p>
                <p className="stat-value">{stats.today}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="card-body">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'} btn-sm`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('today')}
                className={`btn ${filter === 'today' ? 'btn-primary' : 'btn-outline'} btn-sm`}
              >
                Today ({stats.today})
              </button>
              <button
                onClick={() => setFilter('scheduled')}
                className={`btn ${filter === 'scheduled' ? 'btn-primary' : 'btn-outline'} btn-sm`}
              >
                Scheduled ({stats.scheduled})
              </button>
              <button
                onClick={() => setFilter('ongoing')}
                className={`btn ${filter === 'ongoing' ? 'btn-primary' : 'btn-outline'} btn-sm`}
              >
                Ongoing ({stats.ongoing})
              </button>
            </div>
          </div>
        </div>

        {/* Meetings List */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Video Consultations</h3>
            <p className="text-sm text-gray-500">Manage your teleconsultation sessions</p>
          </div>
          <div className="card-body">
            {filteredMeetings.length > 0 ? (
              <div className="space-y-4">
                {filteredMeetings.map((meeting: any) => (
                  <div key={meeting._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {meeting.title || 'Video Consultation'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {meeting.patient?.name || 'Patient consultation'}
                            </p>
                          </div>
                          <span className={`badge ${getStatusBadge(meeting.status)}`}>
                            {meeting.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                            </svg>
                            <span>{new Date(meeting.startTime).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{new Date(meeting.startTime).toLocaleTimeString()}</span>
                          </div>
                        </div>

                        {meeting.description && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Description:</span> {meeting.description}
                            </p>
                          </div>
                        )}

                        {meeting.meetingLink && (
                          <div className="mt-3">
                            <a 
                              href={meeting.meetingLink} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-success btn-sm inline-flex items-center"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                              </svg>
                              Join Meeting
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        {meeting.status === 'scheduled' && (
                          <button
                            onClick={async () => {
                              try {
                                await api.meetings.updateStatus(meeting._id, 'ongoing')
                                mutate()
                                if (meeting.meetingLink) {
                                  window.open(meeting.meetingLink, '_blank', 'noopener,noreferrer')
                                }
                              } catch (e) {
                                console.error('Failed to start meeting', e)
                              }
                            }}
                            className="btn-primary btn-sm"
                          >
                            Start Meeting
                          </button>
                        )}
                        {meeting.status === 'ongoing' && (
                          <button
                            onClick={async () => {
                              try {
                                await api.meetings.updateStatus(meeting._id, 'completed')
                                mutate()
                              } catch (e) {
                                console.error('Failed to end meeting', e)
                              }
                            }}
                            className="btn-danger btn-sm"
                          >
                            End Meeting
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No meetings found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === 'all' ? 'You have no video consultations scheduled.' : `No ${filter} meetings found.`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule New Meeting</h3>
            <p className="text-gray-600 mb-4">Create a new video consultation with a patient.</p>
            <button className="btn-primary">
              Schedule Meeting
            </button>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Meeting Settings</h3>
            <p className="text-gray-600 mb-4">Configure your video consultation preferences.</p>
            <button className="btn-outline">
              Settings
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

