const token = process.env.OFFICE_ACTIVATION_TOKEN
const resendKey = process.env.RESEND_API_KEY
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bernocchiglobale.it').replace(/\/$/, '')
const from = process.env.CONTACT_FROM_EMAIL ?? 'Casa Bernocchi <onboarding@resend.dev>'
const to = 'segreteria@bernocchiglobale.it'

if (!token || !resendKey) {
  console.error('[Casa Bernocchi] Activation delivery not configured.')
  process.exit(1)
}

const activationUrl = `${siteUrl}/office/activate?token=${encodeURIComponent(token)}`
const subject = 'Casa Bernocchi — Activación de Segreteria Console'
const text = [
  'SEGRETERIA GENERALE · CASA BERNOCCHI',
  '',
  'Antonella,',
  '',
  'Su acceso institucional a Segreteria Console ha sido habilitado.',
  '',
  `Activar acceso: ${activationUrl}`,
  '',
  'Desde la consola podrá crear y gestionar citas, bloquear disponibilidad en Google Calendar, definir importes aprobados en USD, generar enlaces privados de pago y verificar el estado administrativo de las reservas.',
  '',
  'Este enlace es personal, de un solo uso y válido durante 24 horas. Al abrirlo deberá definir una contraseña de al menos 12 caracteres.',
  '',
  `Acceso ordinario después de la activación: ${siteUrl}/office/login`,
  '',
  'Importante: ignore cualquier correo anterior con el asunto “You’ve been invited”; correspondía al mecanismo genérico de Supabase y ha sido sustituido por esta activación institucional.',
  '',
  'Casa Bernocchi',
  'Segreteria Generale',
  'Conocimiento · Honor · Disciplina · Legado',
].join('\n')

const html = `<!doctype html>
<html lang="es"><body style="margin:0;background:#07131f;padding:32px;font-family:Arial,Helvetica,sans-serif;color:#f7f1e6">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td align="center">
<table role="presentation" width="620" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;width:100%;background:#f7f3ea;color:#07131f;border:1px solid #c9a85f55">
<tr><td style="background:#07131f;padding:30px 38px;border-bottom:3px solid #c9a85f">
<div style="color:#c9a85f;font-size:11px;font-weight:700;letter-spacing:2.4px;text-transform:uppercase">Segreteria Generale · Casa Bernocchi</div>
<div style="margin-top:10px;color:#f7f1e6;font-family:Georgia,Times New Roman,serif;font-size:28px">Activación institucional</div>
</td></tr>
<tr><td style="padding:38px">
<p style="font-family:Georgia,Times New Roman,serif;font-size:18px;line-height:1.7;margin:0 0 18px">Antonella,</p>
<p style="font-family:Georgia,Times New Roman,serif;font-size:15px;line-height:1.8;color:#343b46">Su acceso institucional a <strong>Segreteria Console</strong> ha sido habilitado.</p>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0"><tr><td bgcolor="#c9a85f" style="border-radius:3px"><a href="${activationUrl}" style="display:inline-block;padding:14px 24px;color:#07131f;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:.7px;text-transform:uppercase">Activar acceso institucional</a></td></tr></table>
<p style="font-size:13px;line-height:1.8;color:#4a4f58">Desde la consola podrá crear y gestionar citas, bloquear disponibilidad en Google Calendar, definir importes aprobados en USD, generar enlaces privados de pago y verificar el estado administrativo de las reservas.</p>
<div style="margin:26px 0;padding:18px 20px;border-left:3px solid #c9a85f;background:#eee5d5;color:#4e4b45;font-size:12px;line-height:1.8"><strong>Seguridad:</strong> este enlace es personal, de un solo uso y válido durante 24 horas. Al abrirlo deberá definir una contraseña de al menos 12 caracteres.</div>
<p style="font-size:12px;line-height:1.8;color:#68635b">Después de la activación, el acceso ordinario será:<br><strong>${siteUrl}/office/login</strong></p>
<p style="font-size:11px;line-height:1.7;color:#887a61">Ignore cualquier correo anterior con el asunto “You’ve been invited”; correspondía al mecanismo genérico de Supabase y ha sido sustituido por esta activación institucional.</p>
</td></tr>
<tr><td style="background:#07131f;padding:24px 38px;text-align:center;color:#9da7b3;font-size:10px;line-height:1.7"><span style="color:#c9a85f;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">Conocimiento · Honor · Disciplina · Legado</span><br>Casa Bernocchi · Bernocchi Globale Holdings</td></tr>
</table></td></tr></table></body></html>`

const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${resendKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ from, to: [to], subject, text, html }),
})

if (!response.ok) {
  const detail = await response.text()
  console.error(`[Casa Bernocchi] Activation delivery failed (${response.status}): ${detail.slice(0, 300)}`)
  process.exit(1)
}

console.log('[Casa Bernocchi] Antonella activation email delivered through transactional mail.')
