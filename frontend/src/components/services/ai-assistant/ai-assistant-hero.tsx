 
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AiAssistantHero() {
  return (
    <section className="relative bg-gradient-to-r from-teal-600 to-teal-800 py-20 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <svg className="h-full w-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">AI Health Assistant</h1>
              <p className="text-xl mb-8 text-teal-100">
                Your personal health companion powered by advanced artificial intelligence. Get instant health guidance,
                symptom assessment, and wellness recommendations anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-teal-800 hover:bg-teal-100" asChild>
                  <Link href="#demo">Try AI Assistant Now</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-teal-800"
                  asChild
                >
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-teal-400 rounded-full opacity-50"></div>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-teal-400 rounded-full opacity-50"></div>
              <div className="bg-white p-6 rounded-xl shadow-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" x2="12" y1="19" y2="22"></line>
                    </svg>
                  </div>
                  <h3 className="text-teal-800 font-bold text-lg">AI Health Assistant</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-gray-700">Hello! I'm your AI Health Assistant. How can I help you today?</p>
                  </div>
                  <div className="bg-teal-100 p-3 rounded-lg ml-6">
                    <p className="text-teal-800">I've been having headaches and feeling tired lately.</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-gray-700">
                      I'm sorry to hear that. Let me ask you a few questions to better understand your symptoms. How
                      long have you been experiencing these headaches?
                    </p>
                  </div>
                  <div className="bg-teal-100 p-3 rounded-lg ml-6">
                    <p className="text-teal-800">For about a week now.</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-gray-700">
                      Thank you. Can you describe the pain? Is it constant or does it come and go?
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button className="bg-teal-600 text-white p-2 rounded-r-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <h3 className="text-3xl font-bold mb-2">24/7</h3>
            <p className="text-teal-100">Always Available</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-2">98%</h3>
            <p className="text-teal-100">Accuracy Rate</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-2">50K+</h3>
            <p className="text-teal-100">Monthly Users</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-2">10+</h3>
            <p className="text-teal-100">Languages</p>
          </div>
        </div>
      </div>
    </section>
  )
}
