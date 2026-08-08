import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import {
  adminSetOfficePassword,
  ANTONELLA_EMAIL,
  OFFICE_ACCESS_COOKIE,
  OFFICE_REFRESH_COOKIE,
  officeCookieOptions,
  requireSchedulingIdentity,
  signInOffice,
} from '@/lib/office-auth'
import { supabaseRequest } from '@/lib/supabase-rest'

type ActivationRow = {
  id: string
  user_id: string
  email: string
  expires_at: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: unknown
      password?: unknown
    }
    const token = typeof body.token === 'string' ? body.token.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!/^[A-Za-z0-9_-]{32,160}$/.test(token) || password.length < 12) {
      return NextResponse.json({ error: 'Solicitud de activación inválida.' }, { status: 400 })
    }

    const tokenHash = createHash('sha256').update(token).digest('hex')
    const now = new Date().toISOString()
    const { data: rows } = await supabaseRequest<ActivationRow[]>(
      `office_activation_tokens?token_hash=eq.${tokenHash}&used_at=is.null&expires_at=gt.${encodeURIComponent(now)}&select=id,user_id,email,expires_at&limit=1`,
    )
    const activation = rows[0]
    if (!activation || activation.email.toLowerCase() !== ANTONELLA_EMAIL) {
      return NextResponse.json({ error: 'El enlace no es válido o ya expiró.' }, { status: 401 })
    }

    await adminSetOfficePassword(activation.user_id, password)

    await supabaseRequest(
      `office_activation_tokens?id=eq.${encodeURIComponent(activation.id)}&used_at=is.null`,
      {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ used_at: now }),
      },
    )

    const session = await signInOffice(ANTONELLA_EMAIL, password)
    await requireSchedulingIdentity(session.access_token)

    const response = NextResponse.json({ ok: true })
    response.cookies.set(
      OFFICE_ACCESS_COOKIE,
      session.access_token,
      officeCookieOptions(Math.max(60, session.expires_in - 30)),
    )
    response.cookies.set(
      OFFICE_REFRESH_COOKIE,
      session.refresh_token,
      officeCookieOptions(60 * 60 * 24 * 30),
    )
    return response
  } catch (error) {
    console.error('[Casa Bernocchi] Office activation failed:', error)
    return NextResponse.json({ error: 'No fue posible activar el acceso.' }, { status: 401 })
  }
}
