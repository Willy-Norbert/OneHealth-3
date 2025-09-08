"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { AppShell } from '@/components/layout/AppShell'

type IceServer = { urls: string | string[]; username?: string; credential?: string }

function sanitizeIceServers(servers: IceServer[] = []): RTCIceServer[] {
  return servers.map((s) => {
    const urls = Array.isArray(s.urls) ? s.urls : [s.urls]
    const cleaned = urls.map((u) => (u.startsWith('stun:') ? u.split('?')[0] : u))
    return { urls: cleaned, username: s.username, credential: s.credential }
  })
}

export default function MeetingRoomPage() {
  const params = useParams() as { id: string }
  const meetingId = params?.id
  const { data, error } = useSWR(() => (meetingId ? `meeting-${meetingId}` : null), () => api.meetings.get(meetingId) as any)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [status, setStatus] = useState<string>("")

  // Safe default ICE config. Add TURN if available (env or backend-provided)
  const rtcConfig = useMemo<RTCConfiguration>(() => ({
    iceServers: sanitizeIceServers([
      { urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] },
      // Example TURN (enable if you have credentials)
      // { urls: 'turn:global.turn.twilio.com:3478?transport=udp', username: process.env.NEXT_PUBLIC_TURN_USER || '', credential: process.env.NEXT_PUBLIC_TURN_CRED || '' },
    ]),
  }), [])

  useEffect(() => {
    return () => {
      try {
        pcRef.current?.getSenders().forEach((s) => s.track && s.track.stop())
        pcRef.current?.getReceivers().forEach((r) => r.track && r.track.stop && r.track.stop())
        pcRef.current?.close()
      } catch {}
      pcRef.current = null
    }
  }, [])

  const startLocal = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    if (localVideoRef.current) localVideoRef.current.srcObject = stream
    return stream
  }

  const join = async () => {
    if (!meetingId) return
    setIsJoining(true)
    setStatus('Initializing connection...')
    try {
      const pc = new RTCPeerConnection(rtcConfig)
      pcRef.current = pc

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      }

      const localStream = await startLocal()
      localStream.getTracks().forEach((t) => pc.addTrack(t, localStream))

      // Placeholder: signaling not implemented. This page ensures ICE config is valid.
      setStatus('Ready. Signaling server not configured in this build.')
    } catch (e: any) {
      console.error('Join error:', e)
      setStatus(e?.message || 'Failed to join')
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <AppShell
      menu={[
        { href: '/patient', label: 'Overview' },
        { href: '/doctor/meetings', label: 'Teleconsultations' },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meeting</h1>
            <p className="text-gray-600 mt-1">ID: {meetingId}</p>
          </div>
          <a href="/doctor/meetings" className="btn-outline">Back</a>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Details</h3>
          </div>
          <div className="card-body">
            {error && <div className="text-red-600">Failed to load meeting</div>}
            {!error && !data && <div className="text-gray-500">Loading...</div>}
            {data?.data?.meeting && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p><span className="font-medium">Title:</span> {data.data.meeting.title || 'Video Consultation'}</p>
                  <p><span className="font-medium">Status:</span> {data.data.meeting.status}</p>
                </div>
                <div>
                  <p><span className="font-medium">Start:</span> {new Date(data.data.meeting.startTime).toLocaleString()}</p>
                  <p><span className="font-medium">End:</span> {data.data.meeting.endTime ? new Date(data.data.meeting.endTime).toLocaleString() : '—'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Local</h3>
            </div>
            <div className="card-body">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full rounded-lg bg-black aspect-video" />
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Remote</h3>
            </div>
            <div className="card-body">
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full rounded-lg bg-black aspect-video" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex items-center justify-between">
            <div className="text-sm text-gray-600">{status || 'Click join to initialize devices and connection.'}</div>
            <div className="space-x-3">
              <button onClick={join} disabled={isJoining} className="btn-primary">
                {isJoining ? 'Joining...' : 'Join'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

