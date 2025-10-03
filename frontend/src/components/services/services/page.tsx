import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"
import ServicesHero from "@/components/services/services-hero"
import ServicesOverview from "@/components/services/services-overview"
import TeleconsultationService from "@/components/services/teleconsultation-service"
import AppointmentService from "@/components/services/appointment-service"
import EmergencyService from "@/components/services/emergency-service"
import PharmacyService from "@/components/services/pharmacy-service"
import AiDoctorService from "@/components/services/ai-doctor-service"
import HowItWorks from "@/components/services/how-it-works"
import ServicesPricing from "@/components/services/services-pricing"
import ServicesFaq from "@/components/services/services-faq"
import ServicesCta from "@/components/services/services-cta"

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ServicesHero />
      <ServicesOverview />
      <TeleconsultationService />
      <AppointmentService />
      <EmergencyService />
      <PharmacyService />
      <AiDoctorService />
      <HowItWorks />
      <ServicesPricing />
      <ServicesFaq />
      <ServicesCta />
      <Footer />
    </main>
  )
}
