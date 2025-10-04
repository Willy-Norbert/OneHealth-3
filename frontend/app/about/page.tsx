"use client";
import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"
import AboutHero from "@/components/about/about-hero"
import MissionVision from "@/components/about/mission-vision"
import OurStory from "@/components/about/our-story"
import CoreValues from "@/components/about/core-values"
import OurTeam from "@/components/about/our-team"
import Partners from "@/components/about/partners"
import Achievements from "@/components/about/achievements"
import AboutCta from "@/components/about/about-cta"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="m-10">
        <Navbar />
        <AboutHero />
        <MissionVision />
        <OurStory />
        <CoreValues />
        <OurTeam />
        <Partners />
        <Achievements />
        <AboutCta />
      </div>
      <Footer />
    </main>
  )
}
