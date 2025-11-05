"use client"
import { AppShell } from '@/components/layout/AppShell'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import { useState } from 'react'
import HealthSpinner from '@/components/ui/HealthSpinner'

export default function DoctorProfilePage() {
  const { user, refreshProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [toastMsg, setToastMsg] = useState<string|undefined>(undefined)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialization: user?.specialization || '',
    experience: user?.experience || '',
    bio: user?.bio || '',
    consultationFee: user?.consultationFee || '',
    availability: {
      days: user?.availability?.days || [],
      timeSlots: user?.availability?.timeSlots || []
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.users.updateProfile(formData)
      await refreshProfile()
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      const res: any = await api.uploads.image(file)
      if (res?.url) {
        // Update backend profile image URL using profileImageUrl field
        await api.users.updateProfile({ profileImageUrl: res.url })
        await refreshProfile()
        setToastMsg('Profile photo updated')
        setTimeout(()=>setToastMsg(undefined), 3000)
      }
    } catch (err) {
      console.error('Doctor avatar upload failed', err)
    } finally {
      setAvatarUploading(false)
    }
  }

  return (
    <AppShell
    menu={[
      { href: '/doctor', label: 'Overview' },
      { href: '/doctor/appointments', label: 'Appointments' },
      { href: '/doctor/lab-results', label: 'Medical Records' },
      { href: '/doctor/settings', label: 'Settings' },
      { href: '/doctor/meetings', label: 'Teleconsultations' },
      { href: '/doctor/prescriptions', label: 'Prescriptions' },
      { href: '/doctor/records', label: 'Medical Records' },
      { href: '/doctor/profile', label: 'Profile' },
    ]}
  >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your professional information</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-primary"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-body text-center">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user?.name || 'Avatar'} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
                ) : (
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-semibold text-emerald-600">
                      {user?.name?.charAt(0)?.toUpperCase() || 'D'}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">Dr. {user?.name}</h3>
                <p className="text-gray-500">{user?.email}</p>
                <div className="mt-4">
                  <span className="badge badge-primary">
                    {user?.specialization || 'General Practice'}
                  </span>
                </div>
                {isEditing && (
                  <div className="mt-4">
                    <label className="btn-outline btn-sm cursor-pointer">
                      {avatarUploading ? <HealthSpinner /> : 'Change Photo'}
                      <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                <p className="text-sm text-gray-500">Update your professional details</p>
              </div>
              <div className="card-body">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Specialization</label>
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Experience (Years)</label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Consultation Fee (RWF)</label>
                      <input
                        type="number"
                        name="consultationFee"
                        value={formData.consultationFee}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input"
                      rows={4}
                      placeholder="Tell patients about your experience and expertise..."
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="btn-outline"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                      >
                        {loading ? (
                            <HealthSpinner />
                        ) : (
                            'Save Changes'
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 shadow px-4 py-3">
          {toastMsg}
        </div>
      )}
    </AppShell>
  )
}