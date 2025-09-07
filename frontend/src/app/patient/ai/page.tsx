"use client"
import { AppShell } from '@/components/layout/AppShell'
import { useState } from 'react'
import { api } from '@/lib/api'

export default function AIPage() {
  const [symptoms, setSymptoms] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState('symptom-checker')

  const run = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let res
      switch (selectedService) {
        case 'symptom-checker':
          res = await api.ai.symptomChecker({ 
            symptoms: symptoms.split(',').map(s => s.trim()), 
            severity: 'mild', 
            duration: '2d', 
            age: 30 
          })
          break
        case 'health-tips':
          res = await api.ai.healthTips({ 
            topic: symptoms, 
            age: 30, 
            gender: 'male' 
          })
          break
        case 'prescription-helper':
          res = await api.ai.prescriptionHelper({ 
            symptoms: symptoms.split(',').map(s => s.trim()), 
            diagnosis: 'General consultation' 
          })
          break
        default:
          res = await api.ai.symptomChecker({ 
            symptoms: symptoms.split(',').map(s => s.trim()), 
            severity: 'mild', 
            duration: '2d', 
            age: 30 
          })
      }
      setResponse(res)
    } catch (error) {
      console.error('AI service error:', error)
      setResponse({ error: 'Failed to get AI response. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const aiServices = [
    {
      id: 'symptom-checker',
      name: 'Symptom Checker',
      description: 'Analyze your symptoms and get preliminary health insights',
      icon: '🔍'
    },
    {
      id: 'health-tips',
      name: 'Health Tips',
      description: 'Get personalized health and wellness recommendations',
      icon: '💡'
    },
    {
      id: 'prescription-helper',
      name: 'Prescription Helper',
      description: 'Get guidance on medication and treatment options',
      icon: '💊'
    }
  ]

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
      ]}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">AI Health Assistant</h1>
          <p className="text-gray-600 mt-2">Get instant health insights and recommendations powered by AI</p>
        </div>

        {/* AI Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiServices.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`card p-6 text-left hover:shadow-lg transition-all ${
                selectedService === service.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              {aiServices.find(s => s.id === selectedService)?.name}
            </h3>
            <p className="text-sm text-gray-500">
              {aiServices.find(s => s.id === selectedService)?.description}
            </p>
          </div>
          <div className="card-body">
            <form onSubmit={run} className="space-y-6">
              <div className="form-group">
                <label className="form-label">
                  {selectedService === 'symptom-checker' ? 'Describe your symptoms (comma separated)' :
                   selectedService === 'health-tips' ? 'What health topic interests you?' :
                   'Describe your condition or symptoms'}
                </label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder={
                    selectedService === 'symptom-checker' ? 'e.g., headache, fever, cough' :
                    selectedService === 'health-tips' ? 'e.g., weight loss, heart health, nutrition' :
                    'e.g., chronic pain, medication side effects'
                  }
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <p>⚠️ This AI assistant provides general health information only.</p>
                  <p>Always consult with a healthcare professional for medical advice.</p>
                </div>
                <button 
                  type="submit" 
                  disabled={loading || !symptoms.trim()}
                  className="btn-primary"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="loading-spinner mr-2"></div>
                      Analyzing...
                    </div>
                  ) : (
                    'Get AI Analysis'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Response */}
        {response && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">AI Response</h3>
            </div>
            <div className="card-body">
              {response.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Error</h4>
                      <p className="text-sm text-red-700 mt-1">{response.error}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {response.data?.analysis && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Analysis</h4>
                      <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
                        {response.data.analysis}
                      </p>
                    </div>
                  )}
                  
                  {response.data?.recommendations && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {response.data.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {response.data?.urgency && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Urgency Level</h4>
                      <span className={`badge ${
                        response.data.urgency === 'high' ? 'badge-danger' :
                        response.data.urgency === 'medium' ? 'badge-warning' :
                        'badge-success'
                      }`}>
                        {response.data.urgency.toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          This AI analysis is for informational purposes only and should not replace professional medical advice. 
                          Please consult with a healthcare provider for proper diagnosis and treatment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Immediate Help?</h3>
            <p className="text-gray-600 mb-4">If you're experiencing severe symptoms or a medical emergency, don't wait.</p>
            <a href="/patient/emergency" className="btn-danger">
              Go to Emergency
            </a>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Book an Appointment</h3>
            <p className="text-gray-600 mb-4">Schedule a consultation with a healthcare professional.</p>
            <a href="/patient/appointments" className="btn-primary">
              Book Appointment
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

