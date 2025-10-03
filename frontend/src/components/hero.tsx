"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="pt-10 pb-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-300">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{t('hero1.badge')}</span>
            </div>

            <h1 
              className="text-4xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight dark:text-white"
              dangerouslySetInnerHTML={{ __html: t('hero1.title') }}
            />

            <p className="text-lg text-gray-700 max-w-xl dark:text-gray-300">
              {t('hero1.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-green-600 hover:bg-green-700 h-12 px-6 text-base dark:bg-green-500 dark:hover:bg-green-600">
                {t('hero1.cta_get_started')}
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 h-12 px-6 text-base dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30">
                {t('hero1.cta_emergency')}
              </Button>
            </div>

            {/* Avatars */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex -space-x-2">
                {["/avatar1.png", "/avatar2.png", "/avatar3.png", "/avatar4.png"].map((src, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white dark:bg-gray-700 dark:border-gray-900 flex items-center justify-center overflow-hidden"
                  >
                    <Image src={src} alt={`User ${index + 1}`} width={40} height={40} />
                  </div>
                ))}
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{t('hero1.users_count')}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('hero1.users_trust')}</div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-100 rounded-full z-0 dark:bg-blue-900"></div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-green-100 rounded-full z-0 dark:bg-green-900"></div>

            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/hero.png"
                  alt="Doctor consulting with patient"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white text-xl font-bold">{t('hero1.consultations_title')}</h3>
                <p className="text-white/80 text-sm mt-2">{t('hero1.consultations_desc')}</p>
              </div>

              <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full dark:bg-green-500">
                {t('hero1.badge_new')}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
