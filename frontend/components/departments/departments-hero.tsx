"use client";
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'

export default function DepartmentsHero() {
  const { t } = useLanguage()

  return (
    <section className="relative pt-20 pb-24 overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-50 dark:bg-green-900 rounded-bl-full opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 dark:bg-blue-900 rounded-tr-full opacity-70"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {t("medicalDepartments.title", "Medical")} <span className="text-green-600 dark:text-green-400">{t("medicalDepartments.highlight", "Departments")}</span> & {t("medicalDepartments.subtitle", "Specialties")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl">
              {t(
                "medicalDepartments.description",
                "Access specialized healthcare services across multiple medical fields from Rwanda's top healthcare professionals."
              )}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 h-5 w-5" />
              <input
                type="text"
                placeholder={t("medicalDepartments.searchPlaceholder", "Search for a department or condition...")}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              {["Cardiology", "Pediatrics", "Orthopedics", "Neurology"].map((dept) => (
                <Button
                  key={dept}
                  variant="outline"
                  className="border-gray-200 dark:border-gray-700 hover:border-green-600 hover:text-green-600"
                >
                  {t(`medicalDepartments.departments.${dept.toLowerCase()}`, dept)}
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/placeholder.svg?height=600&width=800&text=Medical+Departments"
                  alt={t("medicalDepartments.imageAlt", "Medical Departments")}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 dark:from-blue-800/40 to-green-900/30 dark:to-green-800/40"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <h2 className="text-2xl font-bold text-white">{t("medicalDepartments.specializedCareTitle", "Specialized Care")}</h2>
                <p className="text-white/90">{t("medicalDepartments.departmentsCount", "12+ medical departments available")}</p>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg">
              {t("medicalDepartments.badges.expertSpecialists", "Expert Specialists")}
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg">
              {t("medicalDepartments.badges.advancedTreatments", "Advanced Treatments")}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
