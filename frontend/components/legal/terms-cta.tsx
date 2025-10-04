import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TermsCTA() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-gray-900">
            Have questions about our terms?
          </h2>
          <p className="text-gray-600 max-w-[700px] mx-auto">
            Our legal team is available to help clarify any aspects of our Terms of Service that you may have questions
            about.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button asChild className="bg-blue-700 hover:bg-blue-800">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50">
              <Link href="/privacy-policy">Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
