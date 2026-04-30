// ============================================
// LA CAMICERIA — Kling Diagnostic Route
// GET /api/kling-test
// ============================================

import { NextResponse } from 'next/server'
import * as crypto from 'crypto'

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

export async function GET() {
  const accessKeyId = process.env.KLING_ACCESS_KEY_ID
  const secretAccessKey = process.env.KLING_SECRET_ACCESS_KEY

  // 1. Checa se as keys existem
  if (!accessKeyId || !secretAccessKey) {
    return NextResponse.json({
      status: 'error',
      step: 'env',
      message: 'Keys não encontradas nas variáveis de ambiente.',
      KLING_ACCESS_KEY_ID: accessKeyId ? 'presente' : 'AUSENTE',
      KLING_SECRET_ACCESS_KEY: secretAccessKey ? 'presente' : 'AUSENTE',
    })
  }

  // 2. Gera o token
  let token: string
  try {
    token = generateKlingToken(accessKeyId, secretAccessKey)
  } catch (e) {
    return NextResponse.json({
      status: 'error',
      step: 'jwt',
      message: 'Erro ao gerar token JWT.',
      error: String(e),
    })
  }

  // 3. Testa chamada real na API da Kling (lista tasks — endpoint leve)
  try {
    const response = await fetch(
      'https://api.klingai.com/v1/images/kolors-virtual-try-on?pageNum=1&pageSize=1',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    const text = await response.text()
    let json: unknown
    try { json = JSON.parse(text) } catch { json = text }

    return NextResponse.json({
      status: response.ok ? 'ok' : 'error',
      step: 'api_call',
      http_status: response.status,
      kling_response: json,
      token_preview: token.slice(0, 40) + '...',
    })
  } catch (e) {
    return NextResponse.json({
      status: 'error',
      step: 'fetch',
      message: 'Erro ao conectar com a API da Kling.',
      error: String(e),
    })
  }
}

export const runtime = 'nodejs'
