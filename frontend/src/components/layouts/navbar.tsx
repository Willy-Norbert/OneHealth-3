"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
// ...existing code...
import { useState } from "react"
import { useLanguage } from '@/contexts/LanguageContext';
// ...existing code...
import { ThemeToggleButton } from "../common/ThemeToggleButton"
import LanguageSwitcher from "../LanguageSwitcher"

export default function Navbar() {
// ...existing code...
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // ...existing code...

  return (
    <header className="bg-white border-b border-gray-100 p-3 sticky top-0 z-50 dark:bg-gray-900 dark:border-gray-700">
      <div className="container mx-auto px-4">
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
            <Button variant="ghost" size="icon" className="md:hidden dark:text-gray-100 dark:hover:bg-gray-800">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
