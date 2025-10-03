"use client";
import { MapPin, Phone, Mail, Clock, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { JSX } from "react"

export default function ContactInfo() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t("contactInfo.heading")}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t("contactInfo.description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ContactCard
            icon={<MapPin className="h-6 w-6 text-white" />}
            title={t("contactInfo.cards.location.title")}
            details={t("contactInfo.cards.location.details")}
            color="bg-blue-600"
          />

          <ContactCard
            icon={<Phone className="h-6 w-6 text-white" />}
            title={t("contactInfo.cards.phone.title")}
            details={t("contactInfo.cards.phone.details")}
            color="bg-green-600"
          />

          <ContactCard
            icon={<Mail className="h-6 w-6 text-white" />}
            title={t("contactInfo.cards.email.title")}
            details={t("contactInfo.cards.email.details")}
            color="bg-purple-600"
          />

          <ContactCard
            icon={<Clock className="h-6 w-6 text-white" />}
            title={t("contactInfo.cards.hours.title")}
            details={t("contactInfo.cards.hours.details")}
            color="bg-amber-600"
            footer={t("contactInfo.cards.hours.footer")}
          />
        </div>

        <div className="max-w-3xl mx-auto mt-12 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl p-6">
          <div className="flex items-start">
            <div className="bg-red-100 dark:bg-red-800 p-2 rounded-lg mr-4">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{t("contactInfo.emergency.title")}</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">{t("contactInfo.emergency.desc")}</p>
              <p className="text-red-600 dark:text-red-400 font-bold">{t("contactInfo.emergency.hotline")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactCard({
  icon,
  title,
  details,
  color,
  footer = null,
}: {
  icon: JSX.Element
  title: string
  details: string[]
  color: string
  footer?: string | null
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full">
      <div className={`${color} p-6 flex items-center`}>
        <div className="bg-white/20 dark:bg-white/10 w-12 h-12 rounded-full flex items-center justify-center">{icon}</div>
        <h3 className="text-xl font-bold text-white ml-4">{title}</h3>
      </div>
      <div className="p-6">
        <ul className="space-y-2">
          {details.map((detail, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">
              {detail}
            </li>
          ))}
        </ul>
        {footer && <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">{footer}</p>}
      </div>
    </div>
  )
}
