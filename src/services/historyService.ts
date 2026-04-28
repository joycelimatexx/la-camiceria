// ============================================
// LA CAMICERIA — History Service (Client)
// ============================================

import { GenerationHistory } from '@/types'

const HISTORY_KEY = 'lacamiceria_history'
const MAX_HISTORY = 10

export function saveToHistory(item: Omit<GenerationHistory, 'id' | 'createdAt'>): void {
  if (typeof window === 'undefined') return

  const history = getHistory()
  const newItem: GenerationHistory = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }

  const updated = [newItem, ...history].slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}

export function getHistory(): GenerationHistory[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(HISTORY_KEY)
}

export function downloadImage(url: string, filename?: string): void {
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `lacamiceria-look-${Date.now()}.jpg`
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
