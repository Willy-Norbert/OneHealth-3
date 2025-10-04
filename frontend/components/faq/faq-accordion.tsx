"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqData = [
  {
    category: "Appointments",
    id: "appointments",
    questions: [
      {
        question: "How do I book an appointment?",
        answer:
          "You can book an appointment through our website or mobile app. Simply navigate to the Appointments page, select your preferred doctor, choose an available date and time, fill in your details, and confirm your booking.",
      },
      {
        question: "Can I reschedule or cancel my appointment?",
        answer:
          "Yes, you can reschedule or cancel your appointment up to 24 hours before the scheduled time without any penalty. To do so, log in to your account, go to 'My Appointments', and select the reschedule or cancel option.",
      },
      {
        question: "What information do I need to provide when booking an appointment?",
        answer:
          "When booking an appointment, you'll need to provide your personal details (name, contact information), the reason for your visit, your medical history (if applicable), and your insurance information (if you plan to use insurance).",
      },
      {
        question: "How far in advance can I book an appointment?",
        answer:
          "You can book appointments up to 3 months in advance, depending on the doctor's availability. For specialized consultations, we recommend booking at least 2 weeks in advance.",
      },
    ],
  },
  {
    category: "Teleconsultation",
    id: "teleconsultation",
    questions: [
      {
        question: "What is teleconsultation?",
        answer:
          "Teleconsultation is a virtual medical consultation that allows you to speak with a healthcare provider via video call from the comfort of your home. It's convenient for follow-ups, minor health concerns, and situations where physical examination isn't necessary.",
      },
      {
        question: "What equipment do I need for a teleconsultation?",
        answer:
          "You need a device with a camera and microphone (smartphone, tablet, or computer), a stable internet connection, and our mobile app or access to our website. We recommend testing your equipment before your scheduled appointment.",
      },
      {
        question: "Are teleconsultations secure and private?",
        answer:
          "Yes, all teleconsultations are conducted through secure, encrypted connections that comply with healthcare privacy standards. Your medical information and conversation with the doctor remain confidential.",
      },
      {
        question: "Can I get a prescription through teleconsultation?",
        answer:
          "Yes, doctors can issue prescriptions during teleconsultations for appropriate conditions. The prescription will be sent to you electronically and can be used at our partner pharmacies or any pharmacy of your choice.",
      },
    ],
  },
  {
    category: "Medication",
    id: "medication",
    questions: [
      {
        question: "How can I order medication through ONE HEALTHLINE CONNECT?",
        answer:
          "You can order medication through our app or website by uploading your prescription, selecting the medications, and choosing delivery or pickup options. We partner with licensed pharmacies to fulfill your orders.",
      },
      {
        question: "How long does medication delivery take?",
        answer:
          "Standard delivery typically takes 24-48 hours within Kigali and 2-4 days for other regions in Rwanda. We also offer express delivery options in select areas for delivery within 3-6 hours.",
      },
      {
        question: "Can I track my medication order?",
        answer:
          "Yes, once your order is confirmed, you'll receive a tracking number and can monitor the status of your delivery through our app or website in real-time.",
      },
      {
        question: "What if I need to return medication?",
        answer:
          "For safety reasons, we generally don't accept returns on medications. However, if you received incorrect items or damaged products, please contact our customer service within 24 hours of delivery for assistance.",
      },
    ],
  },
  {
    category: "Payments",
    id: "payments",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept various payment methods including credit/debit cards, mobile money (MTN Mobile Money, Airtel Money), bank transfers, and cash payments for in-person services. All online payments are processed securely.",
      },
      {
        question: "How do I get a receipt for my payment?",
        answer:
          "After completing a payment, a digital receipt is automatically generated and sent to your email. You can also access all your receipts in the 'Payment History' section of your account.",
      },
      {
        question: "Do you accept insurance?",
        answer:
          "Yes, we work with several insurance providers in Rwanda. During the booking process, you can provide your insurance information, and we'll verify your coverage. Please check our list of partner insurance companies for details.",
      },
      {
        question: "What is your refund policy?",
        answer:
          "Refunds are processed for cancelled services according to our cancellation policy. For appointments cancelled more than 24 hours in advance, you'll receive a full refund. For later cancellations, a cancellation fee may apply.",
      },
    ],
  },
  {
    category: "Account",
    id: "account",
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "You can create an account by clicking the 'Sign Up' button on our website or app. You'll need to provide your name, email address, phone number, and create a password. Verification will be sent to your email or phone.",
      },
      {
        question: "How can I reset my password?",
        answer:
          "If you forgot your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and we'll send you instructions to reset your password.",
      },
      {
        question: "Can I have a family account?",
        answer:
          "Yes, you can add family members to your account. Go to 'Account Settings', select 'Family Members', and add their information. You'll be able to book appointments and manage healthcare for all family members.",
      },
      {
        question: "How do I update my personal information?",
        answer:
          "You can update your personal information by logging into your account, navigating to 'Account Settings', and selecting 'Personal Information'. Make the necessary changes and save your updates.",
      },
    ],
  },
  {
    category: "Emergency",
    id: "emergency",
    questions: [
      {
        question: "What emergency services do you offer?",
        answer:
          "Our emergency services include 24/7 emergency teleconsultation, ambulance dispatch, emergency home visits by medical professionals, and coordination with emergency departments at partner hospitals.",
      },
      {
        question: "How do I request an ambulance?",
        answer:
          "You can request an ambulance through our app by clicking the 'Emergency' button, selecting 'Ambulance Service', and confirming your location. Alternatively, you can call our emergency hotline at +250 788 911 911.",
      },
      {
        question: "What is the response time for emergency services?",
        answer:
          "Our target response time for emergency teleconsultation is under 2 minutes. For ambulance services in Kigali, we aim to arrive within 15-20 minutes, depending on traffic and your location.",
      },
      {
        question: "Is the emergency service available nationwide?",
        answer:
          "Our emergency teleconsultation is available nationwide. Ambulance services are currently available in Kigali and major provincial cities. We're continuously expanding our coverage to more areas.",
      },
    ],
  },
  {
    category: "AI Doctor",
    id: "ai-doctor",
    questions: [
      {
        question: "What is the AI Doctor feature?",
        answer:
          "The AI Doctor is an artificial intelligence-powered tool that can help assess symptoms, provide general health information, and guide you on whether you should seek medical attention. It's available 24/7 and can be accessed through our app or website.",
      },
      {
        question: "Is the AI Doctor a replacement for real doctors?",
        answer:
          "No, the AI Doctor is not a replacement for human healthcare providers. It's designed to be a preliminary assessment tool and information resource. For diagnosis and treatment, you should always consult with a qualified healthcare professional.",
      },
      {
        question: "How accurate is the AI Doctor?",
        answer:
          "The AI Doctor is continuously learning and improving. It uses up-to-date medical knowledge and sophisticated algorithms to provide information, but it has limitations. Always follow up with a human doctor for confirmation of any assessment.",
      },
      {
        question: "Is my conversation with the AI Doctor private?",
        answer:
          "Yes, your interactions with the AI Doctor are private and secure. The information you provide is encrypted and used only to improve your experience and the AI's capabilities. We do not share this information with third parties.",
      },
    ],
  },
  {
    category: "Privacy",
    id: "privacy",
    questions: [
      {
        question: "How is my health information protected?",
        answer:
          "Your health information is protected through strict security measures including encryption, access controls, and compliance with healthcare privacy regulations. We only share your information with healthcare providers involved in your care and as permitted by our Privacy Policy.",
      },
      {
        question: "Who has access to my medical records?",
        answer:
          "Only authorized healthcare providers directly involved in your care, you, and any individuals you explicitly grant access to (such as family members) can access your medical records. Our staff may access limited information for administrative purposes.",
      },
      {
        question: "Can I request a copy of my medical records?",
        answer:
          "Yes, you have the right to request a copy of your medical records. You can make this request through your account settings or by contacting our customer service. We'll provide your records in a secure, electronic format.",
      },
      {
        question: "How long do you keep my health information?",
        answer:
          "We retain your health information for as long as necessary to provide our services and comply with legal requirements. In general, medical records are kept for at least 10 years from your last interaction with our platform.",
      },
    ],
  },
]

export default function FaqAccordion() {
  const [openCategory, setOpenCategory] = useState<string | null>("appointments")

  return (
    <section className="py-12 bg-white">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          {faqData.map((category) => (
            <div key={category.id} id={category.id} className="mb-10 scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">{category.category}</h2>
              <Accordion
                type="single"
                collapsible
                className="border rounded-lg overflow-hidden"
                value={openCategory === category.id ? `${category.id}-0` : undefined}
                onValueChange={(value) => {
                  if (value) {
                    setOpenCategory(category.id)
                  } else {
                    setOpenCategory(null)
                  }
                }}
              >
                {category.questions.map((item, index) => (
                  <AccordionItem key={index} value={`${category.id}-${index}`} className="border-b last:border-b-0">
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left font-medium">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 bg-gray-50">
                      <p className="text-gray-700">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
