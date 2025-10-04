
import TeleconsultationService from "@/components/services/teleconsultation-service"
import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"

export default function TeleconsultationPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <TeleconsultationService />
      <Footer />
    </main>
  )
}
