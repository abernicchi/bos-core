import { site } from '@/lib/content'

/**
 * Minimal Resend email helper (HTTP API, no SDK dependency).
 *
 * All keys are read from server-only env vars and never exposed to the client.
 * Configure the following in the project environment to enable delivery:
 *   - RESEND_API_KEY          (required to actually send)
 *   - CONTACT_RECIPIENT_EMAIL (Segreteria inbox; defaults to segreteria@…)
 *   - CONTACT_FROM_EMAIL      (verified sender; defaults to Resend sandbox)
 *
 * When RESEND_API_KEY is absent, send() reports `skipped` so callers can log
 * and keep the flow working before an email provider is configured.
 */

export const SEGRETERIA_RECIPIENT =
  process.env.CONTACT_RECIPIENT_EMAIL ?? 'segreteria@bernocchiglobale.it'

const FROM_ADDRESS =
  process.env.CONTACT_FROM_EMAIL ?? `${site.name} <onboarding@resend.dev>`

type SendArgs = {
  to: string | string[]
  subject: string
  text: string
  replyTo?: string
}

type SendResult =
  | { status: 'sent' }
  | { status: 'skipped' }
  | { status: 'error'; detail: string }

export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
}: SendArgs): Promise<SendResult> {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return { status: 'skipped' }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: Array.isArray(to) ? to : [to],
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject,
        text,
      }),
    })
    if (!res.ok) {
      const detail = await res.text()
      return { status: 'error', detail: `${res.status} ${detail}` }
    }
    return { status: 'sent' }
  } catch (err) {
    return { status: 'error', detail: String(err) }
  }
}
