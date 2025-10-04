import {
  Heart,
  Brain,
  Bone,
  Thermometer,
  Droplets,
  Pill,
  LigatureIcon as Bandage,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EmergencyTypes() {
  const { t } = useLanguage();

  const emergencies = [
    { icon: Heart, title: t("emergency_types.cardiac.title"), desc: t("emergency_types.cardiac.desc") },
    { icon: Brain, title: t("emergency_types.neurological.title"), desc: t("emergency_types.neurological.desc") },
    { icon: Bone, title: t("emergency_types.trauma.title"), desc: t("emergency_types.trauma.desc") },
    { icon: Thermometer, title: t("emergency_types.respiratory.title"), desc: t("emergency_types.respiratory.desc") },
    { icon: Droplets, title: t("emergency_types.bleeding.title"), desc: t("emergency_types.bleeding.desc") },
    { icon: Pill, title: t("emergency_types.poisoning.title"), desc: t("emergency_types.poisoning.desc") },
    { icon: Bandage, title: t("emergency_types.burns.title"), desc: t("emergency_types.burns.desc") },
    { icon: AlertTriangle, title: t("emergency_types.other.title"), desc: t("emergency_types.other.desc") },
  ];

  // Ensure urgentSigns is an array
  const urgentSignsRaw = t("emergency_types.urgent_signs");
  const urgentSigns = Array.isArray(urgentSignsRaw)
    ? urgentSignsRaw
    : urgentSignsRaw.split(",").map(s => s.trim()).filter(Boolean);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{t("emergency_types.heading")}</h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">{t("emergency_types.subheading")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {emergencies.map((em, i) => {
            const Icon = em.icon;
            return (
              <Card key={i} className="border-red-100">
                <CardHeader className="pb-2">
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">{em.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{em.desc}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 rounded-lg bg-red-50 p-6">
          <h3 className="mb-3 text-xl font-semibold text-gray-900">{t("emergency_types.cta_title")}</h3>
          <p className="mb-4 text-gray-700">{t("emergency_types.cta_desc")}</p>
          <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {urgentSigns.map((sign, i) => (
              <li key={i} className="flex items-center text-gray-700">
                <span className="mr-2 text-red-600">•</span> {sign}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
