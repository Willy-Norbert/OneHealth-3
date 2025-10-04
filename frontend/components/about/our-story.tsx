"use client"

import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"

export default function OurStory() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t("ourStory1.heading")}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t("ourStory1.subheading")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              {["beginning", "challenge", "solution", "today"].map((key) => (
                <div key={key}>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t(`ourStory1.${key}.title`)}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">{t(`ourStory1.${key}.text`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  {["Founding+Team", "First+Office"].map((text) => (
                    <div key={text} className="rounded-xl overflow-hidden shadow-lg">
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={`/placeholder.svg?height=300&width=400&text=${text}`}
                          alt={t(`ourStory1.images.${text.replace(/\+/g, "")}Alt`)}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 mt-8">
                  {["Early+Prototype", "Current+Team"].map((text) => (
                    <div key={text} className="rounded-xl overflow-hidden shadow-lg">
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={`/placeholder.svg?height=300&width=400&text=${text}`}
                          alt={t(`ourStory1.images.${text.replace(/\+/g, "")}Alt`)}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-100 dark:bg-green-800 rounded-full z-0"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-100 dark:bg-blue-800 rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
