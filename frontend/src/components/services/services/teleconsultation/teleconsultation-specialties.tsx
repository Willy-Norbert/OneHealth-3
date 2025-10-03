"use client";
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext" // your translation hook

export default function TeleconsultationSpecialties() {
  const { t } = useLanguage()

  // Map specialties from translation keys to an array for rendering
  const specialties = [
    "generalMedicine",
    "pediatrics",
    "dermatology",
    "psychiatry",
    "cardiology",
    "nutrition"
  ].map((key) => ({
    key,
    name: t(`teleconsultationSpecialties.specialties.${key}.name`),
    description: t(`teleconsultationSpecialties.specialties.${key}.description`),
    availability: t(`teleconsultationSpecialties.specialties.${key}.availability`),
    image: `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(t(`teleconsultationSpecialties.specialties.${key}.name`))}`,
  }))

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("teleconsultationSpecialties.title")}
          </h2>
          <p className="text-gray-600">{t("teleconsultationSpecialties.description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialties.map(({ key, name, description, availability, image }) => (
            <div
              key={key}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-48 relative">
                <Image src={image} alt={name} fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {availability}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{description}</p>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 mt-2">
                  {t("teleconsultationSpecialties.button.findSpecialists")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-blue-600 hover:bg-blue-700">
            {t("teleconsultationSpecialties.button.viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
