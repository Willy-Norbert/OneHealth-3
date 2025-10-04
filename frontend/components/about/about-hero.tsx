"use client"

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutHero() {
  const { t } = useLanguage();

  return (
    <section className="relative pt-20 pb-24 overflow-hidden bg-white dark:bg-gray-900">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-50 dark:bg-green-900 rounded-bl-full opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 dark:bg-blue-900 rounded-tr-full opacity-70"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t("about.title1")}{" "}
            <span className="text-green-600 dark:text-green-400">{t("about.highlight")}</span>{" "}
            {t("about.title2")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">{t("about.subtitle")}</p>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="aspect-[18/9] relative">
            <Image
              src="/about-hero.png"
              alt={t("about.imageAlt")}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t("about.bottomTitle")}
              </h2>
              <p className="text-white/90 text-lg">{t("about.bottomDescription")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
