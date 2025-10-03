import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"
import AppointmentsHero from "@/components/appointments/appointments-hero"
import AppointmentTypes from "@/components/appointments/appointment-types"
import DoctorSelection from "@/components/appointments/doctor-selection"
import AppointmentForm from "@/components/appointments/appointment-form"
import AppointmentHistory from "@/components/appointments/appointment-history"
import AppointmentFaq from "@/components/appointments/appointment-faq"
import AppointmentCta from "@/components/appointments/appointment-cta"

export default function AppointmentsPage() {
  return (
    <main className="min-h-screen  m-10 bg-white">
      <Navbar />
      <AppointmentsHero />
      <AppointmentTypes />
      <DoctorSelection />
      <AppointmentForm />
      <AppointmentHistory />
      <AppointmentFaq />
      <AppointmentCta />
      <Footer />
    </main>
  )
}
