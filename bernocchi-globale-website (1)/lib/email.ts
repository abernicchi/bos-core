import { site } from '@/lib/content'

/**
 * Server-side email service for Casa Bernocchi.
 *
 * Required environment variables:
 * - RESEND_API_KEY
 * - CONTACT_RECIPIENT_EMAIL
 * - CONTACT_FROM_EMAIL
 */

export const SEGRETERIA_RECIPIENT =
  process.env.CONTACT_RECIPIENT_EMAIL ?? 'segreteria@bernocchiglobale.it'

const FROM_ADDRESS =
  process.env.CONTACT_FROM_EMAIL ??
  `${site.name} <onboarding@resend.dev>`

type SendArgs = {
  to: string | string[]
  subject: string
  text: string
  html?: string
  replyTo?: string
}

export type SendResult =
  | { status: 'sent' }
  | { status: 'skipped' }
  | { status: 'error'; detail: string }

export type AppointmentConfirmationData = {
  fullName: string
  consultation: string
  mode: string
  date: string
  time: string
  language: string
}

type AppointmentLanguage = 'es' | 'it' | 'en'

type AppointmentCopy = {
  htmlLang: AppointmentLanguage
  locale: string
  subject: string
  title: string
  preheader: string
  greeting: (name: string) => string
  opening: string
  followUp: string
  summaryTitle: string
  consultationLabel: string
  modeLabel: string
  dateLabel: string
  timeLabel: string
  languageLabel: string
  button: string
  notice: string
  regards: string
  confidentiality: string
  generated: string
  unspecified: string
}

const APPOINTMENT_COPY: Record<AppointmentLanguage, AppointmentCopy> = {
  es: {
    htmlLang: 'es',
    locale: 'es-ES',
    subject: 'Hemos recibido su solicitud de cita — Bernocchi Health',
    title: 'Hemos recibido su solicitud',
    preheader:
      'La Segreteria Generale ha recibido su solicitud de cita.',
    greeting: (name) => `Estimado/a ${name},`,
    opening:
      'Gracias por contactar con Bernocchi Health. Su solicitud de cita ha sido recibida y puesta a disposición de nuestra Segreteria Generale.',
    followUp:
      'Nuestro equipo revisará la fecha solicitada y se pondrá en contacto con usted personalmente para confirmar la disponibilidad y los siguientes pasos.',
    summaryTitle: 'Resumen de la solicitud',
    consultationLabel: 'Consulta',
    modeLabel: 'Modalidad',
    dateLabel: 'Fecha preferida',
    timeLabel: 'Hora preferida',
    languageLabel: 'Idioma preferido',
    button: 'Visitar Bernocchi Health',
    notice:
      'Esta comunicación confirma la recepción de su solicitud. Todavía no constituye una cita confirmada y no se ha realizado ningún cobro.',
    regards: 'Atentamente,',
    confidentiality: 'Comunicación institucional confidencial.',
    generated:
      'Este mensaje se generó porque se envió una solicitud de cita en',
    unspecified: 'No especificado',
  },
  it: {
    htmlLang: 'it',
    locale: 'it-IT',
    subject:
      'Abbiamo ricevuto la Sua richiesta di appuntamento — Bernocchi Health',
    title: 'Abbiamo ricevuto la Sua richiesta',
    preheader:
      'La Segreteria Generale ha ricevuto la Sua richiesta di appuntamento.',
    greeting: (name) => `Gentile ${name},`,
    opening:
      'La ringraziamo per aver contattato Bernocchi Health. La Sua richiesta di appuntamento è stata ricevuta e sottoposta all’attenzione della nostra Segreteria Generale.',
    followUp:
      'Il nostro ufficio esaminerà la data richiesta e La contatterà personalmente per confermare la disponibilità e i passaggi successivi.',
    summaryTitle: 'Riepilogo della richiesta',
    consultationLabel: 'Consulto',
    modeLabel: 'Modalità',
    dateLabel: 'Data preferita',
    timeLabel: 'Orario preferito',
    languageLabel: 'Lingua preferita',
    button: 'Visita Bernocchi Health',
    notice:
      'Questa comunicazione conferma la ricezione della Sua richiesta. Non costituisce ancora un appuntamento confermato e non è stato effettuato alcun pagamento.',
    regards: 'Con i nostri più cordiali saluti,',
    confidentiality: 'Comunicazione istituzionale riservata.',
    generated:
      'Questo messaggio è stato generato perché è stata inviata una richiesta di appuntamento su',
    unspecified: 'Non specificato',
  },
  en: {
    htmlLang: 'en',
    locale: 'en-GB',
    subject:
      'Your appointment request has been received — Bernocchi Health',
    title: 'Your appointment request has been received',
    preheader:
      'Your appointment request has been received by the Segreteria Generale.',
    greeting: (name) => `Dear ${name},`,
    opening:
      'Thank you for contacting Bernocchi Health. Your appointment request has been received and placed under the attention of our Segreteria Generale.',
    followUp:
      'A member of our office will review the requested date and contact you personally to confirm availability and the next steps.',
    summaryTitle: 'Request summary',
    consultationLabel: 'Consultation',
    modeLabel: 'Modality',
    dateLabel: 'Preferred date',
    timeLabel: 'Preferred time',
    languageLabel: 'Preferred language',
    button: 'Visit Bernocchi Health',
    notice:
      'This communication confirms receipt of your request. It does not yet constitute a confirmed appointment, and no payment has been taken.',
    regards: 'With our regards,',
    confidentiality: 'Confidential institutional communication.',
    generated:
      'This message was generated because an appointment request was submitted at',
    unspecified: 'Not specified',
  },
}

