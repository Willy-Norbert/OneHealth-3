import MyAppointments from "@/components/appointments/my-appointments"
import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"

export default function MyAppointmentsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12">
        <MyAppointments />
      </div>
      <Footer />
    </main>
  )
}