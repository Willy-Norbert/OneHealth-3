"use client"
import { AppShell } from '@/components/layout/AppShell'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    bloodType: user?.bloodType || '',
    emergencyContact: {
      name: user?.emergencyContact?.name || '',
      phone: user?.emergencyContact?.phone || '',
      relationship: user?.emergencyContact?.relationship || ''
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      // Update user profile
      await api.users.updateProfile(formData)
      await refreshProfile()
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
      bloodType: user?.bloodType || '',
      emergencyContact: {
        name: user?.emergencyContact?.name || '',
        phone: user?.emergencyContact?.phone || '',
        relationship: user?.emergencyContact?.relationship || ''
      }
    })
    setIsEditing(false)
  }

  return (
    <AppShell
      menu={[
        { href: '/patient', label: 'Overview' },
        { href: '/patient/appointments', label: 'Appointments' },
        { href: '/patient/teleconsult', label: 'Teleconsultation' },
        { href: '/patient/pharmacy', label: 'Pharmacy' },
        { href: '/patient/ai', label: 'AI Assistant' },
        { href: '/patient/emergency', label: 'Emergency' },
        { href: '/patient/records', label: 'Medical Records' },
        { href: '/patient/orders', label: 'My Orders' },
        { href: '/patient/profile', label: 'Profile' },
      ]}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
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
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-semibold text-blue-600">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-gray-500">{user?.email}</p>
                <div className="mt-4">
                  <span className="badge badge-primary">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <p className="text-sm text-gray-500">Update your personal details</p>
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
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Blood Type</label>
                      <select
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input"
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input"
                      rows={3}
                    />
                  </div>

                  {/* Emergency Contact */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="form-group">
                        <label className="form-label">Contact Name</label>
                        <input
                          type="text"
                          name="emergencyContact.name"
                          value={formData.emergencyContact.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          name="emergencyContact.phone"
                          value={formData.emergencyContact.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Relationship</label>
                        <select
                          name="emergencyContact.relationship"
                          value={formData.emergencyContact.relationship}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="input"
                        >
                          <option value="">Select Relationship</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Parent">Parent</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Child">Child</option>
                          <option value="Friend">Friend</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                      <button
                        type="button"
                        onClick={handleCancel}
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
                          <div className="flex items-center">
                            <div className="loading-spinner mr-2"></div>
                            Saving...
                          </div>
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

        {/* Account Settings */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
            <p className="text-sm text-gray-500">Manage your account preferences</p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Change Password</h4>
                  <p className="text-sm text-gray-500">Update your account password</p>
                </div>
                <button className="btn-outline btn-sm">
                  Change Password
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <button className="btn-outline btn-sm">
                  Enable 2FA
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Account Deletion</h4>
                  <p className="text-sm text-gray-500">Permanently delete your account</p>
                </div>
                <button className="btn-danger btn-sm">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}