"use client";
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext" // or your i18n hook

export default function TeleconsultationHowItWorks() {
  const { t } = useLanguage()

  const steps = t("teleconsultationHowItWorks.steps")

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("teleconsultationHowItWorks.heading")}
          </h2>
          <p className="text-gray-600">
            {t("teleconsultationHowItWorks.description")}
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step: any, index: number) => (
              <div key={index} className="relative">
                {/* Arrow for connection on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 right-0 transform translate-x-1/2 z-10">
                    <ArrowRight className="text-gray-300 h-6 w-6" />
                  </div>
                )}

                <div className="bg-white rounded-xl p-6 shadow-md relative z-10 h-full border border-gray-100">
                  <div
                    className={`${
                      ["bg-blue-600", "bg-green-600", "bg-purple-600", "bg-blue-600", "bg-green-600"][index]
                    } text-white text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center mb-6`}
                  >
                    {`0${index + 1}`}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 max-w-4xl mx-auto bg-blue-50 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t("teleconsultationHowItWorks.demoHeading")}
              </h3>
              <p className="text-gray-600 mb-6">
                {t("teleconsultationHowItWorks.demoDescription")}
              </p>
              <div className="inline-flex items-center text-blue-600 font-medium cursor-pointer hover:text-blue-700">
                {t("teleconsultationHowItWorks.watchDemo")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
            <div className="relative aspect-video lg:aspect-auto">
              <Image
                src="/placeholder.svg?height=400&width=600&text=Video+Demonstration"
                alt={t("teleconsultationHowItWorks.videoAlt")}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-4 shadow-lg cursor-pointer hover:bg-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
