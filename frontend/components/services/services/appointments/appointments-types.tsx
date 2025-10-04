"use client";
import { Button } from "@/components/ui/button";
import { Stethoscope, Brain, Heart, Eye, Bone, Baby, Pill, Microscope, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AppointmentsTypes() {
  const { t } = useLanguage();

  const appointmentTypes = [
    {
      icon: <Stethoscope className="h-8 w-8 text-green-600" />,
      title: t("appointments_types.general_consultation.title"),
      description: t("appointments_types.general_consultation.description"),
      popular: true,
    },
    {
      icon: <Brain className="h-8 w-8 text-green-600" />,
      title: t("appointments_types.specialist_consultation.title"),
      description: t("appointments_types.specialist_consultation.description"),
      popular: false,
    },
    {
      icon: <Heart className="h-8 w-8 text-green-600" />,
      title: t("appointments_types.cardiology.title"),
      description: t("appointments_types.cardiology.description"),
      popular: true,
    },
    {
      icon: <Eye className="h-8 w-8 text-green-600" />,
      title: t("appointments_types.ophthalmology.title"),
      description: t("appointments_types.ophthalmology.description"),
      popular: false,
    },
    {
      icon: <Bone className="h-8 w-8 text-green-600" />,
      title: t("appointments_types.orthopedics.title"),
      description: t("appointments_types.orthopedics.description"),
      popular: false,
    },
    {
      icon: <Baby className="h-8 w-8 text-green-600" />,
      title: t("appointments_types.pediatrics.title"),
      description: t("appointments_types.pediatrics.description"),
      popular: true,
    },
    {
      icon: <Pill className="h-8 w-8 text-green-600" />,
      title: t("appointments_types.pharmacy.title"),
      description: t("appointments_types.pharmacy.description"),
      popular: false,
    },
    {
      icon: <Microscope className="h-8 w-8 text-green-600" />,
      title: t("appointments_types.laboratory.title"),
      description: t("appointments_types.laboratory.description"),
      popular: false,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("appointments_types.title")} <span className="text-green-600">{t("appointments_types.title_highlight")}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("appointments_types.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {appointmentTypes.map((type, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
                type.popular
                  ? "border-2 border-green-500 bg-green-50"
                  : "border border-gray-200 bg-white hover:border-green-200"
              }`}
            >
              {type.popular && (
                <div className="bg-green-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-full inline-block mb-4">
                  {t("appointments_types.popular")}
                </div>
              )}
              <div className="mb-4">{type.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.title}</h3>
              <p className="text-gray-600 mb-4">{type.description}</p>
              <Button
                variant={type.popular ? "default" : "outline"}
                className={
                  type.popular
                    ? "bg-green-600 hover:bg-green-700 w-full"
                    : "border-green-600 text-green-600 hover:bg-green-50 w-full"
                }
              >
                {t("appointments_types.book_now")}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">{t("appointments_types.more_specialties")}</p>
          <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
            {t("appointments_types.view_all")} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
