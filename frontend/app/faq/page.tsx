import type { Metadata } from "next"
import FaqHero from "@/components/faq/faq-hero"
import FaqCategories from "@/components/faq/faq-categories"
import FaqSearch from "@/components/faq/faq-search"
import FaqAccordion from "@/components/faq/faq-accordion"
import FaqContact from "@/components/faq/faq-contact"
import FaqCTA from "@/components/faq/faq-cta"
import DefaultLayout from "@/components/layouts/DefaultLayout"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | ONE HEALTHLINE CONNECT",
  description: "Find answers to common questions about ONE HEALTHLINE CONNECT's services, appointments, payments, and more.",
}

export default function FaqPage() {
  return (
    <DefaultLayout>
    <main className="flex flex-col min-h-screen">
      <FaqHero />
      <FaqSearch />
      <FaqCategories />
      <FaqAccordion />
      <FaqContact />
      <FaqCTA />
    </main>
    </DefaultLayout>
  )
}
