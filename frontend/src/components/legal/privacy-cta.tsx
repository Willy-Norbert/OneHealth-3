import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrivacyCTA() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-gray-900">
            Have questions about our privacy practices?
          </h2>
          <p className="text-gray-600 max-w-[700px] mx-auto">
            Our team is here to help you understand how we protect your information and answer any questions you may
            have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              <Link href="/faq">View FAQs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
