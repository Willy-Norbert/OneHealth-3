"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AppointmentsFaq() {
  const { t } = useLanguage();

  const faqs = [
    {
      question: t("appointments_faq.q1.question"),
      answer: t("appointments_faq.q1.answer"),
    },
    {
      question: t("appointments_faq.q2.question"),
      answer: t("appointments_faq.q2.answer"),
    },
    {
      question: t("appointments_faq.q3.question"),
      answer: t("appointments_faq.q3.answer"),
    },
    {
      question: t("appointments_faq.q4.question"),
      answer: t("appointments_faq.q4.answer"),
    },
    {
      question: t("appointments_faq.q5.question"),
      answer: t("appointments_faq.q5.answer"),
    },
    {
      question: t("appointments_faq.q6.question"),
      answer: t("appointments_faq.q6.answer"),
    },
    {
      question: t("appointments_faq.q7.question"),
      answer: t("appointments_faq.q7.answer"),
    },
    {
      question: t("appointments_faq.q8.question"),
      answer: t("appointments_faq.q8.answer"),
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("appointments_faq.title")} <span className="text-green-600">{t("appointments_faq.title_highlight")}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("appointments_faq.subtitle")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">{t("appointments_faq.need_more_help")}</p>
          <div className="inline-flex items-center justify-center bg-green-50 rounded-full px-6 py-3">
            <span className="text-green-800 font-medium">{t("appointments_faq.contact_us_text")}</span>
            <a href="tel:+250788123456" className="ml-2 text-green-600 font-bold hover:underline">
              +250 788 123 456
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
