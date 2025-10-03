"use client";
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Video, Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext" // or wherever your translation hook is

export default function TeleconsultationHero() {
  const { t } = useLanguage()

  return (
    <section className="relative pt-20 pb-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-bl-full opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-green-50 rounded-tr-full opacity-70"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full mb-4">
              <Video className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{t("teleconsultation3.serviceTag")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {t("teleconsultation3.title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-xl">
              {t("teleconsultation3.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                {t("teleconsultation3.startConsultation")} <Video className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                {t("teleconsultation3.bookAppointment")} <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-100 rounded-full z-0"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-100 rounded-full z-0"></div>

            <div className="relative z-10">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <Image
                    src="/placeholder.svg?height=600&width=800&text=Teleconsultation"
                    alt={t("teleconsultation3.serviceTag")}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Stats overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-white text-2xl font-bold">500+</p>
                      <p className="text-white/80 text-sm">{t("teleconsultation3.stats.doctors")}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white text-2xl font-bold">24/7</p>
                      <p className="text-white/80 text-sm">{t("teleconsultation3.stats.availability")}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white text-2xl font-bold">15 min</p>
                      <p className="text-white/80 text-sm">{t("teleconsultation3.stats.avgWaitTime")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
              {t("teleconsultation3.securePrivate")}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
