"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Brain, User } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FeaturedDepartments() {
  const { t } = useLanguage();

  const departmentData = {
    cardiology: {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      color: "bg-red-50 dark:bg-red-900",
      image: "/placeholder.svg?height=600&width=800&text=Cardiology"
    },
    neurology: {
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-50 dark:bg-purple-900",
      image: "/placeholder.svg?height=600&width=800&text=Neurology"
    },
    pediatrics: {
      icon: <User className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-900",
      image: "/placeholder.svg?height=600&width=800&text=Pediatrics"
    }
  };

  const featuredDepartments = Object.entries(departmentData).map(([id, data]) => ({
    id,
    name: t(`departments1.departments_list.${id}.name`),
    description: t(`departments1.departments_list.${id}.description`),
    image: data.image,
    icon: data.icon,
    color: data.color,
    services: t(`departments1.departments_list.${id}.services`, { returnObjects: true }),
    specialists: id === 'cardiology' ? 8 : id === 'neurology' ? 6 : 10
  }));

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t("departments1.featured_title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t("departments1.featured_description")}
          </p>
        </div>

        <div className="space-y-20">
          {featuredDepartments.map((dept, index) => (
            <div
              key={dept.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "order-1 lg:order-2" : ""}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <div className="aspect-[4/3] relative">
                    <Image src={dept.image || "/placeholder.svg"} alt={dept.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
                  </div>
                  <div className="absolute top-6 left-6 flex items-center space-x-2">
                    <div className={`${dept.color} p-3 rounded-lg`}>{dept.icon}</div>
                    <h3 className="text-white text-xl font-bold">{dept.name}</h3>
                  </div>
                  <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full text-sm font-medium text-gray-900 dark:text-white">
                    {t("departments1.specialists_available", { count: dept.specialists })}
                  </div>
                </div>
              </div>

              <div className={index % 2 === 1 ? "order-2 lg:order-1" : ""}>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{dept.name} Department</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{dept.description}</p>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    {t("departments1.services_offered") || "Services Offered:"}
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {dept.services?.map((service: string, idx: number) => (
                      <li key={idx} className="flex items-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                        <span className="text-gray-700 dark:text-gray-300">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={`/departments/${dept.id}`}>
                  <Button className="bg-green-600 hover:bg-green-700">
                    {t("departments1.learn_more")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
