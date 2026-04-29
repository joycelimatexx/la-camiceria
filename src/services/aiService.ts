// ============================================
// LA CAMICERIA — AI Service (Replicate IDM-VTON)
// ============================================

import { GenerateRequest, GenerateResponse } from '@/types'

export function buildTryOnPrompt(productName: string, category: string): string {
  return `High-end fashion editorial. Person wearing ${productName} by La Camiceria. Mediterranean luxury, natural lighting, professional campaign photography.`
}

/**
 * Gera try-on real via Replicate IDM-VTON
 */
export async function generateWithReplicate(request: GenerateRequest): Promise<GenerateResponse> {
  const apiKey = process.env.REPLICATE_API_KEY
  if (!apiKey) {
    return { success: false, error: 'Replicate API key não configurada.' }
  }

  try {
    // Inicia a predição
    const startResponse = await fetch('https://api.replicate.com/v1/models/cuuupid/idm-vton/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait=60',
      },
      body: JSON.stringify({
        input: {
          human_img: `data:image/jpeg;base64,${request.userImageBase64}`,
          garm_img: request.productImageUrl,
          garment_des: `${request.productName} - ${request.productCategory} premium La Camiceria`,
          is_checked: true,
          is_checked_crop: false,
          denoise_steps: 30,
          seed: 42,
        },
      }),
    })

    if (!startResponse.ok) {
      const error = await startResponse.json()
      return { success: false, error: error.detail || 'Erro ao iniciar geração.' }
    }

    const prediction = await startResponse.json()

    // Se já veio com output (Prefer: wait)
    if (prediction.output) {
      return { success: true, imageUrl: prediction.output }
    }

    // Polling para aguardar o resultado
    const predictionId = prediction.id
    let attempts = 0
    const maxAttempts = 30

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 3000))
      attempts++

      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      })

      const poll = await pollResponse.json()

      if (poll.status === 'succeeded' && poll.output) {
        return { success: true, imageUrl: poll.output }
      }

      if (poll.status === 'failed') {
        return { success: false, error: poll.error || 'Geração falhou.' }
      }
    }

    return { success: false, error: 'Tempo esgotado. Tente novamente.' }

  } catch (error) {
    console.error('[Replicate] Error:', error)
    return { success: false, error: 'Erro de conexão com Replicate.' }
  }
}

/**
 * Dispatcher principal
 */
export async function generateTryOnImage(request: GenerateRequest): Promise<GenerateResponse> {
  if (process.env.REPLICATE_API_KEY) {
    return generateWithReplicate(request)
  }

  if (process.env.OPENAI_API_KEY) {
    const { generateWithOpenAI } = await import('./openaiService')
    return generateWithOpenAI(request)
  }

  // Modo demo
  await new Promise(resolve => setTimeout(resolve, 3000))
  return {
    success: true,
    imageUrl: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&q=80`,
  }
}
