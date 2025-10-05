"use client"
import { useState, useEffect } from 'react'
import EditModal from './EditModal'
import { apiFetch } from '@/lib/api'

interface DepartmentEditModalProps {
  isOpen: boolean
  onClose: () => void
  department: any
  onSuccess: () => void
}

export default function DepartmentEditModal({ isOpen, onClose, department, onSuccess }: DepartmentEditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    consultationFee: '',
    services: [''],
    isActive: true
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        description: department.description || '',
        consultationFee: department.consultationFee || '',
        services: department.services && department.services.length > 0 ? department.services : [''],
        isActive: department.isActive !== false
      })
    }
  }, [department])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...formData.services]
    newServices[index] = value
    setFormData(prev => ({
      ...prev,
      services: newServices
    }))
  }

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, '']
    }))
  }

  const removeService = (index: number) => {
    if (formData.services.length > 1) {
      const newServices = formData.services.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        services: newServices
      }))
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const filteredServices = formData.services.filter(service => service.trim() !== '')
      const payload = {
        ...formData,
        services: filteredServices,
        consultationFee: parseInt(formData.consultationFee) || 0
      }

      await apiFetch(`/departments/${department._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        auth: true
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to update department:', error)
      alert('Failed to update department. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const progress = Math.round(
    (Object.entries(formData).filter(([key, value]) => {
      if (key === 'services') {
        return Array.isArray(value) && value.some(s => s.trim() !== '')
      }
      return value !== '' && value !== null && value !== undefined
    }).length / Object.keys(formData).length) * 100
  )

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Department"
      subtitle="Update department information and services"
      onSave={handleSave}
      isLoading={isLoading}
      progress={progress}
      showProgress={true}
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter department name"
                required
              />
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter department description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="isActive"
                value={formData.isActive ? 'active' : 'inactive'}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h3>
          <div className="space-y-3">
            {formData.services.map((service, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={service}
                  onChange={(e) => handleServiceChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={`Service ${index + 1}`}
                />
                {formData.services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addService}
              className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Service
            </button>
          </div>
        </div>
      </div>
    </EditModal>
  )
}


