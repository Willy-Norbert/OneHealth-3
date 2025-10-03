import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EmergencyFaq() {
  const { t } = useLanguage();

  const faqs = Array.isArray(t("emergency_faq.faqs")) ? t("emergency_faq.faqs") : [];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("emergency_faq.heading")}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            {t("emergency_faq.subheading")}
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq: any, index: number) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-gray-900">{t("emergency_faq.contact_heading")}</p>
          <p className="mt-2 text-gray-600">
            {t("emergency_faq.contact_text")}
          </p>
        </div>
      </div>
    </section>
  );
}
