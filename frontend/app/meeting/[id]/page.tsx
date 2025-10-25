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
  const [iceWarning, setIceWarning] = useState<string|null>(null)
  const [mediaError, setMediaError] = useState<string|null>(null)
  const [participants, setParticipants] = useState<UserBrief[]>([])
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [screenOn, setScreenOn] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'poor' | 'disconnected'>('connecting')
  const [userMessages, setUserMessages] = useState<Array<{id: string, type: 'info' | 'success' | 'warning' | 'error', message: string, timestamp: number}>>([])
  const [meetingDuration, setMeetingDuration] = useState(0)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const socketRef = useRef<any>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)
  const remoteUserRef = useRef<string | null>(null)
  const pendingRemoteCandidatesRef = useRef<RTCIceCandidateInit[]>([])
  const statsIntervalRef = useRef<any>(null)
  const iceRestartTimerRef = useRef<any>(null)

  // Detect production vs development environment
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname === 'www.onehealthline.com' || window.location.hostname === 'onehealthline.com')
  const API_BASE = isProduction 
    ? 'https://api.onehealthline.com' 
    : (process.env.NEXT_PUBLIC_API_URL || 'https://api.onehealthline.com')
  
  const WS_URL = isProduction 
    ? 'https://api.onehealthline.com' 
    : 'https://api.onehealthline.com'
  
  // Override any malformed environment variables
  if (typeof window !== 'undefined') {
    // Clear any cached malformed URLs
    delete (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_WS_URL
    
    // Completely disable the problematic environment variable
    process.env.NEXT_PUBLIC_WS_URL = undefined
    delete process.env.NEXT_PUBLIC_WS_URL
  }
  
  // Ensure proper WebSocket URL format
  const getSocketURL = () => {
    // Use the detected URL (production or development)
    let url = WS_URL
    
    // Additional safety: clean any potential malformed URLs
    url = url.replace(/%20/g, '')
    url = url.replace(/^ws:\/\/%20/, 'ws://')
    url = url.replace(/^http:\/\/%20/, 'http://')
    url = url.replace(/^https:\/\/%20/, 'https://')
    url = url.replace(/^ws:\/\/http/, 'ws://')
    url = url.replace(/^ws:\/\/https/, 'wss://')
    url = url.replace(/^http:\/\/http/, 'http://')
    url = url.replace(/^http:\/\/https/, 'https://')
    url = url.replace(/^ws:\/\/%20http/, 'ws://')
    url = url.replace(/^ws:\/\/%20https/, 'wss://')
    url = url.replace(/^http:\/\/%20http/, 'http://')
    url = url.replace(/^http:\/\/%20https/, 'https://')
    
    // Ensure it starts with http:// or https:// (not ws://)
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = (isProduction ? 'https://' : 'http://') + url
    }
    
    console.log('🔧 Cleaned WebSocket URL:', url)
    console.log('🔍 Is Production:', isProduction)
    console.log('🔍 Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side')
    console.log('🔍 Original WS_URL:', WS_URL)
    console.log('🔍 Environment WS_URL:', process.env.NEXT_PUBLIC_WS_URL)
    return url
  }

  // Helper functions for user experience
  const addUserMessage = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
    const id = Date.now().toString()
    setUserMessages(prev => [...prev.slice(-4), { id, type, message, timestamp: Date.now() }])
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setUserMessages(prev => prev.filter(msg => msg.id !== id))
    }, 5000)
  }

  // Google Meet-style notifications
  const notifyUserJoined = (userName: string) => {
    addUserMessage('success', `👋 ${userName} joined the meeting`)
  }

  const notifyUserLeft = (userName: string) => {
    addUserMessage('info', `👋 ${userName} left the meeting`)
  }

  const notifyConnectionIssue = (issue: string) => {
    addUserMessage('warning', `⚠️ ${issue}`)
  }

  const notifyReconnecting = () => {
    addUserMessage('info', '🔄 Reconnecting...')
  }

  const updateConnectionStatus = (status: 'connecting' | 'connected' | 'poor' | 'disconnected') => {
    setConnectionStatus(status)
    
    switch (status) {
      case 'connected':
        addUserMessage('success', '✅ Connected to meeting')
        break
      case 'connecting':
        addUserMessage('info', '🔄 Connecting to meeting...')
        break
      case 'poor':
        addUserMessage('warning', '⚠️ Poor connection detected')
        break
      case 'disconnected':
        addUserMessage('error', '❌ Connection lost')
        break
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

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

  const [dynamicIce, setDynamicIce] = useState<RTCIceServer[] | null>(null)
  const defaultIce: RTCIceServer[] = useMemo(() => ([
    { urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] },
  ]), [])

  function attachPcEventHandlers(pc: RTCPeerConnection) {
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        console.log('[ICE] local candidate -> emit', event.candidate)
        socketRef.current.emit('ice-candidate', event.candidate, id, remoteUserRef.current)
      }
    }

    pc.ontrack = (event) => {
      console.log('[RTC] ontrack received', event.streams?.[0]?.getTracks()?.map(t=>({ kind: t.kind, id: t.id, enabled: t.enabled })))
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    pc.oniceconnectionstatechange = () => {
      setStatus(`ICE: ${pc.iceConnectionState}`)
      const now = new Date().toISOString()
      console.log(`[ICE][${now}] state`, pc.iceConnectionState)
      if (pc.iceConnectionState === 'connected') {
        setIceWarning(null)
        setTimeout(() => setStatus('Ready'), 800)
      }
      if (pc.iceConnectionState === 'checking' || pc.iceConnectionState === 'disconnected') {
        setIceWarning('Connection is taking longer than expected. Please check your network or try rejoining.')
        if (iceRestartTimerRef.current) clearTimeout(iceRestartTimerRef.current)
        iceRestartTimerRef.current = setTimeout(() => {
          if (pcRef.current && (pcRef.current.iceConnectionState === 'checking' || pcRef.current.iceConnectionState === 'disconnected')) {
            setIceWarning('ICE connection is stuck. Please refresh or rejoin the meeting.')
          }
        }, 10000)
      } else {
        setIceWarning(null)
      }
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        // Debounced ICE restart
        if (iceRestartTimerRef.current) clearTimeout(iceRestartTimerRef.current)
        iceRestartTimerRef.current = setTimeout(async () => {
          try {
            if (!pcRef.current || pcRef.current.signalingState === 'closed') return
            if (!remoteUserRef.current) return
            console.log('[ICE] attempting ICE restart')
            const offer = await pcRef.current.createOffer({ iceRestart: true })
            await pcRef.current.setLocalDescription(offer)
            socketRef.current?.emit('offer', pcRef.current.localDescription, id, remoteUserRef.current)
          } catch (e) {
            console.warn('[ICE] restart failed', e)
          }
        }, 1200)
      }
    }

    pc.onsignalingstatechange = () => {
      const now = new Date().toISOString()
      console.log(`[RTC][${now}] signalingState`, pc.signalingState)
    }

    pc.onconnectionstatechange = () => {
      const now = new Date().toISOString()
      console.log(`[RTC][${now}] connectionState`, pc.connectionState)
    }

    pc.onnegotiationneeded = async () => {
      try {
        if (pc.signalingState !== 'stable') { console.log('[RTC] skip negotiationneeded, not stable'); return }
        if (!remoteUserRef.current) { console.log('[RTC] skip negotiationneeded, no remoteUser yet'); return }
        console.log('[SDP] negotiationneeded creating offer')
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socketRef.current?.emit('offer', pc.localDescription, id, remoteUserRef.current)
      } catch (e) {
        console.warn('[RTC] negotiationneeded error', e)
      }
    }
  }

  async function createPeerConnection(): Promise<RTCPeerConnection> {
    // Only create once per session
    if (pcRef.current) return pcRef.current
    const pc = new RTCPeerConnection({ iceServers: dynamicIce || defaultIce })
    pcRef.current = pc
    attachPcEventHandlers(pc)

    // Attach local tracks only once
    if (!localStreamRef.current) {
      try {
        // Add timeout to prevent hanging
        const mediaPromise = navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Media access timeout')), 10000)
        )
        const stream = await Promise.race([mediaPromise, timeoutPromise]) as MediaStream
        localStreamRef.current = stream
        if (localVideoRef.current) localVideoRef.current.srcObject = stream
      } catch (err) {
        setMediaError('Could not access camera or microphone. Please check permissions.')
        setStatus('Media error')
        throw err
      }
    }
    // Add tracks only if not already added
    if (localStreamRef.current && pc.getSenders().length === 0) {
      localStreamRef.current.getTracks().forEach((track) => {
        try { pc.addTrack(track, localStreamRef.current as MediaStream) } catch (err) { console.warn('addTrack error', err) }
      })
    }
    return pc
  }

  function clearRemoteMedia() {
    if (remoteVideoRef.current) {
      const ms = remoteVideoRef.current.srcObject as MediaStream | null
      if (ms) ms.getTracks().forEach((t) => t.stop())
      remoteVideoRef.current.srcObject = null
    }
  }

  useEffect(() => {
    let mounted = true
  if (!token) { setStatus('Not authenticated'); return }
  if (!id) { setStatus('Invalid meeting'); return }
  setMediaError(null)

  // Set meeting status to in-progress when component mounts
  const setMeetingInProgress = async () => {
    try {
      await api.meetings.updateStatus(id, 'in-progress')
      addUserMessage('success', '🎉 Meeting started successfully')
      
      // Start duration tracking
      const startTime = Date.now()
      const interval = setInterval(() => {
        setMeetingDuration(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      
      // Store interval reference for cleanup
      statsIntervalRef.current = interval
    } catch (error) {
      console.warn('Failed to update meeting status:', error)
      addUserMessage('error', '❌ Failed to start meeting')
    }
  }
  setMeetingInProgress()

    let isMakingOffer = false
    let ignoreOffer = false
    // Polite peer logic: only the second user to join is polite
    const politeRef = { current: false }

    ;(async () => {
      try {
        // Fetch fresh TURN credentials from backend
        try {
          const turn = await (api as any).meetings.getTurnToken()
          const urls = String(turn?.data?.WEBRTC_TURN_URLS || '')
          const user = String(turn?.data?.WEBRTC_TURN_USER || '')
          const pass = String(turn?.data?.WEBRTC_TURN_PASS || '')
          if (urls && user && pass) {
            const servers: RTCIceServer[] = urls.split(',').map((u: string) => ({ urls: u.trim(), username: user, credential: pass }))
            setDynamicIce([{ urls: ['stun:stun.l.google.com:19302'] }, ...servers])
          }
        } catch (e) {
          console.warn('TURN fetch failed, using default STUN only')
        }
        const { io } = await import('socket.io-client')
        const socketURL = getSocketURL()
        console.log('🔌 Connecting to socket:', socketURL)
        console.log('🔍 Environment WS_URL:', process.env.NEXT_PUBLIC_WS_URL)
        console.log('🔍 Final socketURL:', socketURL)
        
        // Force override any malformed environment variables
        const originalEnv = process.env.NEXT_PUBLIC_WS_URL
        process.env.NEXT_PUBLIC_WS_URL = socketURL
        
        // Clean up any existing socket connections first
        if (socketRef.current) {
          socketRef.current.disconnect()
          socketRef.current = null
        }
        
        // Disconnect any existing Socket.IO connections globally
        if (typeof window !== 'undefined' && (window as any).io) {
          const existingSockets = (window as any).io.sockets || []
          existingSockets.forEach((socket: any) => {
            if (socket && socket.disconnect) {
              socket.disconnect()
            }
          })
        }

        // Override Socket.IO URL construction to prevent malformed URLs
        const originalIo = (window as any).io
        if (originalIo) {
          const originalConnect = originalIo.prototype.connect
          originalIo.prototype.connect = function(url: string, opts: any) {
            // Force clean URL
            const cleanUrl = url.replace(/%20/g, '').replace(/^wss:\/\/%20/, 'wss://').replace(/^ws:\/\/%20/, 'ws://')
            console.log('🔧 Socket.IO URL override:', url, '->', cleanUrl)
            return originalConnect.call(this, cleanUrl, opts)
          }
        }
        
        const socket = io(socketURL, { 
          auth: { token },
          transports: ['websocket', 'polling'],
          upgrade: true,
          rememberUpgrade: true,
          timeout: 20000,
          forceNew: true,
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 2000,
          reconnectionDelayMax: 10000,
          // Force proper URL construction
          autoConnect: true,
          multiplex: false,
          // Prevent multiple connections
          withCredentials: false
        })

        socket.on('connect_error', (error) => {
          console.error('[Socket] Connection error:', error)
          console.error('[Socket] Attempted URL:', socketURL)
          console.error('[Socket] Is Production:', isProduction)
          setStatus('Connection failed. Retrying...')
          addUserMessage('error', '❌ Connection failed. Retrying...')
        })

        socket.on('connect', () => {
          console.log('✅ Socket connected successfully')
          console.log('🔗 Socket connected to:', socketURL)
          console.log('🔗 Socket transport:', socket.io.engine.transport.name)
          console.log('🔗 Socket ID:', socket.id)
          setStatus('Connected')
          addUserMessage('success', '✅ Connected to meeting server')
          
          // Validate the connection is using the correct URL
          console.log('🔍 Socket connection validated successfully')
        })

        socket.on('disconnect', (reason) => {
          console.log('❌ Socket disconnected:', reason)
          setStatus('Disconnected')
          addUserMessage('warning', '⚠️ Connection lost. Reconnecting...')
        })
        socket.on('reconnect', async (attemptNumber) => {
          console.log('[Socket] Reconnected after', attemptNumber, 'attempts')
          setStatus('Reconnected. Rejoining...')
          await createPeerConnection()
          clearRemoteMedia()
          socket.emit('join-room', id, () => mounted && setStatus('Joined room'))
        })

        socketRef.current = socket

        // Clean any prior listeners to avoid duplicates (hot reload)
        socket.off('room-users'); socket.off('user-joined'); socket.off('user-left'); socket.off('offer'); socket.off('answer'); socket.off('ice-candidate')

        // Join signaling room using meeting_id
        socket.emit('join-room', id, () => mounted && setStatus('Joined room'))

        socket.on('room-users', async (users: UserBrief[]) => {
          if (!mounted) return
          setParticipants(users)
          const me = socket.id
          const other = users.find((u) => u.id !== me)
          remoteUserRef.current = other?.id || null
          // Only the second user to join is polite
          politeRef.current = users.length > 1 && other?.id === me ? true : false
          // Do not recreate peer connection here
        })

        socket.on('user-joined', async (userId: string) => {
          if (!mounted) return
          remoteUserRef.current = userId
          // Do not recreate peer connection here
          try {
            const pc = pcRef.current || await createPeerConnection()
            if (pc.signalingState !== 'stable') { console.log('[RTC] skip offer, signaling not stable'); return }
            isMakingOffer = true
            const offer = await pc.createOffer()
            console.log('[SDP] created local offer')
            await pc.setLocalDescription(offer)
            console.log('[SDP] setLocalDescription(offer)')
            socket.emit('offer', pc.localDescription, id, userId)
          } catch (e) {
            console.warn('[RTC] user-joined offer error', e)
          } finally {
            isMakingOffer = false
          }
        })

        socket.on('user-left', async (userId: string) => {
          if (!mounted) return
          setParticipants((prev) => prev.filter((p) => p.id !== userId))
          if (remoteUserRef.current === userId) remoteUserRef.current = null
          setStatus('A participant left the meeting')
          // Do not recreate peer connection here
          setTimeout(() => setStatus('Ready'), 1200)
        })

        socket.on('offer', async (offer: RTCSessionDescriptionInit, _roomId: string, senderId: string) => {
          try {
            const pc = pcRef.current || await createPeerConnection()
            const offerDesc = new RTCSessionDescription(offer)
            const readyForOffer = pc.signalingState === 'stable' || pc.signalingState === 'have-local-offer'
            const offerCollision = isMakingOffer || !readyForOffer
            ignoreOffer = !politeRef.current && offerCollision
            if (ignoreOffer) return

            if (offerCollision) {
              await Promise.all([
                pc.setLocalDescription({ type: 'rollback' } as any),
                (async ()=>{ console.log('[SDP] setRemoteDescription(offer) with rollback'); await pc.setRemoteDescription(offerDesc) })(),
              ])
            } else {
              console.log('[SDP] setRemoteDescription(offer)')
              await pc.setRemoteDescription(offerDesc)
            }

            const answer = await pc.createAnswer()
            console.log('[SDP] created local answer')
            await pc.setLocalDescription(answer)
            console.log('[SDP] setLocalDescription(answer)')
            remoteUserRef.current = senderId
            socket.emit('answer', pc.localDescription, id, senderId)
            // Flush buffered ICE if any
            if (pendingRemoteCandidatesRef.current.length) {
              for (const c of pendingRemoteCandidatesRef.current) {
                try { await pc.addIceCandidate(new RTCIceCandidate(c)) } catch {}
              }
              pendingRemoteCandidatesRef.current = []
            }
          } catch (e) {
            console.warn('[RTC] offer handling error', e)
          }
        })

        socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
          try {
            const pc = pcRef.current
            if (!pc) return
            if (pc.signalingState !== 'have-local-offer') { console.log('[SDP] skip setRemoteDescription(answer) wrong state', pc.signalingState); return }
            console.log('[SDP] setRemoteDescription(answer)')
            await pc.setRemoteDescription(new RTCSessionDescription(answer))
            // Flush buffered ICE if any (fix)
            if (pendingRemoteCandidatesRef.current.length) {
              for (const c of pendingRemoteCandidatesRef.current) {
                try { await pc.addIceCandidate(new RTCIceCandidate(c)) } catch {}
              }
              pendingRemoteCandidatesRef.current = []
            }
          } catch (e) {
            console.warn('[RTC] answer handling error', e)
          }
        })

        socket.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
          try {
            const pc = pcRef.current || await createPeerConnection()
            if (!pc.remoteDescription) {
              console.log('[ICE] buffering remote candidate before SRD')
              pendingRemoteCandidatesRef.current.push(candidate)
              return
            }
            console.log('[ICE] addIceCandidate')
            await pc.addIceCandidate(new RTCIceCandidate(candidate))
          } catch (e) {
            console.warn('[ICE] addIceCandidate error', e)
          }
        })

        // Periodic stats
        if (statsIntervalRef.current) clearInterval(statsIntervalRef.current)
        statsIntervalRef.current = setInterval(async () => {
          try {
            const pc = pcRef.current
            if (!pc) return
            const stats = await pc.getStats()
            let outbound = 0, inbound = 0
            stats.forEach((r) => {
              if ((r.type === 'outbound-rtp') && !r.isRemote) outbound += (r.bytesSent || 0)
              if ((r.type === 'inbound-rtp') && !r.isRemote) inbound += (r.bytesReceived || 0)
            })
            console.log('[STATS] bytes outbound/inbound', outbound, inbound)
          } catch {}
        }, 3000)

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
      if (statsIntervalRef.current) { clearInterval(statsIntervalRef.current); statsIntervalRef.current = null }
      if (iceRestartTimerRef.current) { clearTimeout(iceRestartTimerRef.current); iceRestartTimerRef.current = null }
      pcRef.current = null
      localStreamRef.current = null
      screenStreamRef.current = null
      clearRemoteMedia()
      
      // Set meeting status to completed when leaving
      const setMeetingCompleted = async () => {
        try {
          await api.meetings.updateStatus(id, 'completed')
        } catch (error) {
          console.warn('Failed to update meeting status on leave:', error)
        }
      }
      setMeetingCompleted()
    }
  }, [WS_URL, id, token, defaultIce, dynamicIce])

  const toggleMic = () => {
    const enabled = !micOn
    setMicOn(enabled)
    localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = enabled))
    // Never remove/add tracks, just enable/disable
  }

  const toggleCam = () => {
    const enabled = !camOn
    setCamOn(enabled)
    localStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = enabled))
    // Never remove/add tracks, just enable/disable
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

  // Dynamic menu based on user role
  const getMenuItems = () => {
    if (user?.role === 'doctor') {
      return [
        { href: '/doctor', label: 'Overview' },
        { href: '/doctor/meetings', label: 'Teleconsultations' },
      ]
    } else if (user?.role === 'patient') {
      return [
        { href: '/patient', label: 'Dashboard' },
        { href: '/patient/appointments', label: 'My Appointments' },
      ]
    } else if (user?.role === 'admin') {
      return [
        { href: '/admin', label: 'Admin Dashboard' },
        { href: '/admin/meetings', label: 'All Meetings' },
      ]
    }
    return []
  }

  return (
    <AppShell
      menu={getMenuItems()}
    >
      <div className="relative -m-6 p-6 bg-gradient-to-br from-blue-50 via-white to-emerald-50 min-h-[calc(100vh-4rem)]">
        {mediaError && (
          <div className="alert alert-error mb-4">{mediaError}</div>
        )}
        {iceWarning && (
          <div className="alert alert-warning mb-4">{iceWarning}</div>
        )}
        
        {/* Google Meet-style Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {userMessages.map((msg) => (
            <div
              key={msg.id}
              className={`px-4 py-3 rounded-lg shadow-lg border-l-4 transition-all duration-300 ${
                msg.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' :
                msg.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
                msg.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
                'bg-blue-50 border-blue-400 text-blue-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{msg.message}</span>
                <button
                  onClick={() => setUserMessages(prev => prev.filter(m => m.id !== msg.id))}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
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
                      {participants.map((p, index) => (
                        <div key={`${p.id}-${index}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
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
                        {rx.medications.map((m: any, idx: number) => {
                          // Use a unique key for each medication (fallback to idx if no name/dosage)
                          const medKey = m.name && m.dosage ? `${m.name}-${m.dosage}-${idx}` : `med-${idx}`
                          return (
                            <div key={medKey} className="grid grid-cols-2 gap-2">
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
                          )
                        })}
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

