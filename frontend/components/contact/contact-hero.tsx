"use client";
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ContactHero() {
  const { t } = useLanguage()

  const headingParts = t("contactHero.heading").split("{highlight}")
  const highlight = t("contactHero.highlight")

  return (
    <section className="relative pt-20 pb-24 overflow-hidden bg-white dark:bg-gray-900">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-50 dark:bg-green-800 rounded-bl-full opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 dark:bg-blue-800 rounded-tr-full opacity-70"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {headingParts[0]}
              <span className="text-green-600 dark:text-green-400">{highlight}</span>
              {headingParts[1]}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl">{t("contactHero.description")}</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center bg-green-50 dark:bg-green-900 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full mr-2"></div>
                <span className="text-green-800 dark:text-green-200 font-medium">{t("contactHero.badge1")}</span>
              </div>
              <div className="flex items-center bg-blue-50 dark:bg-blue-900 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full mr-2"></div>
                <span className="text-blue-800 dark:text-blue-200 font-medium">{t("contactHero.badge2")}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/placeholder.svg?height=600&width=800&text=Contact+Us"
                  alt={t("contactHero.overlayTitle")}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 dark:from-blue-800/50 to-green-900/30 dark:to-green-800/50"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <h2 className="text-2xl font-bold text-white">{t("contactHero.overlayTitle")}</h2>
                <p className="text-white/90">{t("contactHero.overlayDesc")}</p>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
              {t("contactHero.badgeFloating1")}
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">
              {t("contactHero.badgeFloating2")}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
