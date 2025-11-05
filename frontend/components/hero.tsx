// src/components/hero.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Heart, ChevronLeft, ChevronRight, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { MedicalTexture } from "@/components/ui/MedicalTexture"

export default function HeroSection() {
  const [stats, setStats] = useState({
    doctors: 240,
    medicalTests: 1456,
    patients: 300,
    experience: "1M+"
  });

  useEffect(() => {
    // Fetch stats from database
    const fetchStats = async () => {
      try {
        // Fetch doctor count
        const doctorsRes = await api.doctors.list();
        const doctorCount = (doctorsRes as any)?.data?.doctors?.length || (doctorsRes as any)?.doctors?.length || 240;
        
        // Fetch medical records count (medical tests)
        const medicalRecordsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/medical-records/count`, {
          credentials: 'include'
        });
        let medicalTestCount = 1456;
        if (medicalRecordsRes.ok) {
          const recordsData = await medicalRecordsRes.json();
          medicalTestCount = recordsData?.count || 1456;
        }
        
        // Fetch patient count
        const patientsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/patients/count`, {
          credentials: 'include'
        });
        let patientCount = 300;
        if (patientsRes.ok) {
          const patientsData = await patientsRes.json();
          patientCount = patientsData?.count || 300;
        }
        
        setStats({
          doctors: doctorCount,
          medicalTests: medicalTestCount,
          patients: patientCount,
          experience: "1M+"
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Keep default values on error
      }
    };
    
    fetchStats();
  }, []);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-emerald-50/20 to-gray-50 relative overflow-hidden">
      <MedicalTexture pattern="healthcare" opacity={0.06} className="text-emerald-600" />
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
        <div className="grid md:grid-cols-2 gap-12 items-start relative">
          {/* Left Column */}
          <div className="space-y-8 pt-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.p 
                className="text-accent text-sm font-medium mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Booking of doctor's appointment
              </motion.p>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Outstanding<br />
                High Quality Care<br />
                & Patient Safety!
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg max-w-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                From specialty condition and treatment to everyday needs. Our doctors include highly.
              </motion.p>
            </motion.div>

            {/* Email Signup */}
            <motion.div 
              className="flex gap-2 max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="pl-10 h-12 bg-emerald-50/80 backdrop-blur-sm border-border relative"
                />
                <MedicalTexture pattern="stethoscope" opacity={0.08} className="text-emerald-600" />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white h-12 px-6 whitespace-nowrap">
                Get Started - It's Free
              </Button>
            </motion.div>

            {/* Statistics */}
            <motion.div 
              className="grid grid-cols-3 gap-6 pt-8 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <MedicalTexture pattern="medical-cross" opacity={0.06} className="text-emerald-600" />
              <div className="relative z-10">
                <div className="text-4xl font-bold text-foreground mb-1">{stats.doctors.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Qualified Doctors & Medical Specialists</div>
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold text-foreground mb-1">{stats.medicalTests.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">we have active hospitals and doctors</div>
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold text-foreground mb-1">{stats.experience}</div>
                <div className="text-sm text-muted-foreground">Years Of Experience The Medical Field</div>
              </div>
            </motion.div>

            {/* Recognized by Section */}
            <div className="pt-12">
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Recognized by</h3>
                <p className="text-sm text-muted-foreground">Trusted by leading hospitals across Rwanda</p>
              </div>
              
              {/* Hospital Logos Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-items-center">
                {/* King Faisal Hospital */}
                <div className="flex flex-col items-center p-4 bg-emerald-50/60 backdrop-blur-sm rounded-lg hover:bg-emerald-100/80 transition-all duration-300 hover:scale-105 shadow-sm relative overflow-hidden">
                  <MedicalTexture pattern="medical-cross" opacity={0.08} className="text-emerald-600" />
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">KFH</span>
                  </div>
                  <span className="text-xs text-center font-medium text-foreground">King Faisal Hospital</span>
                </div>

                {/* CHUK - University Teaching Hospital */}
                <div className="flex flex-col items-center p-4 bg-emerald-50/60 backdrop-blur-sm rounded-lg hover:bg-emerald-100/80 transition-all duration-300 hover:scale-105 shadow-sm relative overflow-hidden">
                  <MedicalTexture pattern="medical-cross" opacity={0.08} className="text-emerald-600" />
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">CHUK</span>
                  </div>
                  <span className="text-xs text-center font-medium text-foreground">CHUK Hospital</span>
                </div>

                {/* Rwanda Military Hospital */}
                <div className="flex flex-col items-center p-4 bg-emerald-50/60 backdrop-blur-sm rounded-lg hover:bg-emerald-100/80 transition-all duration-300 hover:scale-105 shadow-sm relative overflow-hidden">
                  <MedicalTexture pattern="medical-cross" opacity={0.08} className="text-emerald-600" />
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">RMH</span>
                  </div>
                  <span className="text-xs text-center font-medium text-foreground">Rwanda Military Hospital</span>
                </div>

                {/* Kibagabaga Hospital */}
                <div className="flex flex-col items-center p-4 bg-emerald-50/60 backdrop-blur-sm rounded-lg hover:bg-emerald-100/80 transition-all duration-300 hover:scale-105 shadow-sm relative overflow-hidden">
                  <MedicalTexture pattern="medical-cross" opacity={0.08} className="text-emerald-600" />
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">KH</span>
                  </div>
                  <span className="text-xs text-center font-medium text-foreground">Kibagabaga Hospital</span>
                </div>

                {/* La Croix du Sud Hospital */}
                <div className="flex flex-col items-center p-4 bg-emerald-50/60 backdrop-blur-sm rounded-lg hover:bg-emerald-100/80 transition-all duration-300 hover:scale-105 shadow-sm relative overflow-hidden">
                  <MedicalTexture pattern="medical-cross" opacity={0.08} className="text-emerald-600" />
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">LCS</span>
                  </div>
                  <span className="text-xs text-center font-medium text-foreground">La Croix du Sud</span>
                </div>

                {/* Kanombe Military Hospital */}
                <div className="flex flex-col items-center p-4 bg-emerald-50/60 backdrop-blur-sm rounded-lg hover:bg-emerald-100/80 transition-all duration-300 hover:scale-105 shadow-sm relative overflow-hidden">
                  <MedicalTexture pattern="medical-cross" opacity={0.08} className="text-emerald-600" />
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">KMH</span>
                  </div>
                  <span className="text-xs text-center font-medium text-foreground">Kanombe Military Hospital</span>
                </div>

                {/* Muhima Hospital */}
                <div className="flex flex-col items-center p-4 bg-emerald-50/60 backdrop-blur-sm rounded-lg hover:bg-emerald-100/80 transition-all duration-300 hover:scale-105 shadow-sm relative overflow-hidden">
                  <MedicalTexture pattern="medical-cross" opacity={0.08} className="text-emerald-600" />
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">MH</span>
                  </div>
                  <span className="text-xs text-center font-medium text-foreground">Muhima Hospital</span>
                </div>

                {/* Nyarugenge District Hospital */}
                <div className="flex flex-col items-center p-4 bg-emerald-50/60 backdrop-blur-sm rounded-lg hover:bg-emerald-100/80 transition-all duration-300 hover:scale-105 shadow-sm relative overflow-hidden">
                  <MedicalTexture pattern="medical-cross" opacity={0.08} className="text-emerald-600" />
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-pink-800 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">NDH</span>
                  </div>
                  <span className="text-xs text-center font-medium text-foreground">Nyarugenge District Hospital</span>
                </div>
              </div>

              {/* Additional Trust Indicators */}
              <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground">
                  Partnered with 10+ healthcare facilities across Rwanda
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Main Doctor Card */}
            <Card className="overflow-hidden border-8 border-emerald-50/50 relative bg-emerald-50/95 backdrop-blur-sm">
              <MedicalTexture pattern="hospital" opacity={0.08} className="text-emerald-600" />
              <div className="aspect-[3/4] relative bg-gradient-to-br from-emerald-50/80 to-emerald-50/40">
                {/* More decorative blobs inside card */}
                <div className="absolute top-12 right-12 w-32 h-32 bg-pink-300/40 rounded-full blur-2xl" />
                <div className="absolute top-24 right-24 w-24 h-24 bg-blue-300/40 rounded-full blur-xl" />
                <div className="absolute top-36 right-16 w-28 h-28 bg-yellow-300/40 rounded-[60%_40%_30%_70%] blur-2xl" />
                <div className="absolute top-20 right-32 w-36 h-36 bg-cyan-300/30 rounded-[40%_60%_70%_30%] blur-2xl" />
                <div className="absolute top-48 right-20 w-20 h-20 bg-orange-300/40 rounded-full blur-xl" />
                
                <img 
                  src={doctorHero} 
                  alt="Professional Doctor" 
                  className="w-full h-full object-contain  relative "
                />
                
                {/* Small avatar overlay */}
                <div className="absolute top-1/4 left-8 w-20 h-20 rounded-full border-4 border-emerald-100 shadow-2xl overflow-hidden z-20">
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
                      className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg relative overflow-hidden ${
                        selectedTime === time
                          ? 'bg-accent text-white scale-105'
                          : 'bg-emerald-50/95 backdrop-blur-sm text-foreground hover:bg-emerald-100/95'
                      }`}
                    >
                      {selectedTime !== time && <MedicalTexture pattern="pills" opacity={0.08} className="text-emerald-600" />}
                      <span className="relative z-10">{time}</span>
                    </button>
                  ))}
                </div>

                {/* Calendar Widget - Repositioned lower */}
                <Card className="absolute bottom-32 right-6 p-4 bg-emerald-50/95 backdrop-blur-sm shadow-2xl w-72 z-20 relative overflow-hidden">
                  <MedicalTexture pattern="healthcare" opacity={0.08} className="text-emerald-600" />
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">January</span>
                      <span className="font-bold text-foreground">{currentMonth}</span>
                      <span className="text-muted-foreground">March</span>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 relative z-10">
                    {/* Days */}
                    {daysInMonth.map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all relative overflow-hidden ${
                          selectedDate === day
                            ? 'bg-accent text-white font-bold shadow-md scale-110'
                            : day === 1 || day === 2 || day === 3 || day === 4 || day === 5
                            ? 'text-foreground hover:bg-emerald-100/80 font-medium bg-emerald-50/60'
                            : day === 24 || day === 26
                            ? 'text-accent hover:bg-accent/10 font-medium bg-emerald-50/40'
                            : day > 5 && day < 12
                            ? 'text-muted-foreground bg-emerald-50/30'
                            : day === 12
                            ? 'text-muted-foreground bg-emerald-50/50'
                            : 'text-muted-foreground hover:bg-emerald-100/60 bg-emerald-50/30'
                        }`}
                      >
                        <span className="relative z-10">{day}</span>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Doctor Cards */}
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  {doctors.map((doctor, idx) => (
                    <Card key={idx} className="bg-emerald-50/95 backdrop-blur-sm p-3 flex items-center justify-between shadow-lg relative overflow-hidden">
                      <MedicalTexture pattern="stethoscope" opacity={0.08} className="text-emerald-600" />
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-200 shadow-sm">
                          <img 
                            src={doctor.image} 
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-foreground text-sm">{doctor.name}</div>
                          <div className="text-xs text-muted-foreground">{doctor.specialty}</div>
                        </div>
                      </div>
                      <Button className="bg-accent hover:bg-accent/90 text-white text-sm h-8 px-4 relative z-10">
                        Select
                      </Button>
                    </Card>
                  ))}

                  {/* Appointment Info Card */}
                  <Card className="bg-emerald-50/95 backdrop-blur-sm p-3 shadow-lg relative overflow-hidden">
                    <MedicalTexture pattern="hospital" opacity={0.08} className="text-emerald-600" />
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Date</div>
                        <div className="font-bold text-foreground">15 February 2020</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Time</div>
                        <div className="font-bold text-foreground">{selectedTime}</div>
                      </div>
                      <div className="flex items-end justify-end">
                        <Button className="bg-primary hover:bg-primary/90 text-white text-sm h-8 px-4">
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-1">Doctor</div>
                      <div className="font-bold text-foreground">Dr. Robert Long</div>
                      <div className="text-xs text-muted-foreground">Radiology</div>
                      <Button variant="outline" className="w-full mt-2 text-sm h-8">
                        Cancel
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
