"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Search, Filter, Star } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function DoctorSelection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All")

  const specialties = ["All", "General Medicine", "Pediatrics", "Cardiology", "Dermatology", "Neurology", "Orthopedics"]

  const doctors = [
    {
      id: 1,
      name: "Dr. Jean Mugabo",
      specialty: "Cardiology",
      hospital: "Kigali University Hospital",
      image: "/placeholder.svg?height=400&width=300&text=Dr.+Mugabo",
      rating: 4.9,
      reviewCount: 124,
      nextAvailable: "Today",
      languages: ["English", "Kinyarwanda", "French"],
    },
    {
      id: 2,
      name: "Dr. Marie Uwase",
      specialty: "Pediatrics",
      hospital: "Rwanda Children's Hospital",
      image: "/placeholder.svg?height=400&width=300&text=Dr.+Uwase",
      rating: 4.8,
      reviewCount: 98,
      nextAvailable: "Tomorrow",
      languages: ["English", "Kinyarwanda"],
    },
    {
      id: 3,
      name: "Dr. Eric Ndayishimiye",
      specialty: "Neurology",
      hospital: "Butaro Hospital",
      image: "/placeholder.svg?height=400&width=300&text=Dr.+Ndayishimiye",
      rating: 4.7,
      reviewCount: 86,
      nextAvailable: "In 2 days",
      languages: ["English", "Kinyarwanda", "French"],
    },
    {
      id: 4,
      name: "Dr. Claire Mutesi",
      specialty: "Dermatology",
      hospital: "CHUK",
      image: "/placeholder.svg?height=400&width=300&text=Dr.+Mutesi",
      rating: 4.9,
      reviewCount: 112,
      nextAvailable: "Today",
      languages: ["English", "Kinyarwanda"],
    },
    {
      id: 5,
      name: "Dr. Patrick Habimana",
      specialty: "General Medicine",
      hospital: "King Faisal Hospital",
      image: "/placeholder.svg?height=400&width=300&text=Dr.+Habimana",
      rating: 4.6,
      reviewCount: 75,
      nextAvailable: "Today",
      languages: ["English", "Kinyarwanda", "Swahili"],
    },
    {
      id: 6,
      name: "Dr. Diane Karenzi",
      specialty: "Orthopedics",
      hospital: "Rwanda Military Hospital",
      image: "/placeholder.svg?height=400&width=300&text=Dr.+Karenzi",
      rating: 4.8,
      reviewCount: 92,
      nextAvailable: "In 3 days",
      languages: ["English", "Kinyarwanda", "French"],
    },
  ]

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty

    return matchesSearch && matchesSpecialty
  })

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Healthcare Provider</h2>
          <p className="text-gray-600">
            Select from our network of qualified healthcare professionals based on specialty, availability, and ratings
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by doctor name, specialty, or hospital"
                className="pl-10 bg-gray-50 border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <div className="aspect-[3/2] relative">
                  <Image src={doctor.image || "/placeholder.svg"} alt={doctor.name} fill className="object-cover" />
                </div>
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-medium text-green-600 shadow-md">
                  {doctor.nextAvailable}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                <p className="text-green-600 font-medium">{doctor.specialty}</p>
                <p className="text-gray-500 text-sm">{doctor.hospital}</p>

                <div className="flex items-center mt-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-700 font-medium">{doctor.rating}</span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-500 text-sm">{doctor.reviewCount} reviews</span>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-500">Languages:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {doctor.languages.map((language) => (
                      <span
                        key={language}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">Book Appointment</Button>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No doctors found matching your search criteria. Please try different keywords or filters.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
