"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function TestimonialsSection() {
  const { t } = useLanguage()

  const testimonials = [
    {
      id: 1,
      name: "Claudine Niyonzima",
      role: t("testimonials.roles.mother", "Mother of two"),
      image: "/t3.png",
      quote: t(
        "testimonials.quotes.1",
        "ONE HEALTHLINE CONNECT has transformed how my family accesses healthcare. The teleconsultation feature saved us hours of travel when my son had a fever. The doctor was able to diagnose and prescribe medication that was delivered to our home within hours."
      ),
      rating: 5,
    },
    {
      id: 2,
      name: "Emmanuel Habimana",
      role: t("testimonials.roles.businessOwner", "Business Owner"),
      image: "/t2.png",
      quote: t(
        "testimonials.quotes.2",
        "As someone with a busy schedule, being able to book appointments and consult with specialists without leaving my office has been invaluable. The platform is intuitive and the doctors are responsive and professional."
      ),
      rating: 5,
    },
    {
      id: 3,
      name: "Diane Mukasine",
      role: t("testimonials.roles.teacher", "Teacher"),
      image: "/t1.png",
      quote: t(
        "testimonials.quotes.3",
        "The AI health assistant has been my daily companion for managing my diabetes. It reminds me to take my medication, suggests healthy meal options, and alerts me when my readings are concerning. It's like having a personal health coach."
      ),
      rating: 4,
    },
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  const prevTestimonial = () => setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("testimonials.title", "What Our Patients Say")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            {t(
              "testimonials.subtitle",
              "Real experiences from people who have transformed their healthcare journey with ONE HEALTHLINE CONNECT"
            )}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            {/* Quote icon */}
            <div className="absolute -top-6 -left-6 bg-green-600 text-white p-4 rounded-full shadow-lg">
              <Quote className="h-6 w-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-green-100 dark:border-green-800">
                  <Image
                    src={testimonials[activeIndex].image || "/placeholder.svg"}
                    alt={testimonials[activeIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mt-4">{testimonials[activeIndex].name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonials[activeIndex].role}</p>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${i < testimonials[activeIndex].rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <blockquote className="text-gray-700 dark:text-gray-300 text-lg italic leading-relaxed">
                  &quot;{testimonials[activeIndex].quote}&quot;
                </blockquote>
              </div>
            </div>

            {/* Navigation controls */}
            <div className="flex justify-center mt-8 gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full border-gray-200 dark:border-gray-600 hover:border-green-600 dark:hover:border-green-400 hover:text-green-600 dark:hover:text-green-400"
                aria-label={t("testimonials.prev", "Previous testimonial")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full ${index === activeIndex ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`}
                    aria-label={t("testimonials.goto", `Go to testimonial ${index + 1}`, { index: index + 1 })}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full border-gray-200 dark:border-gray-600 hover:border-green-600 dark:hover:border-green-400 hover:text-green-600 dark:hover:text-green-400"
                aria-label={t("testimonials.next", "Next testimonial")}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
