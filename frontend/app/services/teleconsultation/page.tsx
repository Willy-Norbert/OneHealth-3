import TeleconsultationHero from "@/components/services/teleconsultation/teleconsultation-hero"
import TeleconsultationFeatures from "@/components/services/teleconsultation/teleconsultation-features"
import TeleconsultationHowItWorks from "@/components/services/teleconsultation/teleconsultation-how-it-works"
import TeleconsultationSpecialties from "@/components/services/teleconsultation/teleconsultation-specialties"
import TeleconsultationPricing from "@/components/services/teleconsultation/teleconsultation-pricing"
import TeleconsultationTestimonials from "@/components/services/teleconsultation/teleconsultation-testimonials"
import TeleconsultationFaq from "@/components/services/teleconsultation/teleconsultation-faq"
import TeleconsultationCta from "@/components/services/teleconsultation/teleconsultation-cta"
import DefaultLayout from "@/components/layouts/DefaultLayout"

export default function TeleconsultationPage() {
  return (
    <DefaultLayout>  
      <TeleconsultationHero />
      <TeleconsultationFeatures />
      <TeleconsultationHowItWorks />
      <TeleconsultationSpecialties />
      <TeleconsultationPricing />
      <TeleconsultationTestimonials />
      <TeleconsultationFaq />
      <TeleconsultationCta />
    </DefaultLayout>
  )
}
