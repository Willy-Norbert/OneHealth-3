import { Calendar, Video, Clock, Building, User, FileText } from "lucide-react"
import Link from "next/link"

export default function AppointmentTypes() {
  const appointmentTypes = [
    {
      icon: <Video className="h-8 w-8 text-white" />,
      title: "Virtual Consultation",
      description: "Connect with healthcare providers via video call from anywhere",
      color: "bg-blue-600",
      timeframe: "Same day appointments available",
      href: "#appointment-form",
    },
    {
      icon: <Building className="h-8 w-8 text-white" />,
      title: "In-Person Visit",
      description: "Schedule a face-to-face appointment at a healthcare facility",
      color: "bg-green-600",
      timeframe: "Book up to 30 days in advance",
      href: "#appointment-form",
    },
    {
      icon: <Clock className="h-8 w-8 text-white" />,
      title: "Urgent Care",
      description: "Get priority scheduling for urgent but non-emergency issues",
      color: "bg-amber-600",
      timeframe: "Same day priority slots",
      href: "#appointment-form",
    },
    {
      icon: <User className="h-8 w-8 text-white" />,
      title: "Specialist Referral",
      description: "Book with specialists based on referrals from your primary doctor",
      color: "bg-purple-600",
      timeframe: "Expedited specialist access",
      href: "#appointment-form",
    },
    {
      icon: <FileText className="h-8 w-8 text-white" />,
      title: "Follow-up Visit",
      description: "Schedule a follow-up appointment after your initial consultation",
      color: "bg-teal-600",
      timeframe: "Based on doctor recommendation",
      href: "#appointment-form",
    },
    {
      icon: <Calendar className="h-8 w-8 text-white" />,
      title: "Regular Check-up",
      description: "Book routine health check-ups and preventive care appointments",
      color: "bg-indigo-600",
      timeframe: "Flexible scheduling options",
      href: "#appointment-form",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Appointment Types</h2>
          <p className="text-gray-600">
            Choose the type of appointment that best suits your healthcare needs and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {appointmentTypes.map((type, index) => (
            <Link key={index} href={type.href} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl h-full">
                <div className={`${type.color} p-6`}>
                  <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{type.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{type.timeframe}</span>
                  </div>
                  <div className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Select this type{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
