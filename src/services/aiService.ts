// ============================================
// LA CAMICERIA — AI Service
// Primary: Kling kolors-virtual-try-on
// Fallback: OpenAI GPT-4o + DALL-E 3
// ============================================

import { GenerateRequest, GenerateResponse } from '@/types'
import * as crypto from 'crypto'

// ─────────────────────────────────────────
// KLING — Auth (JWT HS256)
// ─────────────────────────────────────────

function generateKlingToken(accessKeyId: string, secretAccessKey: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const now = Math.floor(Date.now() / 1000)
  const payload = Buffer.from(
    JSON.stringify({ iss: accessKeyId, exp: now + 1800, nbf: now - 5 })
  ).toString('base64url')

  const signature = crypto
    .createHmac('sha256', secretAccessKey)
    .update(`${header}.${payload}`)
    .digest('base64url')

  return `${header}.${payload}.${signature}`
}

// ─────────────────────────────────────────
// KLING — Submit virtual try-on task
// ─────────────────────────────────────────

async function submitKlingTryOn(
  humanImageBase64: string,
  clothImageBase64: string,
  token: string
): Promise<string> {
  const response = await fetch(
    'https://api.klingai.com/v1/images/kolors-virtual-try-on',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        human_image: humanImageBase64,
        cloth_image: clothImageBase64,
      }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Kling submit failed: ${response.status} — ${err}`)
  }

  const data = await response.json()

  // API retorna { code, message, data: { task_id } }
  if (data.code !== 0) {
    throw new Error(`Kling API error: ${data.message}`)
  }

  return data.data.task_id as string
}

// ─────────────────────────────────────────
// KLING — Poll until done (max ~55s)
// ─────────────────────────────────────────

async function pollKlingResult(taskId: string, token: string): Promise<string> {
  const MAX_ATTEMPTS = 18   // 18 × 3s = 54s (dentro do maxDuration: 60)
  const INTERVAL_MS = 3000

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    await new Promise(r => setTimeout(r, INTERVAL_MS))

    const response = await fetch(
      `https://api.klingai.com/v1/images/kolors-virtual-try-on/${taskId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    if (!response.ok) {
      throw new Error(`Kling poll failed: ${response.status}`)
    }

    const data = await response.json()

    if (data.code !== 0) {
      throw new Error(`Kling poll error: ${data.message}`)
    }

    const taskStatus: string = data.data.task_status

    if (taskStatus === 'succeed') {
      // data.data.task_result.images[0].url
      const url: string = data.data.task_result?.images?.[0]?.url
      if (!url) throw new Error('Kling: task succeeded but no image URL returned.')
      return url
    }

    if (taskStatus === 'failed') {
      throw new Error(`Kling task failed: ${data.data.task_status_msg || 'unknown reason'}`)
    }

    // taskStatus === 'processing' | 'submitted' → continua polling
  }

  throw new Error('Kling timeout: tarefa não concluída em 54s.')
}

// ─────────────────────────────────────────
// KLING — Pipeline completo
// ─────────────────────────────────────────

async function generateWithKling(
  userImageBase64: string,
  productImageBase64: string
): Promise<string> {
  const accessKeyId = process.env.KLING_ACCESS_KEY_ID!
  const secretAccessKey = process.env.KLING_SECRET_ACCESS_KEY!

  const token = generateKlingToken(accessKeyId, secretAccessKey)
  const taskId = await submitKlingTryOn(userImageBase64, productImageBase64, token)
  const imageUrl = await pollKlingResult(taskId, token)

  return imageUrl
}

// ─────────────────────────────────────────
// OPENAI FALLBACK — GPT-4o + DALL-E 3
// ─────────────────────────────────────────

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
      Authorization: `Bearer ${apiKey}`,
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
              image_url: { url: `data:image/jpeg;base64,${userImageBase64}`, detail: 'high' },
            },
            {
              type: 'image_url',
              image_url: { url: productFullUrl, detail: 'high' },
            },
          ],
        },
      ],
    }),
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

async function generateImageWithDALLE(prompt: string, apiKey: string): Promise<string | null> {
  const finalPrompt = `${prompt}

IMPORTANT: This is a premium fashion campaign photo for La Camiceria. 
Ultra-realistic photography, 8k quality, professional studio lighting with natural tones.
Mediterranean luxury aesthetic. The person's face and physical characteristics must match exactly.
No artistic filters, pure photorealistic result.`

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
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

// ─────────────────────────────────────────
// EXPORT PRINCIPAL
// ─────────────────────────────────────────

export async function generateTryOnImage(request: GenerateRequest): Promise<GenerateResponse> {
  const klingKey = process.env.KLING_ACCESS_KEY_ID
  const klingSecret = process.env.KLING_SECRET_ACCESS_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  // ── Modo demo (sem nenhuma key)
  if (!klingKey && !openaiKey) {
    await new Promise(resolve => setTimeout(resolve, 3000))
    return {
      success: true,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&q=80',
    }
  }

  // ── Kling (primary)
  if (klingKey && klingSecret) {
    try {
      // productImageUrl pode ser path local (/products/...) ou URL externa
      // Precisamos do base64 da peça — o frontend deve enviar productImageBase64
      // Se não vier, tentamos converter a URL para base64 via fetch
      let clothBase64 = request.productImageBase64 || ''

      if (!clothBase64 && request.productImageUrl) {
        const productFullUrl = request.productImageUrl.startsWith('/')
          ? `${process.env.NEXT_PUBLIC_APP_URL}${request.productImageUrl}`
          : request.productImageUrl

        const imgRes = await fetch(productFullUrl)
        const buffer = await imgRes.arrayBuffer()
        clothBase64 = Buffer.from(buffer).toString('base64')
      }

      if (!clothBase64) {
        throw new Error('Não foi possível obter imagem da peça.')
      }

      const imageUrl = await generateWithKling(request.userImageBase64, clothBase64)
      return { success: true, imageUrl }
    } catch (error) {
      console.error('[Kling] Error:', error)

      // Fallback para OpenAI se disponível
      if (!openaiKey) {
        return { success: false, error: 'Erro na geração com Kling. Tente novamente.' }
      }
      console.warn('[Kling] Falling back to OpenAI...')
    }
  }

  // ── OpenAI fallback
  try {
    const detailedPrompt = await analyzeImagesWithGPT4o(
      request.userImageBase64,
      request.productImageUrl,
      request.productName,
      openaiKey!
    )

    if (!detailedPrompt) {
      return { success: false, error: 'Não foi possível analisar as imagens.' }
    }

    const imageUrl = await generateImageWithDALLE(detailedPrompt, openaiKey!)
    if (!imageUrl) {
      return { success: false, error: 'Não foi possível gerar a imagem.' }
    }

    return { success: true, imageUrl }
  } catch (error) {
    console.error('[OpenAI Fallback] Error:', error)
    return { success: false, error: 'Erro na geração. Tente novamente.' }
  }
}
