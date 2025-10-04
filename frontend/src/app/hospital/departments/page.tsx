"use client"
import { AppShell } from '@/components/layout/AppShell'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import HealthSpinner from '@/components/ui/HealthSpinner'

export default function HospitalDepartmentsPage() {
  const { data: departments, mutate } = useSWR('hospital-departments', () => api.departments.list() as any)
  const { data: doctors } = useSWR('hospital-doctors', () => api.doctors.list() as any)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    services: [''],
    consultationFee: '',
    isActive: true
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Filter out empty services
      const filteredServices = formData.services.filter(service => service.trim() !== '')
      const submitData = {
        ...formData,
        services: filteredServices,
        consultationFee: parseInt(formData.consultationFee) || 0
      }
      
      // This would be an API call to create department
      console.log('Creating department:', submitData)
      // await api.departments.create(submitData)
      // await mutate()
      setShowCreateForm(false)
      setFormData({
        name: '',
        description: '',
        services: [''],
        consultationFee: '',
        isActive: true
      })
    } catch (error) {
      console.error('Error creating department:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: departments?.data?.departments?.length || 0,
    active: departments?.data?.departments?.filter((d: any) => d.isActive).length || 0,
    doctors: doctors?.data?.doctors?.length || 0,
    totalServices: departments?.data?.departments?.reduce((acc: number, d: any) => acc + (d.services?.length || 0), 0) || 0
  }

  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string|null>(null)

  async function handleDelete(departmentId: string) {
    if (!window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await api.departments.delete(departmentId)
      await departments.mutate()
    } catch (e: any) {
      setDeleteError(e?.message || 'Failed to delete department')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <AppShell
    menu={[
      { href: '/hospital', label: 'Overview' },
      { href: '/hospital/doctors', label: 'Doctors' },
      { href: '/hospital/departments', label: 'Departments' },
      { href: '/hospital/appointments', label: 'Appointments' },
      { href: '/hospital/patients', label: 'Patients' },
      { href: '/hospital/lab-results', label: 'Medical Records' },
      { href: '/hospital/drug-interactions', label: 'Prescriptions' },
      { href: '/hospital/analytics', label: 'Analytics' },
      { href: '/hospital/profile', label: 'Profile' },
      { href: '/hospital/notifications', label: 'Notifications' },
      { href: '/hospital/emergency', label: 'Emergency' },
      
    ]}
  >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
            <p className="text-gray-600 mt-1">Manage hospital departments and services</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Department
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 7.5h10.5m-10.5 6h10.5m-10.5 6h10.5" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Total Departments</p>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Active</p>
                <p className="stat-value">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Total Doctors</p>
                <p className="stat-value">{stats.doctors}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 17.25m4.75-14.146a2.25 2.25 0 014.5 0v5.714a2.25 2.25 0 01-.659 1.591L5 17.25m4.75-14.146a2.25 2.25 0 014.5 0v5.714a2.25 2.25 0 01-.659 1.591L5 17.25" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="stat-label">Total Services</p>
                <p className="stat-value">{stats.totalServices}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Department Form */}
        {showCreateForm && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Create New Department</h3>
              <p className="text-sm text-gray-500">Add a new department to your hospital</p>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Department Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g., Cardiology"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Consultation Fee (RWF)</label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g., 50000"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input"
                    rows={3}
                    placeholder="Describe the department's purpose and services"
                    required
                  />
                </div>

                {/* Services */}
                <div className="form-group">
                  <label className="form-label">Services Offered</label>
                  <div className="space-y-3">
                    {formData.services.map((service, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={service}
                          onChange={(e) => handleServiceChange(index, e.target.value)}
                          className="input flex-1"
                          placeholder="e.g., General Consultation"
                          required
                        />
                        {formData.services.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeService(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addService}
                      className="btn-outline btn-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add Service
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active Department</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
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
                      'Create Department'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Departments List */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Hospital Departments</h3>
            <p className="text-sm text-gray-500">Manage all departments in your hospital</p>
          </div>
          <div className="card-body">
            {departments?.data?.departments?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.data.departments.map((department: any) => (
                  <div key={department._id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{department.name}</h4>
                        <p className="text-sm text-gray-500">{department.description}</p>
                      </div>
                      <span className={`badge ${department.isActive ? 'badge-success' : 'badge-gray'}`}>
                        {department.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {department.services?.map((service: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Fee:</span> {department.consultationFee?.toLocaleString()} RWF
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="btn-primary btn-sm"
                          onClick={() => { setSelectedDepartment(department); setShowEditModal(true) }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-outline btn-sm"
                          onClick={() => { setSelectedDepartment(department); setShowViewModal(true) }}
                        >
                          View
                        </button>
                        <button
                          className="btn-error btn-sm"
                          onClick={() => handleDelete(department._id)}
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? 'Deleting...' : 'Delete'}
                        </button>
      {/* Edit Modal */}
      {showEditModal && selectedDepartment && (
        <div className="modal-overlay">
          <div className="modal max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Edit Department</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const filteredServices = selectedDepartment.services.filter((s: string) => s.trim() !== '');
                  const submitData = {
                    ...selectedDepartment,
                    services: filteredServices,
                    consultationFee: parseInt(selectedDepartment.consultationFee) || 0
                  };
                  await api.departments.update(selectedDepartment._id, submitData);
                  await mutate();
                  setShowEditModal(false);
                } catch (error) {
                  alert('Failed to update department');
                } finally {
                  setLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="form-label">Name</label>
                <input
                  className="input w-full"
                  type="text"
                  value={selectedDepartment.name}
                  onChange={e => setSelectedDepartment((d: any) => ({ ...d, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="input w-full"
                  value={selectedDepartment.description}
                  onChange={e => setSelectedDepartment((d: any) => ({ ...d, description: e.target.value }))}
                  rows={2}
                />
              </div>
              <div>
                <label className="form-label">Consultation Fee (RWF)</label>
                <input
                  className="input w-full"
                  type="number"
                  value={selectedDepartment.consultationFee}
                  onChange={e => setSelectedDepartment((d: any) => ({ ...d, consultationFee: e.target.value }))}
                  min={0}
                />
              </div>
              <div>
                <label className="form-label">Services</label>
                {selectedDepartment.services.map((service: string, idx: number) => (
                  <div key={idx} className="flex items-center mb-2">
                    <input
                      className="input flex-1"
                      type="text"
                      value={service}
                      onChange={e => {
                        const newServices = [...selectedDepartment.services];
                        newServices[idx] = e.target.value;
                        setSelectedDepartment((d: any) => ({ ...d, services: newServices }));
                      }}
                    />
                    <button
                      type="button"
                      className="ml-2 btn-outline btn-xs"
                      onClick={() => {
                        if (selectedDepartment.services.length > 1) {
                          setSelectedDepartment((d: any) => ({ ...d, services: d.services.filter((_: any, i: number) => i !== idx) }));
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-outline btn-xs mt-2"
                  onClick={() => setSelectedDepartment((d: any) => ({ ...d, services: [...d.services, ''] }))}
                >
                  Add Service
                </button>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn-outline" onClick={()=>setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Modal */}
      {showViewModal && selectedDepartment && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="text-xl font-bold mb-4">Department Details</h2>
            <p><b>Name:</b> {selectedDepartment.name}</p>
            <p><b>Description:</b> {selectedDepartment.description}</p>
            <p><b>Fee:</b> {selectedDepartment.consultationFee?.toLocaleString()} RWF</p>
            <p><b>Services:</b> {selectedDepartment.services?.join(', ')}</p>
            <p><b>Status:</b> {selectedDepartment.isActive ? 'Active' : 'Inactive'}</p>
            <button className="btn-outline mt-4" onClick={()=>setShowViewModal(false)}>Close</button>
          </div>
        </div>
      )}
      {deleteError && <div className="alert alert-error mt-4">{deleteError}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 7.5h10.5m-10.5 6h10.5m-10.5 6h10.5" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No departments</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first department.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn-primary"
                  >
                    Create First Department
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}