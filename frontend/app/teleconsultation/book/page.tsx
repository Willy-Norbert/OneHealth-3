
import TeleconsultationBooking from "@/components/teleconsultation/teleconsultation-booking"
import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"

export default function BookTeleconsultationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12">
        <TeleconsultationBooking />
      </div>
      <Footer />
    </main>
  )
}
