"use client";
import EmergencyHero from "@/components/services/emergency/emergency-hero"
import EmergencyFeatures from "@/components/services/emergency/emergency-features"
import EmergencyHowItWorks from "@/components/services/emergency/emergency-how-it-works"
import EmergencyTypes from "@/components/services/emergency/emergency-types"
import EmergencyLocations from "@/components/services/emergency/emergency-locations"
import EmergencyTestimonials from "@/components/services/emergency/emergency-testimonials"
import EmergencyFaq from "@/components/services/emergency/emergency-faq"
import EmergencyCta from "@/components/services/emergency/emergency-cta"
import DefaultLayout from "@/components/layouts/DefaultLayout"

export default function EmergencyPage() {
  return (
    <DefaultLayout>
    <main className="min-h-screen bg-white">

      <EmergencyHero />
      <EmergencyFeatures />
      <EmergencyHowItWorks />
      <EmergencyTypes />
      <EmergencyLocations />
      <EmergencyTestimonials />
      <EmergencyFaq />
      <EmergencyCta />
      
    </main>
    </DefaultLayout>
  )
}
