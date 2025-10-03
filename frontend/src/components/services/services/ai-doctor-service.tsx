"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check, Brain, Activity, Clipboard, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

export default function AiDoctorService() {
  const { t } = useLanguage()

  const features = [
    t("aiDoctor.features.personalizedMonitoring"),
    t("aiDoctor.features.aiSymptomAssessment"),
    t("aiDoctor.features.wellnessRecommendations"),
    t("aiDoctor.features.medicationReminders"),
    t("aiDoctor.features.healthDataAnalysis"),
    t("aiDoctor.features.integrationWithServices"),
  ]

  const capabilities = [
    t("aiDoctor.capabilities.generalInquiries"),
    t("aiDoctor.capabilities.chronicManagement"),
    t("aiDoctor.capabilities.nutritionAdvice"),
    t("aiDoctor.capabilities.mentalHealthSupport"),
    t("aiDoctor.capabilities.sleepImprovement"),
    t("aiDoctor.capabilities.physicalActivity"),
  ]

  return (
    <section id="ai-doctor" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center px-4 py-2 bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-100 rounded-full mb-6">
              <Brain className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{t("aiDoctor.label")}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t("aiDoctor.title")}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{t("aiDoctor.description")}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-teal-100 dark:bg-teal-700 p-1 rounded-full mr-3 mt-1">
                    <Check className="h-4 w-4 text-teal-600 dark:text-teal-300" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">{t("aiDoctor.capabilitiesTitle")}</h3>
              <div className="grid grid-cols-2 gap-4">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-teal-600 dark:bg-teal-400 rounded-full mr-2"></div>
                    <span className="text-gray-700 dark:text-gray-200">{capability}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-600">
                <Link href="/services/ai-assistant#demo">
                  {t("aiDoctor.tryAssistant")} <Brain className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-gray-700">
                <Link href="/services/ai-assistant">{t("aiDoctor.learnMore")}</Link>
              </Button>
            </div>
          </div>

          {/* Right Side */}
          <div className="order-1 lg:order-2 relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-teal-100 dark:bg-teal-800 rounded-full z-0"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 dark:bg-blue-800 rounded-full z-0"></div>

            <div className="relative z-10">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <Image
                    src="/placeholder.svg?height=600&width=800&text=AI+Health+Assistant"
                    alt={t("aiDoctor.imageAlt")}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Overlays */}
                <div className="absolute top-4 left-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg flex items-center space-x-3">
                  <div className="bg-teal-100 dark:bg-teal-700 p-2 rounded-lg">
                    <Activity className="h-6 w-6 text-teal-600 dark:text-teal-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("aiDoctor.overlay.healthMonitoringTitle")}</h4>
                    <p className="text-gray-500 dark:text-gray-300 text-xs">{t("aiDoctor.overlay.healthMonitoringDesc")}</p>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-700 p-2 rounded-lg">
                    <Clipboard className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("aiDoctor.overlay.personalizedPlansTitle")}</h4>
                    <p className="text-gray-500 dark:text-gray-300 text-xs">{t("aiDoctor.overlay.personalizedPlansDesc")}</p>
                  </div>
                </div>

                <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg flex items-center space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-700 p-2 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("aiDoctor.overlay.assistanceTitle")}</h4>
                    <p className="text-gray-500 dark:text-gray-300 text-xs">{t("aiDoctor.overlay.assistanceDesc")}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
