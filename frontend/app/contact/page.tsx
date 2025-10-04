"use client";
import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"
import ContactHero from "@/components/contact/contact-hero"
import ContactForm from "@/components/contact/contact-form"
import ContactInfo from "@/components/contact/contact-info"
import ContactLocations from "@/components/contact/contact-locations"
import ContactFaq from "@/components/contact/contact-faq"
import ContactCta from "@/components/contact/contact-cta"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <ContactHero />
      <ContactForm />
      <ContactInfo />
      <ContactLocations />
      <ContactFaq />
      <ContactCta />
      <Footer />
    </main>
  )
}
