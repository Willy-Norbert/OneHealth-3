"use client";
import { Button } from "@/components/ui/button";
import { Video, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TeleconsultationCta() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("teleconsultation_cta.title")}
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {t("teleconsultation_cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-900 hover:bg-white/90 h-12 px-6 text-base">
              <Video className="mr-2 h-5 w-5" /> {t("teleconsultation_cta.start_button")}
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 h-12 px-6 text-base"
            >
              {t("teleconsultation_cta.learn_more")}{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
