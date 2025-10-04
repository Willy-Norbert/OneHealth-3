"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Video, MapPin, FileText, Check, User, Phone, Mail } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Hospital {
  _id: string
  name: string
  location: string
  specialties: string[]
  isActive: boolean
}

export default function AppointmentBooking() {
  const [step, setStep] = useState(1)
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    hospital: "",
    department: "",
    appointmentType: "virtual",
    appointmentDate: "",
    appointmentTime: "",
    reasonForVisit: "",
    previousVisit: false,
    insuranceInfo: {
      provider: "",
      policyNumber: ""
    },
    patientDetails: {
      fullName: "",
      email: "",
      phoneNumber: "",
      age: "",
      gender: "",
      address: "",
      emergencyContact: {
        name: "",
        phone: "",
        relationship: ""
      }
    }
  })

  const departments = [
    "General Medicine",
    "Cardiology", 
    "Pediatrics",
    "Gynecology",
    "Orthopedics",
    "Dermatology",
    "Neurology",
    "Psychiatry",
    "Emergency",
    "Surgery",
    "Oncology",
    "Ophthalmology",
    "ENT",
    "Urology",
    "Endocrinology"
  ]

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM"
  ]

  // Fetch hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch('/api/teleconsultation/hospitals')
        const data = await response.json()
        if (data.status === 'success') {
          setHospitals(data.data.hospitals)
        }
      } catch (error) {
        console.error('Error fetching hospitals:', error)
      }
    }
    fetchHospitals()
  }, [])

  // Fetch available time slots when date/hospital/department changes
  useEffect(() => {
    if (formData.appointmentDate && formData.hospital && formData.department) {
      fetchAvailableSlots()
    }
  }, [formData.appointmentDate, formData.hospital, formData.department])

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(
        `/api/appointments/available-slots?date=${formData.appointmentDate}&hospital=${formData.hospital}&department=${formData.department}`
      )
      const data = await response.json()
      if (data.status === 'success') {
        setAvailableSlots(data.data.availableSlots)
      }
    } catch (error) {
      console.error('Error fetching available slots:', error)
      setAvailableSlots(timeSlots)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.status === 'success') {
        toast({
          title: "Appointment Booked Successfully!",
          description: "You will receive a confirmation email shortly.",
        })
        setStep(6) // Success step
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Please try again.",

        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.hospital && formData.department
      case 2:
        return formData.appointmentDate && formData.appointmentTime
      case 3:
        return formData.reasonForVisit
      case 4:
        return formData.patientDetails.fullName && 
               formData.patientDetails.email && 
               formData.patientDetails.phoneNumber &&
               formData.patientDetails.age &&
               formData.patientDetails.gender
      case 5:
        return true // Payment step - always valid for now
      default:
        return false
    }
  }

  const nextStep = () => {
    if (isStepValid(step)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4, 5].map((number) => (
            <div
              key={number}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= number ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > number ? <Check className="w-5 h-5" /> : number}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Select Hospital & Department */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Hospital & Department</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Hospital/Clinic</label>
              <Select value={formData.hospital} onValueChange={(value) => setFormData({...formData, hospital: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a hospital or clinic" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map((hospital) => (
                    <SelectItem key={hospital._id} value={hospital._id}>
                      {hospital.name} - {hospital.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Appointment Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`flex items-center p-4 rounded-lg border-2 ${
                    formData.appointmentType === "virtual"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setFormData({...formData, appointmentType: "virtual"})}
                >
                  <Video className="h-5 w-5 mr-2" />
                  Virtual Consultation
                </button>
                <button
                  type="button"
                  className={`flex items-center p-4 rounded-lg border-2 ${
                    formData.appointmentType === "in-person"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setFormData({...formData, appointmentType: "in-person"})}
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  In-Person Visit
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Date & Time */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <Select value={formData.appointmentTime} onValueChange={(value) => setFormData({...formData, appointmentTime: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Appointment Details */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Reason for Visit</label>
              <Textarea
                placeholder="Please describe your symptoms or reason for the appointment"
                value={formData.reasonForVisit}
                onChange={(e) => setFormData({...formData, reasonForVisit: e.target.value})}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Have you visited this doctor before?</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="previousVisit"
                    checked={formData.previousVisit === true}
                    onChange={() => setFormData({...formData, previousVisit: true})}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="previousVisit"
                    checked={formData.previousVisit === false}
                    onChange={() => setFormData({...formData, previousVisit: false})}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Insurance Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Insurance Provider</label>
                  <Input
                    placeholder="e.g., RSSB, MMI, Radiant"
                    value={formData.insuranceInfo.provider}
                    onChange={(e) => setFormData({
                      ...formData,
                      insuranceInfo: {...formData.insuranceInfo, provider: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Policy/Member Number</label>
                  <Input
                    placeholder="Your policy number"
                    value={formData.insuranceInfo.policyNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      insuranceInfo: {...formData.insuranceInfo, policyNumber: e.target.value}
                    })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Patient Details */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <Input
                  placeholder="Your full name"
                  value={formData.patientDetails.fullName}
                  onChange={(e) => setFormData({
                    ...formData,
                    patientDetails: {...formData.patientDetails, fullName: e.target.value}
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.patientDetails.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    patientDetails: {...formData.patientDetails, email: e.target.value}
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <Input
                  placeholder="+250 xxx xxx xxx"
                  value={formData.patientDetails.phoneNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    patientDetails: {...formData.patientDetails, phoneNumber: e.target.value}
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Age *</label>
                <Input
                  type="number"
                  placeholder="25"
                  value={formData.patientDetails.age}
                  onChange={(e) => setFormData({
                    ...formData,
                    patientDetails: {...formData.patientDetails, age: e.target.value}
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender *</label>
                <Select 
                  value={formData.patientDetails.gender} 
                  onValueChange={(value) => setFormData({
                    ...formData,
                    patientDetails: {...formData.patientDetails, gender: value}
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <Input
                  placeholder="Your address"
                  value={formData.patientDetails.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    patientDetails: {...formData.patientDetails, address: e.target.value}
                  })}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    placeholder="Contact name"
                    value={formData.patientDetails.emergencyContact.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      patientDetails: {
                        ...formData.patientDetails,
                        emergencyContact: {...formData.patientDetails.emergencyContact, name: e.target.value}
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    placeholder="Contact phone"
                    value={formData.patientDetails.emergencyContact.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      patientDetails: {
                        ...formData.patientDetails,
                        emergencyContact: {...formData.patientDetails.emergencyContact, phone: e.target.value}
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Relationship</label>
                  <Input
                    placeholder="e.g., Spouse, Parent"
                    value={formData.patientDetails.emergencyContact.relationship}
                    onChange={(e) => setFormData({
                      ...formData,
                      patientDetails: {
                        ...formData.patientDetails,
                        emergencyContact: {...formData.patientDetails.emergencyContact, relationship: e.target.value}
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Confirmation & Payment */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Your Appointment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Appointment Summary</h3>
              <div className="space-y-2">
                <p><strong>Hospital:</strong> {hospitals.find(h => h._id === formData.hospital)?.name}</p>
                <p><strong>Department:</strong> {formData.department}</p>
                <p><strong>Type:</strong> {formData.appointmentType === 'virtual' ? 'Virtual Consultation' : 'In-Person Visit'}</p>
                <p><strong>Date:</strong> {new Date(formData.appointmentDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {formData.appointmentTime}</p>
                <p><strong>Patient:</strong> {formData.patientDetails.fullName}</p>
                <p><strong>Consultation Fee:</strong> {formData.appointmentType === 'virtual' ? '25,000 RWF' : '30,000 RWF'}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>You'll receive a confirmation email with appointment details</li>
                <li>Payment instructions will be sent via SMS</li>
                <li>A reminder will be sent 24 hours before your appointment</li>
                {formData.appointmentType === 'virtual' && (
                  <li>Meeting link will be shared 30 minutes before the consultation</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 6: Success */}
      {step === 6 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-green-600">Appointment Booked Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg">Your appointment has been confirmed and you will receive an email shortly.</p>
            <Button onClick={() => window.location.href = '/appointments/my-appointments'}>
              View My Appointments
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      {step < 6 && (
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            Previous
          </Button>
          {step === 5 ? (
            <Button
              onClick={handleSubmit}
              disabled={loading || !isStepValid(step)}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Booking...' : 'Confirm Appointment'}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!isStepValid(step)}
              className="bg-green-600 hover:bg-green-700"
            >
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  )
}