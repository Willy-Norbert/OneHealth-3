'use client'

import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function FloatingLanguageSwitcher() {
  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[1100]">
      <LanguageSwitcher
        className="bg-white text-emerald-600 shadow-lg hover:bg-emerald-50 border border-emerald-100"
        variant="header"
      />
    </div>
  )
}

