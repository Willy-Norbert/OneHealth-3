"use client"
import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'

interface MeetingData {
  id: string
  title: string
  status: string
  participants: number
  startTime?: string
}

interface VideoStream {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
}

export default function PersistentMeetingIndicator() {
  console.log('🚀 PersistentMeetingIndicator component mounted')
  
  const [isInMeeting, setIsInMeeting] = useState(false)
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 16, y: 16 }) // Default top-right position
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [videoStreams, setVideoStreams] = useState<VideoStream>({ localStream: null, remoteStream: null })
  const [showVideoPreview, setShowVideoPreview] = useState(true) // Show video by default
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth() as any

  console.log('📊 Component state:', {
    user: !!user,
    userId: user?._id,
    pathname,
    isMeetingPage: pathname?.includes('/meeting/'),
    isInMeeting,
    isVisible,
    meetingData: !!meetingData
  })

  // Check if current path is a meeting page
  const isMeetingPage = pathname?.includes('/meeting/')
  
  // Extract meeting ID from URL if on meeting page
  const currentMeetingId = isMeetingPage ? pathname?.split('/meeting/')[1] : null

  // Store current meeting ID when on meeting page
  useEffect(() => {
    if (isMeetingPage && currentMeetingId) {
      console.log('💾 Storing current meeting ID:', currentMeetingId)
      // Store in sessionStorage for persistence
      sessionStorage.setItem('currentMeetingId', currentMeetingId)
    }
  }, [isMeetingPage, currentMeetingId])

  // Maintain meeting connection when navigating away
  useEffect(() => {
    if (isMeetingPage && isInMeeting) {
      console.log('🎥 User is in meeting - capturing video streams for persistent view')
      
      const captureStreams = () => {
        try {
          console.log('Attempting to capture video streams...')
          // Look for video elements in the meeting page
          const allVideos = document.querySelectorAll('video')
          console.log('Found videos:', allVideos.length)
          
          let localVideo: HTMLVideoElement | null = null
          let remoteVideo: HTMLVideoElement | null = null
          
          allVideos.forEach((video, index) => {
            console.log(`Video ${index}:`, {
              muted: video.muted,
              autoplay: video.autoplay,
              srcObject: !!video.srcObject
            })
            
            if (video.muted && video.srcObject) {
              localVideo = video as HTMLVideoElement
            } else if (!video.muted && video.srcObject) {
              remoteVideo = video as HTMLVideoElement
            }
          })
          
          if (localVideo || remoteVideo) {
            console.log('✅ Captured streams for persistent meeting:', { local: !!localVideo, remote: !!remoteVideo })
            setVideoStreams({
              localStream: localVideo?.srcObject as MediaStream || null,
              remoteStream: remoteVideo?.srcObject as MediaStream || null
            })
            setShowVideoPreview(true)
          } else {
            console.log('⚠️ No video streams found - meeting may not be active')
          }
        } catch (error) {
          console.log('Could not capture video streams:', error)
        }
      }

      // Try to capture streams after a short delay
      const timer = setTimeout(captureStreams, 2000)
      return () => clearTimeout(timer)
    }
  }, [isMeetingPage, isInMeeting])

  // Keep meeting active when indicator is shown
  useEffect(() => {
    if (isVisible && meetingData) {
      console.log('🔄 Meeting indicator active - maintaining connection')
      console.log('📞 Meeting continues in background for other participants')
      
      // The meeting should continue running in the background
      // The other participant should still see and hear this user
    }
  }, [isVisible, meetingData])

  useEffect(() => {
    // Check if user is in an active meeting
    const checkActiveMeeting = async () => {
      if (!user || !user._id) {
        console.log('No user or user ID')
        return
      }

      console.log('🔍 Checking for active meetings...')
      console.log('User ID:', user._id)
      console.log('Is meeting page:', isMeetingPage)

      try {
        // Get user's meetings to check for active ones
        const response = await api.meetings.user(user._id, { status: 'in-progress' })
        console.log('📊 API Response:', response)
        
        const meetings = response?.data?.meetings || []
        console.log('📋 Found meetings:', meetings.length)
        console.log('📋 Meetings data:', meetings)
        
        if (meetings.length > 0) {
          const activeMeeting = meetings[0]
          console.log('✅ Active meeting found:', activeMeeting)
          console.log('🔍 Meeting details:', {
            meeting_id: activeMeeting.meeting_id,
            title: activeMeeting.title,
            status: activeMeeting.status,
            startTime: activeMeeting.startTime,
            doctor: activeMeeting.doctor,
            patient: activeMeeting.patient
          })
          
          // Verify we have the required meeting_id
          if (activeMeeting.meeting_id) {
            setMeetingData({
              id: activeMeeting.meeting_id,
              title: activeMeeting.title || 'Teleconsultation',
              status: activeMeeting.status,
              participants: 2,
              startTime: activeMeeting.startTime
            })
            setIsInMeeting(true)
            
            // Show indicator if NOT on meeting page
            if (!isMeetingPage) {
              console.log('🎯 Showing indicator - user navigated away from meeting')
              console.log('🎯 Meeting ID for navigation:', activeMeeting.meeting_id)
              setIsVisible(true)
            } else {
              console.log('🚫 Hiding indicator - user is on meeting page')
              setIsVisible(false)
            }
          } else {
            console.log('❌ Meeting found but no meeting_id')
            setIsInMeeting(false)
            setMeetingData(null)
            setIsVisible(false)
          }
        } else {
          console.log('❌ No active meetings found via API')
          
          // Fallback: Check for stored meeting ID
          const storedMeetingId = sessionStorage.getItem('currentMeetingId')
          const fallbackMeetingId = currentMeetingId || storedMeetingId
          
          if (fallbackMeetingId) {
            console.log('🔄 Fallback: Using meeting ID:', fallbackMeetingId)
            setMeetingData({
              id: fallbackMeetingId,
              title: 'Current Meeting',
              status: 'in-progress',
              participants: 2,
              startTime: new Date().toISOString()
            })
            setIsInMeeting(true)
            
            if (!isMeetingPage) {
              console.log('🎯 Showing indicator with fallback meeting ID')
              setIsVisible(true)
            } else {
              setIsVisible(false)
            }
          } else {
            console.log('❌ No fallback meeting ID available')
            setIsInMeeting(false)
            setMeetingData(null)
            setIsVisible(false)
          }
        }
      } catch (error) {
        console.error('💥 Error checking active meeting:', error)
        console.error('💥 Error details:', error)
        setIsInMeeting(false)
        setMeetingData(null)
        setIsVisible(false)
      }
    }

    // Clear state on mount
    setIsInMeeting(false)
    setMeetingData(null)
    setIsVisible(false)
    setShowVideoPreview(true)
    setVideoStreams({ localStream: null, remoteStream: null })

    checkActiveMeeting()

    // Check every 2 seconds
    const interval = setInterval(checkActiveMeeting, 2000)
    return () => clearInterval(interval)
  }, [user, isMeetingPage])

  // Hide indicator when on meeting page
  useEffect(() => {
    if (isMeetingPage) {
      setIsVisible(false)
    } else if (isInMeeting) {
      setIsVisible(true)
    }
  }, [isMeetingPage, isInMeeting])

  const handleJoinMeeting = () => {
    if (meetingData) {
      console.log('Joining meeting:', meetingData.id)
      // Navigate to the current active meeting using the meeting_id
      router.push(`/meeting/${meetingData.id}`)
    }
  }

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) return // Don't allow dragging when minimized
    
    setIsDragging(true)
    const rect = indicatorRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - (indicatorRef.current?.offsetWidth || 320)
    const maxY = window.innerHeight - (indicatorRef.current?.offsetHeight || 200)
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  // Handle video stream updates
  useEffect(() => {
    if (localVideoRef.current && videoStreams.localStream) {
      localVideoRef.current.srcObject = videoStreams.localStream
    }
  }, [videoStreams.localStream])

  useEffect(() => {
    if (remoteVideoRef.current && videoStreams.remoteStream) {
      remoteVideoRef.current.srcObject = videoStreams.remoteStream
    }
  }, [videoStreams.remoteStream])

  // No leave meeting function - meeting continues automatically

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime)
    const now = new Date()
    const diffMs = now.getTime() - start.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const hours = Math.floor(diffMins / 60)
    const minutes = diffMins % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Cleanup effect to ensure no persistent state
  useEffect(() => {
    // Clear state when component unmounts
    return () => {
      setIsInMeeting(false)
      setMeetingData(null)
      setIsVisible(false)
      setShowVideoPreview(false)
      setVideoStreams({ localStream: null, remoteStream: null })
    }
  }, [])

  // Debug: Add test data if no real meeting data
  const debugMode = process.env.NODE_ENV === 'development'
  
  // Don't render anything if on meeting page
  if (isMeetingPage) {
    return null
  }

  // Show debug indicator in development
  if (debugMode && !isVisible && !meetingData) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-400 rounded-lg p-4">
        <div className="text-sm text-yellow-800">
          <div className="font-medium">Debug: Persistent Meeting Indicator</div>
          <div>User: {user?.name || 'Unknown'}</div>
          <div>User ID: {user?._id || 'None'}</div>
          <div>Is Meeting Page: {isMeetingPage ? 'Yes' : 'No'}</div>
          <div>Is Visible: {isVisible ? 'Yes' : 'No'}</div>
          <div>Meeting Data: {meetingData ? 'Yes' : 'No'}</div>
          <button 
            onClick={() => {
              setMeetingData({
                id: 'test-meeting-123',
                title: 'Test Meeting',
                status: 'in-progress',
                participants: 2,
                startTime: new Date().toISOString()
              })
              setIsInMeeting(true)
              setIsVisible(true)
            }}
            className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded text-xs"
          >
            Test Indicator
          </button>
        </div>
      </div>
    )
  }

  // Don't render anything if not visible or no meeting data
  if (!isVisible || !meetingData) {
    return null
  }

  return (
    <div 
      ref={indicatorRef}
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized ? 'w-12 h-12' : 'w-80'
      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isDragging ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div 
        className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${
          isMinimized ? 'w-12 h-12' : 'w-80'
        }`}
        onMouseDown={handleMouseDown}
      >
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            className="w-12 h-12 bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
            title="Click to expand meeting indicator"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5M3 8.25h18M3 15.75h18"/>
            </svg>
          </button>
        ) : (
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">Meeting Active</span>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="p-1 text-gray-400 cursor-grab" title="Drag to move">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8M8 12h8M8 18h8"/>
                  </svg>
                </div>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Minimize"
                >
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Video Preview */}
            {showVideoPreview && (
              <div className="mb-4">
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  {videoStreams.remoteStream ? (
                    <video
                      ref={remoteVideoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5M3 8.25h18M3 15.75h18"/>
                          </svg>
                        </div>
                        <div className="text-xs">Meeting continues...</div>
                        <div className="text-xs text-green-400 mt-1">Others can see you</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Local video overlay */}
                  {videoStreams.localStream && (
                    <div className="absolute bottom-2 right-2 w-16 h-12 bg-gray-900 rounded overflow-hidden border border-white/20">
                      <video
                        ref={localVideoRef}
                        className="w-full h-full object-cover scale-x-[-1]"
                        autoPlay
                        playsInline
                        muted
                      />
                    </div>
                  )}
                  
                  {/* Meeting status overlay */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <div className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Meeting Info */}
            <div className="space-y-2 mb-4">
              <h3 className="font-medium text-gray-900 truncate">{meetingData.title}</h3>
              <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                🎥 Meeting continues - other participants can still see and hear you
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {meetingData.startTime && formatDuration(meetingData.startTime)}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  {meetingData.participants} participants
                </span>
              </div>
            </div>

            {/* Actions - Only video toggle and return to meeting */}
            <div className="flex gap-2">
              <button
                onClick={handleJoinMeeting}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                title="Return to meeting"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5A2.25 2.25 0 015.25 5.25h7.5A2.25 2.25 0 0115 7.5v1.06l3.22-1.933A1.125 1.125 0 0120 7.56v8.88a1.125 1.125 0 01-1.78.933L15 15.439V16.5a2.25 2.25 0 01-2.25 2.25h-7.5A2.25 2.25 0 013 16.5v-9z"/>
                </svg>
                Return to Meeting
              </button>
              <button
                onClick={() => setShowVideoPreview(!showVideoPreview)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                  showVideoPreview 
                    ? 'bg-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title={showVideoPreview ? 'Hide video preview' : 'Show video preview'}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l10.5-10.5M21.75 15.75l-10.5-10.5M9 12l3 3 3-3"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
