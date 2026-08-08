import { NextResponse } from 'next/server'
import {
  ANTONELLA_EMAIL,
  OFFICE_ACCESS_COOKIE,
  OFFICE_REFRESH_COOKIE,
  officeCookieOptions,
  requireSchedulingIdentity,
  signInOffice,
} from '@/lib/office-auth'

export async function POST(request: Request) {
  const form = await request.formData()
  const email = String(form.get('email') ?? '').trim().toLowerCase()
  const password = String(form.get('password') ?? '')

  try {
    if (email !== ANTONELLA_EMAIL || password.length < 8) throw new Error('INVALID_LOGIN')
    const session = await signInOffice(email, password)
    await requireSchedulingIdentity(session.access_token)

    const response = NextResponse.redirect(new URL('/office', request.url), 303)
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
    console.error('[Casa Bernocchi] Office login failed:', error)
    return NextResponse.redirect(new URL('/office/login?error=1', request.url), 303)
  }
}
