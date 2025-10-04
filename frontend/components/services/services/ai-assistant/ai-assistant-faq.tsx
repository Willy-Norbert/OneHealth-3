import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function AiAssistantFaq() {
  const faqs = [
    {
      question: "How accurate is the AI Health Assistant?",
      answer:
        "Our AI Health Assistant has been trained on extensive medical data and validated by healthcare professionals. It achieves over 90% accuracy in preliminary assessments. However, it's designed to complement, not replace, professional medical advice. For serious health concerns, we always recommend consulting with a healthcare provider.",
    },
    {
      question: "Is my health data secure when using the AI Assistant?",
      answer:
        "Absolutely. We take data security and privacy very seriously. All communications with our AI Health Assistant are encrypted end-to-end. Your health data is stored securely following international standards and GDPR compliance. We never share your personal health information with third parties without your explicit consent.",
    },
    {
      question: "Can the AI Assistant prescribe medication?",
      answer:
        "No, the AI Health Assistant cannot prescribe medication. It can provide general information about medications and remind you to take prescribed medications, but only licensed healthcare professionals can prescribe medicines. The AI can help connect you with a doctor for prescription needs.",
    },
    {
      question: "What languages does the AI Health Assistant support?",
      answer:
        "Currently, our AI Health Assistant supports English, Kinyarwanda, and French. We're working on adding more languages to better serve all communities in Rwanda and the broader region.",
    },
    {
      question: "Can I use the AI Assistant without internet connection?",
      answer:
        "The core functionality of the AI Health Assistant requires an internet connection to process your queries. However, we've implemented a basic offline mode that provides access to previously downloaded health information and medication reminders even when you're offline.",
    },
    {
      question: "How does the AI Assistant handle emergency situations?",
      answer:
        "The AI Health Assistant is programmed to recognize potential emergency situations. If it detects signs of a medical emergency, it will immediately prompt you to call emergency services (912) and provide basic first aid guidance while you wait for help. Always call emergency services directly in critical situations.",
    },
    {
      question: "Can the AI Assistant monitor my health conditions over time?",
      answer:
        "Yes, the AI Health Assistant can help monitor chronic conditions by allowing you to log symptoms, medication adherence, vital signs, and other health metrics. It can show trends over time and alert you to significant changes that might require medical attention.",
    },
    {
      question: "Is there a cost to use the AI Health Assistant?",
      answer:
        "The basic version of our AI Health Assistant is available free of charge to all ONE HEALTHLINE CONNECT users. We also offer a premium version with additional features like unlimited specialist consultations, priority response, and advanced health tracking for a monthly subscription fee.",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to common questions about our AI Health Assistant.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 hover:text-teal-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-4">
            Still have questions about our AI Health Assistant?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-md hover:bg-gray-50 transition duration-300">
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
                className="mr-2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Chat with Support
            </button>
            <button className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-md hover:bg-gray-50 transition duration-300">
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
                className="mr-2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
