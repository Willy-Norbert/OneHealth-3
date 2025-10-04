"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ServicesHero() {
  const { t } = useLanguage();

  return (
    <section className="relative pt-20 pb-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-50 dark:bg-green-800 rounded-bl-full opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 dark:bg-blue-900 rounded-tr-full opacity-70"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight"
              dangerouslySetInnerHTML={{ __html: t("servicesHero.title") }}
            />
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl">
              {t("servicesHero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                {t("servicesHero.getStarted")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-800/50"
              >
                {t("servicesHero.viewPricing")}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/placeholder.svg?height=600&width=800&text=Healthcare+Services"
                  alt={t("servicesHero.imageAlt")}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 dark:from-blue-700/50 to-green-900/30 dark:to-green-700/50"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <h2 className="text-2xl font-bold text-white">{t("servicesHero.coreServices.title")}</h2>
                <p className="text-white/90">{t("servicesHero.coreServices.description")}</p>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg">
              {t("servicesHero.badges.support")}
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg">
              {t("servicesHero.badges.coverage")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
