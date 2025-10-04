import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function toast({ title, description, variant = 'default' }: Omit<Toast, 'id'>) {
  // Simple toast implementation - you can replace this with your preferred toast library
  if (variant === 'destructive') {
    alert(`Error: ${title}\n${description}`)
  } else {
    alert(`${title}\n${description}`)
  }
}

export function useToast() {
  return { toast }
}