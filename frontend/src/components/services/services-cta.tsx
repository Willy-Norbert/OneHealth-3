"use client";

import { Button } from "@/components/ui/button"
import { Download, ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ServicesCta() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 to-green-900 text-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("servicesCta.title")}</h2>
          <p className="text-xl text-white/80 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            {t("servicesCta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-900 hover:bg-white/90 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 h-12 px-6 text-base">
              <Download className="mr-2 h-5 w-5" /> {t("servicesCta.downloadApp")}
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 dark:border-gray-300 dark:text-gray-200 dark:hover:bg-gray-700 h-12 px-6 text-base">
              {t("servicesCta.contactUs")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
