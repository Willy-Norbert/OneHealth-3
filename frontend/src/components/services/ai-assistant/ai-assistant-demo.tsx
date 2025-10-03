"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function AiAssistantDemo() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI Health Assistant. How can I help you today?",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Predefined responses for demo purposes
  const demoResponses = {
    headache:
      "I'm sorry to hear you're experiencing a headache. To better understand your situation, could you tell me:\n\n1. How long have you had this headache?\n2. How would you rate the pain on a scale of 1-10?\n3. Have you taken any medication for it?",

    diabetes:
      "Diabetes is a chronic condition that affects how your body turns food into energy. There are three main types: Type 1, Type 2, and gestational diabetes.\n\nKey management strategies include:\n• Regular blood sugar monitoring\n• Balanced diet\n• Regular physical activity\n• Medication as prescribed\n• Regular check-ups\n\nWould you like more specific information about any of these aspects?",

    exercise:
      "Regular exercise is crucial for maintaining good health. For adults, the recommendation is:\n\n• At least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity weekly\n• Muscle-strengthening activities 2+ days per week\n\nSome beginner-friendly exercises include walking, swimming, and cycling. Would you like me to suggest a simple exercise plan based on your fitness level?",

    appointment:
      "I'd be happy to help you schedule an appointment. Could you please specify:\n\n1. What type of healthcare provider you need to see?\n2. Is this for a new issue or a follow-up?\n3. Do you prefer a specific location or doctor?\n4. What days/times work best for you?\n\nOnce you provide these details, I can help you find available appointments.",

    covid:
      "COVID-19 symptoms may include fever, cough, fatigue, loss of taste or smell, sore throat, headache, and body aches.\n\nIf you're experiencing symptoms:\n• Get tested\n• Self-isolate until you receive results\n• Rest and stay hydrated\n• Monitor your symptoms\n\nSeek immediate medical attention if you experience difficulty breathing, persistent chest pain, confusion, or bluish lips or face.",
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = { role: "user", content: inputValue }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let response =
        "I understand your concern. To provide better assistance, could you provide more details about your situation?"

      // Check for keywords in the input
      const lowercaseInput = inputValue.toLowerCase()
      for (const [keyword, reply] of Object.entries(demoResponses)) {
        if (lowercaseInput.includes(keyword)) {
          response = reply
          break
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <section className="py-16 bg-gray-50" id="demo">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Try Our AI Health Assistant</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of our AI Health Assistant with this interactive demo. Ask health questions, describe
            symptoms, or explore health topics.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-teal-600 p-4 text-white">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
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
                  <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              </div>
              <h3 className="font-bold text-lg">ONE HEALTHLINE CONNECT AI Assistant</h3>
            </div>
            <p className="mt-2 text-sm text-teal-100">
              This is a demo. In a real conversation, our AI would provide personalized health guidance based on your
              inputs.
            </p>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user" ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your health question or concern..."
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
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
              </Button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 mr-2">Try asking about:</span>
              <button
                onClick={() => setInputValue("I have a headache that won't go away")}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-700"
              >
                Headache symptoms
              </button>
              <button
                onClick={() => setInputValue("Tell me about diabetes management")}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-700"
              >
                Diabetes information
              </button>
              <button
                onClick={() => setInputValue("What exercise should I do to stay healthy?")}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-700"
              >
                Exercise recommendations
              </button>
              <button
                onClick={() => setInputValue("I need to book an appointment")}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-700"
              >
                Book appointment
              </button>
              <button
                onClick={() => setInputValue("What are the symptoms of COVID-19?")}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-700"
              >
                COVID-19 symptoms
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            This is a demonstration of our AI Health Assistant. The full version provides more comprehensive health
            guidance and integrates with all ONE HEALTHLINE CONNECT services.
          </p>
        </div>
      </div>
    </section>
  )
}
