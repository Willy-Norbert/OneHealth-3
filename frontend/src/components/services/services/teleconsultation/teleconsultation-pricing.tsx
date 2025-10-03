"use client";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TeleconsultationPricing() {
  const { t } = useLanguage();

  const plans = [
    {
      key: "single",
      color: "border-gray-200",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      popular: false,
    },
    {
      key: "monthly",
      color: "border-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: true,
    },
    {
      key: "family",
      color: "border-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700",
      popular: false,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("pricing1.title")}</h2>
          <p className="text-gray-600">{t("pricing1.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-8 border-2 ${plan.color} ${
                plan.popular ? "shadow-xl relative" : "shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-bold rounded-bl-xl rounded-tr-xl">
                  {t("pricing1.mostPopular")}
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t(`pricing1.plans.${plan.key}.name`)}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">{t(`pricing1.plans.${plan.key}.price`)}</span>
                {t(`pricing1.plans.${plan.key}.period`) && (
                  <span className="text-gray-500 text-sm ml-1">{t(`pricing1.plans.${plan.key}.period`)}</span>
                )}
              </div>
              <p className="text-gray-600 mb-6">{t(`pricing1.plans.${plan.key}.description`)}</p>
              <ul className="space-y-3 mb-8">
                {(Array.isArray(t(`pricing1.plans.${plan.key}.features`)) ? t(`pricing1.plans.${plan.key}.features`) : []).map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className={`w-full ${plan.buttonColor}`}>{t("pricing1.choosePlan")}</Button>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center mt-12">
          <p className="text-gray-500 text-sm">{t("pricing1.footerNote")}</p>
        </div>
      </div>
    </section>
  );
}
