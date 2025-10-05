"use client"
import { useState, useEffect } from 'react'
import EditModal from './EditModal'
import { apiFetch } from '@/lib/api'

interface MedicalRecordEditModalProps {
  isOpen: boolean
  onClose: () => void
  medicalRecord: any
  onSuccess: () => void
}

export default function MedicalRecordEditModal({ isOpen, onClose, medicalRecord, onSuccess }: MedicalRecordEditModalProps) {
  const [formData, setFormData] = useState({
    recordType: 'general',
    title: '',
    description: '',
    diagnosis: '',
    treatment: '',
    medications: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: ''
    },
    labResults: '',
    imagingResults: '',
    followUpRequired: false,
    followUpDate: '',
    notes: '',
    attachments: []
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (medicalRecord) {
      setFormData({
        recordType: medicalRecord.recordType || 'general',
        title: medicalRecord.title || '',
        description: medicalRecord.description || '',
        diagnosis: medicalRecord.diagnosis || '',
        treatment: medicalRecord.treatment || '',
        medications: medicalRecord.medications || '',
        vitalSigns: {
          bloodPressure: medicalRecord.vitalSigns?.bloodPressure || '',
          heartRate: medicalRecord.vitalSigns?.heartRate || '',
          temperature: medicalRecord.vitalSigns?.temperature || '',
          weight: medicalRecord.vitalSigns?.weight || '',
          height: medicalRecord.vitalSigns?.height || ''
        },
        labResults: medicalRecord.labResults || '',
        imagingResults: medicalRecord.imagingResults || '',
        followUpRequired: medicalRecord.followUpRequired || false,
        followUpDate: medicalRecord.followUpDate 
          ? new Date(medicalRecord.followUpDate).toISOString().split('T')[0]
          : '',
        notes: medicalRecord.notes || '',
        attachments: medicalRecord.attachments || []
      })
    }
  }, [medicalRecord])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (name.startsWith('vitalSigns.')) {
      const vitalSign = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        vitalSigns: {
          ...prev.vitalSigns,
          [vitalSign]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }))
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const payload = {
        ...formData,
        followUpDate: formData.followUpDate ? new Date(formData.followUpDate).toISOString() : null
      }

      await apiFetch(`/medical-records/${medicalRecord._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        auth: true
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to update medical record:', error)
      alert('Failed to update medical record. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const progress = Math.round(
    (Object.entries(formData).filter(([key, value]) => {
      if (key === 'vitalSigns') {
        return Object.values(value).some(v => v !== '')
      }
      if (key === 'followUpRequired') return true
      if (key === 'attachments') return Array.isArray(value) && value.length > 0
      return value !== '' && value !== null && value !== undefined
    }).length / Object.keys(formData).length) * 100
  )

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Medical Record"
      subtitle="Update patient medical record and treatment details"
      onSave={handleSave}
      isLoading={isLoading}
      progress={progress}
      showProgress={true}
    >
      <div className="space-y-6">
        {/* Record Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Record Type *</label>
              <select
                name="recordType"
                value={formData.recordType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="general">General</option>
                <option value="consultation">Consultation</option>
                <option value="diagnosis">Diagnosis</option>
                <option value="treatment">Treatment</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter record title"
                required
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
                placeholder="Enter record description"
              />
            </div>
          </div>
        </div>

        {/* Diagnosis and Treatment */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Diagnosis & Treatment</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter diagnosis details"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Plan</label>
              <textarea
                name="treatment"
                value={formData.treatment}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter treatment plan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medications Prescribed</label>
              <textarea
                name="medications"
                value={formData.medications}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter prescribed medications"
              />
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure</label>
              <input
                type="text"
                name="vitalSigns.bloodPressure"
                value={formData.vitalSigns.bloodPressure}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="120/80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heart Rate (BPM)</label>
              <input
                type="number"
                name="vitalSigns.heartRate"
                value={formData.vitalSigns.heartRate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="72"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
              <input
                type="number"
                name="vitalSigns.temperature"
                value={formData.vitalSigns.temperature}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="36.5"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                name="vitalSigns.weight"
                value={formData.vitalSigns.weight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="70"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                name="vitalSigns.height"
                value={formData.vitalSigns.height}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="170"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lab Results</label>
              <textarea
                name="labResults"
                value={formData.labResults}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter lab test results"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imaging Results</label>
              <textarea
                name="imagingResults"
                value={formData.imagingResults}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter imaging test results"
              />
            </div>
          </div>
        </div>

        {/* Follow-up */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-up</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="followUpRequired"
                checked={formData.followUpRequired}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700">Follow-up Required</label>
            </div>
            {formData.followUpRequired && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter additional notes"
              />
            </div>
          </div>
        </div>
      </div>
    </EditModal>
  )
}


