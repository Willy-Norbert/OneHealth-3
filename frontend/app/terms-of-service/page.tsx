import type { Metadata } from "next"
import TermsHero from "@/components/legal/terms-hero"
import TermsContent from "@/components/legal/terms-content"
import TermsCTA from "@/components/legal/terms-cta"

export const metadata: Metadata = {
  title: "Terms of Service | ONE HEALTHLINE CONNECT",
  description: "Terms and conditions for using ONE HEALTHLINE CONNECT's services and platform.",
}

export default function TermsOfServicePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <TermsHero />
      <TermsContent />
      <TermsCTA />
    </main>
  )
}
