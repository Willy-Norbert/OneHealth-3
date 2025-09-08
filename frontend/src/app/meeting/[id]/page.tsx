"use client"
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Cookies from 'js-cookie'

type Signal = {
  type: 'offer' | 'answer' | 'ice-candidate' | 'user-joined' | 'room-users'
  payload?: any
}

export default function MeetingRoom() {
  const { id } = useParams<{ id: string }>()
  const token = Cookies.get('token')
  const [status, setStatus] = useState<string>('Initializing...')
  const [participants, setParticipants] = useState<Array<{ id: string; name: string }>>([])

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const socketRef = useRef<any>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteUserRef = useRef<string | null>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  useEffect(() => {
    let mounted = true
    if (!token) {
      setStatus('Not authenticated')
      return
    }

    ;(async () => {
      try {
        const { io } = await import('socket.io-client')
        const socket = io(API_BASE, { auth: { token } })
        socketRef.current = socket

        // IMPORTANT: STUN must not include query params; TURN can include transport with credentials
        const iceServers: RTCIceServer[] = [
          { urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] },
          // If you have TURN credentials, uncomment:
          // { urls: 'turn:global.turn.twilio.com:3478?transport=udp', username: process.env.NEXT_PUBLIC_TURN_USER!, credential: process.env.NEXT_PUBLIC_TURN_CRED! },
        ]

        const pc = new RTCPeerConnection({ iceServers })
        pcRef.current = pc

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', event.candidate, id, remoteUserRef.current)
          }
        }

        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0]
          }
        }

        // get local media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        localStreamRef.current = stream
        stream.getTracks().forEach((track) => pc.addTrack(track, stream))
        if (localVideoRef.current) localVideoRef.current.srcObject = stream

        // join room
        socket.emit('join-room', id, (_resp: any) => {
          if (!mounted) return
          setStatus('Joined room')
        })

        socket.on('room-users', (users: Array<{ id: string; name: string }>) => {
          if (!mounted) return
          setParticipants(users)
          // Prefer the first other user in the room (if any)
          const me = socket.id
          const other = users.find((u) => u.id !== me)
          remoteUserRef.current = other?.id || null
        })

        socket.on('user-joined', async (userId: string, userName: string) => {
          if (!mounted) return
          setParticipants((prev) => (prev.some((u) => u.id === userId) ? prev : [...prev, { id: userId, name: userName }]))
          remoteUserRef.current = userId

          // we are the caller
          const offer = await pc.createOffer()
          await pc.setLocalDescription(offer)
          socket.emit('offer', offer, id, userId)
        })

        socket.on('offer', async (offer: RTCSessionDescriptionInit, _roomId: string, senderId: string) => {
          await pc.setRemoteDescription(new RTCSessionDescription(offer))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          remoteUserRef.current = senderId
          socket.emit('answer', answer, id, senderId)
        })

        socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
          await pc.setRemoteDescription(new RTCSessionDescription(answer))
        })

        socket.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate))
          } catch {
            // ignore invalid/early candidates
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
      pcRef.current = null
      localStreamRef.current = null
    }
    // NOTE: do NOT depend on participants; it would recreate RTCPeerConnection and duplicate handlers
  }, [API_BASE, id, token])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-navy">Meeting</h1>
      <div className="text-sm text-slate-600">Status: {status}</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <video ref={localVideoRef} className="w-full rounded bg-black" playsInline autoPlay muted />
        <video ref={remoteVideoRef} className="w-full rounded bg-black" playsInline autoPlay />
      </div>
    </div>
  )
}