"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white dark:bg-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/irabaruta-logo.png" alt="logo" width={120} height={60} />
            </Link>
            <p className="text-gray-300 dark:text-gray-400">
              {t('footer.description') || "Your trusted healthcare partner providing quality medical services across Rwanda."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white dark:text-gray-200">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {['home','about','services','departments','contact'].map((link) => (
                <li key={link}>
                  <Link 
                    href={`/${link === 'home' ? '' : link}`} 
                    className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    {t(`nav.${link}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white dark:text-gray-200">{t('footer.services')}</h3>
            <ul className="space-y-2">
              {[
                { slug: 'teleconsultation', key: 'teleconsultation' },
                { slug: 'appointments', key: 'appointments' },
                { slug: 'emergency', key: 'emergency' },
                { slug: 'pharmacy', key: 'pharmacy' },
                { slug: 'ai-assistant', key: 'aiAssistant' },
              ].map((service) => (
                <li key={service.slug}>
                  <Link 
                    href={`/services/${service.slug}`} 
                    className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    {t(`nav.${service.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white dark:text-gray-200">{t('footer.support')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                  {t('footer.termsOfService')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center dark:border-gray-600">
          <p className="text-gray-300 dark:text-gray-400">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
