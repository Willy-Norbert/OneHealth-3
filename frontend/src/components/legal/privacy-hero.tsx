import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyHero() {
  return (
    <section className="bg-gradient-to-r from-green-600 to-blue-700 py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">Privacy Policy</h1>
          <p className="text-xl text-white/90 max-w-[700px] mx-auto">
            Our commitment to protecting your privacy and personal information
          </p>
          <p className="text-white/80 max-w-[600px]">Last Updated: May 12, 2025</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button className="bg-white text-green-700 hover:bg-white/90">Download PDF</Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Contact Us <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
