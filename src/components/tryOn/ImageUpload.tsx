'use client'

import { useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void
  currentImage?: string
}

export default function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState<string>('')
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    setError('')
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Formato inválido. Use JPG ou PNG.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 10MB.')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => { onImageSelect(file, reader.result as string) }
    reader.readAsDataURL(file)
  }, [onImageSelect])

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setIsDragActive(false)
    if (rejectedFiles.length > 0) { setError('Formato inválido.'); return }
    if (acceptedFiles[0]) processFile(acceptedFiles[0])
  }, [processFile])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    noClick: true,
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  if (currentImage) {
    return (
      <div className="relative group">
        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-sand-100">
          <img src={currentImage} alt="Sua foto" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-navy-900/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-6">
          <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border border-cream/60 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 7a2 2 0 0 1 2-2h.5l1-2h5l1 2H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" stroke="white" strokeWidth="1.2"/>
                <circle cx="10" cy="11" r="2.5" stroke="white" strokeWidth="1.2"/>
              </svg>
            </div>
            <span className="text-label text-cream" style={{fontSize:'0.6rem'}}>Câmera</span>
          </button>
          <button onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border border-cream/60 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="16" height="16" rx="3" stroke="white" strokeWidth="1.2"/>
                <circle cx="7" cy="7" r="1.5" stroke="white" strokeWidth="1.2"/>
                <path d="M2 13l4-4 3 3 3-3 4 4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-label text-cream" style={{fontSize:'0.6rem'}}>Galeria</span>
          </button>
        </div>
        <div className="absolute top-3 right-3 w-8 h-8 bg-navy-900 rounded-full flex items-center justify-center shadow-md">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7L6 11L12 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <input ref={cameraInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleInput}/>
        <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleInput}/>
      </div>
    )
  }

  return (
    <div>
      <div {...getRootProps()} className={`dropzone aspect-[3/4] flex flex-col items-center justify-center p-8 transition-all duration-300 ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-6 transition-all duration-300 ${isDragActive ? 'border-navy-900' : 'border-sand-300'}`}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 10a3 3 0 0 1 3-3h1l1.5-3h7L18 7h3a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V10z" stroke={isDragActive ? '#102A43' : '#9FB3C8'} strokeWidth="1.2"/>
            <circle cx="14" cy="15" r="3.5" stroke={isDragActive ? '#102A43' : '#9FB3C8'} strokeWidth="1.2"/>
          </svg>
        </div>
        <p className="font-serif text-navy-700 text-lg mb-1 text-center">Adicione sua foto</p>
        <p className="font-body text-sand-500 text-sm text-center mb-6">Tire uma foto ou escolha da galeria</p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 btn-primary py-3 px-4 text-xs">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.5 6a1.5 1.5 0 0 1 1.5-1.5h.4l.9-1.8h5.4l.9 1.8h.9A1.5 1.5 0 0 1 13 6v6a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1.5 12V6z" stroke="currentColor" strokeWidth="1.1"/>
              <circle cx="7.25" cy="9" r="2" stroke="currentColor" strokeWidth="1.1"/>
            </svg>
            Tirar Foto
          </button>
          <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 btn-ghost py-3 px-4 text-xs">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.1"/>
              <circle cx="5.5" cy="5.5" r="1.2" stroke="currentColor" strokeWidth="1.1"/>
              <path d="M1.5 10.5l3.5-3 2.5 2.5 2.5-2.5 3.5 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Galeria
          </button>
        </div>

        <div className="flex items-center gap-2 mt-5">
          {['JPG','PNG','WebP'].map(fmt => (
            <span key={fmt} className="text-label text-sand-400 bg-sand-100 px-2 py-0.5 rounded" style={{fontSize:'0.6rem'}}>{fmt}</span>
          ))}
          <span className="text-label text-sand-400" style={{fontSize:'0.6rem'}}>· Máx 10MB</span>
        </div>
      </div>

      {error && <p className="mt-3 text-center font-body text-sm text-red-500">{error}</p>}
      <p className="mt-4 text-center font-body text-xs text-sand-400">Para melhor resultado, use fundo neutro e rosto visível</p>

      <input ref={cameraInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleInput}/>
      <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleInput}/>
    </div>
  )
}
