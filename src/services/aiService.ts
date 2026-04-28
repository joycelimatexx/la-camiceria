// ============================================
// LA CAMICERIA — AI Generation Service
// ============================================

import { GenerateRequest, GenerateResponse } from '@/types'

/**
 * Gera o prompt automático para o try-on
 */
export function buildTryOnPrompt(productName: string, category: string): string {
  const categoryContext: Record<string, string> = {
    camisa: 'dress shirt with collar and buttons',
    polo: 'polo shirt with collar',
    bermuda: 'tailored shorts below the knee',
    trico: 'knitted sweater with fine texture',
    blazer: 'unstructured linen blazer',
  }

  const clothingType = categoryContext[category] || 'clothing item'

  return `High-end fashion editorial photography. A sophisticated man wearing a ${clothingType} called "${productName}" by La Camiceria. 

The garment is applied realistically onto the person: preserve exact clothing color, fabric texture, stitching details, and natural drape. Maintain the person's face, body proportions, and natural pose.

Style: Mediterranean luxury resort campaign. Natural golden-hour lighting, white linen background or seaside setting. Minimalist luxury fashion photography. Clean, breathable, effortless elegance. Shot on medium format camera. Sharp details on fabric texture, soft bokeh background. Color grading: warm whites, deep navy shadows, sand highlights.

Quality: photorealistic, 8k resolution, professional fashion campaign, no artifacts.`
}

/**
 * Gera imagem via OpenAI DALL-E 3
 */
export async function generateWithOpenAI(request: GenerateRequest): Promise<GenerateResponse> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return { success: false, error: 'OpenAI API key não configurada.' }
  }

  const prompt = buildTryOnPrompt(request.productName, request.productCategory)

  try {
    // Para DALL-E 3 com imagem de referência, usar a edição de imagem
    // Nota: DALL-E 3 edits requerem PNG com canal alpha
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        size: '1024x1024',
        quality: 'hd',
        n: 1,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error?.message || 'Erro na geração.' }
    }

    const data = await response.json()
    const imageUrl = data.data?.[0]?.url

    if (!imageUrl) {
      return { success: false, error: 'Nenhuma imagem gerada.' }
    }

    return { success: true, imageUrl }
  } catch (error) {
    return { success: false, error: 'Erro de conexão com OpenAI.' }
  }
}

/**
 * Gera imagem via Freepik Mystic
 */
export async function generateWithFreepik(request: GenerateRequest): Promise<GenerateResponse> {
  const apiKey = process.env.FREEPIK_API_KEY
  if (!apiKey) {
    return { success: false, error: 'Freepik API key não configurada.' }
  }

  const prompt = buildTryOnPrompt(request.productName, request.productCategory)

  try {
    // Freepik Mystic API
    const response = await fetch('https://api.freepik.com/v1/ai/text-to-image', {
      method: 'POST',
      headers: {
        'x-freepik-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        negative_prompt: 'blurry, low quality, distorted face, wrong proportions, artifacts, ugly, bad anatomy',
        guidance_scale: 7,
        num_images: 1,
        image: {
          size: '1:1',
        },
        styling: {
          style: 'photo',
          color: 'warm',
          lightning: 'studio',
          framing: 'full-body',
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Erro na geração Freepik.' }
    }

    const data = await response.json()
    const imageUrl = data.data?.[0]?.base64
      ? `data:image/jpeg;base64,${data.data[0].base64}`
      : data.data?.[0]?.url

    if (!imageUrl) {
      return { success: false, error: 'Nenhuma imagem gerada.' }
    }

    return { success: true, imageUrl }
  } catch (error) {
    return { success: false, error: 'Erro de conexão com Freepik.' }
  }
}

/**
 * Dispatcher principal — usa o provider configurado
 */
export async function generateTryOnImage(request: GenerateRequest): Promise<GenerateResponse> {
  // Prioridade: OpenAI > Freepik > Mock
  if (process.env.OPENAI_API_KEY) {
    return generateWithOpenAI(request)
  }

  if (process.env.FREEPIK_API_KEY) {
    return generateWithFreepik(request)
  }

  // Modo demo sem API
  await new Promise(resolve => setTimeout(resolve, 3000))
  return {
    success: true,
    imageUrl: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&q=80`,
  }
}
