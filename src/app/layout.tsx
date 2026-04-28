// ============================================
// LA CAMICERIA — Root Layout
// ============================================

import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Cormorant_Garamond, Jost, DM_Mono } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'La Camiceria — Provador Virtual',
  description: 'Experimente virtualmente as peças exclusivas da La Camiceria. Moda masculina premium com tecnologia de ponta.',
  keywords: 'La Camiceria, moda masculina, roupa premium, provador virtual, linho, camisa, polo',
  openGraph: {
    title: 'La Camiceria — Provador Virtual',
    description: 'Vista-se com elegância. Experimente virtualmente.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#102A43',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${cormorant.variable} ${jost.variable} ${dmMono.variable}`}>
      <body className="bg-cream text-navy-900 antialiased">
        {children}
      </body>
    </html>
  )
}
