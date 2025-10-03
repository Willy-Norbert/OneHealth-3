"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AppointmentsLocations() {
  const { t } = useLanguage();

  const locations = [
    {
      name: t("appointments_locations.kigali.name"),
      address: t("appointments_locations.kigali.address"),
      phone: "+250 788 123 456",
      hours: t("appointments_locations.kigali.hours"),
      image: "/placeholder.svg?height=200&width=300&text=Kigali+Center",
      featured: true,
    },
    {
      name: t("appointments_locations.butare.name"),
      address: t("appointments_locations.butare.address"),
      phone: "+250 788 234 567",
      hours: t("appointments_locations.butare.hours"),
      image: "/placeholder.svg?height=200&width=300&text=Butare+Clinic",
      featured: false,
    },
    {
      name: t("appointments_locations.musanze.name"),
      address: t("appointments_locations.musanze.address"),
      phone: "+250 788 345 678",
      hours: t("appointments_locations.musanze.hours"),
      image: "/placeholder.svg?height=200&width=300&text=Musanze+Hospital",
      featured: false,
    },
    {
      name: t("appointments_locations.rubavu.name"),
      address: t("appointments_locations.rubavu.address"),
      phone: "+250 788 456 789",
      hours: t("appointments_locations.rubavu.hours"),
      image: "/placeholder.svg?height=200&width=300&text=Rubavu+Center",
      featured: false,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("appointments_locations.title")}{" "}
            <span className="text-green-600">{t("appointments_locations.title_highlight")}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("appointments_locations.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${
                location.featured ? "ring-2 ring-green-500" : ""
              }`}
            >
              <div className="relative h-48">
                <Image src={location.image || "/placeholder.svg"} alt={location.name} fill className="object-cover" />
                {location.featured && (
                  <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-full">
                    {t("appointments_locations.featured")}
                  </div>
                )}
              </div>
              <div className="p-5 bg-white">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{location.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">{location.address}</p>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">{location.phone}</p>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">{location.hours}</p>
                  </div>
                </div>
                <Button
                  variant={location.featured ? "default" : "outline"}
                  className={
                    location.featured
                      ? "bg-green-600 hover:bg-green-700 w-full"
                      : "border-green-600 text-green-600 hover:bg-green-50 w-full"
                  }
                >
                  {t("appointments_locations.book_button")}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("appointments_locations.find_nearby.title")}</h3>
              <p className="text-gray-600">{t("appointments_locations.find_nearby.subtitle")}</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              {t("appointments_locations.view_all")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
