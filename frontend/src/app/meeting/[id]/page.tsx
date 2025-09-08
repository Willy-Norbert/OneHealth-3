"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import { AppShell } from '@/components/layout/AppShell'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'

type UserBrief = { id: string; name?: string }

export default function MeetingRoom() {
  const { id } = useParams<{ id: string }>()
  const token = Cookies.get('token')
  const { user } = useAuth() as any

  const [status, setStatus] = useState<string>('Initializing...')
  const [participants, setParticipants] = useState<UserBrief[]>([])
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [screenOn, setScreenOn] = useState(false)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const socketRef = useRef<any>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)
  const remoteUserRef = useRef<string | null>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  // Fetch meeting meta (optional, for header details)
  const { data: meetingData } = useSWR(() => (id ? `meeting-${id}` : null), () => api.meetings.get(id) as any)
  const meeting = (meetingData as any)?.data?.meeting
  // For prescriptions - try to locate the linked appointment for this meeting
  const shouldFetchDoctorAppts = !!user && user.role === 'doctor'
  const { data: myDoctorAppts } = useSWR(() => (shouldFetchDoctorAppts ? 'my-doctor-appts' : null), () => api.appointments.myDoctor() as any)
  const currentAppointmentId = (() => {
    const patientId = meeting?.patient?._id || meeting?.patient
    const list = (myDoctorAppts as any)?.data?.appointments || []
    const byPatient = list.filter((a: any) => String(a.patient?._id || a.patient) === String(patientId) && a.appointmentType === 'virtual')
    if (!byPatient.length) return undefined
    // Prefer the one closest to now
    byPatient.sort((a: any, b: any) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
    return byPatient[0]?._id
  })()

  // Quick Prescription form state
  const [rxSubmitting, setRxSubmitting] = useState(false)
  const [rxMsg, setRxMsg] = useState<string>('')
  const [rx, setRx] = useState<any>({
    diagnosis: '',
    notes: '',
    medications: [{ name: '', dosage: '', frequency: '', instructions: '' }]
  })
  const addMed = () => setRx((prev: any) => ({ ...prev, medications: [...prev.medications, { name: '', dosage: '', frequency: '', instructions: '' }] }))
  const removeMed = (idx: number) => setRx((prev: any) => ({ ...prev, medications: prev.medications.filter((_: any, i: number) => i !== idx) }))
  const changeMed = (idx: number, field: string, value: string) => setRx((prev: any) => ({
    ...prev,
    medications: prev.medications.map((m: any, i: number) => i === idx ? { ...m, [field]: value } : m)
  }))
  const submitRx = async () => {
    if (user?.role !== 'doctor') { setRxMsg('Only doctors can create prescriptions'); return }
    if (!meeting?.patient?._id) { setRxMsg('Missing patient'); return }
    if (!currentAppointmentId) { setRxMsg('No linked virtual appointment found for this meeting'); return }
    setRxSubmitting(true)
    setRxMsg('')
    try {
      const payload = {
        patient: meeting.patient._id,
        appointment: currentAppointmentId,
        diagnosis: rx.diagnosis,
        medications: rx.medications.filter((m: any) => m.name && m.dosage && m.frequency),
        notes: rx.notes,
      }
      await api.prescriptions.create(payload as any)
      setRxMsg('Prescription saved')
      setRx({ diagnosis: '', notes: '', medications: [{ name: '', dosage: '', frequency: '', instructions: '' }] })
    } catch (e: any) {
      setRxMsg(e?.message || 'Failed to save prescription')
    } finally {
      setRxSubmitting(false)
      setTimeout(() => setRxMsg(''), 2500)
    }
  }

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
    const politeRef = { current: false } // default: existing user is impolite; joiner becomes polite

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
        socket.off('room-users'); socket.off('user-joined'); socket.off('user-left'); socket.off('offer'); socket.off('answer'); socket.off('ice-candidate')

        // Join signaling room using meeting_id
        socket.emit('join-room', id, () => mounted && setStatus('Joined room'))

        socket.on('room-users', (users: UserBrief[]) => {
          if (!mounted) return
          setParticipants(users)
          const me = socket.id
          const other = users.find((u) => u.id !== me)
          remoteUserRef.current = other?.id || null
          // If I received room-users, I am the joiner => be polite
          politeRef.current = true
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

        // Notify when someone leaves
        socket.on('user-left', (userId: string) => {
          if (!mounted) return
          setParticipants((prev) => prev.filter((p) => p.id !== userId))
          setStatus('A participant left the meeting')
          setTimeout(() => setStatus('Ready'), 1500)
        })

        socket.on('offer', async (offer: RTCSessionDescriptionInit, _roomId: string, senderId: string) => {
          try {
            const offerDesc = new RTCSessionDescription(offer)
            const readyForOffer = pc.signalingState === 'stable' || pc.signalingState === 'have-local-offer'
            const offerCollision = isMakingOffer || !readyForOffer
            ignoreOffer = !politeRef.current && offerCollision
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

        // Also initiate negotiation if needed (e.g., tracks added later)
        pc.onnegotiationneeded = async () => {
          try {
            if (pc.signalingState !== 'stable') return
            if (!remoteUserRef.current) return
            if (isMakingOffer) return
            isMakingOffer = true
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)
            socket.emit('offer', pc.localDescription, id, remoteUserRef.current)
          } finally {
            isMakingOffer = false
          }
        }

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

  const toggleFullscreen = () => {
    const el = stageRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {})
    } else {
      document.exitFullscreen?.().catch(() => {})
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
              <div ref={stageRef} className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video shadow-lg ring-1 ring-black/5">
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
                  <button onClick={toggleMic} className={`backdrop-blur px-4 py-2 rounded-full shadow-md border ${micOn ? 'bg-white/80 border-gray-200 text-gray-800 hover:bg-white' : 'bg-red-600 text-white border-red-600'}`} title={micOn ? 'Mute microphone' : 'Unmute microphone'}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {micOn ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5a3 3 0 00-3 3v7.5a3 3 0 106 0V4.5a3 3 0 00-3-3zM19.5 10.5a7.5 7.5 0 01-15 0M12 22.5v-3" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9 9v3.75a3 3 0 004.243 2.773M15 10.5V4.5a3 3 0 00-5.96-.6" />
                      )}
                    </svg>
                  </button>
                  <button onClick={toggleCam} className={`backdrop-blur px-4 py-2 rounded-full shadow-md border ${camOn ? 'bg-white/80 border-gray-200 text-gray-800 hover:bg-white' : 'bg-red-600 text-white border-red-600'}`} title={camOn ? 'Turn camera off' : 'Turn camera on'}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {camOn ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5A2.25 2.25 0 015.25 5.25h7.5A2.25 2.25 0 0115 7.5v1.06l3.22-1.933A1.125 1.125 0 0120 7.56v8.88a1.125 1.125 0 01-1.78.933L15 15.439V16.5a2.25 2.25 0 01-2.25 2.25h-7.5A2.25 2.25 0 013 16.5v-9z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.75 9.75H5.25A2.25 2.25 0 003 12v4.5A2.25 2.25 0 005.25 18.75h7.5A2.25 2.25 0 0015 16.5v-.439l3.22 1.873A1.125 1.125 0 0020 16.999V9.06a1.125 1.125 0 00-1.78-.933L15 10.06M9.75 9.75l4.5 4.5" />
                      )}
                    </svg>
                  </button>
                  <button onClick={toggleScreen} className={`backdrop-blur px-4 py-2 rounded-full shadow-md border ${screenOn ? 'bg-red-600 text-white border-red-600' : 'bg-white/80 border-gray-200 text-gray-800 hover:bg-white'}`} title={screenOn ? 'Stop sharing' : 'Share screen'}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5A1.5 1.5 0 0121.75 6v7.5A1.5 1.5 0 0120.25 15H3.75A1.5 1.5 0 012.25 13.5V6A1.5 1.5 0 013.75 4.5zM6 19.5h12" />
                    </svg>
                  </button>
                  <button onClick={toggleFullscreen} className="backdrop-blur px-4 py-2 rounded-full shadow-md border bg-white/80 border-gray-200 text-gray-800 hover:bg-white" title="Fullscreen">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9V4.5H8.25M15.75 4.5H20.25V9M20.25 15V19.5H15.75M8.25 19.5H3.75V15" />
                    </svg>
                  </button>
                  <a href="/doctor/meetings" className="px-4 py-2 rounded-full shadow-md border bg-red-600 text-white border-red-600" title="End call">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 13.5c4.5-4.5 10.5-4.5 15 0l-3 3c-3-3-6-3-9 0l-3-3z" />
                    </svg>
                  </a>
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

              {/* Quick Prescription - visible to doctors only */}
              {user?.role === 'doctor' && (
                <div className="rounded-2xl overflow-hidden bg-white shadow ring-1 ring-black/5">
                  <div className="px-5 py-4 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900">Quick Prescription</h3>
                    <p className="text-xs text-gray-500 mt-1">Create and send a prescription to the current patient</p>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="form-label">Diagnosis</label>
                      <input className="input" value={rx.diagnosis} onChange={(e)=>setRx({ ...rx, diagnosis: e.target.value })} placeholder="e.g., Acute pharyngitis" />
                    </div>
                    <div>
                      <label className="form-label">Medications</label>
                      <div className="space-y-3">
                        {rx.medications.map((m: any, idx: number) => (
                          <div key={idx} className="grid grid-cols-2 gap-2">
                            <input className="input" placeholder="Name" value={m.name} onChange={(e)=>changeMed(idx,'name',e.target.value)} />
                            <input className="input" placeholder="Dosage" value={m.dosage} onChange={(e)=>changeMed(idx,'dosage',e.target.value)} />
                            <input className="input" placeholder="Frequency" value={m.frequency} onChange={(e)=>changeMed(idx,'frequency',e.target.value)} />
                            <input className="input" placeholder="Instructions (optional)" value={m.instructions} onChange={(e)=>changeMed(idx,'instructions',e.target.value)} />
                            <div className="col-span-2 flex justify-end">
                              {rx.medications.length > 1 && (
                                <button onClick={()=>removeMed(idx)} className="btn-outline btn-sm">Remove</button>
                              )}
                            </div>
                          </div>
                        ))}
                        <button onClick={addMed} className="btn-outline btn-sm">Add Medication</button>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Notes</label>
                      <textarea className="input h-20" value={rx.notes} onChange={(e)=>setRx({ ...rx, notes: e.target.value })} placeholder="Additional instructions" />
                    </div>
                    {rxMsg && <div className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded">{rxMsg}</div>}
                    <div className="flex justify-end">
                      <button onClick={submitRx} disabled={rxSubmitting} className="btn-primary btn-sm">{rxSubmitting ? 'Saving...' : 'Save Prescription'}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

