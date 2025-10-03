"use client"

import { useLanguage } from "@/contexts/LanguageContext"

export default function MissionVision() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="bg-green-50 dark:bg-green-900 rounded-2xl p-8 md:p-10 relative overflow-hidden">
            {/* ...icon */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('missionVision.mission.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {t('missionVision.mission.description')}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-2xl p-8 md:p-10 relative overflow-hidden">
            {/* ...icon */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('missionVision.vision.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {t('missionVision.vision.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
