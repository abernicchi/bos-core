import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  OFFICE_ACCESS_COOKIE,
  OFFICE_REFRESH_COOKIE,
  officeCookieOptions,
  refreshOfficeToken,
  requireSchedulingIdentity,
} from '@/lib/office-auth'

export async function GET(request: Request) {
  const store = await cookies()
  const refreshToken = store.get(OFFICE_REFRESH_COOKIE)?.value
  const next = new URL(request.url).searchParams.get('next') || '/office'
  if (!refreshToken) return NextResponse.redirect(new URL('/office/login', request.url))

  try {
    const session = await refreshOfficeToken(refreshToken)
    await requireSchedulingIdentity(session.access_token)
    const response = NextResponse.redirect(new URL(next.startsWith('/') ? next : '/office', request.url))
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
    console.error('[Casa Bernocchi] Office token refresh failed:', error)
    const response = NextResponse.redirect(new URL('/office/login?error=1', request.url))
    response.cookies.delete(OFFICE_ACCESS_COOKIE)
    response.cookies.delete(OFFICE_REFRESH_COOKIE)
    return response
  }
}
