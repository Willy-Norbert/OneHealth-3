
import AiAssistantHero from "@/components/services/ai-assistant/ai-assistant-hero"
import AiAssistantFeatures from "@/components/services/ai-assistant/ai-assistant-features"
import AiAssistantHowItWorks from "@/components/services/ai-assistant/ai-assistant-how-it-works"
import AiAssistantCapabilities from "@/components/services/ai-assistant/ai-assistant-capabilities"
import AiAssistantDemo from "@/components/services/ai-assistant/ai-assistant-demo"
import AiAssistantTestimonials from "@/components/services/ai-assistant/ai-assistant-testimonials"
import AiAssistantFaq from "@/components/services/ai-assistant/ai-assistant-faq"
import AiAssistantCta from "@/components/services/ai-assistant/ai-assistant-cta"

import DefaultLayout from "@/components/layouts/DefaultLayout"

export default function AiAssistantPage() {
  return (
    <DefaultLayout>
    <main className="min-h-screen bg-white">
      <AiAssistantHero />
      <AiAssistantFeatures />
      <AiAssistantHowItWorks />
      <AiAssistantCapabilities />
      <AiAssistantDemo />
      <AiAssistantTestimonials /> 
       <AiAssistantFaq />
      <AiAssistantCta />

    </main>
    </DefaultLayout>
  )
}
