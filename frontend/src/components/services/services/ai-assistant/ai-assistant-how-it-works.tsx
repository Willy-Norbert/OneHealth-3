export default function AiAssistantHowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Start a Conversation",
      description:
        "Begin chatting with our AI Health Assistant through the app or website. No registration required to get started.",
      icon: (
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
          className="text-teal-600"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
    },
    {
      number: "02",
      title: "Describe Your Symptoms",
      description:
        "Tell the AI about your symptoms, health concerns, or ask health-related questions in natural language.",
      icon: (
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
          className="text-teal-600"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" x2="12" y1="8" y2="12"></line>
          <line x1="12" x2="12.01" y1="16" y2="16"></line>
        </svg>
      ),
    },
    {
      number: "03",
      title: "Answer Follow-up Questions",
      description:
        "The AI will ask relevant questions to better understand your situation and gather necessary information.",
      icon: (
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
          className="text-teal-600"
        >
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
      ),
    },
    {
      number: "04",
      title: "Receive Health Insights",
      description: "Get personalized health information, potential causes of symptoms, and recommended next steps.",
      icon: (
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
          className="text-teal-600"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
    },
    {
      number: "05",
      title: "Connect with Healthcare Providers",
      description: "If needed, the AI can help you book an appointment with a doctor or start a teleconsultation.",
      icon: (
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
          className="text-teal-600"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
    },
  ]

  return (
    <section className="py-16 bg-gray-50" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How the AI Health Assistant Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI Health Assistant uses advanced natural language processing and medical knowledge to provide
            personalized health guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-bold text-teal-600 mr-2">{step.number}</span>
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-teal-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-teal-400 rounded-full opacity-20"></div>
              <div className="bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center mr-3">
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
                    <p className="text-gray-700">
                      Based on your symptoms of headaches and fatigue for the past week, there are several possible
                      causes. Let me ask you a few more questions.
                    </p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-gray-700">Are you experiencing any sensitivity to light or sound?</p>
                  </div>
                  <div className="bg-teal-100 p-3 rounded-lg ml-6">
                    <p className="text-teal-800">Yes, bright lights make the headache worse.</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-gray-700">
                      Thank you. Have you noticed any changes in your sleep pattern or stress levels recently?
                    </p>
                  </div>
                  <div className="bg-teal-100 p-3 rounded-lg ml-6">
                    <p className="text-teal-800">I&apos;ve been sleeping less due to work deadlines.</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-gray-700">
                      Based on your symptoms, you may be experiencing tension headaches or migraines, possibly triggered
                      by stress and lack of sleep. Would you like me to suggest some self-care measures or connect you
                      with a healthcare provider?
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-teal-600 text-white p-2 rounded-md">Self-care Tips</button>
                  <button className="flex-1 bg-teal-800 text-white p-2 rounded-md">See a Doctor</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
