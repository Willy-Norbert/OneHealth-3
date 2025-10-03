"use client";
import Image from "next/image"
import { Star } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function AppointmentsTestimonials() {
  const { t } = useLanguage()

  const testimonials = [
    {
      name: "Jean Mutesi",
      location: "Kigali",
      image: "/placeholder.svg?height=100&width=100&text=JM",
      rating: 5,
      text: t("appointments_testimonials.jean.text"),
    },
    {
      name: "Emmanuel Hakizimana",
      location: "Butare",
      image: "/placeholder.svg?height=100&width=100&text=EH",
      rating: 5,
      text: t("appointments_testimonials.emmanuel.text"),
    },
    {
      name: "Marie Claire Uwamahoro",
      location: "Musanze",
      image: "/placeholder.svg?height=100&width=100&text=MCU",
      rating: 4,
      text: t("appointments_testimonials.marie.text"),
    },
  ]

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("appointments_testimonials.title")}{" "}
            <span className="text-green-600">{t("appointments_testimonials.highlight")}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("appointments_testimonials.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.location}</p>
                  <div className="flex mt-1">{renderStars(testimonial.rating)}</div>
                </div>
              </div>
              <p className="text-gray-700 italic">&quot;{testimonial.text}&quot;</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-green-50 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-8 md:w-1/3">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto md:mx-0 mb-4">
                <Star className="h-10 w-10 text-green-600 fill-green-600" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl font-bold text-gray-900">4.9/5</p>
                <p className="text-gray-600">{t("appointments_testimonials.average_rating")}</p>
              </div>
            </div>
            <div className="md:w-2/3">
              {["5", "4", "3", "2", "1"].map((star, i) => (
                <div className="flex items-center mb-2" key={star}>
                  <p className="w-24 text-sm text-gray-600">{star} {t("appointments_testimonials.stars")}</p>
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="bg-green-600 h-full rounded-full"
                      style={{
                        width:
                          star === "5"
                            ? "85%"
                            : star === "4"
                            ? "12%"
                            : star === "3"
                            ? "3%"
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <p className="w-12 text-right text-sm text-gray-600">
                    {star === "5" ? "85%" : star === "4" ? "12%" : star === "3" ? "3%" : "0%"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
