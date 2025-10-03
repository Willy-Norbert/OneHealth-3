"use client";
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ServicesPricing() {
  const { t } = useLanguage()
  const plans = ["basic", "premium", "business"]

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t("pricing.title")}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t("pricing.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((planKey, index) => {
            const plan = t(`pricing.plans.${planKey}`, { returnObjects: true })
            const isPopular = planKey === "premium"
            const color = planKey === "basic" ? "border-gray-200 dark:border-gray-700" :
                          planKey === "premium" ? "border-green-600" :
                          "border-blue-600"
            const buttonColor = planKey === "basic" ? "bg-gray-600 hover:bg-gray-700" :
                                 planKey === "premium" ? "bg-green-600 hover:bg-green-700" :
                                 "bg-blue-600 hover:bg-blue-700"

            return (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-xl p-8 border-2 ${color} ${
                  isPopular ? "shadow-xl relative" : "shadow-md"
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-1 text-sm font-bold rounded-bl-xl rounded-tr-xl">
                    {t("pricing.mostPopular")}
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">{plan.period}</span>}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-900 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${buttonColor}`}>
                  {planKey === "business" ? t("pricing.ctaBusiness") : t("pricing.ctaDefault")}
                </Button>
              </div>
            )
          })}
        </div>

        <div className="max-w-3xl mx-auto text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t("pricing.note")}</p>
        </div>
      </div>
    </section>
  )
}
