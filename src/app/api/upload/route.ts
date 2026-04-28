// ============================================
// LA CAMICERIA — Upload API Route
// ============================================

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'Nenhum arquivo enviado.' }, { status: 400 })
    }

    // Validar tipo
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Formato inválido. Use JPG, PNG ou WebP.' },
        { status: 400 }
      )
    }

    // Validar tamanho (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Arquivo muito grande. Máximo 10MB.' },
        { status: 400 }
      )
    }

    // Converter para base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // Se Cloudinary estiver configurado, fazer upload lá
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`
      
      const cloudFormData = new FormData()
      cloudFormData.append('file', dataUrl)
      cloudFormData.append('upload_preset', 'lacamiceria_tryon')
      cloudFormData.append('folder', 'lacamiceria/users')

      const cloudRes = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: cloudFormData,
      })

      if (cloudRes.ok) {
        const cloudData = await cloudRes.json()
        return NextResponse.json({
          success: true,
          url: cloudData.secure_url,
          base64: base64,
        })
      }
    }

    // Fallback: retornar base64 diretamente
    return NextResponse.json({
      success: true,
      url: dataUrl,
      base64: base64,
    })
  } catch (error) {
    console.error('[Upload API] Error:', error)
    return NextResponse.json({ success: false, error: 'Erro no upload.' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
