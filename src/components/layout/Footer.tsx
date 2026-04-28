export default function Footer() {
  return (
    <footer className="bg-navy-950 text-cream py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div>
            <p
              className="font-display text-2xl tracking-widest text-cream"
              style={{ letterSpacing: '0.3em' }}
            >
              LA CAMICERIA
            </p>
            <p className="text-label text-sand-400 mt-2" style={{ fontSize: '0.6rem' }}>
              ELEGÂNCIA SEM ESFORÇO
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-label text-sand-500" style={{ fontSize: '0.6rem' }}>
              © {new Date().getFullYear()} La Camiceria. Todos os direitos reservados.
            </p>
            <p className="text-label text-sand-600" style={{ fontSize: '0.55rem' }}>
              Powered by AI · Feito no Brasil
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800">
          <div className="divider-elegant">
            <span className="text-label text-navy-700" style={{ fontSize: '0.55rem' }}>
              MODA MASCULINA PREMIUM · MEDITERRÂNEO · OLD MONEY CONTEMPORÂNEO
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
