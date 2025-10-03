"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function AppointmentFaq() {
  const faqs = [
    {
      question: "How do I schedule an appointment?",
      answer:
        "You can schedule an appointment through our website or mobile app. Simply select the type of appointment you need, choose a healthcare provider, select a convenient date and time, and fill out the required information. Once confirmed, you'll receive a confirmation via email and SMS.",
    },
    {
      question: "Can I reschedule or cancel my appointment?",
      answer:
        "Yes, you can reschedule or cancel your appointment up to 6 hours before the scheduled time without any penalty. To do so, log in to your account, go to 'Your Appointments', select the appointment you wish to change, and click on 'Reschedule' or 'Cancel'.",
    },
    {
      question: "What's the difference between virtual and in-person appointments?",
      answer:
        "Virtual appointments are conducted via video call through our platform, allowing you to consult with healthcare providers from anywhere. In-person appointments require you to visit the healthcare facility at the scheduled time. Both types provide quality care, but the choice depends on your preference and medical needs.",
    },
    {
      question: "How long do appointments typically last?",
      answer:
        "Initial consultations typically last 30 minutes, while follow-up appointments are usually 15-20 minutes. Specialist consultations may vary in length depending on the specialty and complexity of your case. The estimated duration will be shown when you book your appointment.",
    },
    {
      question: "What should I do if I'm running late for my appointment?",
      answer:
        "If you're running late for an in-person appointment, please call the healthcare facility directly to inform them. For virtual appointments, you can join the video call late, but please note that the appointment will still end at the scheduled time to avoid delays for other patients.",
    },
    {
      question: "Do I need to prepare anything for my virtual appointment?",
      answer:
        "For virtual appointments, ensure you have a stable internet connection, a quiet environment, good lighting, and a charged device. Have any relevant medical records or information ready, and prepare a list of symptoms or questions you want to discuss. Test your camera and microphone before the appointment starts.",
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">
            Find answers to common questions about our appointment booking process and policies
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "shadow-md" : "shadow-sm"
                }`}
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
