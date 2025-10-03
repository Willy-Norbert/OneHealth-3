"use client";
import { Clock, Truck, Shield, CreditCard, Pill, MessageSquare, RefreshCw, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PharmacyFeatures() {
  const { t } = useLanguage();

  const features = [
    { icon: <Clock className="h-10 w-10 text-purple-600" />, title: t("pharmacy_features.24_7_ordering.title"), description: t("pharmacy_features.24_7_ordering.description") },
    { icon: <Truck className="h-10 w-10 text-purple-600" />, title: t("pharmacy_features.fast_delivery.title"), description: t("pharmacy_features.fast_delivery.description") },
    { icon: <Shield className="h-10 w-10 text-purple-600" />, title: t("pharmacy_features.verified_medications.title"), description: t("pharmacy_features.verified_medications.description") },
    { icon: <CreditCard className="h-10 w-10 text-purple-600" />, title: t("pharmacy_features.secure_payments.title"), description: t("pharmacy_features.secure_payments.description") },
    { icon: <Pill className="h-10 w-10 text-purple-600" />, title: t("pharmacy_features.medication_reminders.title"), description: t("pharmacy_features.medication_reminders.description") },
    { icon: <MessageSquare className="h-10 w-10 text-purple-600" />, title: t("pharmacy_features.pharmacist_consultation.title"), description: t("pharmacy_features.pharmacist_consultation.description") },
    { icon: <RefreshCw className="h-10 w-10 text-purple-600" />, title: t("pharmacy_features.easy_refills.title"), description: t("pharmacy_features.easy_refills.description") },
    { icon: <FileText className="h-10 w-10 text-purple-600" />, title: t("pharmacy_features.digital_prescriptions.title"), description: t("pharmacy_features.digital_prescriptions.description") },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("pharmacy_features.heading")} <span className="text-purple-600">{t("pharmacy_features.highlight")}</span>
          </h2>
          <p className="text-xl text-gray-600">{t("pharmacy_features.description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="bg-purple-50 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
