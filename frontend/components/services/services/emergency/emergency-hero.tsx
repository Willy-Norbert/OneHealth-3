"use client";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EmergencyHero() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-red-800 py-20 text-white">
      <div className="absolute inset-0 bg-[url('https://rwandainspirer.com/wp-content/uploads/2024/08/yu7-799x445.jpg?height=1080&width=1920')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-block rounded-full bg-white px-4 py-1 text-sm font-semibold text-red-600">
              {t("emergency_hero.label")}
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {t("emergency_hero.title")}
            </h1>
            <p className="mb-8 text-lg md:text-xl">{t("emergency_hero.description")}</p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                <PhoneCall className="mr-2 h-5 w-5" />
                {t("emergency_hero.call_button")}: 912
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                {t("emergency_hero.learn_more")}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-96">
              <div className="absolute inset-0 flex items-center justify-center bg-red-500/10">
                <div className="grid grid-cols-2 gap-4 p-6 text-center">
                  <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-3xl font-bold md:text-4xl">{t("emergency_hero.stats.response_time.value")}</p>
                    <p className="text-sm font-medium">{t("emergency_hero.stats.response_time.label")}</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-3xl font-bold md:text-4xl">{t("emergency_hero.stats.availability.value")}</p>
                    <p className="text-sm font-medium">{t("emergency_hero.stats.availability.label")}</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-3xl font-bold md:text-4xl">{t("emergency_hero.stats.vehicles.value")}</p>
                    <p className="text-sm font-medium">{t("emergency_hero.stats.vehicles.label")}</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-3xl font-bold md:text-4xl">{t("emergency_hero.stats.responders.value")}</p>
                    <p className="text-sm font-medium">{t("emergency_hero.stats.responders.label")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
