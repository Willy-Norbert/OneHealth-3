"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ContactSection() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("contact.title", "Contact Us")}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            {t(
              "contact.description",
              "Have questions or need assistance? Our team is here to help you with any inquiries."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t("contact.form.title", "Send us a message")}</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t("contact.form.name_label", "Full Name")}
                  </label>
                  <Input id="name" placeholder={t("contact.form.name_placeholder", "Your name")} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t("contact.form.email_label", "Email Address")}
                  </label>
                  <Input id="email" type="email" placeholder={t("contact.form.email_placeholder", "Your email")} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("contact.form.subject_label", "Subject")}
                </label>
                <Input id="subject" placeholder={t("contact.form.subject_placeholder", "How can we help you?")} />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("contact.form.message_label", "Message")}
                </label>
                <Textarea
                  id="message"
                  placeholder={t("contact.form.message_placeholder", "Your message")}
                  rows={20}
                  className="md:min-h-60"
                />
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                {t("contact.form.send_button", "Send Message")}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col">
            <div className="bg-blue-600 dark:bg-blue-800 text-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold mb-6">{t("contact.info.title", "Contact Information")}</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-500/30 dark:bg-blue-400/20 p-3 rounded-lg mr-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium">{t("contact.info.location.title", "Our Location")}</h4>
                    <p className="text-white/80">{t("contact.info.location.address", "KG 123 St, Kigali, Rwanda")}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-500/30 dark:bg-blue-400/20 p-3 rounded-lg mr-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium">{t("contact.info.phone.title", "Phone Number")}</h4>
                    <p className="text-white/80">{t("contact.info.phone.main", "+250 788 123 456")}</p>
                    <p className="text-white/80">{t("contact.info.phone.emergency", "Emergency: +250 788 999 911")}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-500/30 dark:bg-blue-400/20 p-3 rounded-lg mr-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium">{t("contact.info.email.title", "Email Address")}</h4>
                    <p className="text-white/80">{t("contact.info.email.main", "info@healthlinerwanda.com")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-600 dark:bg-green-800 text-white rounded-2xl shadow-xl p-8">
              <div className="flex items-start">
                <div className="bg-green-500/30 dark:bg-green-400/20 p-3 rounded-lg mr-4">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-lg">{t("contact.hours.title", "Working Hours")}</h4>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>{t("contact.hours.monday_friday.day", "Monday - Friday:")}</span>
                      <span>{t("contact.hours.monday_friday.time", "8:00 AM - 8:00 PM")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("contact.hours.saturday.day", "Saturday:")}</span>
                      <span>{t("contact.hours.saturday.time", "9:00 AM - 6:00 PM")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("contact.hours.sunday.day", "Sunday:")}</span>
                      <span>{t("contact.hours.sunday.time", "10:00 AM - 4:00 PM")}</span>
                    </div>
                    <div className="pt-2 text-white/80">
                      <p>{t("contact.hours.note", "* Emergency services available 24/7")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
