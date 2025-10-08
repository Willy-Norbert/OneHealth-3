
"use client"

import { ReactNode } from "react"
import Navbar from "./navbar"
import Footer from "./footer"

interface DefaultLayoutProps {
  children: ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
