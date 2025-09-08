"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import { AppShell } from '@/components/layout/AppShell'
import { api } from '@/lib/api'

type UserBrief = { id: string; name?: string }

export default function MeetingRoom() {
  const { id } = useParams<{ id: string }>()
  const token = Cookies.get('token')

  const [status, setStatus] = useState<string>('Initializing...')
  const [participants, setParticipants] = useState<UserBrief[]>([])
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [screenOn, setScreenOn] = useState(false)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const socketRef = useRef<any>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)
  const remoteUserRef = useRef<string | null>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  // Fetch meeting meta (optional, for header details)
  const { data: meetingData } = useSWR(() => (id ? `meeting-${id}` : null), () => api.meetings.get(id) as any)
  const meeting = (meetingData as any)?.data?.meeting

  const iceServers: RTCIceServer[] = useMemo(() => ([
    { urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] },
    // If you have TURN creds, you can add them here
    // { urls: 'turn:global.turn.twilio.com:3478?transport=udp', username: process.env.NEXT_PUBLIC_TURN_USER || '', credential: process.env.NEXT_PUBLIC_TURN_CRED || '' }
  ]), [])

  useEffect(() => {
    let mounted = true
    if (!token) { setStatus('Not authenticated'); return }
    if (!id) { setStatus('Invalid meeting'); return }

    let isMakingOffer = false
    let ignoreOffer = false
    const polite = true // resolve glare by being polite on this side

    ;(async () => {
      try {
        const { io } = await import('socket.io-client')
        const socket = io(API_BASE, { auth: { token } })
        socketRef.current = socket

        const pc = new RTCPeerConnection({ iceServers })
        pcRef.current = pc

        pc.onicecandidate = (event) => {
          if (event.candidate && socketRef.current) {
            socketRef.current.emit('ice-candidate', event.candidate, id, remoteUserRef.current)
          }
        }

        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0]
          }
        }

        // Local media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        localStreamRef.current = stream
        stream.getTracks().forEach((track) => pc.addTrack(track, stream))
        if (localVideoRef.current) localVideoRef.current.srcObject = stream

        // Clean any prior listeners to avoid duplicates (hot reload)
        socket.off('room-users'); socket.off('user-joined'); socket.off('offer'); socket.off('answer'); socket.off('ice-candidate')

        // Join signaling room using meeting_id
        socket.emit('join-room', id, () => mounted && setStatus('Joined room'))

        socket.on('room-users', (users: UserBrief[]) => {
          if (!mounted) return
          setParticipants(users)
          const me = socket.id
          const other = users.find((u) => u.id !== me)
          remoteUserRef.current = other?.id || null
        })

        socket.on('user-joined', async (userId: string) => {
          if (!mounted) return
          remoteUserRef.current = userId
          try {
            if (pc.signalingState !== 'stable') return
            isMakingOffer = true
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)
            socket.emit('offer', pc.localDescription, id, userId)
          } catch {
            // ignore
          } finally {
            isMakingOffer = false
          }
        })

        socket.on('offer', async (offer: RTCSessionDescriptionInit, _roomId: string, senderId: string) => {
          try {
            const offerDesc = new RTCSessionDescription(offer)
            const readyForOffer = pc.signalingState === 'stable' || pc.signalingState === 'have-local-offer'
            const offerCollision = isMakingOffer || !readyForOffer
            ignoreOffer = !polite && offerCollision
            if (ignoreOffer) return

            if (offerCollision) {
              await Promise.all([
                pc.setLocalDescription({ type: 'rollback' } as any),
                pc.setRemoteDescription(offerDesc),
              ])
            } else {
              await pc.setRemoteDescription(offerDesc)
            }

            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            remoteUserRef.current = senderId
            socket.emit('answer', pc.localDescription, id, senderId)
          } catch {
            // ignore
          }
        })

        socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
          try {
            if (pc.signalingState !== 'have-local-offer') return
            await pc.setRemoteDescription(new RTCSessionDescription(answer))
          } catch {
            // ignore
          }
        })

        socket.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate))
          } catch {
            // ignore
          }
        })

        setStatus('Ready')
      } catch (e: any) {
        setStatus(e?.message || 'Failed to initialize meeting')
      }
    })()

    return () => {
      mounted = false
      try { socketRef.current?.disconnect?.() } catch {}
      try { pcRef.current?.close?.() } catch {}
      localStreamRef.current?.getTracks()?.forEach((t) => t.stop())
      screenStreamRef.current?.getTracks()?.forEach((t) => t.stop())
      pcRef.current = null
      localStreamRef.current = null
      screenStreamRef.current = null
    }
  }, [API_BASE, id, token, iceServers])

  const toggleMic = () => {
    const enabled = !micOn
    setMicOn(enabled)
    localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = enabled))
  }

  const toggleCam = () => {
    const enabled = !camOn
    setCamOn(enabled)
    localStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = enabled))
  }

  const toggleScreen = async () => {
    if (!pcRef.current) return
    if (!screenOn) {
      try {
        const display = await (navigator.mediaDevices as any).getDisplayMedia({ video: true })
        screenStreamRef.current = display
        const screenTrack = display.getVideoTracks()[0]
        const sender = pcRef.current.getSenders().find((s) => s.track && s.track.kind === 'video')
        if (sender) await sender.replaceTrack(screenTrack)
        screenTrack.onended = async () => {
          // revert back to camera
          const camTrack = localStreamRef.current?.getVideoTracks()[0]
          if (camTrack && pcRef.current) {
            const sender2 = pcRef.current.getSenders().find((s) => s.track && s.track.kind === 'video')
            if (sender2) await sender2.replaceTrack(camTrack)
          }
          setScreenOn(false)
        }
        setScreenOn(true)
      } catch {
        // ignore
      }
    } else {
      const camTrack = localStreamRef.current?.getVideoTracks()[0]
      if (camTrack) {
        const sender = pcRef.current.getSenders().find((s) => s.track && s.track.kind === 'video')
        if (sender) await sender.replaceTrack(camTrack)
      }
      screenStreamRef.current?.getTracks().forEach((t) => t.stop())
      setScreenOn(false)
    }
  }

  const copyLink = async () => {
    const link = typeof window !== 'undefined' ? window.location.href : ''
    try { await navigator.clipboard.writeText(link) } catch {}
    setStatus('Link copied to clipboard')
    setTimeout(() => setStatus('Ready'), 1500)
  }

  return (
    <AppShell
      menu={[
        { href: '/doctor', label: 'Overview' },
        { href: '/doctor/meetings', label: 'Teleconsultations' },
      ]}
    >
      <div className="relative -m-6 p-6 bg-gradient-to-br from-blue-50 via-white to-emerald-50 min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {status}
              </div>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">Teleconsultation</h1>
              <p className="text-gray-600">{meeting?.title || 'Secure video consultation'}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={copyLink} className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm">Copy Link</button>
              <a href="/doctor/meetings" className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-sm">Leave</a>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Stage */}
            <div className="lg:col-span-3 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video shadow-lg ring-1 ring-black/5">
                <video ref={remoteVideoRef} className="w-full h-full object-cover" playsInline autoPlay />
                {!remoteVideoRef.current?.srcObject && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5M3 8.25h18M3 15.75h18"/></svg>
                    </div>
                    Waiting for participant...
                  </div>
                )}
                {/* Floating Controls */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-3">
                  <button onClick={toggleMic} className={`backdrop-blur px-4 py-2 rounded-full shadow-md border ${micOn ? 'bg-white/70 border-gray-200 text-gray-800' : 'bg-red-600 text-white border-red-600'}`}>
                    {micOn ? 'Mute' : 'Unmute'}
                  </button>
                  <button onClick={toggleCam} className={`backdrop-blur px-4 py-2 rounded-full shadow-md border ${camOn ? 'bg-white/70 border-gray-200 text-gray-800' : 'bg-red-600 text-white border-red-600'}`}>
                    {camOn ? 'Camera Off' : 'Camera On'}
                  </button>
                  <button onClick={toggleScreen} className={`backdrop-blur px-4 py-2 rounded-full shadow-md border ${screenOn ? 'bg-red-600 text-white border-red-600' : 'bg-white/70 border-gray-200 text-gray-800'}`}>
                    {screenOn ? 'Stop Share' : 'Share Screen'}
                  </button>
                  <a href="/doctor/meetings" className="px-4 py-2 rounded-full shadow-md border bg-red-600 text-white border-red-600">End</a>
                </div>
              </div>
              {/* Local preview */}
              <div className="rounded-2xl overflow-hidden bg-white shadow ring-1 ring-black/5 p-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl overflow-hidden bg-gray-900 aspect-video ring-1 ring-white/10">
                    <video ref={localVideoRef} className="w-full h-full object-cover" playsInline autoPlay muted />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="text-xs text-gray-500">Meeting ID</div>
                      <div className="text-sm font-medium text-gray-800 truncate">{id}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="text-xs text-gray-500">Start Time</div>
                      <div className="text-sm font-medium text-gray-800">{meeting?.startTime ? new Date(meeting.startTime).toLocaleString() : '—'}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="text-xs text-gray-500">Status</div>
                      <div className="text-sm font-medium text-emerald-700">{status}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="text-xs text-gray-500">Participants</div>
                      <div className="text-sm font-medium text-gray-800">{participants.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl overflow-hidden bg-white shadow ring-1 ring-black/5">
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Participants</h3>
                </div>
                <div className="p-4 max-h-[50vh] overflow-auto">
                  {participants.length ? (
                    <div className="space-y-2">
                      {participants.map((p) => (
                        <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                            {(p.name || p.id).charAt(0).toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-800 truncate">{p.name || p.id}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No other participants yet.</div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden bg-white shadow ring-1 ring-black/5">
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Notes</h3>
                </div>
                <div className="p-4">
                  <textarea className="input h-28" placeholder="Write important notes here..."></textarea>
                  <div className="mt-3 flex justify-end">
                    <button className="btn-primary btn-sm">Save Notes</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

