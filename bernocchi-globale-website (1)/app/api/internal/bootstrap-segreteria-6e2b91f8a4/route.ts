import { NextResponse } from 'next/server'
import { ANTONELLA_EMAIL, inviteAntonella } from '@/lib/office-auth'
import { supabaseRequest } from '@/lib/supabase-rest'

export async function GET() {
  try {
    const user = await inviteAntonella()
    if (!user.id) throw new Error('INVITED_USER_ID_MISSING')

    await supabaseRequest('scheduling_staff_profiles?on_conflict=user_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
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
    })

    return NextResponse.json({
      ok: true,
      email: ANTONELLA_EMAIL,
      userId: user.id,
      activation: 'sent',
    })
  } catch (error) {
    console.error('[Casa Bernocchi] Segreteria bootstrap failed:', error)
    return NextResponse.json({ ok: false, error: 'No fue posible emitir la activación.' }, { status: 500 })
  }
}
