"use client"
import { AuthProvider } from '@/context/AuthContext'
import { NotificationsProvider } from '@/context/NotificationsContext'
import { ThemeProvider } from 'next-themes'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Image from 'next/image'
import { useEffect } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const scrollOffset = scrollY * 0.3 // Slow scroll effect (30% of normal scroll speed)
      document.documentElement.style.setProperty('--scroll-offset', `${scrollOffset}px`)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          <NotificationsProvider>
            {/* Fixed background with slow scroll animation for all white sections */}
            <div 
              className="fixed inset-0 z-0 pointer-events-none"
              style={{
                backgroundImage: 'url(/bg_auth.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.3,
                transform: 'translateY(var(--scroll-offset, 0px))',
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="absolute inset-0 bg-emerald-600/30" />
            </div>
            
            <div className="relative z-10">
              {children}
            </div>
          </NotificationsProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

