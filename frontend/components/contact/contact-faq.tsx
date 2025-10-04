"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ContactFaq() {
  const { t } = useLanguage()

  const faqs = [
    {
      question: t("faq2.items.0.question"),
      answer: t("faq2.items.0.answer"),
    },
    {
      question: t("faq2.items.1.question"),
      answer: t("faq2.items.1.answer"),
    },
    {
      question: t("faq2.items.2.question"),
      answer: t("faq2.items.2.answer"),
    },
    {
      question: t("faq2.items.3.question"),
      answer: t("faq2.items.3.answer"),
    },
    {
      question: t("faq2.items.4.question"),
      answer: t("faq2.items.4.answer"),
    },
    {
      question: t("faq2.items.5.question"),
      answer: t("faq2.items.5.answer"),
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t("faq2.heading")}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t("faq2.description")}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
                  openIndex === index ? "shadow-md dark:shadow-lg" : "shadow-sm dark:shadow-sm"
                }`}
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
