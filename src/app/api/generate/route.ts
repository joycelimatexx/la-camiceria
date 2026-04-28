// ============================================
// LA CAMICERIA — Generate API Route
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { generateTryOnImage } from '@/services/aiService'
import { GenerateRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()

    const { userImageBase64, productImageUrl, productName, productCategory } = body

    if (!productName || !productCategory) {
      return NextResponse.json(
        { success: false, error: 'Produto não selecionado.' },
        { status: 400 }
      )
    }

    if (!userImageBase64) {
      return NextResponse.json(
        { success: false, error: 'Foto do usuário não enviada.' },
        { status: 400 }
      )
    }

    const result = await generateTryOnImage({
      userImageBase64,
      productImageUrl,
      productName,
      productCategory,
    })

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[Generate API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60
