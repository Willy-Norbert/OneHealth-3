import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function AiAssistantTestimonials() {
  const testimonials = [
    {
      quote: "The AI Health Assistant helped me understand my symptoms and guided me to the right specialist. It saved me time and unnecessary worry.",
      name: "Marie Uwamahoro",
      title: "Teacher, Kigali",
      avatar: "/placeholder.svg?height=80&width=80"
    },
    {
      quote: "As someone living in a rural area, having 24/7 access to health guidance through the AI Assistant has been life-changing for my family.",
      name: "Jean Claude Mutabazi",
      title: "Farmer, Eastern Province",
      avatar: "/placeholder.svg?height=80&width=80"
    },
    {
      quote: "I use the AI Assistant to track my diabetes and get personalized advice. It's like having a health coach in my pocket at all times.",
      name: "Diane Mukasine",
      title: "Business Owner, Musanze",
      avatar: "/placeholder.svg?height=80&width=80"
    },
    {
      quote: "The medication reminders and health tips from the AI Assistant have helped me manage my hypertension much better than before.",
      name: "Emmanuel Hakizimana",
      title: "Retired Teacher, Huye",
      avatar: "/placeholder.svg?height=80&width=80"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our AI Health Assistant is making a difference in the lives of Rwandans across the country.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2 border-gray-100">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <svg
                      width="45"
                      height="36"
                      viewBox="0 0 45 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-teal-200"
                    >
                      <path
                        d="M13.4 36C9.4 36 6.2 34.6 3.8 31.8C1.4 28.8 0.2 25.2 0.2 21C0.2 17.6 1 14.4 2.6 11.4C4.2 8.4 6.4 5.8 9.2 3.6C12 1.2 15.2 0 18.8 0L21.4 6.8C18.2 7.6 15.6 9 13.6 11C11.6 13 10.6 15.2 10.6 17.6C10.6 18.8 11 19.8 11.8 20.6C12.6 21.4 13.6 21.8 14.8 21.8C17.2 21.8 19 22.8 20.2 24.8C21.4 26.8 22 29 22 31.4C22 33 21.4 34.4 20.2 35.4C19 35.8 16.8 36 13.4 36ZM35.4 36C31.4 36 28.2 34.6 25.8 31.8C23.4 28.8 22.2 25.2 22.2 21C22.2 17.6 23 14.4 24.6 11.4C26.2 8.4 28.4 5.8 31.2 3.6C34 1.2 37.2 0 40.8 0L43.4 6.8C40.2 7.6 37.6 9 35.6 11C33.6 13 32.6 15.2 32.6 17.6C32.6 18.8 33 19.8 33.8 20.6C34.6 21.4 35.6 21.8 36.8 21.8C39.2 21.8 41 22.8 42.2 24.8C43.4 26.8 44 29 44 31.4C44 33 43.4 34.4 42.2 35.4C41 35.8 38.8 36 35.4 36Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-6 flex-grow">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-500 text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-teal-50 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <h4 className="text-3xl font-bold text-teal-600 mb-2">50K+</h4>
                  <p className="text-gray-600">Monthly Users</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-teal-600 mb-2">92%</h4>
                  <p className="text-gray-600">User Satisfaction</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-teal-600 mb-2">30%</h4>
                  <p className="text-gray-600">Reduced Wait Times</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-teal-600 mb-2">24/7</h4>
                  <p className="text-gray-600">Availability</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-teal-600"
                    >
                      <path d="M12 2v8" />
                      <path d="m4.93 10.93 1.41 1.41" />
                      <path d="M2 18h2" />
                      <path d="M20 18h2" />
                      <path d="m19.07 10.93-1.41 1.41" />
                      <path d="M22 22H2" />
                      <path d="M16 6h-4a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4h-4" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">Join Our Community</h4>
                </div>
                <p className="text-gray-700 mb-4">
                  Experience the benefits of our AI Health Assistant and join thousands of Rwandans improving their health.
                </p>
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
                  Try AI Assistant Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
