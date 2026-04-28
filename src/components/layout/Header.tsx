'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-sand-200/50 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex flex-col items-start">
          <span
            className="font-display text-xl font-600 tracking-widest text-navy-900"
            style={{ letterSpacing: '0.25em' }}
          >
            LA CAMICERIA
          </span>
          <span className="text-label text-sand-500 mt-0.5" style={{ fontSize: '0.55rem' }}>
            MODA MASCULINA PREMIUM
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {['Coleção', 'Sobre', 'Contato'].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-label text-navy-500 hover:text-navy-900 transition-colors"
              style={{ fontSize: '0.65rem' }}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/try-on"
          className="btn-primary text-xs py-3 px-6"
        >
          Experimentar
        </Link>
      </div>
    </header>
  )
}
