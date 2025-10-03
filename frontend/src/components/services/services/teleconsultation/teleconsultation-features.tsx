"use client";
import { Video, MessageSquare, FileText, Clock, Shield, SmartphoneIcon as DeviceMobile } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext" // or your translation hook

export default function TeleconsultationFeatures() {
  const { t } = useLanguage()

  const features = [
    {
      icon: <Video className="h-10 w-10 text-blue-600" />,
      title: t("teleconsultationFeatures.features.video.title"),
      description: t("teleconsultationFeatures.features.video.description"),
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-blue-600" />,
      title: t("teleconsultationFeatures.features.messaging.title"),
      description: t("teleconsultationFeatures.features.messaging.description"),
    },
    {
      icon: <FileText className="h-10 w-10 text-blue-600" />,
      title: t("teleconsultationFeatures.features.prescriptions.title"),
      description: t("teleconsultationFeatures.features.prescriptions.description"),
    },
    {
      icon: <Clock className="h-10 w-10 text-blue-600" />,
      title: t("teleconsultationFeatures.features.quickAccess.title"),
      description: t("teleconsultationFeatures.features.quickAccess.description"),
    },
    {
      icon: <Shield className="h-10 w-10 text-blue-600" />,
      title: t("teleconsultationFeatures.features.privacy.title"),
      description: t("teleconsultationFeatures.features.privacy.description"),
    },
    {
      icon: <DeviceMobile className="h-10 w-10 text-blue-600" />,
      title: t("teleconsultationFeatures.features.multiDevice.title"),
      description: t("teleconsultationFeatures.features.multiDevice.description"),
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("teleconsultationFeatures.heading")}
          </h2>
          <p className="text-gray-600">
            {t("teleconsultationFeatures.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
