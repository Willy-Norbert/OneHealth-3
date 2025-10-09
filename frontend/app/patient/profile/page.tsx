"use client"
import { AppShell } from '@/components/layout/AppShell'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import React, { useState } from 'react'
import HealthSpinner from '@/components/ui/HealthSpinner'

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState<string|undefined>(undefined)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string|undefined>(undefined)
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
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [docLoading, setDocLoading] = useState<string | null>(null)

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) return
    setDeleting(true)
    setDeleteError(undefined)
    try {
      await api.users.deleteAccount()
      window.location.href = '/auth/login'
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete account')
    } finally {
      setDeleting(false)
    }
  }

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      const res: any = await api.uploads.image(file)
      if (res?.url) {
        // Update backend profile image URL
        await api.users.updateProfile({ profileImageUrl: res.url })
        await refreshProfile()
        setToastMsg('Profile photo updated')
        setTimeout(()=>setToastMsg(undefined), 3000)
      }
    } catch (err) {
      console.error('Avatar upload failed', err)
    } finally {
      setAvatarUploading(false)
    }
  }

  const uploadSingleDocument = async (file: File, kind: 'id' | 'insuranceFront' | 'insuranceBack') => {
    setDocLoading(kind)
    try {
      const res: any = await api.uploads.image(file)
      if (!res?.url) return
      if (kind === 'id') {
        await api.users.updateProfile({ idDocumentUrl: res.url })
      } else if (kind === 'insuranceFront') {
        await api.users.updateProfile({ insurance: { frontUrl: res.url } })
      } else {
        await api.users.updateProfile({ insurance: { backUrl: res.url } })
      }
      await refreshProfile()
      setToastMsg('Document updated')
      setTimeout(()=>setToastMsg(undefined), 2500)
    } finally {
      setDocLoading(null)
    }
  }

  const uploadAdditionalDocuments = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setDocLoading('additional')
    try {
      const uploaded: { fileName: string; url: string }[] = []
      for (const f of Array.from(files)) {
        const res: any = await api.uploads.image(f)
        if (res?.url) uploaded.push({ fileName: f.name, url: res.url })
      }
      if (uploaded.length) {
        const current = (user as any)?.additionalDocuments || []
        await api.users.updateProfile({ additionalDocuments: [...current, ...uploaded] })
        await refreshProfile()
        setToastMsg('Files uploaded')
        setTimeout(()=>setToastMsg(undefined), 2500)
      }
    } finally {
      setDocLoading(null)
    }
  }

  const removeAdditionalDocument = async (idx: number) => {
    const current = (user as any)?.additionalDocuments || []
    const next = current.filter((_: any, i: number) => i !== idx)
    setDocLoading('removeDoc')
    try {
      await api.users.updateProfile({ additionalDocuments: next })
      await refreshProfile()
    } finally {
      setDocLoading(null)
    }
  }

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
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            Edit Profile
          </button>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-body text-center">
                {(() => {
                  const photo = (user as any)?.profileImageUrl || (user as any)?.profileImage
                  return photo ? (
                    <img src={photo as string} alt={user && 'name' in user ? (user.name as string) : 'Avatar'} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
                  ) : (
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-semibold text-emerald-600">
                        {user && 'name' in user && typeof user.name === 'string' ? (user.name as string).charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  )
                })()}
                <h3 className="text-xl font-semibold text-gray-900">{user && 'name' in user ? user.name : ''}</h3>
                <p className="text-gray-500">{user && 'email' in user ? user.email : ''}</p>
                <div className="mt-4">
                  <span className="badge badge-primary">
                    {user && 'role' in user && typeof user.role === 'string' ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : ''}
                  </span>
                </div>
                <div className="mt-4">
                  <label className="btn-outline btn-sm cursor-pointer">
                    {avatarUploading ? <HealthSpinner /> : 'Change Photo'}
                    <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
                  </label>
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
                <div className="space-y-2">
                  <div><b>Name:</b> {user && 'name' in user ? user.name : ''}</div>
                  <div><b>Email:</b> {user && 'email' in user ? user.email : ''}</div>
                  <div><b>Phone:</b> {user && 'phone' in user ? String(user.phone) : ''}</div>
                  <div><b>Date of Birth:</b> {user && 'dateOfBirth' in user ? String(user.dateOfBirth) : ''}</div>
                  <div><b>Gender:</b> {user && 'gender' in user ? String(user.gender) : ''}</div>
                  <div><b>Blood Type:</b> {user && 'bloodType' in user ? String(user.bloodType) : ''}</div>
                  <div><b>Address:</b> {user && 'address' in user ? String(user.address) : ''}</div>
                  <div><b>Emergency Contact:</b> {
                    user && 'emergencyContact' in user && user.emergencyContact && typeof user.emergencyContact === 'object'
                      ? `${'name' in user.emergencyContact ? String(user.emergencyContact.name) : ''} (${ 'relationship' in user.emergencyContact ? String(user.emergencyContact.relationship) : '' }) ${ 'phone' in user.emergencyContact ? String(user.emergencyContact.phone) : ''}`
                      : ''
                  }</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
            <p className="text-sm text-gray-500">Preview and update your uploaded documents</p>
          </div>
          <div className="card-body space-y-6">
            {/* National ID */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">National ID</h4>
                <label className="btn-outline btn-sm cursor-pointer">
                  {docLoading==='id' ? <HealthSpinner /> : 'Replace'}
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={e=>uploadSingleDocument(e.target.files?.[0]!, 'id')} />
                </label>
              </div>
              { (user as any)?.idDocumentUrl ? (
                (String((user as any).idDocumentUrl).toLowerCase().endsWith('.pdf') ? (
                  <a href={(user as any).idDocumentUrl} target="_blank" className="text-emerald-700 underline">View PDF</a>
                ) : (
                  <img src={(user as any).idDocumentUrl} alt="ID" className="w-48 rounded-lg border" />
                ))
              ) : (
                <p className="text-sm text-gray-500">No ID uploaded</p>
              )}
            </div>

            {/* Insurance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Insurance (Front)</h4>
                  <label className="btn-outline btn-sm cursor-pointer">
                    {docLoading==='insuranceFront' ? <HealthSpinner /> : 'Replace'}
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={e=>uploadSingleDocument(e.target.files?.[0]!, 'insuranceFront')} />
                  </label>
                </div>
                { (user as any)?.insurance?.frontUrl ? (
                  (String((user as any).insurance.frontUrl).toLowerCase().endsWith('.pdf') ? (
                    <a href={(user as any).insurance.frontUrl} target="_blank" className="text-emerald-700 underline">View PDF</a>
                  ) : (
                    <img src={(user as any).insurance.frontUrl} alt="Insurance Front" className="w-48 rounded-lg border" />
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Not uploaded</p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Insurance (Back)</h4>
                  <label className="btn-outline btn-sm cursor-pointer">
                    {docLoading==='insuranceBack' ? <HealthSpinner /> : 'Replace'}
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={e=>uploadSingleDocument(e.target.files?.[0]!, 'insuranceBack')} />
                  </label>
                </div>
                { (user as any)?.insurance?.backUrl ? (
                  (String((user as any).insurance.backUrl).toLowerCase().endsWith('.pdf') ? (
                    <a href={(user as any).insurance.backUrl} target="_blank" className="text-emerald-700 underline">View PDF</a>
                  ) : (
                    <img src={(user as any).insurance.backUrl} alt="Insurance Back" className="w-48 rounded-lg border" />
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Not uploaded</p>
                )}
              </div>
            </div>

            {/* Additional medical files */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Additional Medical Records</h4>
                <label className="btn-outline btn-sm cursor-pointer">
                  {docLoading==='additional' ? <HealthSpinner /> : 'Upload'}
                  <input type="file" accept="image/*,.pdf" multiple className="hidden" onChange={e=>uploadAdditionalDocuments(e.target.files)} />
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {((user as any)?.additionalDocuments || []).map((doc: any, idx: number) => (
                  <div key={idx} className="border rounded-lg p-3 flex items-center justify-between">
                    <a href={doc.url} target="_blank" className="text-emerald-700 underline truncate mr-3">{doc.fileName || 'Document'}</a>
                    <button className="btn-danger btn-xs" onClick={()=>removeAdditionalDocument(idx)} disabled={docLoading==='removeDoc'}>Remove</button>
                  </div>
                ))}
                {((user as any)?.additionalDocuments || []).length === 0 && (
                  <p className="text-sm text-gray-500">No additional files uploaded</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="modal-overlay">
            <div className="modal max-w-2xl w-full">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
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
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
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
                    onChange={e => handleInputChange(e as any)}
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
                        className="input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Relationship</label>
                      <select
                        name="emergencyContact.relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={handleInputChange}
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
                      <HealthSpinner />
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                <button className="btn-danger btn-sm" onClick={handleDeleteAccount} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
                {deleteError && <div className="alert alert-error mt-2">{deleteError}</div>}
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