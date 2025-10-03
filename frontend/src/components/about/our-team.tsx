"use client"

import Image from "next/image"
import { FaFacebook, FaXTwitter, FaLinkedin } from "react-icons/fa6"
import { useLanguage } from "@/contexts/LanguageContext"

export default function OurTeam() {
  const { t } = useLanguage()

  const executives = [
    {
      name: "Zirimwabagabo Charles",
      role: t("ourTeam.roles.founder"),
      bio: t("ourTeam.bios.charles"),
      image: "/placeholder.svg?height=400&width=400&text=Dr.+Jean+Mugabo",
      social: {
        twitter: "#",
        linkedin: "#",
        facebook: "#",
      },
    },
    {
      name: "Byiringiro Urban Bobola",
      role: t("ourTeam.roles.cto"),
      bio: t("ourTeam.bios.urban"),
      image: "/placeholder.svg?height=400&width=400&text=Marie+Uwase",
      social: {
        twitter: "#",
        linkedin: "#",
      },
    },
    {
      name: "IRABARUTA Willy Norbert",
      role: t("ourTeam.roles.cmo"),
      bio: t("ourTeam.bios.willy"),
      image: "/placeholder.svg?height=400&width=400&text=Eric+Ndayishimiye",
      social: {
        linkedin: "#",
        facebook: "#",
      },
    },
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t("ourTeam.heading")}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t("ourTeam.subheading")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {executives.map((executive, index) => (
            <div key={index} className="group">
              <div className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg dark:shadow-md transition-all duration-300 hover:shadow-xl dark:hover:shadow-lg">
                <div className="relative">
                  <div className="aspect-square relative">
                    <Image
                      src={executive.image || "/placeholder.svg"}
                      alt={executive.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-6 w-full">
                      <div className="flex justify-center space-x-4">
                        {executive.social.facebook && (
                          <a
                            href={executive.social.facebook}
                            className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
                          >
                            <FaFacebook className="h-5 w-5 text-white" />
                          </a>
                        )}
                        {executive.social.twitter && (
                          <a
                            href={executive.social.twitter}
                            className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
                          >
                            <FaXTwitter className="h-5 w-5 text-white" />
                          </a>
                        )}
                        {executive.social.linkedin && (
                          <a
                            href={executive.social.linkedin}
                            className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
                          >
                            <FaLinkedin className="h-5 w-5 text-white" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{executive.name}</h3>
                  <p className="text-green-600 dark:text-green-400 font-medium text-sm">{executive.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm">{executive.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
