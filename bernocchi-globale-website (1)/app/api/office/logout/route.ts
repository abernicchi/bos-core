import { NextResponse } from 'next/server'
import { OFFICE_ACCESS_COOKIE, OFFICE_REFRESH_COOKIE } from '@/lib/office-auth'

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/office/login', request.url), 303)
  response.cookies.delete(OFFICE_ACCESS_COOKIE)
  response.cookies.delete(OFFICE_REFRESH_COOKIE)
  return response
}
