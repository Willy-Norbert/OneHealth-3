"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ContactForm() {
  const { t } = useLanguage()

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    department: "general",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      setTimeout(() => {
        setIsSubmitted(false)
        setFormState({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          department: "general",
        })
      }, 3000)
    }, 1500)
  }

  const required = <span className="text-red-500">{t("contactForm.required")}</span>
  const privacyPolicyLink = (
    <a href="/privacy" className="text-green-600 hover:underline">
      {t("contactForm.privacyPolicy")}
    </a>
  )

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t("contactForm.heading")}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t("contactForm.description")}</p>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
          <div className="p-8">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t("contactForm.successTitle")}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">{t("contactForm.successMessage")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {t("contactForm.labels.name")} {required}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      placeholder={t("contactForm.placeholders.name")}
                      required
                      className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {t("contactForm.labels.email")} {required}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder={t("contactForm.placeholders.email")}
                      required
                      className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {t("contactForm.labels.phone")}
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formState.phone}
                      onChange={handleChange}
                      placeholder={t("contactForm.placeholders.phone")}
                      className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {t("contactForm.labels.department")}
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formState.department}
                      onChange={handleChange}
                      className="w-full h-10 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="general">{t("contactForm.departments.general")}</option>
                      <option value="appointments">{t("contactForm.departments.appointments")}</option>
                      <option value="billing">{t("contactForm.departments.billing")}</option>
                      <option value="technical">{t("contactForm.departments.technical")}</option>
                      <option value="feedback">{t("contactForm.departments.feedback")}</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    {t("contactForm.labels.subject")} {required}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    placeholder={t("contactForm.placeholders.subject")}
                    required
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    {t("contactForm.labels.message")} {required}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder={t("contactForm.placeholders.message")}
                    required
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 min-h-[150px]"
                  />
                </div>

                <div className="flex items-center mb-6">
                  <input
                    id="privacy"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-green-600 dark:text-green-400 focus:ring-green-500 border-gray-300 dark:border-gray-500 rounded"
                  />
                  <label htmlFor="privacy" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                    {t("contactForm.labels.privacy")} {privacyPolicyLink}
                  </label>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("contactForm.sending")}
                    </>
                  ) : (
                    t("contactForm.sendMessage")
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
