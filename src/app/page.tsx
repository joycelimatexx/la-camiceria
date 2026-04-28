import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cream via-sand-50 to-navy-50 opacity-60" />
          {/* Geometric decorative elements */}
          <div className="absolute top-20 left-12 w-px h-48 bg-gradient-to-b from-transparent via-sand-300 to-transparent" />
          <div className="absolute top-32 right-16 w-px h-64 bg-gradient-to-b from-transparent via-sand-300 to-transparent" />
          <div className="absolute bottom-32 left-1/4 w-48 h-px bg-gradient-to-r from-transparent via-sand-300 to-transparent" />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full border border-sand-200 opacity-30" />
          <div className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full border border-sand-300 opacity-20" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <p className="text-label text-sand-500 mb-8 tracking-ultra-wide" style={{ fontSize: '0.65rem' }}>
              ✦ &nbsp; EXPERIÊNCIA VIRTUAL &nbsp; ✦
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-navy-900 leading-none mb-4">
              Veja como
              <br />
              <span className="italic font-light text-navy-600">você fica</span>
            </h1>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <div className="divider-elegant my-8 max-w-xs mx-auto">
              <span className="text-label text-sand-400 px-4" style={{ fontSize: '0.6rem' }}>
                LA CAMICERIA
              </span>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
            <p className="font-serif text-navy-500 text-xl md:text-2xl leading-relaxed mb-12 max-w-2xl mx-auto">
              Experimente virtualmente nossas peças premium.
              <br />
              <span className="italic">Elegância mediterrânea ao alcance de um clique.</span>
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.8s', opacity: 0 }}>
            <Link href="/try-on" className="btn-primary text-sm py-4 px-10 inline-flex items-center gap-3">
              <span>Experimentar Virtualmente</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-soft">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-sand-400" />
          <span className="text-label text-sand-400" style={{ fontSize: '0.55rem' }}>ROLE</span>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="py-32 px-6 bg-off-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-label text-sand-500 mb-4" style={{ fontSize: '0.65rem' }}>COMO FUNCIONA</p>
            <h2 className="font-display text-4xl md:text-5xl text-navy-900">
              Três passos para o
              <br />
              <span className="italic font-light">look perfeito</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                number: '01',
                title: 'Envie sua foto',
                description: 'Faça upload de uma foto sua. Quanto melhor a foto, mais realista o resultado.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="3" y="3" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="14" cy="12" r="4" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M6 25c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                number: '02',
                title: 'Escolha a peça',
                description: 'Selecione entre nossa coleção exclusiva de camisas, polos, bermudas e mais.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M5 8l4-4h10l4 4v4l-4 1v11H9V13L5 12V8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                number: '03',
                title: 'Gere seu look',
                description: 'Nossa IA aplica a peça em você com fidelidade editorial. Baixe e compartilhe.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 4l2 6h6l-5 3.6 1.9 6L14 16l-4.9 3.6L11 13.6 6 10h6L14 4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((step, i) => (
              <div key={step.number} className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full border border-sand-200 text-navy-500 mb-6 group-hover:border-navy-900 group-hover:text-navy-900 transition-all duration-400">
                  {step.icon}
                  <span
                    className="absolute -top-2 -right-2 font-mono text-xs text-sand-400"
                    style={{ fontSize: '0.6rem' }}
                  >
                    {step.number}
                  </span>
                </div>
                <h3 className="font-display text-xl text-navy-900 mb-3">{step.title}</h3>
                <p className="font-body text-sand-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/try-on" className="btn-primary inline-flex">
              Começar agora
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brand Statement ── */}
      <section className="py-32 px-6 bg-navy-950 text-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.05) 80px, rgba(255,255,255,0.05) 81px), repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.05) 80px, rgba(255,255,255,0.05) 81px)'
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-label text-sand-500 mb-8" style={{ fontSize: '0.65rem' }}>NOSSA FILOSOFIA</p>

          <blockquote className="font-serif text-3xl md:text-5xl text-cream leading-relaxed italic mb-12">
            "Vestir-se bem não é vaidade.
            <br />
            <span className="text-sand-300">É respeito por si mesmo."</span>
          </blockquote>

          <div className="divider-elegant max-w-xs mx-auto mb-8">
            <span className="text-label text-sand-600 px-4" style={{ fontSize: '0.55rem' }}>LA CAMICERIA</span>
          </div>

          <p className="font-body text-sand-400 text-sm leading-relaxed max-w-xl mx-auto">
            Moda masculina premium inspirada na leveza do Mediterrâneo.
            Linho italiano, algodão egípcio, acabamento artesanal.
            Old money contemporâneo para o homem moderno.
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-32 px-6 bg-cream text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-label text-sand-400 mb-4" style={{ fontSize: '0.65rem' }}>PRONTO PARA EXPERIMENTAR?</p>
          <h2 className="font-display text-5xl md:text-6xl text-navy-900 mb-8">
            Vista-se com
            <br />
            <span className="italic font-light">confiança</span>
          </h2>
          <Link href="/try-on" className="btn-primary text-sm py-4 px-12 inline-flex">
            Abrir Provador Virtual
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
