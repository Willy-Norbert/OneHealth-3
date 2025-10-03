import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EmergencyLocations() {
  const { t } = useLanguage();

  const locations = [
    {
      name: t("emergency_locations.kigali.name"),
      address: t("emergency_locations.kigali.address"),
      coverage: t("emergency_locations.kigali.coverage"),
      responseTime: t("emergency_locations.kigali.responseTime"),
      units: t("emergency_locations.kigali.units"),
    },
    {
      name: t("emergency_locations.butare.name"),
      address: t("emergency_locations.butare.address"),
      coverage: t("emergency_locations.butare.coverage"),
      responseTime: t("emergency_locations.butare.responseTime"),
      units: t("emergency_locations.butare.units"),
    },
    {
      name: t("emergency_locations.musanze.name"),
      address: t("emergency_locations.musanze.address"),
      coverage: t("emergency_locations.musanze.coverage"),
      responseTime: t("emergency_locations.musanze.responseTime"),
      units: t("emergency_locations.musanze.units"),
    },
    {
      name: t("emergency_locations.rubavu.name"),
      address: t("emergency_locations.rubavu.address"),
      coverage: t("emergency_locations.rubavu.coverage"),
      responseTime: t("emergency_locations.rubavu.responseTime"),
      units: t("emergency_locations.rubavu.units"),
    },
    {
      name: t("emergency_locations.rwamagana.name"),
      address: t("emergency_locations.rwamagana.address"),
      coverage: t("emergency_locations.rwamagana.coverage"),
      responseTime: t("emergency_locations.rwamagana.responseTime"),
      units: t("emergency_locations.rwamagana.units"),
    },
    {
      name: t("emergency_locations.nyagatare.name"),
      address: t("emergency_locations.nyagatare.address"),
      coverage: t("emergency_locations.nyagatare.coverage"),
      responseTime: t("emergency_locations.nyagatare.responseTime"),
      units: t("emergency_locations.nyagatare.units"),
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("emergency_locations.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            {t("emergency_locations.description")}
          </p>
        </div>

        <div className="mb-12 overflow-hidden rounded-lg bg-white shadow-md">
          <div className="relative h-[400px] w-full bg-gray-200">
            <div className="absolute inset-0 flex items-center justify-center bg-[url('https://static.vecteezy.com/system/resources/thumbnails/046/860/156/small_2x/map-with-red-pin-marked-free-photo.jpeg?height=800&width=1200')] bg-cover bg-center">
              <div className="rounded-lg bg-white/80 p-4 text-center backdrop-blur-sm">
                <p className="text-lg font-semibold text-gray-900">{t("emergency_locations.map_placeholder.title")}</p>
                <p className="text-gray-600">{t("emergency_locations.map_placeholder.subtitle")}</p>
              </div>
            </div>
            {/* Sample location markers */}
            {locations.map((_, idx) => (
              <div
                key={idx}
                className={`absolute h-8 w-8 flex items-center justify-center rounded-full bg-red-600 text-white`}
                style={{
                  left: `${25 + idx * 10}%`,
                  top: `${20 + idx * 10}%`,
                }}
              >
                <MapPin className="h-4 w-4" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc, idx) => (
            <div key={idx} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-gray-900">{loc.name}</h3>
              <div className="mb-4 flex items-center text-gray-600">
                <MapPin className="mr-2 h-5 w-5 text-red-600" />
                <p>{loc.address}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">{t("emergency_locations.coverage_label")}</p>
                <p className="text-gray-600">{loc.coverage}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">{t("emergency_locations.response_time_label")}</p>
                <p className="text-gray-600">{loc.responseTime}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{t("emergency_locations.units_label")}</p>
                <p className="text-gray-600">{loc.units}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-gray-900">{t("emergency_locations.footer_note_1")}</p>
          <p className="mt-2 text-gray-600">{t("emergency_locations.footer_note_2")}</p>
        </div>
      </div>
    </section>
  );
}
