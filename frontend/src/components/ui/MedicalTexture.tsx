"use client"

import React from 'react'

/**
 * Medical Texture Background Component
 * Uses Material Design medical icons as repeating patterns
 * Colors derived from logo (emerald/green theme)
 */
export function MedicalTexture({ 
  className = '', 
  opacity = 0.05,
  iconSize = 40,
  pattern = 'medical-cross'
}: { 
  className?: string
  opacity?: number
  iconSize?: number
  pattern?: 'medical-cross' | 'healthcare' | 'hospital' | 'stethoscope' | 'pills'
}) {
  // SVG patterns as strings for Material Design medical icons
  const patterns = {
    'medical-cross': `<path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/><path d="M12 8L13 11L16 12L13 13L12 16L11 13L8 12L11 11L12 8Z" fill="currentColor" opacity="0.6"/>`,
    'healthcare': `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 7V17M7 12H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.4"/>`,
    'hospital': `<path d="M3 21H21L12 3L3 21Z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    'stethoscope': `<path d="M8 8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10V8Z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M4 12C4 10.9 4.9 10 6 10C7.1 10 8 10.9 8 12C8 13.1 7.1 14 6 14C4.9 14 4 13.1 4 12Z" fill="currentColor"/><path d="M16 12C16 10.9 16.9 10 18 10C19.1 10 20 10.9 20 12C20 13.1 19.1 14 18 14C16.9 14 16 13.1 16 12Z" fill="currentColor"/><path d="M12 14V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
    'pills': `<rect x="6" y="8" width="8" height="8" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="10" y="6" width="8" height="8" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="9" cy="11" r="1.5" fill="currentColor" opacity="0.6"/><circle cx="15" cy="13" r="1.5" fill="currentColor" opacity="0.6"/>`
  }

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" opacity="${opacity}">${patterns[pattern]}</svg>`

  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgString)}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: `${iconSize}px ${iconSize}px`,
        backgroundPosition: '0 0',
      }}
      aria-hidden="true"
    />
  )
}

/**
 * Medical Texture Background Wrapper
 * Wraps content with medical-themed textured background
 */
export function MedicalTextureBackground({ 
  children, 
  className = '',
  pattern = 'medical-cross',
  baseColor = 'emerald',
  intensity = 'light'
}: { 
  children: React.ReactNode
  className?: string
  pattern?: 'medical-cross' | 'healthcare' | 'hospital' | 'stethoscope' | 'pills'
  baseColor?: 'emerald' | 'green' | 'teal'
  intensity?: 'light' | 'medium' | 'dark'
}) {
  const colorClasses = {
    emerald: {
      light: 'bg-emerald-50',
      medium: 'bg-emerald-100',
      dark: 'bg-emerald-200'
    },
    green: {
      light: 'bg-green-50',
      medium: 'bg-green-100',
      dark: 'bg-green-200'
    },
    teal: {
      light: 'bg-teal-50',
      medium: 'bg-teal-100',
      dark: 'bg-teal-200'
    }
  }

  const opacity = {
    light: 0.03,
    medium: 0.06,
    dark: 0.1
  }

  return (
    <div className={`relative ${colorClasses[baseColor][intensity]} ${className}`}>
      <MedicalTexture 
        pattern={pattern} 
        opacity={opacity[intensity]}
        className="text-emerald-600"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}


