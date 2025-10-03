
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight, Check, Hospital, CreditCard, User, Calendar, FileText } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface Hospital {
  _id: string
  name: string
  location: string
  services: string[]
}

interface ConsultationType {
  _id: string
  name: string
  category: string
  speciality?: string
  fee: number
  duration: number
}

interface Insurance {
  _id: string
  name: string
  type: string
  coveragePercentage: number
}

export default function TeleconsultationBooking() {
  const [currentStep, setCurrentStep] = useState(1)
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [consultationTypes, setConsultationTypes] = useState<ConsultationType[]>([])
  const [insuranceOptions, setInsuranceOptions] = useState<Insurance[]>([])
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    hospital: '',
    consultationType: '',
    insurance: '',
    patientDetails: {
      fullName: '',
      age: '',
      sex: '',
      weight: '',
      nationalId: '',
      insuranceNumber: '',
      phoneNumber: ''
    },
    paymentDetails: {
      method: '',
      amount: 0
    }
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const [hospitalsRes, consultationTypesRes, insuranceRes] = await Promise.all([
        fetch(`${API_URL}/teleconsultation/hospitals`),
        fetch(`${API_URL}/teleconsultation/consultation-types`),
        fetch(`${API_URL}/teleconsultation/insurance-options`)
      ])

      const hospitalsData = await hospitalsRes.json()
      const consultationTypesData = await consultationTypesRes.json()
      const insuranceData = await insuranceRes.json()

      setHospitals(hospitalsData.data.hospitals || [])
      setConsultationTypes(consultationTypesData.data.consultationTypes || [])
      setInsuranceOptions(insuranceData.data.insuranceOptions || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const selectedConsultationType = consultationTypes.find(ct => ct._id === formData.consultationType)
  const selectedInsurance = insuranceOptions.find(ins => ins._id === formData.insurance)

  const calculateFinalAmount = () => {
    if (!selectedConsultationType) return 0
    const baseAmount = selectedConsultationType.fee
    if (selectedInsurance) {
      const discount = (baseAmount * selectedInsurance.coveragePercentage) / 100
      return baseAmount - discount
    }
    return baseAmount
  }

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const finalAmount = calculateFinalAmount()
      
      const response = await fetch(`${API_URL}/teleconsultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          paymentDetails: {
            ...formData.paymentDetails,
            amount: finalAmount
          }
        })
      })

      if (response.ok) {
        alert('Teleconsultation booked successfully! You will receive a confirmation SMS.')
        // Reset form or redirect
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.message}`)
      }
    } catch (error) {
      console.error('Error booking teleconsultation:', error)
      alert('An error occurred while booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Hospital className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Select Hospital/Clinic</h3>
            </div>
            <RadioGroup value={formData.hospital} onValueChange={(value) => setFormData({...formData, hospital: value})}>
              {hospitals.map((hospital) => (
                <div key={hospital._id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={hospital._id} id={hospital._id} />
                  <Label htmlFor={hospital._id} className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">{hospital.name}</p>
                      <p className="text-sm text-gray-600">{hospital.location}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Choose Consultation Type</h3>
            </div>
            <RadioGroup value={formData.consultationType} onValueChange={(value) => setFormData({...formData, consultationType: value})}>
              {consultationTypes.map((type) => (
                <div key={type._id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={type._id} id={type._id} />
                  <Label htmlFor={type._id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{type.name}</p>
                        <p className="text-sm text-gray-600">{type.category}{type.speciality && ` - ${type.speciality}`}</p>
                        <p className="text-sm text-gray-600">{type.duration} minutes</p>
                      </div>
                      <p className="font-bold text-green-600">${type.fee}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Select Insurance</h3>
            </div>
            <RadioGroup value={formData.insurance} onValueChange={(value) => setFormData({...formData, insurance: value})}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="" id="no-insurance" />
                <Label htmlFor="no-insurance" className="flex-1 cursor-pointer">
                  <p className="font-medium">Pay Out-of-Pocket</p>
                  <p className="text-sm text-gray-600">No insurance coverage</p>
                </Label>
              </div>
              {insuranceOptions.map((insurance) => (
                <div key={insurance._id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={insurance._id} id={insurance._id} />
                  <Label htmlFor={insurance._id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{insurance.name}</p>
                        <p className="text-sm text-gray-600">{insurance.type} Insurance</p>
                      </div>
                      <p className="font-bold text-blue-600">{insurance.coveragePercentage}% coverage</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Patient Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.patientDetails.fullName}
                  onChange={(e) => setFormData({
                    ...formData,
                    patientDetails: { ...formData.patientDetails, fullName: e.target.value }
                  })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.patientDetails.age}
                  onChange={(e) => setFormData({
                    ...formData,
                    patientDetails: { ...formData.patientDetails, age: e.target.value }
                  })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sex">Sex *</Label>
                <RadioGroup
                  value={formData.patientDetails.sex}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    patientDetails: { ...formData.patientDetails, sex: value }
                  })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.patientDetails.weight}
                  onChange={(e) => setFormData({
                    ...formData,
                    patientDetails: { ...formData.patientDetails, weight: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="nationalId">National ID</Label>
                <Input
                  id="nationalId"
                  value={formData.patientDetails.nationalId}
                  onChange={(e) => setFormData({
                    ...formData,
                    patientDetails: { ...formData.patientDetails, nationalId: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.patientDetails.phoneNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    patientDetails: { ...formData.patientDetails, phoneNumber: e.target.value }
                  })}
                  required
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Payment Method</h3>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Payment Summary</h4>
              {selectedConsultationType && (
                <>
                  <p>Consultation Fee: ${selectedConsultationType.fee}</p>
                  {selectedInsurance && (
                    <p>Insurance Coverage ({selectedInsurance.coveragePercentage}%): -${(selectedConsultationType.fee * selectedInsurance.coveragePercentage / 100).toFixed(2)}</p>
                  )}
                  <Separator className="my-2" />
                  <p className="font-bold">Total Amount: ${calculateFinalAmount().toFixed(2)}</p>
                </>
              )}
            </div>

            <RadioGroup 
              value={formData.paymentDetails.method} 
              onValueChange={(value) => setFormData({
                ...formData, 
                paymentDetails: { ...formData.paymentDetails, method: value }
              })}
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="Bank Transfer" id="bank-transfer" />
                <Label htmlFor="bank-transfer" className="flex-1 cursor-pointer">
                  <p className="font-medium">Bank Transfer</p>
                  <p className="text-sm text-gray-600">Direct bank transfer</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="USSD" id="ussd" />
                <Label htmlFor="ussd" className="flex-1 cursor-pointer">
                  <p className="font-medium">182# USSD Payment</p>
                  <p className="text-sm text-gray-600">Mobile money payment</p>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Consultation Method</h3>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-medium">Payment Confirmed!</p>
              <p className="text-sm text-green-700">You will receive a confirmation SMS with consultation details.</p>
            </div>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <p className="font-medium">Secure Video Call</p>
                <p className="text-sm text-gray-600">High-quality video consultation (recommended)</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-medium">Phone Call</p>
                <p className="text-sm text-gray-600">Audio-only consultation for low connectivity</p>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Follow-Up Care</h3>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">What to Expect:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Digital prescription (if needed)</li>
                  <li>• Referral to specialists (if needed)</li>
                  <li>• Follow-up appointment scheduling</li>
                  <li>• Medical records updated</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Medical History Access</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Your Medical Records Will Include:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Doctor's Name</li>
                <li>• Date of Consultation</li>
                <li>• Diagnosis or Illness</li>
                <li>• Medications Prescribed</li>
                <li>• Doctor's Notes & Recommendations</li>
                <li>• Hospital or Clinic Name</li>
              </ul>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Access your complete medical history anytime in the "My Medical Records" section.
              </p>
              <Button onClick={handleSubmit} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                {loading ? "Booking..." : "Complete Booking"}
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.hospital !== ''
      case 2: return formData.consultationType !== ''
      case 3: return true // Insurance is optional
      case 4: return formData.patientDetails.fullName && formData.patientDetails.age && formData.patientDetails.sex && formData.patientDetails.phoneNumber
      case 5: return formData.paymentDetails.method !== ''
      default: return true
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <span>Book Teleconsultation</span>
          </CardTitle>
          <CardDescription>
            Step {currentStep} of 8: Complete your teleconsultation booking
          </CardDescription>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            ></div>
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStepContent()}
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            {currentStep < 8 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
