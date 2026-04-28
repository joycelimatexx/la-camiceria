'use client'

import { useEffect, useState } from 'react'
import { GenerationHistory } from '@/types'
import { getHistory, clearHistory, downloadImage } from '@/services/historyService'

export default function HistoryPanel() {
  const [history, setHistory] = useState<GenerationHistory[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setHistory(getHistory())
  }, [isOpen])

  const handleClear = () => {
    clearHistory()
    setHistory([])
  }

  if (history.length === 0 && !isOpen) return null

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-navy text-cream rounded-full px-4 py-3 flex items-center gap-2 shadow-xl transition-all duration-300 hover:shadow-2xl"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h8M2 12h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span className="text-label text-cream" style={{ fontSize: '0.6rem' }}>
          Histórico ({history.length})
        </span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-72 glass rounded-2xl shadow-xl border border-sand-200/50 overflow-hidden animate-fade-up">
          <div className="p-4 border-b border-sand-200/50 flex items-center justify-between">
            <p className="text-label text-navy-700" style={{ fontSize: '0.6rem' }}>LOOKS GERADOS</p>
            <button
              onClick={handleClear}
              className="text-label text-sand-400 hover:text-red-400 transition-colors"
              style={{ fontSize: '0.6rem' }}
            >
              Limpar
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {history.length === 0 ? (
              <div className="p-6 text-center">
                <p className="font-body text-sand-400 text-sm">Nenhum look ainda.</p>
              </div>
            ) : (
              <div className="divide-y divide-sand-100">
                {history.map((item) => (
                  <div key={item.id} className="p-3 flex items-center gap-3 hover:bg-sand-50 transition-colors">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-sand-100 flex-shrink-0">
                      <img src={item.resultUrl} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-navy-900 text-xs font-medium truncate">{item.productName}</p>
                      <p className="text-label text-sand-400 mt-0.5" style={{ fontSize: '0.55rem' }}>
                        {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <button
                      onClick={() => downloadImage(item.resultUrl)}
                      className="flex-shrink-0 w-8 h-8 rounded-full border border-sand-200 flex items-center justify-center hover:border-navy-900 hover:text-navy-900 transition-all"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v7M3 5l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
