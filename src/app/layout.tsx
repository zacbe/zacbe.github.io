import type { Metadata, Viewport } from 'next'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/fira-mono/400.css'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://zacbe.dev'),
  title: { default: 'Zacbé', template: '%s · Zacbé' },
  description: 'What a senior backend engineer learns, and the weekend projects he builds.',
  openGraph: { type: 'website', siteName: 'zacbe.dev', locale: 'en_US' },
}

export const viewport: Viewport = {
  themeColor: '#FAFAF9',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
