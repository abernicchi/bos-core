import { notFound } from 'next/navigation'
import { verifyAdminToken } from '@/lib/admin-token'
import { getEvent } from '@/lib/google-calendar'

export default async function Review({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params; const payload = verifyAdminToken(token); if (!payload) notFound()
  const event = await getEvent(payload.eventId); const p = event.extendedProperties?.private ?? {}
  return <main className="mx-auto min-h-screen max-w-2xl bg-[#fffdf9] px-6 py-20 text-[#142034]"><p className="text-xs uppercase tracking-[.2em] text-[#9b7b40]">Segreteria Generale</p><h1 className="mt-3 font-serif text-4xl">Revisión de reserva</h1><dl className="mt-8 grid gap-3 border-y py-6"><div><dt className="font-semibold">Identificador</dt><dd>{event.id}</dd></div><div><dt className="font-semibold">Consulta</dt><dd>{p.consultation}</dd></div><div><dt className="font-semibold">Estado</dt><dd>{p.bookingStatus}</dd></div><div><dt className="font-semibold">Paciente</dt><dd>{p.patientName} — {p.patientEmail} — {p.patientWhatsapp}</dd></div></dl><form action="/api/admin/booking" method="post" className="mt-8 flex flex-wrap gap-3"><input type="hidden" name="token" value={token}/><button name="action" value="confirm" className="bg-[#b9964a] px-5 py-3 font-semibold text-[#07131f]">Confirmar depósito y cita</button><button name="action" value="release" className="border px-5 py-3">Liberar horario</button><button name="action" value="cancel" className="border px-5 py-3">Cancelar sin confirmar</button></form></main>
}
