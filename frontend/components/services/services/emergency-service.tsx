"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check, Phone, Ambulance, HeartPulse, MapPin } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function EmergencyService() {
  const { t } = useLanguage()

  const features = [
    t("emergency.features.24_7_hotline"),
    t("emergency.features.ambulance_dispatch"),
    t("emergency.features.gps_tracking"),
    t("emergency.features.direct_er_connection"),
    t("emergency.features.first_aid_guidance"),
    t("emergency.features.contact_notification"),
  ]

  const emergencyTypes = [
    t("emergency.types.medical"),
    t("emergency.types.accidents"),
    t("emergency.types.cardiac"),
    t("emergency.types.respiratory"),
    t("emergency.types.allergic"),
    t("emergency.types.pregnancy"),
  ]

  return (
    <section id="emergency" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-full mb-6">
              <Phone className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{t("emergency.label")}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t("emergency.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{t("emergency.description")}</p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-red-100 dark:bg-red-700 p-1 rounded-full mr-3 mt-1">
                    <Check className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">{feature}</span>
                </div>
              ))}
            </div>

            {/* Types */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">{t("emergency.types_label")}</h3>
              <div className="grid grid-cols-2 gap-4">
                {emergencyTypes.map((type, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mr-2"></div>
                    <span className="text-gray-700 dark:text-gray-200">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600">
                {t("emergency.cta_assistance")} <Phone className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-red-600 dark:border-red-400 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700">
                {t("emergency.cta_learn_more")}
              </Button>
            </div>
          </div>

          {/* Image Section */}
          <div className="order-1 lg:order-2 relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-red-100 dark:bg-red-800 rounded-full z-0"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 dark:bg-blue-800 rounded-full z-0"></div>

            <div className="relative z-10">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <Image
                    src="/placeholder.svg?height=600&width=800&text=Emergency+Services"
                    alt={t("emergency.image_alt")}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Overlay Cards */}
                <div className="absolute top-4 left-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg flex items-center space-x-3">
                  <div className="bg-red-100 dark:bg-red-700 p-2 rounded-lg">
                    <Ambulance className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("emergency.overlay.ambulance_title")}</h4>
                    <p className="text-gray-500 dark:text-gray-300 text-xs">{t("emergency.overlay.ambulance_sub")}</p>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-700 p-2 rounded-lg">
                    <HeartPulse className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("emergency.overlay.medical_guidance_title")}</h4>
                    <p className="text-gray-500 dark:text-gray-300 text-xs">{t("emergency.overlay.medical_guidance_sub")}</p>
                  </div>
                </div>

                <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg flex items-center space-x-3">
                  <div className="bg-green-100 dark:bg-green-700 p-2 rounded-lg">
                    <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("emergency.overlay.gps_title")}</h4>
                    <p className="text-gray-500 dark:text-gray-300 text-xs">{t("emergency.overlay.gps_sub")}</p>
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