const CONSULTATION_TRANSLATIONS: Record<
  AppointmentLanguage,
  Record<string, string>
> = {
  es: {
    'clinical sexology': 'Sexología clínica',
    'couples therapy': 'Terapia de pareja',
    "men's sexual health": 'Salud sexual masculina',
    "women's sexual health": 'Salud sexual femenina',
    'online consultation': 'Consulta en línea',
    'executive consultation': 'Consulta ejecutiva',
  },
  it: {
    'clinical sexology': 'Sessuologia clinica',
    'couples therapy': 'Terapia di coppia',
    "men's sexual health": 'Salute sessuale maschile',
    "women's sexual health": 'Salute sessuale femminile',
    'online consultation': 'Consulto online',
    'executive consultation': 'Consulenza executive',
  },
  en: {},
}

const MODE_TRANSLATIONS: Record<
  AppointmentLanguage,
  Record<string, string>
> = {
  es: {
    online: 'En línea',
    'in person': 'Presencial',
    'in-person': 'Presencial',
    presencial: 'Presencial',
  },
  it: {
    online: 'Online',
    'in person': 'In presenza',
    'in-person': 'In presenza',
    presencial: 'In presenza',
  },
  en: {
    presencial: 'In person',
    'en línea': 'Online',
    'en linea': 'Online',
  },
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function normalizeForLookup(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function resolveAppointmentLanguage(value: string): AppointmentLanguage {
  const normalized = normalizeForLookup(value)

  if (
    normalized === 'es' ||
    normalized.includes('espanol') ||
    normalized.includes('spanish')
  ) {
    return 'es'
  }

  if (
    normalized === 'it' ||
    normalized.includes('italiano') ||
    normalized.includes('italian')
  ) {
    return 'it'
  }

  return 'en'
}

function localizeConsultation(
  consultation: string,
  language: AppointmentLanguage,
): string {
  const normalized = normalizeForLookup(consultation)
  return CONSULTATION_TRANSLATIONS[language][normalized] ?? consultation
}

function localizeMode(
  mode: string,
  language: AppointmentLanguage,
): string {
  const normalized = normalizeForLookup(mode)
  return MODE_TRANSLATIONS[language][normalized] ?? mode
}

function localizeLanguageName(
  language: AppointmentLanguage,
): string {
  if (language === 'es') return 'Español'
  if (language === 'it') return 'Italiano'
  return 'English'
}

function formatAppointmentDate(
  date: string,
  copy: AppointmentCopy,
): string {
  const isoDate = /^\d{4}-\d{2}-\d{2}$/.test(date)

  if (!isoDate) return date

  const parsedDate = new Date(`${date}T12:00:00`)

  if (Number.isNaN(parsedDate.getTime())) return date

  return new Intl.DateTimeFormat(copy.locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate)
}

export function getAppointmentConfirmationSubject(
  language: string,
): string {
  const languageCode = resolveAppointmentLanguage(language)
  return APPOINTMENT_COPY[languageCode].subject
}

export function buildAppointmentConfirmationText({
  fullName,
  consultation,
  mode,
  date,
  time,
  language,
}: AppointmentConfirmationData): string {
  const languageCode = resolveAppointmentLanguage(language)
  const copy = APPOINTMENT_COPY[languageCode]
  const localizedConsultation = localizeConsultation(
    consultation,
    languageCode,
  )
  const localizedMode = localizeMode(mode, languageCode)
  const localizedDate = formatAppointmentDate(date, copy)
  const localizedLanguage = localizeLanguageName(languageCode)

  return [
    copy.greeting(fullName),
    '',
    copy.opening,
    '',
    copy.followUp,
    '',
    `${copy.consultationLabel}: ${localizedConsultation}`,
    `${copy.modeLabel}: ${localizedMode}`,
    `${copy.dateLabel}: ${localizedDate}`,
    `${copy.timeLabel}: ${time}`,
    `${copy.languageLabel}: ${localizedLanguage}`,
    '',
    copy.notice,
    '',
    copy.regards,
    'Segreteria Generale',
    'Casa Bernocchi',
    site.legalName,
    site.domain,
  ].join('\n')
}

/**
 * Premium appointment-confirmation email.
 *
 * It deliberately excludes clinical or sensitive information and contains
 * only the logistical details provided during the booking request.
 */
export function buildAppointmentConfirmationEmail({
  fullName,
  consultation,
  mode,
  date,
  time,
  language,
}: AppointmentConfirmationData): string {
  const languageCode = resolveAppointmentLanguage(language)
  const copy = APPOINTMENT_COPY[languageCode]

  const localizedConsultation = localizeConsultation(
    consultation,
    languageCode,
  )
  const localizedMode = localizeMode(mode, languageCode)
  const localizedDate = formatAppointmentDate(date, copy)
  const localizedLanguage = localizeLanguageName(languageCode)

  const safeConsultation = escapeHtml(localizedConsultation)
  const safeMode = escapeHtml(localizedMode)
  const safeDate = escapeHtml(localizedDate)
  const safeTime = escapeHtml(time)
  const safeLanguage = escapeHtml(
    localizedLanguage || copy.unspecified,
  )

  const websiteUrl = site.url.replace(/\/$/, '')
  const healthUrl = `${websiteUrl}/health`
  const logoUrl = `${websiteUrl}/images/casa-bernocchi-logo.jpeg`
  const year = new Date().getFullYear()

  return `<!doctype html>
<html lang="${copy.htmlLang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${escapeHtml(copy.subject)}</title>

    <style>
      @media only screen and (max-width: 640px) {
        .email-container {
          width: 100% !important;
        }

        .email-padding {
          padding-left: 24px !important;
          padding-right: 24px !important;
        }

        .institutional-image {
          width: 100% !important;
          height: auto !important;
        }

        .details-label,
        .details-value {
          display: block !important;
          width: 100% !important;
          text-align: left !important;
        }

        .details-value {
          padding-top: 4px !important;
        }
      }
    </style>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f2efe8;
      font-family: Arial, Helvetica, sans-serif;
      color: #18202b;
    "
  >
    <div
      style="
        display: none;
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        color: transparent;
      "
    >
      ${escapeHtml(copy.preheader)}
    </div>

    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background-color: #f2efe8;"
    >
      <tr>
        <td align="center" style="padding: 38px 14px;">
          <table
            role="presentation"
            width="640"
            cellspacing="0"
            cellpadding="0"
            border="0"
            class="email-container"
            style="
              width: 640px;
              max-width: 640px;
              background-color: #ffffff;
              border: 1px solid #ded8ca;
              border-radius: 4px;
              overflow: hidden;
              box-shadow: 0 8px 30px rgba(15, 25, 38, 0.08);
            "
          >
            <tr>
              <td
                align="center"
                class="email-padding"
                style="
                  padding: 24px 40px 36px;
                  background-color: #05090d;
                  border-bottom: 4px solid #b99752;
                "
              >
                <img
                  src="${logoUrl}"
                  width="536"
                  alt="Casa Bernocchi — Domus Fvndatrix"
                  class="institutional-image"
                  style="
                    display: block;
                    width: 100%;
                    max-width: 536px;
                    height: auto;
                    margin: 0 auto 26px;
                    border: 0;
                    outline: none;
                    text-decoration: none;
                  "
                >

                <div
                  style="
                    color: #d4b66f;
                    font-size: 11px;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    margin-bottom: 10px;
                  "
                >
                  Segreteria Generale
                </div>

                <h1
                  style="
                    margin: 0;
                    color: #ffffff;
                    font-family: Georgia, 'Times New Roman', serif;
                    font-size: 31px;
                    line-height: 1.25;
                    font-weight: normal;
                  "
                >
                  ${escapeHtml(copy.title)}
                </h1>

                <p
                  style="
                    margin: 12px 0 0;
                    color: #b9c1c9;
                    font-size: 14px;
                    line-height: 1.7;
                  "
                >
                  Bernocchi Health · Casa Bernocchi
                </p>
              </td>
            </tr>

            <tr>
              <td
                class="email-padding"
                style="padding: 44px 52px 18px;"
              >
                <p
                  style="
                    margin: 0 0 22px;
                    color: #18202b;
                    font-family: Georgia, 'Times New Roman', serif;
                    font-size: 22px;
                    line-height: 1.5;
                  "
                >
                  ${escapeHtml(copy.greeting(fullName))}
                </p>

                <p
                  style="
                    margin: 0;
                    color: #4f5862;
                    font-size: 15px;
                    line-height: 1.8;
                  "
                >
                  ${escapeHtml(copy.opening)}
                </p>

                <p
                  style="
                    margin: 18px 0 0;
                    color: #4f5862;
                    font-size: 15px;
                    line-height: 1.8;
                  "
                >
                  ${escapeHtml(copy.followUp)}
                </p>
              </td>
            </tr>

            <tr>
              <td
                class="email-padding"
                style="padding: 22px 52px 12px;"
              >
                <div
                  style="
                    padding: 11px 0;
                    border-top: 1px solid #b99752;
                    border-bottom: 1px solid #b99752;
                    color: #8b6e35;
                    font-size: 11px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                  "
                >
                  ${escapeHtml(copy.summaryTitle)}
                </div>
              </td>
            </tr>

            <tr>
              <td
                class="email-padding"
                style="padding: 10px 52px 28px;"
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    border: 1px solid #e2ded5;
                    background-color: #faf9f6;
                  "
                >
                  <tr>
                    <td
                      class="details-label"
                      width="38%"
                      style="
                        padding: 16px 18px;
                        border-bottom: 1px solid #e2ded5;
                        color: #747b82;
                        font-size: 12px;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                      "
                    >
                      ${escapeHtml(copy.consultationLabel)}
                    </td>

                    <td
                      class="details-value"
                      style="
                        padding: 16px 18px;
                        border-bottom: 1px solid #e2ded5;
                        color: #18202b;
                        font-size: 14px;
                        font-weight: bold;
                      "
                    >
                      ${safeConsultation}
                    </td>
                  </tr>

                  <tr>
                    <td
                      class="details-label"
                      style="
                        padding: 16px 18px;
                        border-bottom: 1px solid #e2ded5;
                        color: #747b82;
                        font-size: 12px;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                      "
                    >
                      ${escapeHtml(copy.modeLabel)}
                    </td>

                    <td
                      class="details-value"
                      style="
                        padding: 16px 18px;
                        border-bottom: 1px solid #e2ded5;
                        color: #18202b;
                        font-size: 14px;
                        font-weight: bold;
                      "
                    >
                      ${safeMode}
                    </td>
                  </tr>

                  <tr>
                    <td
                      class="details-label"
                      style="
                        padding: 16px 18px;
                        border-bottom: 1px solid #e2ded5;
                        color: #747b82;
                        font-size: 12px;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                      "
                    >
                      ${escapeHtml(copy.dateLabel)}
                    </td>

                    <td
                      class="details-value"
                      style="
                        padding: 16px 18px;
                        border-bottom: 1px solid #e2ded5;
                        color: #18202b;
                        font-size: 14px;
                        font-weight: bold;
                      "
                    >
                      ${safeDate}
                    </td>
                  </tr>

                  <tr>
                    <td
                      class="details-label"
                      style="
                        padding: 16px 18px;
                        border-bottom: 1px solid #e2ded5;
                        color: #747b82;
                        font-size: 12px;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                      "
                    >
                      ${escapeHtml(copy.timeLabel)}
                    </td>

                    <td
                      class="details-value"
                      style="
                        padding: 16px 18px;
                        border-bottom: 1px solid #e2ded5;
                        color: #18202b;
                        font-size: 14px;
                        font-weight: bold;
                      "
                    >
                      ${safeTime}
                    </td>
                  </tr>

                  <tr>
                    <td
                      class="details-label"
                      style="
                        padding: 16px 18px;
                        color: #747b82;
                        font-size: 12px;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                      "
                    >
                      ${escapeHtml(copy.languageLabel)}
                    </td>

                    <td
                      class="details-value"
                      style="
                        padding: 16px 18px;
                        color: #18202b;
                        font-size: 14px;
                        font-weight: bold;
                      "
                    >
                      ${safeLanguage}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                align="center"
                class="email-padding"
                style="padding: 4px 52px 38px;"
              >
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      align="center"
                      style="
                        background-color: #b99752;
                        border-radius: 2px;
                      "
                    >
                      <a
                        href="${healthUrl}"
                        style="
                          display: inline-block;
                          padding: 14px 28px;
                          color: #081522;
                          font-size: 12px;
                          font-weight: bold;
                          letter-spacing: 1.4px;
                          text-decoration: none;
                          text-transform: uppercase;
                        "
                      >
                        ${escapeHtml(copy.button)}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                class="email-padding"
                style="
                  padding: 28px 52px;
                  background-color: #f7f5f0;
                  border-top: 1px solid #e2ded5;
                "
              >
                <p
                  style="
                    margin: 0;
                    color: #4f5862;
                    font-size: 13px;
                    line-height: 1.75;
                  "
                >
                  ${escapeHtml(copy.notice)}
                </p>

                <p
                  style="
                    margin: 18px 0 0;
                    color: #18202b;
                    font-family: Georgia, 'Times New Roman', serif;
                    font-size: 16px;
                    line-height: 1.6;
                  "
                >
                  ${escapeHtml(copy.regards)}<br>
                  <strong>Segreteria Generale</strong><br>
                  Casa Bernocchi
                </p>
              </td>
            </tr>

            <tr>
              <td
                align="center"
                class="email-padding"
                style="
                  padding: 25px 52px;
                  background-color: #081522;
                "
              >
                <p
                  style="
                    margin: 0;
                    color: #d4b66f;
                    font-size: 11px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                  "
                >
                  Scientia · Integritas · Posteritas
                </p>

                <p
                  style="
                    margin: 12px 0 0;
                    color: #9ca5ad;
                    font-size: 11px;
                    line-height: 1.7;
                  "
                >
                  ${escapeHtml(site.legalName)}<br>
                  Milano · Costa Rica
                </p>

                <p
                  style="
                    margin: 12px 0 0;
                    color: #77818b;
                    font-size: 10px;
                    line-height: 1.6;
                  "
                >
                  © ${year} Casa Bernocchi. ${escapeHtml(copy.confidentiality)}
                </p>
              </td>
            </tr>
          </table>

          <p
            style="
              margin: 18px 0 0;
              color: #8c8a84;
              font-size: 10px;
              line-height: 1.6;
              text-align: center;
            "
          >
            ${escapeHtml(copy.generated)} ${escapeHtml(site.domain)}.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
  replyTo,
}: SendArgs): Promise<SendResult> {
  const resendKey = process.env.RESEND_API_KEY

  if (!resendKey) {
    return { status: 'skipped' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
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
        ...(html ? { html } : {}),
      }),
    })

    if (!response.ok) {
      const detail = await response.text()

      return {
        status: 'error',
        detail: `${response.status} ${detail}`,
      }
    }

    return { status: 'sent' }
  } catch (error) {
    return {
      status: 'error',
      detail: String(error),
    }
  }
}
