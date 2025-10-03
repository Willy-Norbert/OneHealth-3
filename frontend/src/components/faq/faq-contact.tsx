import { Mail, Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FaqContact() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Didn&apos;t find what you&apos;re looking for?</h2>
          <p className="text-gray-600 mb-8">
            Our support team is here to help. Contact us through any of these channels:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">Email Us</h3>
              <p className="text-gray-500 text-sm mb-4">Get a response within 24 hours</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="mailto:support@healthlinerwanda.com">support@healthlinerwanda.com</Link>
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">Call Us</h3>
              <p className="text-gray-500 text-sm mb-4">Available 24/7 for assistance</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="tel:+250788123456">+250 788 123 456</Link>
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">Live Chat</h3>
              <p className="text-gray-500 text-sm mb-4">Chat with our support team</p>
              <Button className="w-full bg-green-600 hover:bg-green-700">Start Chat</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
