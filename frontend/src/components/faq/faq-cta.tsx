import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FaqCTA() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-green-600 to-blue-700">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-white">
            Ready to experience better healthcare?
          </h2>
          <p className="text-white/90 max-w-[700px] mx-auto">
            Join thousands of Rwandans who trust ONE HEALTHLINE CONNECT for their healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button asChild className="bg-white text-green-700 hover:bg-white/90">
              <Link href="/appointments">Book an Appointment</Link>
            </Button>
            <Button asChild variant="outline" className="text-white border-white hover:bg-white/10">
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
