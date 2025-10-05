"use client"
import { useState, useEffect } from 'react'
import EditModal from './EditModal'
import { apiFetch } from '@/lib/api'

interface AppointmentEditModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: any
  onSuccess: () => void
}

export default function AppointmentEditModal({ isOpen, onClose, appointment, onSuccess }: AppointmentEditModalProps) {
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: 'in-person',
    reasonForVisit: '',
    status: 'pending',
    consultationFee: '',
    previousVisit: false,
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    if (appointment) {
      const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0]
      setFormData({
        appointmentDate,
        appointmentTime: appointment.appointmentTime || '',
        appointmentType: appointment.appointmentType || 'in-person',
        reasonForVisit: appointment.reasonForVisit || '',
        status: appointment.status || 'pending',
        consultationFee: appointment.consultationFee || '',
        previousVisit: appointment.previousVisit || false,
        notes: appointment.notes || ''
      })
    }
  }, [appointment])

  useEffect(() => {
    // Load doctors and departments
    const loadData = async () => {
      try {
        const [doctorsRes, departmentsRes] = await Promise.all([
          apiFetch('/doctors', { auth: true }),
          apiFetch('/departments', { auth: true })
        ])
        setDoctors(doctorsRes.data?.doctors || [])
        setDepartments(departmentsRes.data?.departments || [])
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }
    loadData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const payload = {
        appointmentDate: new Date(formData.appointmentDate).toISOString(),
        appointmentTime: formData.appointmentTime,
        appointmentType: formData.appointmentType,
        reasonForVisit: formData.reasonForVisit,
        status: formData.status,
        consultationFee: parseInt(formData.consultationFee) || 0,
        previousVisit: formData.previousVisit,
        notes: formData.notes
      }

      await apiFetch(`/appointments/${appointment._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        auth: true
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to update appointment:', error)
      alert('Failed to update appointment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const progress = Math.round(
    (Object.entries(formData).filter(([key, value]) => {
      if (key === 'previousVisit') return true // Boolean field
      return value !== '' && value !== null && value !== undefined
    }).length / Object.keys(formData).length) * 100
  )

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Appointment"
      subtitle="Update appointment details and scheduling"
      onSave={handleSave}
      isLoading={isLoading}
      progress={progress}
      showProgress={true}
    >
      <div className="space-y-6">
        {/* Appointment Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date *</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Time *</label>
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type *</label>
              <select
                name="appointmentType"
                value={formData.appointmentType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="in-person">In-Person</option>
                <option value="virtual">Virtual</option>
                <option value="phone">Phone</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
                <option value="no-show">No Show</option>
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
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="previousVisit"
                checked={formData.previousVisit}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700">Previous Visit</label>
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
                <p className="text-sm text-gray-900">{appointment?.patient?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <p className="text-sm text-gray-900">{appointment?.patient?.email || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Doctor</label>
                <p className="text-sm text-gray-900">{appointment?.doctor?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                <p className="text-sm text-gray-900">{appointment?.department?.name || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit *</label>
              <textarea
                name="reasonForVisit"
                value={formData.reasonForVisit}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter reason for visit"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter any additional notes"
              />
            </div>
          </div>
        </div>
      </div>
    </EditModal>
  )
}


