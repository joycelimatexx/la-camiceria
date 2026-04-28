'use client'

import { GenerationState } from '@/types'
import { downloadImage } from '@/services/historyService'

interface GenerationResultProps {
  state: GenerationState
  productName?: string
  userImage?: string
  onRegenerate: () => void
  onReset: () => void
}

const PROGRESS_MESSAGES: Record<number, string> = {
  0: 'Iniciando...',
  15: 'Analisando sua foto...',
  30: 'Processando a peça selecionada...',
  50: 'Criando composição visual...',
  70: 'IA gerando o look...',
  85: 'Refinando detalhes...',
  95: 'Finalizando...',
  100: 'Look pronto.',
}

export default function GenerationResult({
  state,
  productName,
  userImage,
  onRegenerate,
  onReset,
}: GenerationResultProps) {

  const handleDownload = () => {
    if (state.resultUrl) {
      downloadImage(state.resultUrl, `lacamiceria-${productName?.replace(/\s+/g, '-').toLowerCase()}.jpg`)
    }
  }

  // Loading state
  if (state.step === 'generating' || state.step === 'uploading' || state.step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] py-12">
        {/* Elegant loading animation */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border border-sand-200 animate-spin-slow" />
          <div className="absolute inset-2 rounded-full border border-sand-300 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '4s' }} />
          <div className="absolute inset-4 rounded-full border border-navy-300 animate-spin-slow" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-navy-900 rounded-full animate-pulse" />
          </div>
        </div>

        <h3 className="font-display text-2xl text-navy-900 mb-3">
          Criando seu look
        </h3>
        <p className="font-serif italic text-sand-500 text-lg mb-8">
          {state.message}
        </p>

        {/* Progress bar */}
        <div className="w-64 md:w-80">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${state.progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-label text-sand-400" style={{ fontSize: '0.6rem' }}>
              {state.step === 'uploading' ? 'Upload' : state.step === 'processing' ? 'Processando' : 'Gerando'}
            </span>
            <span className="font-mono text-xs text-navy-400">{state.progress}%</span>
          </div>
        </div>

        <p className="mt-8 font-body text-xs text-sand-400 text-center max-w-xs">
          Nossa IA está aplicando a peça com fidelidade editorial.<br />Isso leva alguns segundos.
        </p>
      </div>
    )
  }

  // Error state
  if (state.step === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12 text-center">
        <div className="w-16 h-16 rounded-full border border-red-200 flex items-center justify-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 8v5M12 16h.01" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="1" />
          </svg>
        </div>
        <h3 className="font-display text-xl text-navy-900 mb-2">Ops, algo falhou</h3>
        <p className="font-body text-sand-500 text-sm mb-8 max-w-xs">{state.error}</p>
        <div className="flex gap-3">
          <button onClick={onRegenerate} className="btn-primary">
            Tentar novamente
          </button>
          <button onClick={onReset} className="btn-ghost">
            Recomeçar
          </button>
        </div>
      </div>
    )
  }

  // Done state
  if (state.step === 'done' && state.resultUrl) {
    return (
      <div className="animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-label text-sand-400 mb-2" style={{ fontSize: '0.6rem' }}>RESULTADO FINAL</p>
          <h3 className="font-display text-3xl text-navy-900">Seu Look La Camiceria</h3>
          <p className="font-serif italic text-sand-500 mt-2">{productName}</p>
        </div>

        {/* Before / After */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Before */}
          {userImage && (
            <div>
              <p className="text-label text-sand-400 text-center mb-3" style={{ fontSize: '0.6rem' }}>ANTES</p>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-sand-100">
                <img src={userImage} alt="Sua foto original" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* After */}
          <div>
            <p className="text-label text-navy-900 text-center mb-3 font-medium" style={{ fontSize: '0.6rem' }}>DEPOIS ✦</p>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-sand-100 relative">
              <img
                src={state.resultUrl}
                alt="Seu look La Camiceria"
                className="w-full h-full object-cover"
              />
              {/* Brand watermark */}
              <div className="absolute bottom-4 right-4 glass px-3 py-1.5 rounded-full">
                <span className="text-label text-navy-700" style={{ fontSize: '0.55rem' }}>LA CAMICERIA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={handleDownload} className="btn-primary w-full sm:w-auto justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Baixar Look
          </button>
          <button onClick={onRegenerate} className="btn-ghost w-full sm:w-auto justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7a5 5 0 1 0 5-5M2 3v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Gerar Novamente
          </button>
          <button onClick={onReset} className="btn-ghost w-full sm:w-auto justify-center">
            Novo Look
          </button>
        </div>
      </div>
    )
  }

  return null
}
