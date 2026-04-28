'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Product, GenerationState } from '@/types'
import StepIndicator from '@/components/ui/StepIndicator'
import ImageUpload from '@/components/tryOn/ImageUpload'
import ProductGrid from '@/components/tryOn/ProductGrid'
import GenerationResult from '@/components/tryOn/GenerationResult'
import HistoryPanel from '@/components/tryOn/HistoryPanel'
import { saveToHistory } from '@/services/historyService'

const PROGRESS_STEPS = [
  { step: 'uploading', progress: 15, message: 'Carregando sua foto...' },
  { step: 'processing', progress: 40, message: 'Analisando o produto...' },
  { step: 'generating', progress: 70, message: 'IA criando seu look...' },
  { step: 'generating', progress: 90, message: 'Refinando detalhes...' },
]

export default function TryOnPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userImage, setUserImage] = useState<string>('')
  const [userImageFile, setUserImageFile] = useState<File | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [generationState, setGenerationState] = useState<GenerationState>({
    step: 'idle',
    progress: 0,
    message: '',
  })

  // Step 1: Photo upload
  const handleImageSelect = (file: File, preview: string) => {
    setUserImageFile(file)
    setUserImage(preview)
    // Auto advance after a brief moment
    setTimeout(() => setCurrentStep(2), 400)
  }

  // Step 2: Product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
  }

  // Step 3: Generate
  const handleGenerate = useCallback(async () => {
    if (!userImageFile || !selectedProduct) return

    setCurrentStep(3)

    // Simulate initial progress
    setGenerationState({ step: 'uploading', progress: 10, message: 'Preparando...' })

    try {
      // Progressive progress updates
      const progressInterval = setInterval(() => {
        setGenerationState(prev => {
          if (prev.progress >= 85) {
            clearInterval(progressInterval)
            return prev
          }
          const newProgress = Math.min(prev.progress + Math.random() * 12, 85)
          const messageIndex = Math.floor(newProgress / 25)
          const messages = [
            'Analisando sua foto...',
            'Processando a peça...',
            'IA gerando o look...',
            'Refinando detalhes...',
          ]
          return {
            step: newProgress < 30 ? 'uploading' : newProgress < 60 ? 'processing' : 'generating',
            progress: Math.round(newProgress),
            message: messages[Math.min(messageIndex, messages.length - 1)],
          }
        })
      }, 800)

      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result as string
          resolve(result.split(',')[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(userImageFile)
      })

      // Call generation API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userImageBase64: base64,
          productImageUrl: selectedProduct.imageUrl,
          productName: selectedProduct.name,
          productCategory: selectedProduct.category,
        }),
      })

      clearInterval(progressInterval)

      const result = await response.json()

      if (!result.success || !result.imageUrl) {
        setGenerationState({
          step: 'error',
          progress: 0,
          message: '',
          error: result.error || 'Erro na geração da imagem.',
        })
        return
      }

      // Success!
      setGenerationState({
        step: 'done',
        progress: 100,
        message: 'Look pronto!',
        resultUrl: result.imageUrl,
      })

      // Save to history
      saveToHistory({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        resultUrl: result.imageUrl,
      })

    } catch (error) {
      setGenerationState({
        step: 'error',
        progress: 0,
        message: '',
        error: 'Erro de conexão. Tente novamente.',
      })
    }
  }, [userImageFile, selectedProduct])

  const handleRegenerate = () => {
    setGenerationState({ step: 'idle', progress: 0, message: '' })
    handleGenerate()
  }

  const handleReset = () => {
    setCurrentStep(1)
    setUserImage('')
    setUserImageFile(null)
    setSelectedProduct(null)
    setGenerationState({ step: 'idle', progress: 0, message: '' })
  }

  const canProceedToGenerate = userImage && selectedProduct

  return (
    <div className="min-h-screen bg-cream">
      {/* Minimal header */}
      <header className="glass border-b border-sand-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-navy-500 hover:text-navy-900 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-label" style={{ fontSize: '0.6rem' }}>Voltar</span>
          </Link>

          <div className="text-center">
            <p className="font-display text-sm tracking-widest text-navy-900" style={{ letterSpacing: '0.2em' }}>
              LA CAMICERIA
            </p>
            <p className="text-label text-sand-500" style={{ fontSize: '0.5rem' }}>PROVADOR VIRTUAL</p>
          </div>

          <div className="w-16" /> {/* spacer */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Step indicator */}
        {generationState.step === 'idle' && (
          <div className="mb-12">
            <StepIndicator currentStep={currentStep} />
          </div>
        )}

        {/* Step 1: Upload */}
        {currentStep === 1 && generationState.step === 'idle' && (
          <div className="max-w-md mx-auto animate-fade-up">
            <div className="text-center mb-10">
              <p className="text-label text-sand-500 mb-3" style={{ fontSize: '0.65rem' }}>ETAPA 1 DE 3</p>
              <h2 className="font-display text-4xl text-navy-900 mb-3">
                Sua foto
              </h2>
              <p className="font-serif italic text-sand-500 text-lg">
                Comece enviando uma foto sua
              </p>
            </div>

            <ImageUpload
              onImageSelect={handleImageSelect}
              currentImage={userImage}
            />

            {userImage && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="btn-primary"
                >
                  Escolher Peça
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Product selection */}
        {currentStep === 2 && generationState.step === 'idle' && (
          <div className="animate-fade-up">
            <div className="text-center mb-10">
              <p className="text-label text-sand-500 mb-3" style={{ fontSize: '0.65rem' }}>ETAPA 2 DE 3</p>
              <h2 className="font-display text-4xl text-navy-900 mb-3">
                Escolha a peça
              </h2>
              <p className="font-serif italic text-sand-500 text-lg">
                Nossa coleção exclusiva
              </p>
            </div>

            <ProductGrid
              onSelect={setSelectedProduct}
              selectedId={selectedProduct?.id}
            />

            {/* Action bar */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-ghost"
              >
                ← Voltar
              </button>

              {selectedProduct && (
                <button
                  onClick={handleGenerate}
                  className="btn-primary py-4 px-10 text-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2l1.6 4H14l-3.4 2.5L12 13 8 10.5 4 13l1.4-4.5L2 6h4.4L8 2z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
                  </svg>
                  Gerar Look — {selectedProduct.name}
                </button>
              )}
            </div>

            {/* Selected product preview */}
            {selectedProduct && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-sand-200/60">
                  <div className="w-3 h-3 rounded-full" style={{ background: selectedProduct.colors[0] }} />
                  <p className="text-label text-navy-700" style={{ fontSize: '0.65rem' }}>
                    {selectedProduct.categoryLabel.toUpperCase()} — {selectedProduct.name}
                  </p>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-sand-400 hover:text-navy-700 transition-colors ml-1"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Generation */}
        {currentStep === 3 && (
          <div className="max-w-3xl mx-auto animate-fade-up">
            <GenerationResult
              state={generationState}
              productName={selectedProduct?.name}
              userImage={userImage}
              onRegenerate={handleRegenerate}
              onReset={handleReset}
            />
          </div>
        )}
      </main>

      <HistoryPanel />
    </div>
  )
}
