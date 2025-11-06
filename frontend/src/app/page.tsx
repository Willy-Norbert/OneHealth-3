import Navbar from "@/components/layouts/navbar"
import Hero from "@/components/hero"
import ServiceCards from "@/components/services/service-cards"
import DepartmentSection from "@/components/department-section"
import StatsSection from "@/components/stats-section"
import TestimonialsSection from "@/components/testimonials-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/layouts/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <div className="relative overflow-hidden">
        <Hero />
        <ServiceCards />
        <DepartmentSection />
        <StatsSection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  )
}

