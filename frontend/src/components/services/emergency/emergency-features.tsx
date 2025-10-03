import {
  CheckCircle2,
  Clock,
  MapPin,
  HeartPulse,
  Stethoscope,
  Truck,
  Phone,
  Shield,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EmergencyFeatures() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Clock,
      title: t("emergency_features.rapid_response.title"),
      description: t("emergency_features.rapid_response.description"),
    },
    {
      icon: MapPin,
      title: t("emergency_features.nationwide_coverage.title"),
      description: t("emergency_features.nationwide_coverage.description"),
    },
    {
      icon: HeartPulse,
      title: t("emergency_features.advanced_life_support.title"),
      description: t("emergency_features.advanced_life_support.description"),
    },
    {
      icon: Stethoscope,
      title: t("emergency_features.medical_professionals.title"),
      description: t("emergency_features.medical_professionals.description"),
    },
    {
      icon: Truck,
      title: t("emergency_features.ambulance_fleet.title"),
      description: t("emergency_features.ambulance_fleet.description"),
    },
    {
      icon: Phone,
      title: t("emergency_features.dispatch_center.title"),
      description: t("emergency_features.dispatch_center.description"),
    },
    {
      icon: Shield,
      title: t("emergency_features.hospital_network.title"),
      description: t("emergency_features.hospital_network.description"),
    },
    {
      icon: CheckCircle2,
      title: t("emergency_features.insurance_coordination.title"),
      description: t("emergency_features.insurance_coordination.description"),
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("emergency_features.heading")}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            {t("emergency_features.subheading")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
