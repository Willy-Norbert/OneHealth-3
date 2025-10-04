"use client";
import Navbar from "@/components/layouts/navbar"
import Footer from "@/components/layouts/footer"
import DepartmentsHero from "@/components/departments/departments-hero"
import DepartmentsOverview from "@/components/departments/departments-overview"
import FeaturedDepartments from "@/components/departments/featured-departments"
import DepartmentSpecialists from "@/components/departments/department-specialists"
import DepartmentServices from "@/components/departments/department-services"
import DepartmentConditions from "@/components/departments/department-conditions"
import DepartmentFaq from "@/components/departments/department-faq"
import DepartmentCta from "@/components/departments/department-cta"

export default function DepartmentsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <DepartmentsHero />
      <DepartmentsOverview />
      <FeaturedDepartments />
      <DepartmentSpecialists />
      <DepartmentServices />
      <DepartmentConditions />
      <DepartmentFaq />
      <DepartmentCta />
      <Footer />
    </main>
  )
}
