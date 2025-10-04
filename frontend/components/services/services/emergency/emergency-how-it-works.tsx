import { Phone, Ambulance, Hospital, ClipboardCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EmergencyHowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Phone,
      title: t("emergency_how_it_works.call_emergency.title"),
      description: t("emergency_how_it_works.call_emergency.description"),
      align: "left",
    },
    {
      icon: Ambulance,
      title: t("emergency_how_it_works.rapid_dispatch.title"),
      description: t("emergency_how_it_works.rapid_dispatch.description"),
      align: "right",
    },
    {
      icon: ClipboardCheck,
      title: t("emergency_how_it_works.on_site_treatment.title"),
      description: t("emergency_how_it_works.on_site_treatment.description"),
      align: "left",
    },
    {
      icon: Hospital,
      title: t("emergency_how_it_works.hospital_transport.title"),
      description: t("emergency_how_it_works.hospital_transport.description"),
      align: "right",
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("emergency_how_it_works.heading")}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            {t("emergency_how_it_works.subheading")}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-red-200 md:block"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLeft = step.align === "left";
            return (
              <div key={index} className="relative mb-16">
                <div className="flex flex-col items-center md:flex-row">
                  {isLeft && (
                    <div className="mb-8 flex w-full flex-col items-center text-center md:mb-0 md:w-1/2 md:items-end md:pr-8 md:text-right">
                      <div className="rounded-lg bg-white p-6 shadow-md">
                        <h3 className="mb-3 text-2xl font-bold text-gray-900">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-red-600 text-white">
                    <Icon className="h-6 w-6" />
                  </div>

                  {!isLeft && (
                    <div className="w-full md:w-1/2 md:pl-8">
                      <div className="rounded-lg bg-white p-6 shadow-md">
                        <h3 className="mb-3 text-2xl font-bold text-gray-900">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 rounded-lg bg-red-50 p-6 text-center">
          <p className="text-lg font-medium text-red-800">
            {t("emergency_how_it_works.cta_text")} <span className="font-bold">912</span>
          </p>
        </div>
      </div>
    </section>
  );
}
