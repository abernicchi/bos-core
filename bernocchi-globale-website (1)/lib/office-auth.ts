import 'server-only'

import { supabaseRequest } from '@/lib/supabase-rest'

export const OFFICE_ACCESS_COOKIE = 'cb_office_access'
export const OFFICE_REFRESH_COOKIE = 'cb_office_refresh'
export const ANTONELLA_EMAIL = 'segreteria@bernocchiglobale.it'

function config() {
  const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!baseUrl || !serviceKey) throw new Error('SUPABASE_AUTH_NOT_CONFIGURED')
  return { baseUrl, serviceKey }
}

async function authRequest<T>(
  path: string,
  init: RequestInit = {},
  bearer?: string,
): Promise<T> {
  const { baseUrl, serviceKey } = config()
  const response = await fetch(`${baseUrl}/auth/v1/${path.replace(/^\//, '')}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${bearer ?? serviceKey}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  })
  const data = (await response.json().catch(() => null)) as T
  if (!response.ok) {
    throw new Error(`SUPABASE_AUTH_FAILED:${response.status}:${JSON.stringify(data)}`)
  }
  return data
}

export type OfficeAuthUser = {
  id: string
  email?: string
}

type TokenResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
  user: OfficeAuthUser
}

export async function signInOffice(email: string, password: string) {
  return authRequest<TokenResponse>('token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function refreshOfficeToken(refreshToken: string) {
  return authRequest<TokenResponse>('token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
}

export async function getOfficeAuthUser(accessToken: string) {
  return authRequest<OfficeAuthUser>('user', { method: 'GET' }, accessToken)
}

export async function setOfficePassword(accessToken: string, password: string) {
  return authRequest<OfficeAuthUser>(
    'user',
    { method: 'PUT', body: JSON.stringify({ password }) },
    accessToken,
  )
}

export async function inviteAntonella() {
  const redirectTo = `${(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bernocchiglobale.it').replace(/\/$/, '')}/office/activate`
  return authRequest<OfficeAuthUser>(
    `invite?redirect_to=${encodeURIComponent(redirectTo)}`,
    {
      method: 'POST',
      body: JSON.stringify({
        email: ANTONELLA_EMAIL,
        data: {
          display_name: 'Antonella · Segreteria Generale',
          institutional_role: 'scheduling_manager',
        },
      }),
    },
  )
}

export type SchedulingProfile = {
  user_id: string
  display_name: string
  role: string
  status: string
  can_create_appointments: boolean
  can_reschedule_appointments: boolean
  can_cancel_appointments: boolean
  can_create_payment_links: boolean
  max_payment_amount_minor: number
}

export async function getSchedulingProfile(userId: string) {
  const { data } = await supabaseRequest<SchedulingProfile[]>(
    `scheduling_staff_profiles?user_id=eq.${encodeURIComponent(userId)}&select=*&limit=1`,
  )
  return data[0]
}

export async function requireSchedulingIdentity(accessToken: string) {
  const user = await getOfficeAuthUser(accessToken)
  if (!user.id || user.email?.toLowerCase() !== ANTONELLA_EMAIL) {
    throw new Error('OFFICE_IDENTITY_DENIED')
  }
  const profile = await getSchedulingProfile(user.id)
  if (!profile || profile.status !== 'active') throw new Error('OFFICE_PROFILE_DENIED')
  return { user, profile }
}

export async function supabaseUserRequest<T>(
  path: string,
  accessToken: string,
  init: RequestInit = {},
): Promise<T> {
  const { baseUrl, serviceKey } = config()
  const response = await fetch(`${baseUrl}/rest/v1/${path.replace(/^\//, '')}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  })
  const data = (await response.json().catch(() => null)) as T
  if (!response.ok) {
    throw new Error(`SUPABASE_USER_REQUEST_FAILED:${response.status}:${JSON.stringify(data)}`)
  }
  return data
}

export const officeCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge,
})
