import { GenerateRequest, GenerateResponse } from '@/types'

export async function generateWithOpenAI(request: GenerateRequest): Promise<GenerateResponse> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return { success: false, error: 'OpenAI API key não configurada.' }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `Person wearing ${request.productName} by La Camiceria. Mediterranean luxury fashion photography.`,
        size: '1024x1024',
        quality: 'hd',
        n: 1,
      }),
    })
    const data = await response.json()
    const imageUrl = data.data?.[0]?.url
    if (!imageUrl) return { success: false, error: 'Nenhuma imagem gerada.' }
    return { success: true, imageUrl }
  } catch {
    return { success: false, error: 'Erro de conexão com OpenAI.' }
  }
}
