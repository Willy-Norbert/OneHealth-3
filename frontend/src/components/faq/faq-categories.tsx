import Link from "next/link"
import { Calendar, Video, Pill, CreditCard, UserCog, Ambulance, Bot, ShieldCheck } from "lucide-react"

const categories = [
  {
    title: "Appointments",
    icon: Calendar,
    href: "#appointments",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Teleconsultation",
    icon: Video,
    href: "#teleconsultation",
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Medication",
    icon: Pill,
    href: "#medication",
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "Payments",
    icon: CreditCard,
    href: "#payments",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Account",
    icon: UserCog,
    href: "#account",
    color: "bg-pink-100 text-pink-700",
  },
  {
    title: "Emergency",
    icon: Ambulance,
    href: "#emergency",
    color: "bg-red-100 text-red-700",
  },
  {
    title: "AI Doctor",
    icon: Bot,
    href: "#ai-doctor",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "Privacy",
    icon: ShieldCheck,
    href: "#privacy",
    color: "bg-gray-100 text-gray-700",
  },
]

export default function FaqCategories() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`p-3 rounded-full ${category.color} mb-4`}>
                <category.icon className="h-6 w-6" />
              </div>
              <span className="font-medium text-gray-900">{category.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
