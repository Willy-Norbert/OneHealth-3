import Cookies from 'js-cookie'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export async function apiFetch<T>(path: string, options: RequestInit & { auth?: boolean } = {}): Promise<T> {
  const token = Cookies.get('token')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (options.headers) Object.assign(headers, options.headers as Record<string, string>)
  if (options.auth !== false && token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    
    // Handle 401 specifically - clear token and redirect
    if (res.status === 401) {
      Cookies.remove('token')
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
    }
    
    throw new Error(text || `Request failed: ${res.status}`)
  }
  try {
    return (await res.json()) as T
  } catch {
    // some endpoints may not return JSON in error cases
    return {} as T
  }
}

export const api = {
  // Auth
  register: (body: any) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body), auth: false }),
  login: (body: any) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body), auth: false }),
  verifyOtp: (body: any) => apiFetch('/auth/verify-otp', { method: 'POST', body: JSON.stringify(body), auth: false }),
  resendOtp: (body: any) => apiFetch('/auth/resend-otp', { method: 'POST', body: JSON.stringify(body), auth: false }),
  forgotPassword: (body: any) => apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body), auth: false }),
  resetPassword: (body: any) => apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify(body), auth: false }),
  me: () => apiFetch('/auth/me', { method: 'GET' }),

  // Users
  users: {
    list: (params?: Record<string, string | number | boolean>) => {
      const sp = new URLSearchParams()
      if (params) Object.entries(params).forEach(([k, v]) => sp.append(k, String(v)))
      const qs = sp.toString()
      return apiFetch(`/users${qs ? `?${qs}` : ''}`, { method: 'GET' })
    },
    updateProfile: (body: any) => apiFetch('/users/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  },

  // Core entities
  hospitals: {
    list: () => apiFetch('/hospitals', { method: 'GET', auth: false }),
    get: (id: string) => apiFetch(`/hospitals/${id}`, { method: 'GET', auth: false }),
    createDoctor: (hospitalId: string, body: any) => apiFetch(`/hospitals/${hospitalId}/doctors`, { method: 'POST', body: JSON.stringify(body) }),
  },
  patients: {
    list: () => apiFetch('/users/patients', { method: 'GET' }),
    myForDoctor: () => apiFetch('/patients/my-patients', { method: 'GET' }),
  },
  departments: {
    list: (q?: URLSearchParams) => apiFetch(`/departments${q ? `?${q.toString()}` : ''}`, { method: 'GET', auth: false }),
    byHospital: (id: string) => apiFetch(`/departments/hospital/${id}`, { method: 'GET', auth: false }),
  },
  doctors: {
    list: (q?: URLSearchParams) => apiFetch(`/doctors${q ? `?${q.toString()}` : ''}`, { method: 'GET', auth: false }),
    byHospitalDepartment: (hospitalId: string, departmentId: string) => apiFetch(`/doctors/hospital/${hospitalId}/department/${departmentId}`, { method: 'GET', auth: false }),
    get: (id: string) => apiFetch(`/doctors/${id}`, { method: 'GET', auth: false }),
    create: (body: any) => apiFetch('/doctors', { method: 'POST', body: JSON.stringify(body) }),
  },
  insurance: {
    list: () => apiFetch('/insurance', { method: 'GET', auth: false }),
  },
  teleconsult: {
    consultationTypes: () => apiFetch('/teleconsultation/consultation-types', { method: 'GET', auth: false }),
    insuranceOptions: () => apiFetch('/teleconsultation/insurance-options', { method: 'GET', auth: false }),
    create: (body: any) => apiFetch('/teleconsultation', { method: 'POST', body: JSON.stringify(body) }),
    mine: () => apiFetch('/teleconsultation/my-consultations', { method: 'GET' }),
    get: (id: string) => apiFetch(`/teleconsultation/${id}`, { method: 'GET' }),
    doctor: (doctorId: string) => apiFetch(`/teleconsultation/doctor/${doctorId}/consultations`, { method: 'GET' }),
  },
  appointments: {
    availableSlots: (params: { date: string; hospital: string; department: string }) => {
      const searchParams = new URLSearchParams(params)
      return apiFetch(`/appointments/available-slots?${searchParams.toString()}`, { method: 'GET', auth: false })
    },
    create: (body: any) => apiFetch('/appointments', { method: 'POST', body: JSON.stringify(body) }),
    my: () => apiFetch('/appointments/my-appointments', { method: 'GET' }),
    myDoctor: () => apiFetch('/appointments/my-doctor-appointments', { method: 'GET' }),
    hospital: () => apiFetch('/appointments/hospital', { method: 'GET' }),
    reassign: (id: string, body: any) => apiFetch(`/appointments/${id}/reassign`, { method: 'PATCH', body: JSON.stringify(body) }),
    cancel: (id: string) => apiFetch(`/appointments/${id}/cancel`, { method: 'PATCH' }),
    get: (id: string) => apiFetch(`/appointments/${id}`, { method: 'GET' }),
    hospitalStats: () => apiFetch('/appointments/hospital-stats', { method: 'GET' }),
  },
  payments: {
    checkout: (body: any) => apiFetch('/payments/checkout', { method: 'POST', body: JSON.stringify(body) }),
    verify: (body: any) => apiFetch('/payments/verify', { method: 'POST', body: JSON.stringify(body) }),
    manualConfirm: (paymentId: string, notes?: string) => apiFetch(`/payments/${paymentId}/confirm`, { method: 'POST', body: JSON.stringify({ notes }) }),
  },
  emergencies: {
    create: (body: any) => apiFetch('/emergencies', { method: 'POST', body: JSON.stringify(body) }),
  },
  meetings: {
    user: (userId: string) => apiFetch(`/meetings/user/${userId}`, { method: 'GET' }),
    get: (id: string) => apiFetch(`/meetings/${id}`, { method: 'GET' }),
    create: (body: any) => apiFetch('/meetings', { method: 'POST', body: JSON.stringify(body) }),
    updateStatus: (id: string, status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled') =>
      apiFetch(`/meetings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  labResults: {
    list: (params?: Record<string, string | number>) => {
      const sp = new URLSearchParams()
      if (params) Object.entries(params).forEach(([k, v]) => sp.append(k, String(v)))
      const qs = sp.toString()
      return apiFetch(`/lab-results${qs ? `?${qs}` : ''}`, { method: 'GET' })
    },
    critical: () => apiFetch('/lab-results/critical', { method: 'GET' }),
    statistics: (params?: Record<string, string | number>) => {
      const sp = new URLSearchParams()
      if (params) Object.entries(params).forEach(([k, v]) => sp.append(k, String(v)))
      const qs = sp.toString()
      return apiFetch(`/lab-results/statistics${qs ? `?${qs}` : ''}`, { method: 'GET' })
    },
    get: (id: string) => apiFetch(`/lab-results/${id}`, { method: 'GET' })
  },
  drugInteractions: {
    list: (params?: Record<string, string | number>) => {
      const sp = new URLSearchParams()
      if (params) Object.entries(params).forEach(([k, v]) => sp.append(k, String(v)))
      const qs = sp.toString()
      return apiFetch(`/drug-interactions${qs ? `?${qs}` : ''}`, { method: 'GET' })
    },
    critical: () => apiFetch('/drug-interactions/critical', { method: 'GET' }),
    byDrug: (drugName: string) => apiFetch(`/drug-interactions/drug/${encodeURIComponent(drugName)}`, { method: 'GET' }),
    check: (medications: { name: string; dosage?: string; frequency?: string }[]) =>
      apiFetch('/drug-interactions/check', { method: 'POST', body: JSON.stringify({ medications }) })
  },
  prescriptions: {
    create: (body: any) => apiFetch('/prescriptions', { method: 'POST', body: JSON.stringify(body) }),
    byPatient: (patientId: string) => apiFetch(`/prescriptions/patient/${patientId}`, { method: 'GET' }),
    myAuthored: () => apiFetch('/prescriptions/doctor-authored', { method: 'GET' }),
  },
  ai: {
    symptomChecker: (body: any) => apiFetch('/ai/symptom-checker', { method: 'POST', body: JSON.stringify(body) }),
    bookAppointmentHelper: (body: any) => apiFetch('/ai/book-appointment-helper', { method: 'POST', body: JSON.stringify(body) }),
    prescriptionHelper: (body: any) => apiFetch('/ai/prescription-helper', { method: 'POST', body: JSON.stringify(body) }),
    referralSupport: (body: any) => apiFetch('/ai/referral-support', { method: 'POST', body: JSON.stringify(body) }),
    healthTips: (body: any) => apiFetch('/ai/health-tips', { method: 'POST', body: JSON.stringify(body) }),
  },
  notifications: {
    list: () => apiFetch('/notifications', { method: 'GET' }),
    markRead: (id: string) => id === 'mark-all' ? apiFetch('/notifications/mark-all/read', { method: 'PUT' }) : apiFetch(`/notifications/${id}/read`, { method: 'PUT' }),
  },
  pharmacy: {
    list: () => apiFetch('/pharmacies', { method: 'GET', auth: false }),
    near: (lat: number, lng: number, radius?: number) => apiFetch(`/pharmacies/near?lat=${lat}&lng=${lng}${radius?`&radius=${radius}`:''}`, { method: 'GET', auth: false }),
    get: (id: string) => apiFetch(`/pharmacies/${id}`, { method: 'GET', auth: false }),
    prescriptions: () => apiFetch('/prescriptions/my', { method: 'GET' }),
  },
  orders: {
    create: (body: any) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(body) }),
    my: (patientId: string) => apiFetch(`/orders/patients/${patientId}/orders`, { method: 'GET' }),
  },
  uploads: {
    image: async (file: File) => {
      const token = Cookies.get('token')
      const form = new FormData()
      form.append('image', file)
      const res = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      })
      if (!res.ok) throw new Error('Upload failed')
      return res.json()
    }
  }
}

