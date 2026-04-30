// ============================================
// LA CAMICERIA — AI Service (GPT-4o + DALL-E 3)
// ============================================

import { GenerateRequest, GenerateResponse } from '@/types'

/**
 * Passo 1: GPT-4o analisa as duas imagens e gera um prompt detalhado
 */
async function analyzeImagesWithGPT4o(
  userImageBase64: string,
  productImageUrl: string,
  productName: string,
  apiKey: string
): Promise<string> {

  const productFullUrl = productImageUrl.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_APP_URL}${productImageUrl}`
    : productImageUrl

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Você é um especialista em moda masculina premium. Analise as duas imagens abaixo:
              
IMAGEM 1: Foto de uma pessoa (o cliente)
IMAGEM 2: Peça de roupa "${productName}" da La Camiceria

Descreva em detalhes em inglês para gerar uma imagem realista do cliente vestindo essa peça:
- Descreva o rosto, cabelo, idade aparente, tom de pele e expressão da pessoa exatamente como está na foto
- Descreva o corpo, postura e pose exatamente como está
- Descreva a peça de roupa com todos os detalhes: cor exata, tecido, corte, textura, botões, detalhes
- O resultado deve parecer uma foto profissional de campanha premium
- Mantenha EXATAMENTE o rosto e características físicas da pessoa

Gere apenas o prompt em inglês, sem explicações adicionais.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${userImageBase64}`,
                detail: 'high',
              },
            },
            {
              type: 'image_url',
              image_url: {
                url: productFullUrl,
                detail: 'high',
              },
            },
          ],
        },
      ],
    }),
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

/**
 * Passo 2: DALL-E 3 gera a imagem com o prompt detalhado
 */
async function generateImageWithDALLE(prompt: string, apiKey: string): Promise<string | null> {
  const finalPrompt = `${prompt}

IMPORTANT: This is a premium fashion campaign photo for La Camiceria. 
Ultra-realistic photography, 8k quality, professional studio lighting with natural tones.
Mediterranean luxury aesthetic. The person's face and physical characteristics must match exactly.
No artistic filters, pure photorealistic result.`

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: finalPrompt,
      size: '1024x1792',
      quality: 'hd',
      n: 1,
    }),
  })

  const data = await response.json()
  return data.data?.[0]?.url || null
}

/**
 * Pipeline completo: GPT-4o análise → DALL-E 3 geração
 */
export async function generateTryOnImage(request: GenerateRequest): Promise<GenerateResponse> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    // Modo demo
    await new Promise(resolve => setTimeout(resolve, 3000))
    return {
      success: true,
      imageUrl: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&q=80`,
    }
  }

  try {
    // Passo 1: GPT-4o analisa as duas imagens
    const detailedPrompt = await analyzeImagesWithGPT4o(
      request.userImageBase64,
      request.productImageUrl,
      request.productName,
      apiKey
    )

    if (!detailedPrompt) {
      return { success: false, error: 'Não foi possível analisar as imagens.' }
    }

    // Passo 2: DALL-E 3 gera com o prompt detalhado
    const imageUrl = await generateImageWithDALLE(detailedPrompt, apiKey)

    if (!imageUrl) {
      return { success: false, error: 'Não foi possível gerar a imagem.' }
    }

    return { success: true, imageUrl }

  } catch (error) {
    console.error('[AI Service] Error:', error)
    return { success: false, error: 'Erro na geração. Tente novamente.' }
  }
}
