import 'server-only'

export type ReservationStatus = 'pending_deposit'|'confirmed'|'expired'|'released'|'cancelled'|'failed'
export type Reservation = { id:string; google_event_id?:string; status:ReservationStatus; confirmation_email_sent_at?:string; hold_expires_at?:string; start_at:string; end_at:string; consultation:string; consultation_id:string; mode:string; language:string; patient_name:string; patient_email:string; patient_whatsapp:string }
export class ReservationConflictError extends Error {}

function configuration() {
  const url = process.env.SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Reservation store is not configured')
  return { url: url.replace(/\/$/, ''), key }
}
async function request(path:string, init:RequestInit = {}) {
  const {url,key}=configuration(); const response=await fetch(`${url}/rest/v1/${path}`,{...init,headers:{apikey:key,authorization:`Bearer ${key}`,'content-type':'application/json',prefer:'return=representation',...init.headers}})
  const body=await response.text(); if (!response.ok) { if (response.status===409 || body.includes('booking_interval_conflict') || body.includes('23P01')) throw new ReservationConflictError(); throw new Error(`Reservation store failed (${response.status})`) }
  return body ? JSON.parse(body) : null
}
export async function reserveAtomic(input:{consultationId:string;consultation:string;mode:string;language:string;patientName:string;patientEmail:string;patientWhatsapp:string;startAt:string;endAt:string;holdExpiresAt:string}):Promise<Reservation>{
  const rows=await request('rpc/reserve_booking_atomic',{method:'POST',body:JSON.stringify({p_consultation_id:input.consultationId,p_consultation:input.consultation,p_mode:input.mode,p_language:input.language,p_patient_name:input.patientName,p_patient_email:input.patientEmail,p_patient_whatsapp:input.patientWhatsapp,p_start_at:input.startAt,p_end_at:input.endAt,p_hold_expires_at:input.holdExpiresAt})}); return Array.isArray(rows)?rows[0]:rows
}
export async function updateReservation(id:string, patch:Partial<Reservation>){ const rows=await request(`booking_reservations?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({...patch,updated_at:new Date().toISOString()})}); return rows?.[0] as Reservation|undefined }
export async function reservationByGoogleEvent(id:string){ const rows=await request(`booking_reservations?google_event_id=eq.${encodeURIComponent(id)}&limit=1`); return rows?.[0] as Reservation|undefined }
