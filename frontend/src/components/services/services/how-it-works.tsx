"use client";

import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function HowItWorks() {
  const { t } = useLanguage()
  
  const steps = [
    {
      number: "01",
      title: t("howItWorks.step1.title") || "Download the App",
      description: t("howItWorks.step1.description") || "Download the ONE HEALTHLINE CONNECT app from the App Store or Google Play Store.",
      color: "bg-blue-600 dark:bg-blue-500",
    },
    {
      number: "02", 
      title: t("howItWorks.step2.title") || "Create an Account",
      description: t("howItWorks.step2.description") || "Sign up with your phone number or email and complete your health profile.",
      color: "bg-green-600 dark:bg-green-500",
    },
    {
      number: "03",
      title: t("howItWorks.step3.title") || "Choose a Service",
      description: t("howItWorks.step3.description") || "Select the healthcare service you need from our comprehensive offerings.",
      color: "bg-purple-600 dark:bg-purple-500",
    },
    {
      number: "04",
      title: t("howItWorks.step4.title") || "Connect with Providers",
      description: t("howItWorks.step4.description") || "Get connected with healthcare providers, book appointments, or access emergency services.",
      color: "bg-teal-600 dark:bg-teal-500",
    },
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t("howItWorks.title") || "How It Works"}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t("howItWorks.subtitle") || "Getting started with ONE HEALTHLINE CONNECT is easy. Follow these simple steps to access our healthcare services."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 z-0">
                  <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-300 dark:text-gray-400 h-6 w-6" />
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md relative z-10 h-full">
                <div
                  className={`${step.color} text-white text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center mb-6`}
                >
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
