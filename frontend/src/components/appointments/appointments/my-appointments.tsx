"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Video, Phone, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Appointment {
  _id: string
  hospital: {
    name: string
    location: string
  }
  department: string
  appointmentType: string
  appointmentDate: string
  appointmentTime: string
  reasonForVisit: string
  status: string
  consultationFee: number
  paymentStatus: string
  meetingLink?: string
  createdAt: string
}

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments/my-appointments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      
      if (data.status === 'success') {
        setAppointments(data.data.appointments)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      
      if (data.status === 'success') {
        toast({
          title: "Appointment Cancelled",
          description: "Your appointment has been cancelled successfully."
        })
        fetchAppointments() // Refresh the list
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel appointment",

        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'no-show': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Loading appointments...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
        <p className="text-gray-600">Manage your upcoming and past appointments</p>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-4">You haven't booked any appointments yet.</p>
            <Button onClick={() => window.location.href = '/appointments/book'}>
              Book Your First Appointment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <Card key={appointment._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{appointment.hospital.name}</CardTitle>
                    <p className="text-gray-600">{appointment.department}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                    <Badge className={getPaymentStatusColor(appointment.paymentStatus)}>
                      Payment: {appointment.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{appointment.appointmentTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {appointment.appointmentType === 'virtual' ? (
                        <Video className="h-4 w-4 text-gray-500" />
                      ) : (
                        <MapPin className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="text-sm">
                        {appointment.appointmentType === 'virtual' ? 'Virtual Consultation' : 'In-Person Visit'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Reason for Visit</p>
                      <p className="text-sm text-gray-600">{appointment.reasonForVisit}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Consultation Fee</p>
                      <p className="text-sm text-gray-600">{appointment.consultationFee.toLocaleString()} RWF</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {appointment.meetingLink && appointment.status === 'confirmed' && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Meeting Link</p>
                        <Button size="sm" onClick={() => window.open(appointment.meetingLink, '_blank')}>
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                        </Button>
                      </div>
                    )}
                    
                    {appointment.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelAppointment(appointment._id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Cancel Appointment
                      </Button>
                    )}

                    {appointment.paymentStatus === 'pending' && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800 mb-1">Payment Required</p>
                        <p className="text-xs text-yellow-700">
                          Please complete your payment to confirm the appointment.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Booked on {new Date(appointment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}