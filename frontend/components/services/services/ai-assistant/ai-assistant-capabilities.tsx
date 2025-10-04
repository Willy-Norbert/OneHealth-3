import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AiAssistantCapabilities() {
  const capabilities = [
    {
      id: "symptom-analysis",
      title: "Symptom Analysis",
      description: "Our AI can analyze your symptoms and provide preliminary insights based on medical knowledge.",
      features: [
        "Comprehensive symptom assessment",
        "Follow-up questions for clarity",
        "Potential condition suggestions",
        "Severity assessment",
        "Personalized recommendations",
        "Medical referrals when necessary",
      ],
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
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
          <path d="M9 12h6"></path>
          <path d="M12 9v6"></path>
        </svg>
      ),
    },
    {
      id: "health-education",
      title: "Health Education",
      description:
        "Access a vast library of health information, medical conditions, treatments, and preventive measures.",
      features: [
        "Evidence-based health information",
        "Condition explanations in simple language",
        "Treatment options overview",
        "Medication information",
        "Preventive health measures",
        "Health tips and best practices",
      ],
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
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
        </svg>
      ),
    },
    {
      id: "wellness-coaching",
      title: "Wellness Coaching",
      description: "Receive personalized guidance for improving your overall health and wellness.",
      features: [
        "Nutrition advice and meal planning",
        "Exercise recommendations",
        "Sleep improvement strategies",
        "Stress management techniques",
        "Mental wellness support",
        "Habit formation guidance",
      ],
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      id: "service-integration",
      title: "Service Integration",
      description: "Seamlessly connect with other ONE HEALTHLINE CONNECT services based on your needs.",
      features: [
        "Appointment scheduling",
        "Teleconsultation initiation",
        "Medication ordering",
        "Emergency service access",
        "Health record integration",
        "Follow-up reminders",
      ],
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
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
          <line x1="3" x2="21" y1="9" y2="9"></line>
          <line x1="9" x2="9" y1="21" y2="9"></line>
        </svg>
      ),
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Assistant Capabilities</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the powerful capabilities of our AI Health Assistant designed to support your health journey.
          </p>
        </div>

        <Tabs defaultValue="symptom-analysis" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-gray-100 p-1 rounded-lg mb-8">
            {capabilities.map((capability) => (
              <TabsTrigger
                key={capability.id}
                value={capability.id}
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
              >
                <div className="flex items-center gap-2">
                  <span className="hidden md:inline-block">{capability.icon}</span>
                  <span>{capability.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {capabilities.map((capability) => (
            <TabsContent key={capability.id} value={capability.id} className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gray-50 rounded-lg p-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {capability.icon}
                    <h3 className="text-2xl font-bold text-gray-900">{capability.title}</h3>
                  </div>
                  <p className="text-lg text-gray-700 mb-6">{capability.description}</p>
                  <ul className="space-y-3">
                    {capability.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
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
                          className="text-teal-600 mt-1"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  {capability.id === "symptom-analysis" && (
                    <div className="space-y-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-gray-700">I&apos;ve been having chest pain when I exercise.</p>
                      </div>
                      <div className="bg-teal-100 p-3 rounded-lg">
                        <p className="text-teal-800">
                          I understand you&apos;re experiencing chest pain during exercise. This could be concerning. I need
                          to ask you a few important questions:
                        </p>
                        <ul className="mt-2 space-y-1 text-teal-800">
                          <li>• How would you describe the pain? (Sharp, dull, pressure, etc.)</li>
                          <li>• Does it radiate to other areas like your arm or jaw?</li>
                          <li>• How long does the pain last?</li>
                          <li>• Do you have any history of heart problems?</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {capability.id === "health-education" && (
                    <div className="space-y-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-gray-700">What is hypertension and how can I prevent it?</p>
                      </div>
                      <div className="bg-teal-100 p-3 rounded-lg">
                        <p className="text-teal-800">
                          <strong>Hypertension (High Blood Pressure)</strong>
                        </p>
                        <p className="mt-2 text-teal-800">
                          Hypertension is when your blood pressure is consistently too high. Normal blood pressure is
                          below 120/80 mmHg. Hypertension is 130/80 mmHg or higher.
                        </p>
                        <p className="mt-2 text-teal-800">
                          <strong>Prevention strategies:</strong>
                        </p>
                        <ul className="mt-1 space-y-1 text-teal-800">
                          <li>• Maintain a healthy weight</li>
                          <li>• Exercise regularly (150 minutes/week)</li>
                          <li>• Reduce sodium intake (less than 2,300mg daily)</li>
                          <li>• Limit alcohol consumption</li>
                          <li>• Manage stress effectively</li>
                          <li>• Quit smoking</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {capability.id === "wellness-coaching" && (
                    <div className="space-y-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-gray-700">I want to improve my sleep quality. Any suggestions?</p>
                      </div>
                      <div className="bg-teal-100 p-3 rounded-lg">
                        <p className="text-teal-800">
                          <strong>Sleep Improvement Plan</strong>
                        </p>
                        <ul className="mt-2 space-y-2 text-teal-800">
                          <li>
                            <strong>1. Consistent Schedule:</strong>
                            <p>Go to bed and wake up at the same time daily, even on weekends.</p>
                          </li>
                          <li>
                            <strong>2. Bedtime Routine:</strong>
                            <p>Develop a relaxing 30-minute routine before bed (reading, gentle stretching, etc.)</p>
                          </li>
                          <li>
                            <strong>3. Optimize Environment:</strong>
                            <p>Keep your bedroom dark, quiet, and cool (65-68°F/18-20°C)</p>
                          </li>
                          <li>
                            <strong>4. Limit Screen Time:</strong>
                            <p>Avoid screens 1 hour before bedtime</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {capability.id === "service-integration" && (
                    <div className="space-y-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-gray-700">
                          Based on your symptoms, I recommend consulting with a cardiologist. Would you like me to help
                          you schedule an appointment?
                        </p>
                      </div>
                      <div className="bg-teal-100 p-3 rounded-lg">
                        <p className="text-teal-800">Yes, please help me book an appointment.</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-gray-700">
                          I can help you book with Dr. Mugisha, cardiologist, with the following available slots:
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <button className="bg-white border border-teal-600 text-teal-600 p-2 rounded text-sm">
                            Tomorrow, 10:00 AM
                          </button>
                          <button className="bg-white border border-teal-600 text-teal-600 p-2 rounded text-sm">
                            Tomorrow, 2:30 PM
                          </button>
                          <button className="bg-white border border-teal-600 text-teal-600 p-2 rounded text-sm">
                            Friday, 9:15 AM
                          </button>
                          <button className="bg-white border border-teal-600 text-teal-600 p-2 rounded text-sm">
                            Friday, 3:45 PM
                          </button>
                        </div>
                        <p className="mt-2 text-gray-700">
                          Or would you prefer a teleconsultation within the next hour?
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
