// ============================================
// LA CAMICERIA — Type Definitions
// ============================================

export type ProductCategory = 'camisa' | 'polo' | 'bermuda' | 'trico' | 'blazer' | 'costume'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  categoryLabel: string
  imageUrl: string
  colors: string[]
  description: string
  featured?: boolean
}

export type GenerationStep = 
  | 'idle'
  | 'uploading'
  | 'processing'
  | 'generating'
  | 'done'
  | 'error'

export interface GenerationState {
  step: GenerationStep
  progress: number
  message: string
  resultUrl?: string
  error?: string
}

export interface GenerationHistory {
  id: string
  productId: string
  productName: string
  resultUrl: string
  createdAt: string
}

export interface GenerateRequest {
  userImageBase64: string
  productImageUrl: string
  productName: string
  productCategory: string
}

export interface GenerateResponse {
  success: boolean
  imageUrl?: string
  error?: string
}
