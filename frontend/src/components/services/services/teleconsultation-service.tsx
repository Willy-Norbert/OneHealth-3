"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Video } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function TeleconsultationService() {
  const { t } = useLanguage()

  const features = [
    t("features.consultations"),
    t("features.high_quality_video"),
    t("features.secure_messaging"),
    t("features.digital_prescriptions"),
    t("features.medical_records"),
    t("features.followup_scheduling"),
  ]

  const specialties = [
    { name: t("specialties.general_medicine"), availability: "24/7" },
    { name: t("specialties.pediatrics"), availability: "8AM - 8PM" },
    { name: t("specialties.cardiology"), availability: t("availability.by_appointment") },
    { name: t("specialties.dermatology"), availability: t("availability.by_appointment") },
    { name: t("specialties.psychiatry"), availability: "9AM - 5PM" },
    { name: t("specialties.nutrition"), availability: "9AM - 6PM" },
  ]

  const steps = [
    { number: 1, title: t("steps.select_hospital"), desc: t("steps.select_hospital_desc") },
    { number: 2, title: t("steps.choose_type"), desc: t("steps.choose_type_desc") },
    { number: 3, title: t("steps.select_insurance"), desc: t("steps.select_insurance_desc") },
    { number: 4, title: t("steps.register_details"), desc: t("steps.register_details_desc") },
    { number: 5, title: t("steps.pay_fee"), desc: t("steps.pay_fee_desc") },
    { number: 6, title: t("steps.attend_consultation"), desc: t("steps.attend_consultation_desc") },
    { number: 7, title: t("steps.receive_followup"), desc: t("steps.receive_followup_desc") },
    { number: 8, title: t("steps.review_history"), desc: t("steps.review_history_desc") },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full mb-6">
            <Video className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">{t("hero.label")}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Steps */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
            {t("steps.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 dark:bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {step.number}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t("content.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {t("content.desc")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-800 p-1 rounded-full mr-3 mt-1">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">{t("specialties.title")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specialties.map((specialty, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-200">{specialty.name}</span>
                    <span className="text-sm bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full">
                      {specialty.availability}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/teleconsultation/book">
                <Button className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-lg px-8 py-3">
                  {t("buttons.start_consultation")} <Video className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/medical-records">
                <Button variant="outline" className="border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 text-lg px-8 py-3">
                  {t("buttons.view_records")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Partner Hospitals */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">{t("partners.title")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[ 
              "Baho International Hospital",
              "Wiwo Specialized Hospital", 
              "Legacy Clinic",
              "Polyclinic de l'Étoile",
              "DEV Medical Center",
              "+ More Partner Clinics"
            ].map((hospital, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm text-center">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{hospital}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 dark:bg-blue-700 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">{t("cta7.title")}</h2>
          <p className="text-xl mb-8 opacity-90">{t("cta7.subtitle")}</p>
          <Link href="/teleconsultation/book">
            <Button className="bg-white text-blue-600 dark:text-blue-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-lg px-8 py-3">
              {t("cta7.button")} <Video className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
