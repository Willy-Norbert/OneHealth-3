"use client";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DepartmentSection() {
  const { t } = useLanguage();

  const departments = [
    { name: "Cardiology", icon: "❤️", image: "/cardiology.jpg" },
    { name: "Ophthalmology", icon: "👁️", image: "/ophtamology.jpg" },
    { name: "Dentistry", icon: "🔬", image: "/dentistry.png" },
    { name: "Antenatal", icon: "👶", image: "/antenatal.jpg" },
    { name: "Neurology", icon: "🧠", image: "/neurology.png" },
    { name: "Orthopedics", icon: "🦴", image: "/orthopedic.jpg" },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("departments.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            {t("departments.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {departments.map((dept, index) => (
            <Link
              href={`/departments/${dept.name.toLowerCase()}`}
              key={index}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="relative w-16 h-16 mx-auto mb-4 overflow-hidden rounded-full">
                  <Image
                    src={dept.image || "/placeholder.svg"}
                    alt={dept.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {t(`departments.list.${dept.name.toLowerCase()}`) || dept.name}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/departments"
            className="inline-flex items-center text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
          >
            {t("departments.viewAll")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
