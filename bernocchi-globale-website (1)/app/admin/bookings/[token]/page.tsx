import { notFound } from 'next/navigation'
import { verifyAdminToken } from '@/lib/admin-token'
import { getEvent } from '@/lib/google-calendar'

const resultLabels: Record<string, string> = {
  confirmed: 'La cita fue confirmada y la notificación definitiva fue procesada.',
  'confirmed-email-error': 'La cita fue confirmada, pero el correo no pudo enviarse. Contacte al paciente manualmente.',
  expired: 'La reserva provisional venció y no puede confirmarse. Debe generarse una nueva solicitud.',
  conflict: 'El intervalo ya no está disponible. La reserva no fue confirmada.',
  'meet-pending': 'Google Meet continúa preparándose. La cita está confirmada; reintente para completar el correo.',
  'meet-failed': 'Google no pudo generar Meet. La cita permanece confirmada y puede reintentarse.',
  released: 'El horario fue liberado.', cancelled: 'La solicitud fue cancelada.', error: 'No fue posible completar la operación.',
}

export default async function Review({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ result?: string }> }) {
  const { token } = await params; const payload = verifyAdminToken(token); if (!payload) notFound()
  const result = (await searchParams).result
  let event
  try { event = await getEvent(payload.eventId) } catch { event = undefined }
  const p = event?.extendedProperties?.private ?? {}
  const expired = p.bookingStatus === 'pending_deposit' && Boolean(p.holdExpiresAt) && new Date(p.holdExpiresAt) <= new Date()
  const status = result === 'released' ? 'liberada' : result === 'cancelled' ? 'cancelada' : expired || result === 'expired' ? 'vencida' : p.bookingStatus === 'confirmed' ? 'confirmada' : 'pendiente'
  const actionable = status === 'pendiente'
  return <main className="mx-auto min-h-screen max-w-2xl bg-[#fffdf9] px-6 py-20 text-[#142034]"><p className="text-xs uppercase tracking-[.2em] text-[#9b7b40]">Segreteria Generale</p><h1 className="mt-3 font-serif text-4xl">Revisión de reserva</h1>{result && resultLabels[result] ? <p role="status" className="mt-6 border-l-4 border-[#B9964A] bg-[#F3EFE5] p-4">{resultLabels[result]}</p> : null}<dl className="mt-8 grid gap-3 border-y py-6"><div><dt className="font-semibold">Identificador</dt><dd>{payload.eventId}</dd></div><div><dt className="font-semibold">Consulta</dt><dd>{p.consultation ?? '—'}</dd></div><div><dt className="font-semibold">Estado</dt><dd className="capitalize">{status}</dd></div><div><dt className="font-semibold">Paciente</dt><dd>{p.patientName ?? '—'} — {p.patientEmail ?? '—'} — {p.patientWhatsapp ?? '—'}</dd></div></dl>{actionable ? <form action="/api/admin/booking" method="post" className="mt-8 flex flex-wrap gap-3"><input type="hidden" name="token" value={token}/><button name="action" value="confirm" className="bg-[#b9964a] px-5 py-3 font-semibold text-[#07131f]">Confirmar depósito y cita</button><button name="action" value="release" className="border px-5 py-3">Liberar horario</button><button name="action" value="cancel" className="border px-5 py-3">Cancelar sin confirmar</button></form> : <p className="mt-8 text-sm">No hay acciones adicionales disponibles para esta solicitud.</p>}</main>
}
