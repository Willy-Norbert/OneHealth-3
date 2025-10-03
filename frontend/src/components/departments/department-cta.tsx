"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Phone, ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function DepartmentCta() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 to-green-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("cta1.title")}</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {t("cta1.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-900 hover:bg-white/90 dark:bg-gray-200 dark:text-blue-900 dark:hover:bg-gray-300 h-12 px-6 text-base">
              <Calendar className="mr-2 h-5 w-5" /> {t("cta1.book")}
            </Button>
            <Button
              variant="outline"
              className="border-white text-green-600 hover:bg-white/90 dark:border-gray-300 dark:text-green-400 dark:hover:bg-gray-700 h-12 px-6 text-base"
            >
              <Phone className="mr-2 h-5 w-5" /> {t("cta1.emergency")}
            </Button>
          </div>
          <div className="mt-8 text-white/80 dark:text-gray-300">
            <p>
              {t("cta1.notSure")}{" "}
              <a
                href="#"
                className="text-white underline hover:text-white/90 dark:text-green-400 dark:hover:text-green-300"
              >
                {t("cta1.symptomChecker")} <ArrowRight className="inline h-4 w-4" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
