import { Award, Users, Building, Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Achievements() {
  const { t } = useLanguage()

  const milestones = t("achievements.milestones", [], { returnObjects: true })
  const awards = t("achievements.awards", [], { returnObjects: true })

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t("achievements.heading")}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t("achievements.subheading")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Milestones Timeline */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t("achievements.milestonesTitle")}</h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-200 dark:bg-green-700"></div>

              <div className="space-y-8">
                {milestones.map((milestone: any, index: number) => (
                  <div key={index} className="relative pl-12">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {milestone.year.slice(2)}
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md dark:shadow-lg">
                      <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">{milestone.year}</div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{milestone.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Awards & Recognition */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t("achievements.awardsTitle")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {awards.map((award: any, index: number) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md dark:shadow-lg">
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl mr-4">
                      {index === 0 && <Award className="h-8 w-8 text-yellow-500" />}
                      {index === 1 && <Users className="h-8 w-8 text-blue-500" />}
                      {index === 2 && <Building className="h-8 w-8 text-green-500" />}
                      {index === 3 && <Calendar className="h-8 w-8 text-purple-500" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{award.title}</h4>
                      <p className="text-sm text-green-600 dark:text-green-400 mb-2">{award.year}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{award.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
