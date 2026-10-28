import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

// next/font preloads the files and adds a size-matched fallback, so text paints without
// waiting for the fonts and doesn't shift when they arrive. Latin subset only.
const spaceGrotesk = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2',
      weight: '400',
    },
    {
      path: '../../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2',
      weight: '500',
    },
    {
      path: '../../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2',
      weight: '700',
    },
  ],
  variable: '--font-space-grotesk',
})
// Menlo comes first in --font-mono, so most Apple devices never need this; don't preload it.
const firaMono = localFont({
  src: '../../node_modules/@fontsource/fira-mono/files/fira-mono-latin-400-normal.woff2',
  weight: '400',
  variable: '--font-fira-mono',
  preload: false,
  adjustFontFallback: false,
})

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
    <html lang="en" className={`${spaceGrotesk.variable} ${firaMono.variable}`}>
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
