'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface MeetingData {
  id: string
  title: string
  status: string
  participants: number
  startTime: string
}

interface VideoStreams {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
}

export default function PersistentMeetingIndicator() {
  const [isInMeeting, setIsInMeeting] = useState(false)
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [videoStreams, setVideoStreams] = useState<VideoStreams>({ localStream: null, remoteStream: null })
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'poor' | 'disconnected'>('connecting')
  const [meetingDuration, setMeetingDuration] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hiddenIframe, setHiddenIframe] = useState<HTMLIFrameElement | null>(null)
  
  const indicatorRef = useRef<HTMLDivElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  
  const isMeetingPage = pathname?.includes('/meeting/')
  const currentMeetingId = pathname?.split('/meeting/')[1]

  // Store meeting ID when on meeting page
  useEffect(() => {
    if (isMeetingPage && currentMeetingId) {
      console.log('💾 Storing current meeting ID:', currentMeetingId)
      sessionStorage.setItem('currentMeetingId', currentMeetingId)
      
      setMeetingData({
        id: currentMeetingId,
        title: 'Current Meeting',
        status: 'in-progress',
        participants: 2,
        startTime: new Date().toISOString()
      })
      setIsInMeeting(true)
    }
  }, [isMeetingPage, currentMeetingId])

  // Check for active meeting when not on meeting page
  useEffect(() => {
    if (!isMeetingPage && user?.id) {
      const storedMeetingId = sessionStorage.getItem('currentMeetingId')
      
      if (storedMeetingId) {
        console.log('🎯 Showing popup for stored meeting:', storedMeetingId)
        setMeetingData({
          id: storedMeetingId,
          title: 'Current Meeting',
          status: 'in-progress',
          participants: 2,
          startTime: new Date().toISOString()
        })
        setIsInMeeting(true)
        setIsVisible(true)
        setConnectionStatus('connected')
        
        // Create hidden iframe to keep meeting running
        createHiddenIframe(storedMeetingId)
      }
    } else if (isMeetingPage) {
      setIsVisible(false)
      // Clean up hidden iframe when on meeting page
      cleanupHiddenIframe()
    }
  }, [isMeetingPage, user])

  // Create hidden iframe to maintain meeting connection
  const createHiddenIframe = (meetingId: string) => {
    try {
      // Remove existing iframe if any
      cleanupHiddenIframe()
      
      // Create new hidden iframe
      const iframe = document.createElement('iframe')
      iframe.src = `/meeting/${meetingId}`
      iframe.style.position = 'fixed'
      iframe.style.top = '-9999px'
      iframe.style.left = '-9999px'
      iframe.style.width = '1px'
      iframe.style.height = '1px'
      iframe.style.border = 'none'
      iframe.style.opacity = '0'
      iframe.style.pointerEvents = 'none'
      iframe.style.zIndex = '-1'
      
      // Add to document
      document.body.appendChild(iframe)
      setHiddenIframe(iframe)
      
      console.log('✅ Created hidden iframe for meeting:', meetingId)
      
      // Wait for iframe to load and then capture streams
      iframe.onload = () => {
        setTimeout(() => {
          captureStreamsFromIframe(iframe)
        }, 3000) // Wait 3 seconds for meeting to initialize
      }
      
    } catch (error) {
      console.error('Error creating hidden iframe:', error)
    }
  }

  // Clean up hidden iframe
  const cleanupHiddenIframe = () => {
    if (hiddenIframe) {
      try {
        document.body.removeChild(hiddenIframe)
        setHiddenIframe(null)
        console.log('✅ Cleaned up hidden iframe')
      } catch (error) {
        console.error('Error cleaning up iframe:', error)
      }
    }
  }

  // Capture streams from hidden iframe
  const captureStreamsFromIframe = (iframe: HTMLIFrameElement) => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (iframeDoc) {
        const videos = iframeDoc.querySelectorAll('video')
        console.log('🎥 Found video elements in iframe:', videos.length)
        
        videos.forEach((video, index) => {
          if (video.srcObject) {
            const stream = video.srcObject as MediaStream
            console.log(`📹 Iframe video ${index} stream:`, stream.getVideoTracks().length, 'tracks')
            
            if (stream.getVideoTracks().length > 0) {
              if (index === 0) {
                setVideoStreams(prev => ({ ...prev, remoteStream: stream }))
              } else {
                setVideoStreams(prev => ({ ...prev, localStream: stream }))
              }
            }
          }
        })
        
        setConnectionStatus('connected')
        console.log('✅ Captured streams from hidden iframe')
      }
    } catch (error) {
      console.error('Error capturing streams from iframe:', error)
      // This is expected due to CORS, but the iframe keeps the meeting alive
      console.log('ℹ️ CORS prevented stream capture, but iframe keeps meeting alive')
      setConnectionStatus('connected') // Assume connected since iframe is running
    }
  }

  // Listen for messages from the hidden iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'meetingStreams') {
        console.log('📡 Received streams from iframe:', event.data)
        setVideoStreams(event.data.streams)
        setConnectionStatus('connected')
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Capture video streams from the meeting page (less frequent)
  useEffect(() => {
    if (isVisible && !isMeetingPage) {
      const captureStreams = () => {
        try {
          const videos = document.querySelectorAll('video')
          if (videos.length > 0) {
            videos.forEach((video, index) => {
              if (video.srcObject) {
                const stream = video.srcObject as MediaStream
                if (stream.getVideoTracks().length > 0) {
                  if (index === 0) {
                    setVideoStreams(prev => ({ ...prev, remoteStream: stream }))
                  } else {
                    setVideoStreams(prev => ({ ...prev, localStream: stream }))
                  }
                }
              }
            })
            setConnectionStatus('connected')
          }
        } catch (error) {
          console.error('Error capturing streams:', error)
        }
      }
      
      // Try to capture streams immediately
      captureStreams()
      
      // Check less frequently to reduce load
      const interval = setInterval(captureStreams, 5000)
      
      return () => clearInterval(interval)
    }
  }, [isVisible, isMeetingPage])

  // Update video elements when streams change
  useEffect(() => {
    if (localVideoRef.current && videoStreams.localStream) {
      localVideoRef.current.srcObject = videoStreams.localStream
    }
    if (remoteVideoRef.current && videoStreams.remoteStream) {
      remoteVideoRef.current.srcObject = videoStreams.remoteStream
    }
  }, [videoStreams])

  // Track meeting duration
  useEffect(() => {
    if (isInMeeting && meetingData) {
      const startTime = new Date(meetingData.startTime).getTime()
      const updateDuration = () => {
        const now = new Date().getTime()
        setMeetingDuration(Math.floor((now - startTime) / 1000))
      }
      
      updateDuration()
      const interval = setInterval(updateDuration, 1000)
      
      return () => clearInterval(interval)
    }
  }, [isInMeeting, meetingData])

  // Handle drag functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (indicatorRef.current) {
      const rect = indicatorRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsDragging(true)
    }
  }

  const handleJoinMeeting = () => {
    if (meetingData?.id) {
      router.push(`/meeting/${meetingData.id}`)
    }
  }

  const handleLeaveMeeting = () => {
    console.log('🚪 User left meeting')
    
    // Clean up hidden iframe
    cleanupHiddenIframe()
    
    setIsInMeeting(false)
    setMeetingData(null)
    setIsVisible(false)
    setVideoStreams({ localStream: null, remoteStream: null })
    sessionStorage.removeItem('currentMeetingId')
  }

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupHiddenIframe()
    }
  }, [])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Don't render if on meeting page or not visible
  if (isMeetingPage || !isVisible || !meetingData) {
    return null
  }

  return (
    <div 
      ref={indicatorRef}
      className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg cursor-move"
      style={{
        left: position.x,
        top: position.y,
        width: isMinimized ? '200px' : '320px'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
            connectionStatus === 'poor' ? 'bg-orange-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm font-medium text-gray-800">
            {connectionStatus === 'connected' ? 'LIVE' : 
             connectionStatus === 'connecting' ? 'CONNECTING...' : 
             connectionStatus === 'poor' ? 'POOR CONNECTION' : 'DISCONNECTED'}
          </span>
          <span className="text-xs text-gray-500">• {formatDuration(meetingDuration)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-gray-600 text-sm"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? '□' : '−'}
          </button>
          <button
            onClick={handleLeaveMeeting}
            className="text-gray-400 hover:text-red-600 text-lg transition-colors"
            title="Leave meeting"
          >
            ×
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          {/* Video Preview */}
          <div className="relative">
            {/* Remote Video (Main View) */}
            <div className="relative w-full h-48 bg-gray-900 overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                muted={false}
                playsInline
                className="w-full h-full object-cover"
              />
              {!videoStreams.remoteStream && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="text-white text-sm">
                    {connectionStatus === 'connecting' ? 'Connecting...' : 'Waiting for participant'}
                  </div>
                </div>
              )}
              
              {/* Local Video (Small Overlay) */}
              {videoStreams.localStream && (
                <div className="absolute top-2 right-2 w-16 h-12 bg-gray-900 rounded border border-white overflow-hidden">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted={true}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Live Indicator */}
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                LIVE
              </div>
            </div>
            
            {/* Meeting Info */}
            <div className="p-3 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {meetingData.title}
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                Meeting continues - others can still see and hear you
              </p>
              
              {/* Controls */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleJoinMeeting}
                  className="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700 transition-colors"
                >
                  Return to Meeting
                </button>
                <button
                  onClick={handleLeaveMeeting}
                  className="w-full bg-red-600 text-white text-sm py-2 px-3 rounded hover:bg-red-700 transition-colors"
                >
                  Leave Meeting
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}