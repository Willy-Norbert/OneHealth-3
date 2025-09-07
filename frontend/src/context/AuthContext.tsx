"use client"
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { api } from '@/lib/api'

type Role = 'patient' | 'doctor' | 'admin' | 'hospital'

type JwtPayload = { id: string; role: Role; iat?: number; exp?: number }

type AuthUser = {
  id: string
  role: Role
  name?: string
  email?: string
}

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const decode = useCallback((jwt: string): AuthUser | null => {
    try {
      const payload = jwtDecode<JwtPayload>(jwt)
      // Check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return null
      }
      return { id: payload.id, role: payload.role }
    } catch {
      return null
    }
  }, [])

  const validateToken = useCallback(async (jwt: string) => {
    try {
      const decoded = decode(jwt)
      if (!decoded) {
        setToken(null)
        setUser(null)
        Cookies.remove('token')
        return false
      }
      
      setUser(decoded)
      return true
    } catch {
      setToken(null)
      setUser(null)
      Cookies.remove('token')
      return false
    }
  }, [decode])

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)
      const savedToken = Cookies.get('token')
      
      if (savedToken) {
        const isValid = await validateToken(savedToken)
        if (isValid) {
          setToken(savedToken)
          try {
            await refreshProfile(savedToken)
          } catch (error) {
            console.warn('Failed to refresh profile:', error)
          }
        }
      }
      
      setIsLoading(false)
    }

    initializeAuth()
  }, [validateToken])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await api.login({ email, password }) as any
      const jwt = (res as any).token || (res as any).data?.token
      if (!jwt) throw new Error('No token returned from server')
      
      setToken(jwt)
      Cookies.set('token', jwt, { expires: 7 }) // 7 days
      await refreshProfile(jwt)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    Cookies.remove('token')
  }, [])

  const refreshProfile = useCallback(async (jwt?: string) => {
    const currentToken = jwt || token
    if (!currentToken) return
    
    try {
      const me = await api.me() as any
      const profile = me?.data?.user || me?.user || me?.data
      setUser((prev) => ({ ...(prev || decode(currentToken) || { id: '', role: 'patient' }), ...profile }))
    } catch (error) {
      console.warn('Failed to refresh profile:', error)
      // If profile refresh fails, keep the basic user info from token
    }
  }, [token, decode])

  const value = useMemo(() => ({ 
    user, 
    token, 
    isAuthenticated: !!token && !!user, 
    isLoading,
    login, 
    logout, 
    refreshProfile 
  }), [user, token, isLoading, login, logout, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

