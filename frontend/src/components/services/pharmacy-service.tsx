"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check, Pill, Truck, Clock, CreditCard } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function PharmacyService() {
  const { t } = useLanguage()

  const features = [
    t("pharmacy.features.order"),
    t("pharmacy.features.upload"),
    t("pharmacy.features.compare"),
    t("pharmacy.features.delivery"),
    t("pharmacy.features.reminders"),
    t("pharmacy.features.refill"),
  ]

  const pharmacies = [
    t("pharmacy.partners.kigali"),
    t("pharmacy.partners.rwanda"),
    t("pharmacy.partners.kimironko"),
    t("pharmacy.partners.nyamirambo"),
    t("pharmacy.partners.remera"),
    t("pharmacy.partners.muhima"),
  ]

  return (
    <section id="pharmacy" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image & Overlay Cards */}
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-100 dark:bg-purple-800 rounded-full z-0"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 dark:bg-blue-800 rounded-full z-0"></div>

            <div className="relative z-10">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <Image
                    src="/placeholder.svg?height=600&width=800&text=Pharmacy+Services"
                    alt={t("pharmacy.imageAlt")}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Feature cards overlay */}
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg flex items-center space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-700 p-2 rounded-lg">
                    <Truck className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("pharmacy.overlay.delivery.title")}</h4>
                    <p className="text-gray-500 dark:text-gray-300 text-xs">{t("pharmacy.overlay.delivery.subtitle")}</p>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-700 p-2 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("pharmacy.overlay.reminders.title")}</h4>
                    <p className="text-gray-500 dark:text-gray-300 text-xs">{t("pharmacy.overlay.reminders.subtitle")}</p>
                  </div>
                </div>

                <div className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg flex items-center space-x-3">
                  <div className="bg-green-100 dark:bg-green-700 p-2 rounded-lg">
                    <CreditCard className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("pharmacy.overlay.payment.title")}</h4>
                    <p className="text-gray-500 dark:text-gray-300 text-xs">{t("pharmacy.overlay.payment.subtitle")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 rounded-full mb-6">
              <Pill className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{t("pharmacy.label")}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t("pharmacy.title")}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{t("pharmacy.description")}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-purple-100 dark:bg-purple-700 p-1 rounded-full mr-3 mt-1">
                    <Check className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">{t("pharmacy.partners.title")}</h3>
              <div className="grid grid-cols-2 gap-4">
                {pharmacies.map((pharmacy, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></div>
                    <span className="text-gray-700 dark:text-gray-200">{pharmacy}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-600">
                {t("pharmacy.buttons.order")} <Pill className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700">
                {t("pharmacy.buttons.view")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
