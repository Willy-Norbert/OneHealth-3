"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useLanguage } from '@/contexts/LanguageContext'
import { ThemeToggleButton } from "../common/ThemeToggleButton"
import LanguageSwitcher from "../LanguageSwitcher"
import { MedicalTexture } from "../ui/MedicalTexture"

export default function Navbar() {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show navbar when scrolling down past 200px
      if (currentScrollY > 200 && currentScrollY > lastScrollY) {
        setIsVisible(true)
      } 
      // Hide navbar when at top
      else if (currentScrollY < 100) {
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Show navbar initially
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header 
          className="fixed top-0 left-0 right-0 z-50 p-4"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-green-100 via-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-200 p-4 backdrop-blur-sm dark:from-green-900/30 dark:via-green-800/20 dark:to-gray-800 dark:border-green-600 relative overflow-hidden">
          <MedicalTexture pattern="hospital" opacity={0.03} className="text-emerald-600 dark:hidden" />
          <div className="flex items-center justify-between h-12">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/irabaruta-logo.png" alt="irabaruta logo" width={80} height={80} />
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-900 hover:text-green-600 font-medium dark:text-gray-100 dark:hover:text-green-400">
                {t('nav.home')}
              </Link>
              <Link href="/services" className="text-gray-900 hover:text-green-600 font-medium dark:text-gray-100 dark:hover:text-green-400">
                {t('nav.services')}
              </Link>
              <Link href="/departments" className="text-gray-900 hover:text-green-600 font-medium dark:text-gray-100 dark:hover:text-green-400">
                {t('nav.departments')}
              </Link>
              <Link href="/about" className="text-gray-900 hover:text-green-600 font-medium dark:text-gray-100 dark:hover:text-green-400">
                {t('nav.about')}
              </Link>
              <Link href="/contact" className="text-gray-900 hover:text-green-600 font-medium dark:text-gray-100 dark:hover:text-green-400">
                {t('nav.contact')}
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher variant="header" className="hidden md:block" />
              <Link href="/auth/login" className="hidden md:block">
                <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" className="hidden md:block">
                <Button variant="outline">
                  Register
                </Button>
              </Link>
              <ThemeToggleButton />
              <Button 
                variant="ghost" 
                className="md:hidden dark:text-gray-100 dark:hover:bg-gray-800 w-10 h-10 p-0"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-green-200 dark:border-green-700">
              <nav className="flex flex-col space-y-4 pt-4">
                <Link 
                  href="/" 
                  className="text-gray-900 hover:text-green-600 font-medium dark:text-gray-100 dark:hover:text-green-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.home')}
                </Link>
                <Link 
                  href="/services" 
                  className="text-gray-900 hover:text-green-600 font-medium dark:text-gray-100 dark:hover:text-green-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.services')}
                </Link>
                <Link 
                  href="/departments" 
                  className="text-gray-900 hover:text-green-600 font-medium dark:text-gray-100 dark:hover:text-green-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.departments')}
                </Link>
                <Link 
                  href="/about" 
                  className="text-gray-900 hover:text-green-600 font-medium dark:text-gray-100 dark:hover:text-green-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.about')}
                </Link>
                <Link 
                  href="/contact" 
                  className="text-gray-900 hover:text-green-600 font-medium dark:text-gray-100 dark:hover:text-green-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.contact')}
                </Link>
                <div className="flex flex-col space-y-2 pt-4 border-t border-green-200 dark:border-green-700">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </motion.header>
      )}
    </AnimatePresence>
  )
}