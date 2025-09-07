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
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(Cookies.get('token') || null)
  const [user, setUser] = useState<AuthUser | null>(null)

  const decode = useCallback((jwt: string): AuthUser | null => {
    try {
      const payload = jwtDecode<JwtPayload>(jwt)
      return { id: payload.id, role: payload.role }
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    if (token) {
      const u = decode(token)
      setUser(u)
      Cookies.set('token', token)
    } else {
      setUser(null)
      Cookies.remove('token')
    }
  }, [token, decode])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login({ email, password }) as any
    const jwt = (res as any).token || (res as any).data?.token
    if (!jwt) throw new Error('No token returned from server')
    setToken(jwt)
    await refreshProfile()
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    Cookies.remove('token')
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!token) return
    try {
      const me = await api.me() as any
      const profile = me?.data?.user || me?.user || me?.data
      setUser((prev) => ({ ...(prev || decode(token) || { id: '', role: 'patient' }), ...profile }))
    } catch {
      // ignore
    }
  }, [token, decode])

  const value = useMemo(() => ({ user, token, isAuthenticated: !!token, login, logout, refreshProfile }), [user, token, login, logout, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

