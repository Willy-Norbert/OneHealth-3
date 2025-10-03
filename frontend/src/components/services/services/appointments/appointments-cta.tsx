"use client";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AppointmentsCta() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-green-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t("appointments_cta.title")}
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            {t("appointments_cta.subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <Calendar className="h-10 w-10 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-semibold mb-2">{t("appointments_cta.features.easy_booking.title")}</h3>
              <p className="text-green-100">{t("appointments_cta.features.easy_booking.description")}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <MessageSquare className="h-10 w-10 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-semibold mb-2">{t("appointments_cta.features.instant_confirmation.title")}</h3>
              <p className="text-green-100">{t("appointments_cta.features.instant_confirmation.description")}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <Phone className="h-10 w-10 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-semibold mb-2">{t("appointments_cta.features.support.title")}</h3>
              <p className="text-green-100">{t("appointments_cta.features.support.description")}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-green-600 hover:bg-green-50 text-lg py-6 px-8">
              {t("appointments_cta.buttons.book")} <Calendar className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg py-6 px-8">
              {t("appointments_cta.buttons.view_specialists")}
            </Button>
          </div>

          <p className="mt-8 text-green-100">
            {t("appointments_cta.need_assistance")}{" "}
            <a href="tel:+250788123456" className="font-bold hover:underline">
              +250 788 123 456
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
