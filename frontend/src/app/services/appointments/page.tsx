
// app\services\appointments\page.tsx
import AppointmentsHero from "@/components/services/appointments/appointments-hero"
import AppointmentsFeatures from "@/components/services/appointments/appointments-features"
import AppointmentsHowItWorks from "@/components/services/appointments/appointments-how-it-works"
import AppointmentsTypes from "@/components/services/appointments/appointments-types"
import AppointmentsLocations from "@/components/services/appointments/appointments-locations"
import AppointmentsTestimonials from "@/components/services/appointments/appointments-testimonials"
import AppointmentsFaq from "@/components/services/appointments/appointments-faq"
import AppointmentsCta from "@/components/services/appointments/appointments-cta"
import DefaultLayout from "@/components/layouts/DefaultLayout"

export default function AppointmentsPage() {
  return (
    <DefaultLayout>
    <main className="min-h-screen bg-white">

      <AppointmentsHero />
      <AppointmentsFeatures />
      <AppointmentsHowItWorks />
      <AppointmentsTypes />
      <AppointmentsLocations />
      <AppointmentsTestimonials />
      <AppointmentsFaq />
      <AppointmentsCta />
    </main>
    </DefaultLayout>
  )
}
