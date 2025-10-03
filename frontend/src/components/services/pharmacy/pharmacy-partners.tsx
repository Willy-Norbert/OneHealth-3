import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PharmacyPartners() {
  const { t } = useLanguage();

  const partners = [
    {
      name: t("pharmacy_partners.kigali.name"),
      logo: "/placeholder.svg?height=100&width=200&text=Kigali+Pharmacy",
      description: t("pharmacy_partners.kigali.description"),
      locations: t("pharmacy_partners.kigali.locations"),
      specialties: t("pharmacy_partners.kigali.specialties"),
    },
    {
      name: t("pharmacy_partners.butare.name"),
      logo: "/placeholder.svg?height=100&width=200&text=Butare+Medical",
      description: t("pharmacy_partners.butare.description"),
      locations: t("pharmacy_partners.butare.locations"),
      specialties: t("pharmacy_partners.butare.specialties"),
    },
    {
      name: t("pharmacy_partners.musanze.name"),
      logo: "/placeholder.svg?height=100&width=200&text=Musanze+Health",
      description: t("pharmacy_partners.musanze.description"),
      locations: t("pharmacy_partners.musanze.locations"),
      specialties: t("pharmacy_partners.musanze.specialties"),
    },
    {
      name: t("pharmacy_partners.rubavu.name"),
      logo: "/placeholder.svg?height=100&width=200&text=Rubavu+Center",
      description: t("pharmacy_partners.rubavu.description"),
      locations: t("pharmacy_partners.rubavu.locations"),
      specialties: t("pharmacy_partners.rubavu.specialties"),
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("pharmacy_partners.heading")}{" "}
            <span className="text-purple-600">{t("pharmacy_partners.highlight")}</span>
          </h2>
          <p className="text-xl text-gray-600">{t("pharmacy_partners.description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-full md:w-1/3 flex-shrink-0">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <Image
                      src={partner.logo || "/placeholder.svg"}
                      alt={partner.name}
                      width={200}
                      height={100}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                <div className="w-full md:w-2/3 space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">{partner.name}</h3>
                  <p className="text-gray-600">{partner.description}</p>

                  <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t("pharmacy_partners.labels.locations")}</p>
                      <p className="text-purple-600 font-medium">{partner.locations}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t("pharmacy_partners.labels.specialties")}</p>
                      <p className="text-purple-600 font-medium">{partner.specialties}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-purple-50 px-6 py-3 rounded-full">
            <p className="text-purple-800 font-medium">{t("pharmacy_partners.footer_note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
