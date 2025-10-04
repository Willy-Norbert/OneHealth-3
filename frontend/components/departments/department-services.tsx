"use client"

import { Check } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function DepartmentServices() {
  const { t } = useLanguage()

  const departmentServices = [
    {
      category: t("departments2.diagnostic.title"),
      services: [
        t("departments2.diagnostic.services.imaging"),
        t("departments2.diagnostic.services.laboratory"),
        t("departments2.diagnostic.services.ecg"),
        t("departments2.diagnostic.services.ultrasound"),
        t("departments2.diagnostic.services.endoscopy"),
        t("departments2.diagnostic.services.biopsy"),
      ],
      color: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
      checkColor: "text-blue-600",
    },
    {
      category: t("departments2.treatment.title"),
      services: [
        t("departments2.treatment.services.medication"),
        t("departments2.treatment.services.surgery"),
        t("departments2.treatment.services.physicalTherapy"),
        t("departments2.treatment.services.radiation"),
        t("departments2.treatment.services.chemotherapy"),
        t("departments2.treatment.services.rehab"),
      ],
      color: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-700",
      checkColor: "text-green-600",
    },
    {
      category: t("departments2.preventive.title"),
      services: [
        t("departments2.preventive.services.screenings"),
        t("departments2.preventive.services.vaccinations"),
        t("departments2.preventive.services.checkups"),
        t("departments2.preventive.services.nutrition"),
        t("departments2.preventive.services.lifestyle"),
        t("departments2.preventive.services.education"),
      ],
      color: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-700",
      checkColor: "text-purple-600",
    },
    {
      category: t("departments2.specialized.title"),
      services: [
        t("departments2.specialized.services.chronic"),
        t("departments2.specialized.services.maternal"),
        t("departments2.specialized.services.geriatric"),
        t("departments2.specialized.services.mental"),
        t("departments2.specialized.services.pain"),
        t("departments2.specialized.services.emergency"),
      ],
      color: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-700",
      checkColor: "text-amber-600",
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t("departments2.title")}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t("departments2.description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {departmentServices.map((category, index) => (
            <div
              key={index}
              className={`${category.color} rounded-xl p-6 border ${category.borderColor} transition-all duration-300 hover:shadow-md`}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{category.category}</h3>
              <ul className="space-y-3">
                {category.services.map((service, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="bg-white dark:bg-gray-800 p-1 rounded-full mr-3 mt-1">
                      <Check className={`h-4 w-4 ${category.checkColor}`} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
