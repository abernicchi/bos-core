const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bernocchiglobale.it').replace(/\/$/, '')
const email = 'segreteria@bernocchiglobale.it'

if (!baseUrl || !serviceKey) {
  console.log('[Casa Bernocchi] Antonella bootstrap skipped: Supabase auth not configured for build.')
  process.exit(0)
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
}

async function json(response) {
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new Error(`${response.status}:${JSON.stringify(data)}`)
  return data
}

let user
const listed = await json(await fetch(`${baseUrl}/auth/v1/admin/users?page=1&per_page=1000`, { headers }))
const users = Array.isArray(listed?.users) ? listed.users : []
user = users.find((item) => String(item?.email ?? '').toLowerCase() === email)

if (!user) {
  user = await json(await fetch(`${baseUrl}/auth/v1/invite?redirect_to=${encodeURIComponent(`${siteUrl}/office/activate`)}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email,
      data: {
        display_name: 'Antonella · Segreteria Generale',
        institutional_role: 'scheduling_manager',
      },
    }),
  }))
  console.log('[Casa Bernocchi] Segreteria activation invitation issued.')
} else {
  console.log('[Casa Bernocchi] Segreteria auth user already exists; invitation not duplicated.')
}

if (!user?.id) throw new Error('Antonella bootstrap: missing auth user id')

await json(await fetch(`${baseUrl}/rest/v1/scheduling_staff_profiles?on_conflict=user_id`, {
  method: 'POST',
  headers: {
    ...headers,
    Prefer: 'resolution=merge-duplicates,return=representation',
  },
  body: JSON.stringify({
    user_id: user.id,
    display_name: 'Antonella · Segreteria Generale',
    role: 'scheduling_manager',
    status: 'active',
    can_create_appointments: true,
    can_reschedule_appointments: true,
    can_cancel_appointments: true,
    can_create_payment_links: true,
    max_payment_amount_minor: 500000,
    updated_at: new Date().toISOString(),
  }),
}))

console.log('[Casa Bernocchi] Antonella scheduling profile ensured.')
