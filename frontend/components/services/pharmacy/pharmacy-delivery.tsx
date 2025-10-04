import Image from "next/image";
import { Truck, Clock, MapPin, Shield, ThermometerSnowflake, CheckCircle, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PharmacyDelivery() {
  const { t } = useLanguage();

  const deliveryZones = [
    {
      zone: t("pharmacy_delivery.zones.kigali_urban"),
      time: "1-3 hours",
      fee: "RWF 1,500",
      express: "Available (1 hour)",
    },
    {
      zone: t("pharmacy_delivery.zones.kigali_suburbs"),
      time: "2-4 hours",
      fee: "RWF 2,000",
      express: "Available (1.5 hours)",
    },
    {
      zone: t("pharmacy_delivery.zones.provincial_cities"),
      time: t("pharmacy_delivery.same_day"),
      fee: "RWF 3,000",
      express: "Available (3 hours)",
    },
    {
      zone: t("pharmacy_delivery.zones.rural_areas"),
      time: t("pharmacy_delivery.next_day"),
      fee: "RWF 4,000",
      express: "Not available",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("pharmacy_delivery.heading")} <span className="text-purple-600">{t("pharmacy_delivery.highlight")}</span>
          </h2>
          <p className="text-xl text-gray-600">{t("pharmacy_delivery.description")}</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-100 rounded-full z-0"></div>
            <div className="relative z-10 rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=500&width=600&text=Medication+Delivery"
                alt={t("pharmacy_delivery.image_alt")}
                width={600}
                height={500}
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-50 rounded-full z-0"></div>
          </div>

          <div className="space-y-8">
            {[
              { icon: Truck, title: t("pharmacy_delivery.features.nationwide.title"), description: t("pharmacy_delivery.features.nationwide.description") },
              { icon: Clock, title: t("pharmacy_delivery.features.express.title"), description: t("pharmacy_delivery.features.express.description") },
              { icon: Shield, title: t("pharmacy_delivery.features.secure.title"), description: t("pharmacy_delivery.features.secure.description") },
              { icon: ThermometerSnowflake, title: t("pharmacy_delivery.features.temp.title"), description: t("pharmacy_delivery.features.temp.description") },
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Zones Table */}
        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{t("pharmacy_delivery.zones_heading")}</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-4 text-left text-gray-600 font-medium">{t("pharmacy_delivery.table.zone")}</th>
                  <th className="py-4 px-4 text-left text-gray-600 font-medium">{t("pharmacy_delivery.table.standard")}</th>
                  <th className="py-4 px-4 text-left text-gray-600 font-medium">{t("pharmacy_delivery.table.fee")}</th>
                  <th className="py-4 px-4 text-left text-gray-600 font-medium">{t("pharmacy_delivery.table.express")}</th>
                </tr>
              </thead>
              <tbody>
                {deliveryZones.map((zone, index) => (
                  <tr key={index} className={index < deliveryZones.length - 1 ? "border-b border-gray-200" : ""}>
                    <td className="py-4 px-4 font-medium text-gray-900">{zone.zone}</td>
                    <td className="py-4 px-4 text-gray-600">{zone.time}</td>
                    <td className="py-4 px-4 text-gray-600">{zone.fee}</td>
                    <td className="py-4 px-4">
                      {zone.express.includes("Available") ? (
                        <span className="inline-flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" /> {zone.express}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-gray-500">
                          <AlertTriangle className="h-4 w-4 mr-1" /> {zone.express}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivery Map */}
        <div className="rounded-xl overflow-hidden shadow-lg">
          <div className="aspect-[16/9] relative">
            <Image
              src="/placeholder.svg?height=600&width=1200&text=Rwanda+Delivery+Coverage+Map"
              alt={t("pharmacy_delivery.map_alt")}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 p-6 rounded-lg max-w-md text-center">
                <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t("pharmacy_delivery.map_title")}</h3>
                <p className="text-gray-600">{t("pharmacy_delivery.map_description")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
