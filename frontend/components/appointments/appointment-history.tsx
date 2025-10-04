"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Video, MapPin, MoreHorizontal, FileText, X, Check } from "lucide-react"

export default function AppointmentHistory() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Jean Mugabo",
      specialty: "Cardiology",
      date: "May 15, 2025",
      time: "10:00 AM",
      type: "virtual"  as const,
      status: "confirmed" as const,
    },
    {
      id: 2,
      doctor: "Dr. Marie Uwase",
      specialty: "Pediatrics",
      date: "May 20, 2025",
      time: "02:30 PM",
      type: "in-person" as const,
      location: "Rwanda Children's Hospital",
      status: "confirmed" as const,
    },
  ]

  const pastAppointments = [
    {
      id: 3,
      doctor: "Dr. Eric Ndayishimiye",
      specialty: "Neurology",
      date: "April 28, 2025",
      time: "09:30 AM",
      type: "virtual" as const,
      status: "completed" as const,
    },
    {
      id: 4,
      doctor: "Dr. Claire Mutesi",
      specialty: "Dermatology",
      date: "April 10, 2025",
      time: "11:00 AM",
      type: "in-person" as const,
      location: "CHUK",
      status: "completed" as const,
    },
    {
      id: 5,
      doctor: "Dr. Patrick Habimana",
      specialty: "General Medicine",
      date: "March 22, 2025",
      time: "03:00 PM",
      type: "virtual" as const,
      status: "cancelled" as const,
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Appointments</h2>
          <p className="text-gray-600">View and manage your upcoming and past appointments</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`py-3 px-6 font-medium text-sm focus:outline-none ${
                activeTab === "upcoming"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Appointments
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm focus:outline-none ${
                activeTab === "past"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("past")}
            >
              Past Appointments
            </button>
          </div>

          {/* Appointment Cards */}
          <div className="space-y-6">
            {activeTab === "upcoming" ? (
              upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} isPast={false} />
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">You don&apos;t have any upcoming appointments.</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">Book an Appointment</Button>
                </div>
              )
            ) : pastAppointments.length > 0 ? (
              pastAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} isPast={true} />
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">You don&apos;t have any past appointments.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

interface Appointment {
  id: number
  doctor: string
  specialty: string
  date: string
  time: string
  type: "virtual" | "in-person"
  location?: string
  status: "confirmed" | "pending" | "cancelled" | "completed"
}

function AppointmentCard({ appointment, isPast }: { appointment: Appointment; isPast: boolean }) {
  const [showActions, setShowActions] = useState(false)

  const getStatusBadge = (status: "confirmed" | "pending" | "cancelled" | "completed") => {
    switch (status) {
      case "confirmed":
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">Confirmed</span>
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">Pending</span>
      case "cancelled":
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">Cancelled</span>
      case "completed":
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Completed</span>
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <h3 className="text-lg font-bold text-gray-900">{appointment.doctor}</h3>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-green-600">{appointment.specialty}</span>
            </div>
            <div className="flex flex-wrap items-center mt-2 gap-y-2">
              <div className="flex items-center mr-4">
                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">{appointment.date}</span>
              </div>
              <div className="flex items-center mr-4">
                <Clock className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">{appointment.time}</span>
              </div>
              <div className="flex items-center">
                {appointment.type === "virtual" ? (
                  <>
                    <Video className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-sm text-gray-600">Virtual Consultation</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 text-purple-600 mr-1" />
                    <span className="text-sm text-gray-600">{appointment.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            {getStatusBadge(appointment.status)}
            <div className="relative ml-4">
              <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setShowActions(!showActions)}>
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </button>
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100">
                  <div className="py-1">
                    {!isPast && appointment.status !== "cancelled" && (
                      <>
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                          <Calendar className="h-4 w-4 mr-2" /> Reschedule
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                          <X className="h-4 w-4 mr-2" /> Cancel
                        </button>
                      </>
                    )}
                    {appointment.type === "virtual" && appointment.status === "confirmed" && !isPast && (
                      <button className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left">
                        <Video className="h-4 w-4 mr-2" /> Join Video Call
                      </button>
                    )}
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <FileText className="h-4 w-4 mr-2" /> View Details
                    </button>
                    {isPast && appointment.status === "completed" && (
                      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        <Check className="h-4 w-4 mr-2" /> Book Follow-up
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
