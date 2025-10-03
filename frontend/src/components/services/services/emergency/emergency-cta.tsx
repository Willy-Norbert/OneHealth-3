import { Button } from "@/components/ui/button";
import { PhoneCall, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EmergencyCta() {
  const { t } = useLanguage();

  return (
    <section className="bg-red-600 py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">{t("emergency_cta.heading")}</h2>
          <p className="mb-8 text-lg md:text-xl">{t("emergency_cta.subheading")}</p>

          <div className="mb-10 rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-4 text-center">
              <h3 className="text-2xl font-bold">{t("emergency_cta.hotline_title")}</h3>
              <p className="text-4xl font-bold md:text-5xl">{t("emergency_cta.hotline_number")}</p>
            </div>
            <p className="text-center">{t("emergency_cta.hotline_subtext")}</p>
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <PhoneCall className="mr-2 h-5 w-5" />
              {t("emergency_cta.save_number")}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              <Info className="mr-2 h-5 w-5" />
              {t("emergency_cta.learn_services")}
            </Button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {Array.isArray(t("emergency_cta.features")) ? (
              t("emergency_cta.features").map((feature: any, index: number) => (
                <div key={index} className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                  <h4 className="mb-2 font-semibold">{feature.title}</h4>
                  <p className="text-sm">{feature.description}</p>
                </div>
              ))
            ) : (
              <p>{t("emergency_cta.features")}</p>
            )}
          </div>

          <p className="mt-10 text-sm">{t("emergency_cta.reminder")}</p>
        </div>
      </div>
    </section>
  );
}
