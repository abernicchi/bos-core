import 'server-only'

type SupabaseRequestInit = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>
}

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export async function supabaseRequest<T>(
  path: string,
  init: SupabaseRequestInit = {},
): Promise<{ data: T; response: Response }> {
  const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!baseUrl || !key) {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }

  const headers: Record<string, string> = {
    apikey: key,
    'Content-Type': 'application/json',
    ...init.headers,
  }
  if (key.split('.').length === 3) headers.Authorization = `Bearer ${key}`

  const response = await fetch(`${baseUrl}/rest/v1/${path.replace(/^\//, '')}`, {
    ...init,
    headers,
    cache: 'no-store',
  })

  const data = (await response.json().catch(() => null)) as T
  if (!response.ok) {
    const detail = typeof data === 'string' ? data : JSON.stringify(data)
    throw new Error(`SUPABASE_REQUEST_FAILED:${response.status}:${detail}`)
  }

  return { data, response }
}
