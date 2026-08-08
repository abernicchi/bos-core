import { NextResponse } from 'next/server'
import {
  OFFICE_ACCESS_COOKIE,
  OFFICE_REFRESH_COOKIE,
  officeCookieOptions,
  requireSchedulingIdentity,
  setOfficePassword,
} from '@/lib/office-auth'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      accessToken?: unknown
      refreshToken?: unknown
      password?: unknown
    }
    const accessToken = typeof body.accessToken === 'string' ? body.accessToken : ''
    const refreshToken = typeof body.refreshToken === 'string' ? body.refreshToken : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!accessToken || password.length < 12) {
      return NextResponse.json({ error: 'Solicitud de activación inválida.' }, { status: 400 })
    }

    await requireSchedulingIdentity(accessToken)
    await setOfficePassword(accessToken, password)

    const response = NextResponse.json({ ok: true })
    response.cookies.set(OFFICE_ACCESS_COOKIE, accessToken, officeCookieOptions(60 * 55))
    if (refreshToken) {
      response.cookies.set(
        OFFICE_REFRESH_COOKIE,
        refreshToken,
        officeCookieOptions(60 * 60 * 24 * 30),
      )
    }
    return response
  } catch (error) {
    console.error('[Casa Bernocchi] Office activation failed:', error)
    return NextResponse.json({ error: 'El enlace no es válido o ya expiró.' }, { status: 401 })
  }
}
