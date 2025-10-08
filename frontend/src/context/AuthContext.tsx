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
  // new: indicate pending login and cooldown until timestamp (ms)
  loginPending?: boolean
  loginCooldownUntil?: number | null
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  // track login request state and cooldown after server 429 responses
  const [loginPending, setLoginPending] = useState(false)
  const [loginCooldownUntil, setLoginCooldownUntil] = useState<number | null>(null)

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
    // Prevent attempts while client-side cooldown is active
    if (loginCooldownUntil && Date.now() < loginCooldownUntil) {
      const err: any = new Error('Too many attempts. Please try again later.')
      err.status = 429
      err.retryAfter = Math.ceil((loginCooldownUntil - Date.now()) / 1000)
      throw err
    }

    setIsLoading(true)
    setLoginPending(true)
    try {
      const res = await api.login({ email, password }) as any
      console.log('Login response:', res)

      const jwt = (res as any).token || (res as any).data?.token
      if (!jwt) {
        const errorMsg = (res as any).message || (res as any).data?.message || 'No token returned from server'
        throw new Error(errorMsg)
      }

      setToken(jwt)
      Cookies.set('token', jwt, { expires: 7 }) // 7 days
      await refreshProfile(jwt)
    } catch (error: any) {
      console.error('Login error in AuthContext:', error)
      // If server returned retryAfter, set client cooldown to avoid rapid retries
      if (error?.status === 429 && Number.isFinite(error?.retryAfter)) {
        setLoginCooldownUntil(Date.now() + error.retryAfter * 1000)
      }
      throw error // Re-throw to let the login page handle it
    } finally {
      setIsLoading(false)
      setLoginPending(false)
    }
  }, [loginCooldownUntil])

  const logout = useCallback(() => {
    setIsLoggingOut(true)
    setToken(null)
    setUser(null)
    Cookies.remove('token')
    setIsLoggingOut(false)
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
    refreshProfile,
    isLoggingOut,
    // expose new auth state for UI
    loginPending,
    loginCooldownUntil,
  }), [user, token, isLoading, login, logout, refreshProfile, isLoggingOut, loginPending, loginCooldownUntil])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

