import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EmergencyTestimonials() {
  const { t } = useLanguage();

  let testimonialsRaw = t("emergency_testimonials.testimonials");
  let testimonials: any[] = [];
  if (typeof testimonialsRaw === "string") {
    try {
      testimonials = JSON.parse(testimonialsRaw);
    } catch {
      testimonials = [];
    }
  } else if (Array.isArray(testimonialsRaw)) {
    testimonials = testimonialsRaw;
  }
  let statsRaw = t("emergency_testimonials.stats");
  let stats: any[] = [];
  if (typeof statsRaw === "string") {
    try {
      stats = JSON.parse(statsRaw);
    } catch {
      stats = [];
    }
  } else if (Array.isArray(statsRaw)) {
    stats = statsRaw;
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("emergency_testimonials.heading")}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            {t("emergency_testimonials.subheading")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item: any, index: number) => (
            <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="mb-4 italic text-gray-700">{item.testimonial}</blockquote>
              <div className="flex items-center">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                  {/* Optional: add item.image if available */}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-red-50 p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">{t("emergency_testimonials.stats_heading")}</h3>
              <ul className="space-y-3">
                {stats.map((stat: any, index: number) => (
                  <li key={index} className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-red-600"></div>
                    <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: stat }} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">{t("emergency_testimonials.commitment_heading")}</h3>
              <p className="mb-4 text-gray-700">{t("emergency_testimonials.commitment_p1")}</p>
              <p className="text-gray-700">{t("emergency_testimonials.commitment_p2")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
