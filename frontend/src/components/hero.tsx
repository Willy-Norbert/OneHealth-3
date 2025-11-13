// src/components/hero.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Heart, ChevronLeft, ChevronRight, Mail } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import LanguageSwitcher from "@/components/LanguageSwitcher"

const EXTERNAL_PORTAL_URL = "https://www.onehealthline.com/"

export default function HeroSection() {
  const { t } = useLanguage()
  // images must be placed in your project's public/assets folder:
  // public/assets/doctor-main.jpg
  // public/assets/doctor-avatar.jpg
  // public/assets/doctor-robert.jpg
  // public/assets/doctor-john.jpg
  const doctorHero = "https://media.istockphoto.com/id/171296819/photo/african-american-female-doctor-holding-a-clipboard-isolated.jpg?s=612x612&w=0&k=20&c=hCJk-9gsOff8Fac04a11VMOwflMYiRXUVfAj3UTn67U="
  const doctorAvatar = "https://plus.unsplash.com/premium_photo-1661690013376-9c1b73f0b16c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWZyaWNhbiUyMGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D"
  const doctorRobert = "https://www.google.com/imgres?imgurl=https%3A%2F%2Ft3.ftcdn.net%2Fjpg%2F01%2F84%2F97%2F86%2F360_F_184978680_x44UsEMh4k6HHsQ0d1AgCkCD32PScj7P.jpg&tbnid=Rl5BGAq6NMc4OM&vet=10CAIQxiAoAGoXChMImMeQsuSIkAMVAAAAAB0AAAAAEAc..i&imgrefurl=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dblack%2Bdoctor%2Bwhite%2Bbackground&docid=c4AkiAA8FRtDLM&w=540&h=360&itg=1&q=best%20african%20doctor%20with%20white%20bg&ved=0CAIQxiAoAGoXChMImMeQsuSIkAMVAAAAAB0AAAAAEAc"
  const doctorJohn = "https://img.freepik.com/free-photo/african-medical-doctor-man-isolated-white-background_93675-128521.jpg"

  const [selectedDate, setSelectedDate] = useState<number>(15)
  const [selectedTime, setSelectedTime] = useState<string>("09:30")
  const [currentMonth] = useState<string>("February")
  
  const daysInMonth = Array.from({ length: 28 }, (_, i) => i + 1)
  const timeSlots = ["08:30", "09:30", "10:30"]
  
  const doctors = [
    { name: "Dr. Robert Long", specialty: "Radiology", image: doctorRobert },
    { name: "Dr. John Olson", specialty: "Cardiology", image: doctorJohn }
  ]

  const stats = [
    {
      value: t('hero.stats.patientsValue', { fallback: '300' }),
      label: t('hero.stats.patients', { fallback: "Patient Who managed to register on our system" }),
    },
    {
      value: t('hero.stats.hospitalsValue', { fallback: '10' }),
      label: t('hero.stats.hospitals', { fallback: "we have active hospitals and doctors" }),
    },
    {
      value: t('hero.stats.experienceValue', { fallback: '1yrs+' }),
      label: t('hero.stats.experience', { fallback: "Years Of Experience The Medical Field" }),
    },
  ]

  const partners = [
    {
      key: 'premiumMedical',
      href: 'https://premiumedical.com/',
      image: 'https://premiumedical.com/wp-content/uploads/2022/10/log-e1666540406920.jpg',
    },
    {
      key: 'dentalExpertsClinic',
      href: 'https://www.facebook.com/dentalexpertsrw/',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZoduySQPqsR12D66iJvu-VX7ilJlNSVyuSQ&s',
    },
    {
      key: 'westerwelleFoundation',
      href: 'https://westerwelle-foundation.com/',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvArwo7G-zPI7DojV6VEHWD3jDZ7MmedblkHldcgAlG6vw0CUOPow8xUL8hLXLxir5j48&usqp=CAU',
    },
    {
      key: 'getway',
      href: 'https://getwayconnection.vercel.app/',
      image: 'https://getwayconnection.vercel.app/favicon.ico',
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Decorative curved circular blobs - background layer */}
      <div className="absolute top-32 right-1/4 w-64 h-64 bg-pink-200/40 rounded-full blur-3xl" />
      <div className="absolute top-48 right-1/3 w-48 h-48 bg-rose-200/30 rounded-full blur-2xl" />
      <div className="absolute top-20 right-1/2 w-72 h-72 bg-orange-200/25 rounded-[40%_60%_70%_30%/60%_30%_70%_40%] blur-3xl" />
      <div className="absolute top-64 right-1/4 w-56 h-56 bg-yellow-200/35 rounded-[60%_40%_30%_70%/40%_60%_70%_30%] blur-2xl" />
      <div className="absolute top-40 right-1/3 w-44 h-44 bg-cyan-200/30 rounded-full blur-2xl" />
      <div className="absolute top-56 right-[35%] w-80 h-80 bg-blue-200/20 rounded-[45%_55%_60%_40%/55%_45%_40%_60%] blur-3xl" />
      <div className="absolute bottom-40 right-[30%] w-52 h-52 bg-purple-200/25 rounded-full blur-2xl" />



      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Language Switcher and Auth Links - Top Right */}
        {/* <div className="flex items-center justify-end gap-4 mb-6">
          <LanguageSwitcher variant="header" />
          <Link href="/auth/login">
            <Button variant="outline" className="hidden md:flex">
              {t('nav.login') || 'Login'}
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 hidden md:flex">
              {t('nav.register') || 'Register'}
            </Button>
          </Link>
        </div> */}

        <div className="grid md:grid-cols-2 gap-12 items-start relative">
          {/* Left Column */}
          <div className="space-y-8 pt-8 animate-fade-in-up">
            <div className="animate-fade-in-up">
              <p className="text-accent text-sm font-medium mb-4">
                {t('hero1.badge') || 'Booking of doctor\'s appointment'}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animation-delay-100 animate-fade-in-up">
                {t('hero1.title') ? (
                  <span dangerouslySetInnerHTML={{ __html: t('hero1.title') }} />
                ) : (
                  <>
                    Outstanding<br />
                    High Quality Care<br />
                    & Patient Safety!
                  </>
                )}
              </h1>
              <p className="text-muted-foreground text-lg max-w-lg leading-relaxed animate-fade-in-up animation-delay-200">
                {t('hero1.description') || 'From specialty condition and treatment to everyday needs. Our doctors include highly.'}
              </p>
            </div>

            {/* Auth Buttons and Email Signup */}
            <div className="flex flex-col gap-4">
              {/* Auth Action Buttons */}
              <div className="flex gap-3 animate-fade-in-up animation-delay-200">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white h-12 px-6 flex-1">
                  <Link href={EXTERNAL_PORTAL_URL} target="_blank" rel="noopener noreferrer">
                    {t('hero1.cta_get_started') || 'Get Started - It\'s Free'}
                  </Link>
                </Button>
                <Link href="/auth/login" className="flex-1">
                  <Button variant="outline" className="w-full h-12 px-6">
                    {t('nav.login') || 'Login'}
                  </Button>
                </Link>
              </div>

              {/* Email Signup */}
              <div className="flex gap-2 max-w-md animate-fade-in-up animation-delay-300">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder={t('hero.emailPlaceholder') || 'Enter your email'} 
                    className="pl-10 h-12 bg-white border-border"
                  />
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white h-12 px-6 whitespace-nowrap">
                  <Link href={EXTERNAL_PORTAL_URL} target="_blank" rel="noopener noreferrer">
                    {t('hero1.cta_get_started') || 'Get Started'}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-in-up animation-delay-300">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Recognized by Section */}
            <div className="pt-12 animate-fade-in-up animation-delay-400">
              <div className="text-center mb-8 animate-fade-in-up animation-delay-400">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  {t('hero.partners.title') || 'Recognized by'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('hero.partners.subtitle') || 'Trusted by leading organizations'}
                </p>
              </div>
              
              {/* Partners Logos Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center animate-fade-in-scale animation-delay-500">
                {partners.map(({ key, href, image }) => {
                  const name = t(`hero.partners.logos.${key}`, {
                    fallback:
                      key === 'premiumMedical'
                        ? 'Premium Medical'
                        : key === 'dentalExpertsClinic'
                        ? 'Dental Experts Clinic'
                        : key === 'westerwelleFoundation'
                        ? 'Westerwelle Foundation'
                        : 'Getway',
                  })

                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="flex flex-col items-center p-4 bg-white/50 rounded-lg hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-sm w-full"
                    >
                      <div className="w-36 h-20 md:w-44 md:h-24 flex items-center justify-center">
                        <img src={image} alt={name} className="object-contain w-full h-full" />
                      </div>
                    </a>
                  )
                })}
              </div>

              {/* Additional Trust Indicators */}
              <div className="mt-8 text-center animate-fade-in-up animation-delay-500">
                <p className="text-xs text-muted-foreground">
                  {t('hero.partners.description') || 'Partnered with 10+ healthcare facilities across Rwanda'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative animate-fade-in-right animation-delay-300">
            {/* Main Doctor Card */}
            <Card className="overflow-hidden border-8 border-white/50 relative bg-white dark:bg-gray-800 dark:border-gray-700/60 animate-fade-in-scale animation-delay-400">
              <div className="aspect-[3/4] relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                {/* More decorative blobs inside card */}
                <div className="absolute top-12 right-12 w-32 h-32 bg-pink-300/40 rounded-full blur-2xl" />
                <div className="absolute top-24 right-24 w-24 h-24 bg-blue-300/40 rounded-full blur-xl" />
                <div className="absolute top-36 right-16 w-28 h-28 bg-yellow-300/40 rounded-[60%_40%_30%_70%] blur-2xl" />
                <div className="absolute top-20 right-32 w-36 h-36 bg-cyan-300/30 rounded-[40%_60%_70%_30%] blur-2xl" />
                <div className="absolute top-48 right-20 w-20 h-20 bg-orange-300/40 rounded-full blur-xl" />
                
                <img 
                  src="/doctors.png"
                  alt="Professional Doctor" 
                  className="w-full h-full object-contain  relative "
                />
                
                {/* Small avatar overlay */}
                <div className="absolute top-1/4 left-8 w-20 h-20 rounded-full border-4 border-white shadow-2xl overflow-hidden z-20">
                  <img 
                    src={doctorAvatar} 
                    alt="Doctor" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Time slots */}
                <div className="absolute top-1/2 left-6 flex flex-col gap-2 z-20">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg ${
                        selectedTime === time
                          ? 'bg-accent text-white scale-105'
                          : 'bg-white/95 text-foreground hover:bg-white'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                {/* Calendar Widget - Repositioned lower */}
                <Card className="absolute bottom-32 right-6 p-4 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-2xl w-72 z-20">
                  <div className="flex items-center justify-between mb-4">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground dark:text-gray-300">January</span>
                      <span className="font-bold text-foreground dark:text-gray-100">{currentMonth}</span>
                      <span className="text-muted-foreground dark:text-gray-300">March</span>
                    </div>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {/* Days */}
                    {daysInMonth.map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all ${
                          selectedDate === day
                            ? 'bg-accent text-white font-bold shadow-md scale-110'
                            : day === 1 || day === 2 || day === 3 || day === 4 || day === 5
                            ? 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-700 font-medium'
                            : day === 24 || day === 26
                            ? 'text-accent hover:bg-accent/10 font-medium'
                            : day > 5 && day < 12
                            ? 'text-muted-foreground dark:text-gray-400'
                            : day === 12
                            ? 'text-muted-foreground bg-gray-50 dark:bg-gray-700/60'
                            : 'text-muted-foreground dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Doctor Cards */}
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  {doctors.map((doctor, idx) => (
                    <Card key={idx} className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm p-3 flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
                          <img 
                            src={doctor.image} 
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-foreground dark:text-gray-100 text-sm">{doctor.name}</div>
                          <div className="text-xs text-muted-foreground dark:text-gray-300">{doctor.specialty}</div>
                        </div>
                      </div>
                      <Button
                        asChild
                        className="bg-accent hover:bg-accent/90 text-white text-sm h-8 px-4"
                      >
                        <Link
                          href={EXTERNAL_PORTAL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                        >
                          {t('hero.select') || 'Select'}
                        </Link>
                      </Button>
                    </Card>
                  ))}

                  {/* Appointment Info Card */}
                  <Card className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm p-3 shadow-lg">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground dark:text-gray-300 mb-1">Date</div>
                        <div className="font-bold text-foreground dark:text-gray-100">15 February 2020</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground dark:text-gray-300 mb-1">Time</div>
                        <div className="font-bold text-foreground dark:text-gray-100">{selectedTime}</div>
                      </div>
                      <div className="flex items-end justify-end">
                        <Button
                          asChild
                          className="bg-primary hover:bg-primary/90 text-white text-sm h-8 px-4"
                        >
                          <Link
                            href={EXTERNAL_PORTAL_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                          >
                            {t('hero.edit') || 'Edit'}
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border dark:border-gray-700">
                      <div className="text-xs text-muted-foreground dark:text-gray-300 mb-1">Doctor</div>
                      <div className="font-bold text-foreground dark:text-gray-100">Dr. Robert Long</div>
                      <div className="text-xs text-muted-foreground dark:text-gray-300">Radiology</div>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full mt-2 text-sm h-8 dark:border-gray-700 dark:text-gray-100"
                      >
                        <Link
                          href={EXTERNAL_PORTAL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                        >
                          {t('hero.cancel') || 'Cancel'}
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
