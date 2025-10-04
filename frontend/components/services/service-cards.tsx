"use client";
import Link from "next/link";
import Image from "next/image";
import { Video, Calendar, Phone, Pill, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ServiceCards() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t("services2.title")}</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto dark:text-gray-400">{t("services2.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceCard
            icon={<Video className="h-8 w-8 text-white" />}
            iconBg="bg-blue-600"
            title={t("services2.teleconsultation.title")}
            description={t("services2.teleconsultation.desc")}
            image="/5.png"
            href="/teleconsultation"
          />

          <ServiceCard
            icon={<Calendar className="h-8 w-8 text-white" />}
            iconBg="bg-green-600"
            title={t("services2.appointments.title")}
            description={t("services2.appointments.desc")}
            image="/4.png"
            href="/appointments"
          />

          <ServiceCard
            icon={<Phone className="h-8 w-8 text-white" />}
            iconBg="bg-red-600"
            title={t("services2.emergency.title")}
            description={t("services2.emergency.desc")}
            image="/6.png"
            href="/emergency"
          />

          <ServiceCard
            icon={<Pill className="h-8 w-8 text-white" />}
            iconBg="bg-purple-600"
            title={t("services2.pharmacy.title")}
            description={t("services2.pharmacy.desc")}
            image="/7.png"
            href="/pharmacy"
          />
        </div>

        {/* AI Doctor Feature Card */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center w-fit px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-sm font-medium mb-6">
                {t("services2.ai.badge")}
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">{t("services2.ai.title")}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t("services2.ai.desc")}</p>
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  t("services2.ai.features.monitoring"),
                  t("services2.ai.features.lifestyle"),
                  t("services2.ai.features.medication"),
                  t("services2.ai.features.symptom"),
                ].map((feature, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm dark:bg-gray-700 dark:text-gray-200">
                    {feature}
                  </span>
                ))}
              </div>
              <Link
                href="/services/ai-assistant"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {t("services2.ai.cta")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-[300px] lg:min-h-0">
              <Image src="/ai.jpg" alt={t("services2.ai.title")} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

function ServiceCard({ icon, iconBg, title, description, image, href }: ServiceCardProps) {
  const { t } = useLanguage();
  return (
    <Link href={href} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        <div className="relative h-48">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
        </div>
        <div className="p-6 relative">
          <div className={`absolute -top-8 left-6 ${iconBg} p-4 rounded-xl shadow-lg`}>{icon}</div>
          <div className="pt-6">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
            <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              {t("services2.learnMore")} <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
