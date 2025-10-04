"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Video, MapPin, FileText, Check } from "lucide-react"

export default function AppointmentForm() {
  const [appointmentType, setAppointmentType] = useState("virtual")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ]

  return (
    <section id="appointment-form" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Book Your Appointment</h2>
          <p className="text-gray-600">
            Fill out the form below to schedule your appointment with your selected healthcare provider
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Appointment Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  className={`flex items-center p-4 rounded-lg border-2 ${
                    appointmentType === "virtual"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setAppointmentType("virtual")}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      appointmentType === "virtual" ? "border-green-600" : "border-gray-300"
                    }`}
                  >
                    {appointmentType === "virtual" && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="flex items-center">
                    <Video className="h-5 w-5 text-gray-700 mr-2" />
                    <span className="font-medium">Virtual Consultation</span>
                  </div>
                </button>

                <button
                  className={`flex items-center p-4 rounded-lg border-2 ${
                    appointmentType === "in-person"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setAppointmentType("in-person")}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      appointmentType === "in-person" ? "border-green-600" : "border-gray-300"
                    }`}
                  >
                    {appointmentType === "in-person" && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-700 mr-2" />
                    <span className="font-medium">In-Person Visit</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Select Date & Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="date"
                      className="pl-10 bg-gray-50 border-gray-200"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {appointmentType === "in-person" && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Select Location</h3>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Select a hospital or clinic</option>
                    <option value="kuh">Kigali University Hospital</option>
                    <option value="rmh">Rwanda Military Hospital</option>
                    <option value="kfh">King Faisal Hospital</option>
                    <option value="butaro">Butaro Hospital</option>
                    <option value="chuk">CHUK</option>
                  </select>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Appointment Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <Textarea
                      placeholder="Please briefly describe your symptoms or reason for the appointment"
                      className="pl-10 bg-gray-50 border-gray-200 min-h-[100px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Have you visited this doctor before?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="previous-visit"
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="previous-visit"
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        defaultChecked
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Insurance Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label>
                  <Input type="text" className="bg-gray-50 border-gray-200" placeholder="e.g., RSSB, MMI, Radiant" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Policy/Member Number</label>
                  <Input type="text" className="bg-gray-50 border-gray-200" placeholder="Your policy number" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                className="bg-green-600 hover:bg-green-700 px-8"
                onClick={() => window.location.href = '/appointments/book'}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
