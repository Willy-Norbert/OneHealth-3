import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Video, MapPin } from "lucide-react"

export default function AppointmentsHero() {
  return (
    <section className="relative pt-20 pb-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-50 rounded-bl-full opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 rounded-tr-full opacity-70"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Easy Scheduling</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Book Your <span className="text-green-600">Medical</span> Appointment
            </h1>
            <p className="text-xl text-gray-600 max-w-xl">
              Schedule appointments with top healthcare providers in Rwanda, either virtually or in-person, at your
              convenience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-green-600 hover:bg-green-700">Book Now</Button>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                View My Appointments
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/placeholder.svg?height=600&width=800&text=Medical+Appointment"
                  alt="Medical Appointment"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-green-900/30"></div>
              </div>
            </div>

            {/* Floating feature cards */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Quick Booking</h4>
                <p className="text-gray-500 text-xs">Under 2 minutes</p>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Virtual Options</h4>
                <p className="text-gray-500 text-xs">Teleconsultations available</p>
              </div>
            </div>

            <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Multiple Locations</h4>
                <p className="text-gray-500 text-xs">Across Rwanda</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
