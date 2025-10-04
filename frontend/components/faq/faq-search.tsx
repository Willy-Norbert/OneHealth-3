import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function FaqSearch() {
  return (
    <section className="py-12 bg-white">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for answers..."
              className="pl-10 py-6 text-base rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700">
              Search
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Popular searches: appointments, teleconsultation, payments, medication
          </p>
        </div>
      </div>
    </section>
  )
}
