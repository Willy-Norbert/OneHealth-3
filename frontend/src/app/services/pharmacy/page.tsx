"use client";
import PharmacyHero from "@/components/services/pharmacy/pharmacy-hero"
import PharmacyFeatures from "@/components/services/pharmacy/pharmacy-features"
import PharmacyHowItWorks from "@/components/services/pharmacy/pharmacy-how-it-works"
import PharmacyPartners from "@/components/services/pharmacy/pharmacy-partners"
import PharmacyProducts from "@/components/services/pharmacy/pharmacy-products"
import PharmacyDelivery from "@/components/services/pharmacy/pharmacy-delivery"
import PharmacyTestimonials from "@/components/services/pharmacy/pharmacy-testimonials"
import PharmacyFaq from "@/components/services/pharmacy/pharmacy-faq"
import PharmacyCta from "@/components/services/pharmacy/pharmacy-cta"
import DefaultLayout from "@/components/layouts/DefaultLayout"

export default function PharmacyPage() {
  return (
    <DefaultLayout>
    <main className="min-h-screen bg-white">
      <PharmacyHero />
      <PharmacyFeatures />
      <PharmacyHowItWorks />
      <PharmacyPartners />
      <PharmacyProducts />
      <PharmacyDelivery />
      <PharmacyTestimonials />
      <PharmacyFaq />
      <PharmacyCta />

    </main>
    </DefaultLayout>
  )
}
