'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void
  currentImage?: string
}

export default function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('')
    setIsDragActive(false)

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('Arquivo muito grande. Máximo 10MB.')
      } else {
        setError('Formato inválido. Use JPG ou PNG.')
      }
      return
    }

    const file = acceptedFiles[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      onImageSelect(file, reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [onImageSelect])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  if (currentImage) {
    return (
      <div className="relative group">
        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-sand-100">
          <img
            src={currentImage}
            alt="Sua foto"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-navy-900/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div
            {...getRootProps()}
            className="cursor-pointer text-center p-6"
          >
            <input {...getInputProps()} />
            <div className="w-12 h-12 rounded-full border border-cream/60 flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3v14M3 10h14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-cream font-body text-sm">Trocar foto</p>
          </div>
        </div>

        {/* Check badge */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-navy-900 rounded-full flex items-center justify-center shadow-md">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7L6 11L12 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`dropzone aspect-[3/4] flex flex-col items-center justify-center p-8 transition-all duration-300 ${
          isDragActive ? 'active' : ''
        }`}
      >
        <input {...getInputProps()} />

        {/* Icon */}
        <div className={`w-16 h-16 rounded-full border border-sand-300 flex items-center justify-center mb-6 transition-all duration-300 ${isDragActive ? 'border-navy-900 bg-navy-900/5' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 16V8M8 12l4-4 4 4" stroke={isDragActive ? '#102A43' : '#9FB3C8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="3" width="18" height="18" rx="4" stroke={isDragActive ? '#102A43' : '#C8B49A'} strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        </div>

        <div className="text-center">
          <p className="font-serif text-navy-700 text-lg mb-2">
            {isDragActive ? 'Solte aqui' : 'Faça upload da sua foto'}
          </p>
          <p className="font-body text-sand-500 text-sm mb-4">
            ou clique para selecionar
          </p>
          <div className="flex items-center justify-center gap-3">
            {['JPG', 'PNG', 'WebP'].map(fmt => (
              <span key={fmt} className="text-label text-sand-400 bg-sand-100 px-2 py-1 rounded" style={{ fontSize: '0.6rem' }}>
                {fmt}
              </span>
            ))}
            <span className="text-label text-sand-400" style={{ fontSize: '0.6rem' }}>· Máx 10MB</span>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-center font-body text-sm text-red-500">{error}</p>
      )}

      <p className="mt-4 text-center font-body text-xs text-sand-400">
        Para melhores resultados, use foto de rosto visível e fundo neutro
      </p>
    </div>
  )
}
