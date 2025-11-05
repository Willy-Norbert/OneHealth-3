
"use client"

import { ReactNode } from "react"
import Navbar from "./navbar"
import Footer from "./footer"
import { MedicalTexture } from "@/components/ui/MedicalTexture"

interface DefaultLayoutProps {
  children: ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-emerald-50/30 dark:bg-gray-900 dark:text-gray-100 relative">
      <MedicalTexture pattern="medical-cross" opacity={0.02} className="text-emerald-600 dark:hidden" />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

}
