export default function AiAssistantCta() {
  return (
    <section className="py-16 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience the Future of Healthcare Today</h2>
              <p className="text-lg md:text-xl opacity-90 mb-6">
                Get instant health guidance, personalized recommendations, and peace of mind with our AI Health
                Assistant. Available 24/7, wherever you are in Rwanda.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-teal-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-md transition duration-300">
                  Try AI Assistant Now
                </button>
                <button className="bg-transparent border-2 border-white hover:bg-white/10 font-semibold py-3 px-6 rounded-md transition duration-300">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
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
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.29 7 12 12 20.71 7" />
                      <line x1="12" y1="22" x2="12" y2="12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">AI Health Assistant</h3>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 mt-1 text-teal-200"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>24/7 health guidance</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 mt-1 text-teal-200"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Symptom assessment</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 mt-1 text-teal-200"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Medication reminders</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 mt-1 text-teal-200"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Health tracking</span>
                  </li>
                </ul>
                <button className="w-full bg-white text-teal-600 hover:bg-gray-100 font-semibold py-2 px-4 rounded-md transition duration-300">
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
