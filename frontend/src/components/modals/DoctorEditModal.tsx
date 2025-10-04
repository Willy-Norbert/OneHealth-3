"use client"
import { useState, useEffect } from 'react'
import EditModal from './EditModal'
import { apiFetch } from '@/lib/api'

interface DoctorEditModalProps {
  isOpen: boolean
  onClose: () => void
  doctor: any
  onSuccess: () => void
}

export default function DoctorEditModal({ isOpen, onClose, doctor, onSuccess }: DoctorEditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    profileImage: '',
    licenseNumber: '',
    specialization: '',
    department: '',
    consultationFee: '',
    experience: '',
    languages: '',
    bio: '',
    consultationModes: ['in-person']
  })
  const [isLoading, setIsLoading] = useState(false)
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.user?.name || '',
        email: doctor.user?.email || '',
        phoneNumber: doctor.user?.phoneNumber || '',
        profileImage: doctor.user?.profileImage || '',
        licenseNumber: doctor.licenseNumber || '',
        specialization: doctor.specialization || '',
        department: doctor.department?._id || '',
        consultationFee: doctor.consultationFee || '',
        experience: doctor.experience || '',
        languages: Array.isArray(doctor.languages) ? doctor.languages.join(', ') : doctor.languages || '',
        bio: doctor.bio || '',
        consultationModes: doctor.consultationModes || ['in-person']
      })
    }
  }, [doctor])

  useEffect(() => {
    // Load departments
    const loadDepartments = async () => {
      try {
        const response = await apiFetch('/departments', { auth: true })
        setDepartments(response.data?.departments || [])
      } catch (error) {
        console.error('Failed to load departments:', error)
      }
    }
    loadDepartments()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      consultationModes: checked 
        ? [...prev.consultationModes, value]
        : prev.consultationModes.filter(mode => mode !== value)
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        profileImage: formData.profileImage,
        licenseNumber: formData.licenseNumber,
        specialization: formData.specialization,
        consultationFee: Number(formData.consultationFee || 0),
        experience: Number(formData.experience || 0),
        languages: formData.languages.split(',').map(l => l.trim()).filter(l => l),
        bio: formData.bio,
        consultationModes: formData.consultationModes
      }

      await apiFetch(`/doctors/${doctor._id}/hospital-update`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        auth: true
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to update doctor:', error)
      alert('Failed to update doctor. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const progress = Math.round(
    (Object.values(formData).filter(value => 
      value !== '' && value !== null && value !== undefined && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length / Object.keys(formData).length) * 100
  )

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Doctor"
      subtitle="Update doctor information and settings"
      onSave={handleSave}
      isLoading={isLoading}
      progress={progress}
      showProgress={true}
    >
      <div className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter email address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter image URL"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter license number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter specialization"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select department</option>
                {departments.map((dept: any) => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (RWF)</label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter consultation fee"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter years of experience"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="English, French, Kinyarwanda"
              />
            </div>
          </div>
        </div>

        {/* Consultation Modes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Modes</h3>
          <div className="space-y-2">
            {['in-person', 'virtual', 'phone'].map((mode) => (
              <label key={mode} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  value={mode}
                  checked={formData.consultationModes.includes(mode)}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700 capitalize">{mode.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter doctor's biography and background"
          />
        </div>
      </div>
    </EditModal>
  )
}

