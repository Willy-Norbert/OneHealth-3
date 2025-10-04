"use client";
import { Check, Calendar, Clock, Users, MapPin, CreditCard, Phone, Laptop } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AppointmentsFeatures() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-green-600" />,
      title: t("appointments_features.feature_24_7.title"),
      description: t("appointments_features.feature_24_7.description"),
    },
    {
      icon: <Clock className="h-6 w-6 text-green-600" />,
      title: t("appointments_features.feature_instant.title"),
      description: t("appointments_features.feature_instant.description"),
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      title: t("appointments_features.feature_specialist.title"),
      description: t("appointments_features.feature_specialist.description"),
    },
    {
      icon: <MapPin className="h-6 w-6 text-green-600" />,
      title: t("appointments_features.feature_locations.title"),
      description: t("appointments_features.feature_locations.description"),
    },
    {
      icon: <CreditCard className="h-6 w-6 text-green-600" />,
      title: t("appointments_features.feature_payment.title"),
      description: t("appointments_features.feature_payment.description"),
    },
    {
      icon: <Phone className="h-6 w-6 text-green-600" />,
      title: t("appointments_features.feature_sms.title"),
      description: t("appointments_features.feature_sms.description"),
    },
    {
      icon: <Laptop className="h-6 w-6 text-green-600" />,
      title: t("appointments_features.feature_virtual.title"),
      description: t("appointments_features.feature_virtual.description"),
    },
    {
      icon: <Check className="h-6 w-6 text-green-600" />,
      title: t("appointments_features.feature_reschedule.title"),
      description: t("appointments_features.feature_reschedule.description"),
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("appointments_features.heading")}{" "}
            <span className="text-green-600">{t("appointments_features.heading_highlight")}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("appointments_features.subheading")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-green-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-green-50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {t("appointments_features.cta_title")}
            </h3>
            <p className="text-gray-600">{t("appointments_features.cta_subtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mr-3 shadow-sm">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">50,000+</p>
                <p className="text-sm text-gray-600">
                  {t("appointments_features.cta_stat_appointments")}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mr-3 shadow-sm">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">98%</p>
                <p className="text-sm text-gray-600">
                  {t("appointments_features.cta_stat_satisfaction")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
