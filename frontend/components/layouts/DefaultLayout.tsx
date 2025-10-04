
"use client"

import { ReactNode } from "react"
import Navbar from "./navbar"
import Footer from "./footer"

interface DefaultLayoutProps {
  children: ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
