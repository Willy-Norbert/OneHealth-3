import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-rubik',
})

export const metadata: Metadata = {
  title: 'OneHealthline Connect',
  description: 'Healthcare Anywhere. Anytime.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={rubik.variable}>
      <body suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-gray-900 dark:text-gray-100 overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

