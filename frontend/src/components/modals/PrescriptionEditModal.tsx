"use client"
import { useState, useEffect } from 'react'
import EditModal from './EditModal'
import { apiFetch } from '@/lib/api'

interface PrescriptionEditModalProps {
  isOpen: boolean
  onClose: () => void
  prescription: any
  onSuccess: () => void
}

export default function PrescriptionEditModal({ isOpen, onClose, prescription, onSuccess }: PrescriptionEditModalProps) {
  const [formData, setFormData] = useState({
    appointment: '',
    patient: '',
    diagnosis: '',
    medications: [{
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    }],
    notes: '',
    followUpRequired: false,
    followUpDate: '',
    status: 'active'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    if (prescription) {
      setFormData({
        appointment: prescription.appointment?._id || prescription.appointment || '',
        patient: prescription.patient?._id || prescription.patient || '',
        diagnosis: prescription.diagnosis || '',
        medications: prescription.medications && prescription.medications.length > 0 
          ? prescription.medications 
          : [{
              name: '',
              dosage: '',
              frequency: '',
              duration: '',
              instructions: ''
            }],
        notes: prescription.notes || '',
        followUpRequired: prescription.followUpRequired || false,
        followUpDate: prescription.followUpDate 
          ? new Date(prescription.followUpDate).toISOString().split('T')[0]
          : '',
        status: prescription.status || 'active'
      })
    }
  }, [prescription])

  useEffect(() => {
    // Load appointments
    const loadAppointments = async () => {
      try {
        const response = await apiFetch('/appointments/my-appointments', { auth: true })
        setAppointments(response.data?.appointments || [])
      } catch (error) {
        console.error('Failed to load appointments:', error)
      }
    }
    loadAppointments()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleMedicationChange = (index: number, field: string, value: string) => {
    const newMedications = [...formData.medications]
    newMedications[index] = {
      ...newMedications[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      medications: newMedications
    }))
  }

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, {
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      }]
    }))
  }

  const removeMedication = (index: number) => {
    if (formData.medications.length > 1) {
      const newMedications = formData.medications.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        medications: newMedications
      }))
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const filteredMedications = formData.medications.filter(med => med.name.trim() !== '')
      const payload = {
        ...formData,
        medications: filteredMedications,
        followUpDate: formData.followUpDate ? new Date(formData.followUpDate).toISOString() : null
      }

      await apiFetch(`/prescriptions/${prescription._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        auth: true
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to update prescription:', error)
      alert('Failed to update prescription. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const progress = Math.round(
    (Object.entries(formData).filter(([key, value]) => {
      if (key === 'medications') {
        return Array.isArray(value) && value.some(med => med.name.trim() !== '')
      }
      if (key === 'followUpRequired') return true
      return value !== '' && value !== null && value !== undefined
    }).length / Object.keys(formData).length) * 100
  )

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Prescription"
      subtitle="Update prescription details and medication information"
      onSave={handleSave}
      isLoading={isLoading}
      progress={progress}
      showProgress={true}
    >
      <div className="space-y-6">
        {/* Prescription Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescription Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appointment *</label>
              <select
                name="appointment"
                value={formData.appointment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select appointment</option>
                {appointments.map((appt: any) => (
                  <option key={appt._id} value={appt._id}>
                    {new Date(appt.appointmentDate).toLocaleString()} — {appt.patient?.name || 'Patient'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis *</label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter diagnosis details"
                required
              />
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Patient Name</label>
                <p className="text-sm text-gray-900">{prescription?.patient?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <p className="text-sm text-gray-900">{prescription?.patient?.email || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Doctor</label>
                <p className="text-sm text-gray-900">{prescription?.doctor?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date Created</label>
                <p className="text-sm text-gray-900">
                  {prescription?.createdAt ? new Date(prescription.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Medications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medications</h3>
          <div className="space-y-4">
            {formData.medications.map((medication, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">Medication {index + 1}</h4>
                  {formData.medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medication Name *</label>
                    <input
                      type="text"
                      value={medication.name}
                      onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter medication name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dosage *</label>
                    <input
                      type="text"
                      value={medication.dosage}
                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., 500mg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                    <input
                      type="text"
                      value={medication.frequency}
                      onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Twice daily"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      value={medication.duration}
                      onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., 7 days"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                    <textarea
                      value={medication.instructions}
                      onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter special instructions"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addMedication}
              className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Medication
            </button>
          </div>
        </div>

        {/* Follow-up and Notes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-up & Notes</h3>
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
                placeholder="Enter additional notes or instructions"
              />
            </div>
          </div>
        </div>
      </div>
    </EditModal>
  )
}

