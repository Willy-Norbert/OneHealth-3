import { Button } from "@/components/ui/button";
import { Pill, ArrowRight, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PharmacyCta() {
  const { t } = useLanguage();

  const features = [
    {
      title: t("pharmacy_cta.features.easy_ordering.title"),
      description: t("pharmacy_cta.features.easy_ordering.description"),
    },
    {
      title: t("pharmacy_cta.features.fast_delivery.title"),
      description: t("pharmacy_cta.features.fast_delivery.description"),
    },
    {
      title: t("pharmacy_cta.features.expert_support.title"),
      description: t("pharmacy_cta.features.expert_support.description"),
    },
  ];

  return (
    <section className="py-20 bg-purple-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("pharmacy_cta.heading")}</h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">{t("pharmacy_cta.description")}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-purple-100">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              {t("pharmacy_cta.buttons.order")} <Pill className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-purple-700">
              {t("pharmacy_cta.buttons.upload")} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-purple-700">
              <Phone className="mr-2 h-5 w-5" /> {t("pharmacy_cta.buttons.call")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
