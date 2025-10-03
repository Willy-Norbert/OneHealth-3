import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PharmacyFaq() {
  const { t } = useLanguage();

  const faqs = [
    {
      question: t("pharmacy_faq.questions.upload_prescription.question"),
      answer: t("pharmacy_faq.questions.upload_prescription.answer"),
    },
    {
      question: t("pharmacy_faq.questions.medication_types.question"),
      answer: t("pharmacy_faq.questions.medication_types.answer"),
    },
    {
      question: t("pharmacy_faq.questions.delivery_time.question"),
      answer: t("pharmacy_faq.questions.delivery_time.answer"),
    },
    {
      question: t("pharmacy_faq.questions.minimum_order.question"),
      answer: t("pharmacy_faq.questions.minimum_order.answer"),
    },
    {
      question: t("pharmacy_faq.questions.payment_methods.question"),
      answer: t("pharmacy_faq.questions.payment_methods.answer"),
    },
    {
      question: t("pharmacy_faq.questions.medication_authenticity.question"),
      answer: t("pharmacy_faq.questions.medication_authenticity.answer"),
    },
    {
      question: t("pharmacy_faq.questions.refund_policy.question"),
      answer: t("pharmacy_faq.questions.refund_policy.answer"),
    },
    {
      question: t("pharmacy_faq.questions.temperature_sensitive.question"),
      answer: t("pharmacy_faq.questions.temperature_sensitive.answer"),
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("pharmacy_faq.heading")} <span className="text-purple-600">{t("pharmacy_faq.highlight")}</span>
          </h2>
          <p className="text-xl text-gray-600">{t("pharmacy_faq.description")}</p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left font-medium text-gray-900">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Info */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-purple-50 px-6 py-4 rounded-lg">
            <p className="text-gray-700 mb-2">{t("pharmacy_faq.contact.prompt")}</p>
            <p className="text-purple-600 font-medium">
              {t("pharmacy_faq.contact.message")}
              <br />
              pharmacy@healthlinerwanda.com | +250 788 123 456
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
