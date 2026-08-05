import { site } from '@/lib/content'

/**
 * CASA BERNOCCHI — EMAIL SYSTEM
 * -----------------------------
 * Transactional delivery through Resend.
 *
 * Required:
 *   RESEND_API_KEY
 *
 * Optional:
 *   CONTACT_RECIPIENT_EMAIL
 *   CONTACT_FROM_EMAIL
 */

export const SEGRETERIA_RECIPIENT =
  process.env.CONTACT_RECIPIENT_EMAIL ??
  'segreteria@bernocchiglobale.it'

const FROM_ADDRESS =
  process.env.CONTACT_FROM_EMAIL ??
  `${site.name} <onboarding@resend.dev>`

const SITE_URL = site.url.replace(/\/$/, '')

const LOGO_URL =
  `${SITE_URL}/images/casa-bernocchi-logo.jpeg`

type SendArgs = {
  to: string | string[]
  subject: string
  text: string
  html?: string
  replyTo?: string
}

type SendResult =
  | { status: 'sent' }
  | { status: 'skipped' }
  | { status: 'error'; detail: string }

type EmailLanguage = 'es' | 'it' | 'en'

type AppointmentConfirmationData = {
  fullName: string
  consultation: string
  mode: string
  date: string
  time: string
  language: string
}

type DetailRow = {
  label: string
  value: string
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function resolveLanguage(
  language: string,
): EmailLanguage {
  const normalized = language
    .trim()
    .toLowerCase()

  if (
    normalized === 'es' ||
    normalized.includes('español') ||
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

const confirmationCopy = {
  es: {
    htmlLanguage: 'es',
    subject:
      'Hemos recibido su solicitud de cita — Bernocchi Health',
    eyebrow: 'Confirmación institucional',
    title: 'Su solicitud ha sido recibida',
    greeting: (name: string) =>
      `Estimado/a ${name},`,
    introduction:
      'Gracias por confiar en Bernocchi Health. La Segreteria Generale ha recibido correctamente su solicitud y revisará la disponibilidad con la máxima discreción.',
    labels: {
      consultation: 'Consulta',
      mode: 'Modalidad',
      date: 'Fecha preferida',
      time: 'Hora preferida',
      language: 'Idioma preferido',
    },
    notice:
      'La fecha y la hora indicadas constituyen una solicitud. La cita quedará confirmada únicamente cuando la Segreteria Generale se comunique con usted. No se ha realizado ningún cobro.',
    reply:
      'Para cualquier aclaración adicional, puede responder directamente a este correo.',
    regards: 'Con nuestra más alta consideración',
    transaction:
      'Esta comunicación fue generada después de una solicitud realizada desde el sitio oficial de Casa Bernocchi.',
  },

  it: {
    htmlLanguage: 'it',
    subject:
      'Abbiamo ricevuto la Sua richiesta di appuntamento — Bernocchi Health',
    eyebrow: 'Conferma istituzionale',
    title: 'La Sua richiesta è stata ricevuta',
    greeting: (name: string) =>
      `Gentile ${name},`,
    introduction:
      'La ringraziamo per la fiducia accordata a Bernocchi Health. La Segreteria Generale ha ricevuto correttamente la Sua richiesta e verificherà la disponibilità con la massima discrezione.',
    labels: {
      consultation: 'Consulenza',
      mode: 'Modalità',
      date: 'Data preferita',
      time: 'Orario preferito',
      language: 'Lingua preferita',
    },
    notice:
      'La data e l’orario indicati costituiscono una richiesta. L’appuntamento sarà confermato esclusivamente dalla Segreteria Generale. Non è stato effettuato alcun addebito.',
    reply:
      'Per qualsiasi ulteriore chiarimento, può rispondere direttamente a questa comunicazione.',
    regards: 'Con la nostra più alta considerazione',
    transaction:
      'Questa comunicazione è stata generata a seguito di una richiesta effettuata tramite il sito ufficiale di Casa Bernocchi.',
  },

  en: {
    htmlLanguage: 'en',
    subject:
      'We have received your appointment request — Bernocchi Health',
    eyebrow: 'Institutional confirmation',
    title: 'Your request has been received',
    greeting: (name: string) =>
      `Dear ${name},`,
    introduction:
      'Thank you for placing your trust in Bernocchi Health. The Segreteria Generale has received your request and will review availability with the utmost discretion.',
    labels: {
      consultation: 'Consultation',
      mode: 'Mode',
      date: 'Preferred date',
      time: 'Preferred time',
      language: 'Preferred language',
    },
    notice:
      'The date and time shown constitute a request. The appointment will be confirmed only when the Segreteria Generale contacts you. No payment has been taken.',
    reply:
      'For any further clarification, you may reply directly to this email.',
    regards: 'With our highest consideration',
    transaction:
      'This communication was generated following a request submitted through the official Casa Bernocchi website.',
  },
} as const

function renderDetails(
  details: DetailRow[],
): string {
  return details
    .map(
      (detail, index) => `
        <tr>
          <td
            class="detail-label"
            style="
              width:38%;
              padding:14px 16px;
              ${
                index < details.length - 1
                  ? 'border-bottom:1px solid #e2d8c7;'
                  : ''
              }
              color:#826a3d;
              font-family:Arial, Helvetica, sans-serif;
              font-size:10px;
              font-weight:700;
              line-height:1.5;
              letter-spacing:1.25px;
              text-transform:uppercase;
              vertical-align:top;
            "
          >
            ${escapeHtml(detail.label)}
          </td>

          <td
            class="detail-value"
            style="
              padding:14px 16px;
              ${
                index < details.length - 1
                  ? 'border-bottom:1px solid #e2d8c7;'
                  : ''
              }
              color:#172235;
              font-family:Arial, Helvetica, sans-serif;
              font-size:14px;
              line-height:1.55;
              vertical-align:top;
            "
          >
            ${escapeHtml(detail.value || '—')}
          </td>
        </tr>
      `,
    )
    .join('')
}

function renderPremiumEmail({
  htmlLanguage,
  preheader,
  eyebrow,
  title,
  greeting,
  introduction,
  details,
  notice,
  reply,
  regards,
  transaction,
}: {
  htmlLanguage: string
  preheader: string
  eyebrow: string
  title: string
  greeting: string
  introduction: string
  details?: DetailRow[]
  notice?: string
  reply?: string
  regards: string
  transaction: string
}): string {
  const detailTable =
    details && details.length > 0
      ? `
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="detail-table"
          style="
            width:100%;
            margin:27px 0;
            border:1px solid #d9cebb;
            border-collapse:separate;
            border-spacing:0;
            border-radius:4px;
            background:#faf7f0;
          "
        >
          ${renderDetails(details)}
        </table>
      `
      : ''

  const noticeBox = notice
    ? `
      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        class="notice-box"
        style="
          width:100%;
          margin:27px 0 22px;
          border:1px solid #ddcfb5;
          border-left:3px solid #b9964a;
          background:#f7f2e8;
        "
      >
        <tr>
          <td
            class="notice-text"
            style="
              padding:18px 20px;
              color:#4e4b45;
              font-family:Arial, Helvetica, sans-serif;
              font-size:13px;
              line-height:1.7;
            "
          >
            ${escapeHtml(notice)}
          </td>
        </tr>
      </table>
    `
    : ''

  const replyParagraph = reply
    ? `
      <p
        class="body-copy"
        style="
          margin:20px 0 0;
          color:#343b46;
          font-family:Georgia, 'Times New Roman', serif;
          font-size:15px;
          line-height:1.75;
        "
      >
        ${escapeHtml(reply)}
      </p>
    `
    : ''

  return `<!doctype html>
<html lang="${escapeHtml(htmlLanguage)}">
<head>
  <meta charset="utf-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >
  <meta
    name="color-scheme"
    content="light dark"
  >
  <meta
    name="supported-color-schemes"
    content="light dark"
  >

  <title>${escapeHtml(title)}</title>

  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }

    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #eee9df;
    }

    table {
      border-spacing: 0;
    }

    img {
      border: 0;
      display: block;
    }

    @media only screen and (max-width: 620px) {
      .email-shell {
        width: 100% !important;
      }

      .outer-cell {
        padding: 16px 8px !important;
      }

      .email-padding {
        padding-left: 24px !important;
        padding-right: 24px !important;
      }

      .email-title {
        font-size: 27px !important;
      }

      .brand-name {
        font-size: 25px !important;
      }

      .detail-label,
      .detail-value {
        display: block !important;
        width: auto !important;
        box-sizing: border-box !important;
      }

      .detail-label {
        padding-bottom: 4px !important;
        border-bottom: 0 !important;
      }

      .detail-value {
        padding-top: 2px !important;
      }
    }

    @media (prefers-color-scheme: dark) {
      body,
      .email-background {
        background-color: #050a11 !important;
      }

      .email-shell,
      .content-area {
        background-color: #101722 !important;
        border-color: #2f3948 !important;
      }

      .email-title,
      .body-copy,
      .detail-value,
      .signature-name {
        color: #f3efe5 !important;
      }

      .detail-table,
      .notice-box,
      .signature-box {
        background-color: #151e2a !important;
        border-color: #3a4657 !important;
      }

      .detail-label {
        color: #d0ae68 !important;
        border-color: #3a4657 !important;
      }

      .detail-value {
        border-color: #3a4657 !important;
      }

      .notice-text,
      .muted-copy {
        color: #c1b9aa !important;
      }
    }
  </style>
</head>

<body>
  <div
    style="
      display:none;
      max-height:0;
      overflow:hidden;
      opacity:0;
      color:transparent;
      mso-hide:all;
    "
  >
    ${escapeHtml(preheader)}
  </div>

  <table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    class="email-background"
    style="
      width:100%;
      background:#eee9df;
    "
  >
    <tr>
      <td
        align="center"
        class="outer-cell"
        style="padding:36px 12px;"
      >
        <table
          role="presentation"
          width="600"
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="email-shell"
          style="
            width:600px;
            max-width:600px;
            background:#fffdf9;
            border:1px solid #d8cebd;
            border-radius:6px;
            overflow:hidden;
            box-shadow:0 14px 38px rgba(8,16,28,0.13);
          "
        >
          <!-- HEADER -->
          <tr>
            <td
              align="center"
              class="email-padding"
              style="
                padding:36px 48px 32px;
                background:#07131f;
                border-bottom:3px solid #b9964a;
              "
            >
              <img
                src="${escapeHtml(LOGO_URL)}"
                width="92"
                height="92"
                alt="Casa Bernocchi"
                style="
                  width:92px;
                  height:92px;
                  max-width:92px;
                  border-radius:50%;
                  object-fit:cover;
                "
              >

              <div
                class="brand-name"
                style="
                  margin-top:18px;
                  color:#f3efe5;
                  font-family:Georgia, 'Times New Roman', serif;
                  font-size:29px;
                  line-height:1.2;
                  letter-spacing:0.3px;
                "
              >
                Casa Bernocchi
              </div>

              <div
                style="
                  margin-top:8px;
                  color:#c6a45d;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:10px;
                  font-weight:700;
                  line-height:1.4;
                  letter-spacing:3px;
                  text-transform:uppercase;
                "
              >
                Segreteria Generale
              </div>

              <div
                style="
                  width:56px;
                  height:1px;
                  margin:21px auto 0;
                  background:#b9964a;
                "
              ></div>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td
              class="email-padding content-area"
              style="
                padding:42px 48px 38px;
                background:#fffdf9;
              "
            >
              <div
                style="
                  margin-bottom:11px;
                  color:#9b7b40;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:10px;
                  font-weight:700;
                  line-height:1.5;
                  letter-spacing:2.1px;
                  text-transform:uppercase;
                "
              >
                ${escapeHtml(eyebrow)}
              </div>

              <h1
                class="email-title"
                style="
                  margin:0 0 27px;
                  color:#142034;
                  font-family:Georgia, 'Times New Roman', serif;
                  font-size:32px;
                  font-weight:400;
                  line-height:1.25;
                "
              >
                ${escapeHtml(title)}
              </h1>

              <p
                class="body-copy"
                style="
                  margin:0 0 15px;
                  color:#28313e;
                  font-family:Georgia, 'Times New Roman', serif;
                  font-size:17px;
                  line-height:1.7;
                "
              >
                ${escapeHtml(greeting)}
              </p>

              <p
                class="body-copy"
                style="
                  margin:0;
                  color:#343b46;
                  font-family:Georgia, 'Times New Roman', serif;
                  font-size:15px;
                  line-height:1.8;
                "
              >
                ${escapeHtml(introduction)}
              </p>

              ${detailTable}
              ${noticeBox}
              ${replyParagraph}

              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="signature-box"
                style="
                  width:100%;
                  margin-top:31px;
                  border-top:1px solid #ded4c3;
                "
              >
                <tr>
                  <td style="padding:24px 0 0;">
                    <div
                      class="muted-copy"
                      style="
                        color:#736e65;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:10px;
                        line-height:1.5;
                        letter-spacing:1.2px;
                        text-transform:uppercase;
                      "
                    >
                      ${escapeHtml(regards)}
                    </div>

                    <div
                      class="signature-name"
                      style="
                        margin-top:8px;
                        color:#172235;
                        font-family:Georgia, 'Times New Roman', serif;
                        font-size:20px;
                        line-height:1.4;
                      "
                    >
                      Segreteria Generale
                    </div>

                    <div
                      class="muted-copy"
                      style="
                        margin-top:3px;
                        color:#777168;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:12px;
                        line-height:1.55;
                      "
                    >
                      Casa Bernocchi<br>
                      Bernocchi Globale Holdings
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td
              align="center"
              class="email-padding"
              style="
                padding:25px 42px;
                background:#07131f;
              "
            >
              <div
                style="
                  color:#d0ad65;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:10px;
                  font-weight:700;
                  line-height:1.6;
                  letter-spacing:1.6px;
                  text-transform:uppercase;
                "
              >
                Italian excellence, built to endure.
              </div>

              <div
                style="
                  margin-top:10px;
                  color:#b1bac5;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:11px;
                  line-height:1.7;
                "
              >
                segreteria@bernocchiglobale.it<br>
                bernocchiglobale.it
              </div>

              <div
                style="
                  margin-top:17px;
                  color:#76808e;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:9px;
                  line-height:1.55;
                "
              >
                ${escapeHtml(transaction)}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function renderGenericEmail(
  subject: string,
  text: string,
): string {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(
      (paragraph) => `
        <p
          class="body-copy"
          style="
            margin:0 0 18px;
            color:#343b46;
            font-family:Georgia, 'Times New Roman', serif;
            font-size:15px;
            line-height:1.8;
          "
        >
          ${escapeHtml(paragraph).replaceAll('\n', '<br>')}
        </p>
      `,
    )
    .join('')

  return renderPremiumEmail({
    htmlLanguage: 'en',
    preheader: subject,
    eyebrow: 'Comunicazione istituzionale',
    title: subject,
    greeting: 'Segreteria Generale',
    introduction: '',
    regards: 'Con i nostri riguardi',
    transaction:
      'This transactional communication was generated following a request submitted through the official Casa Bernocchi website.',
  }).replace(
    '<p\n                class="body-copy"\n                style="\n                  margin:0;\n                  color:#343b46;\n                  font-family:Georgia, \'Times New Roman\', serif;\n                  font-size:15px;\n                  line-height:1.8;\n                "\n              >\n                \n              </p>',
    paragraphs,
  )
}

/**
 * Subject used by app/api/appointment/route.ts
 */
export function getAppointmentConfirmationSubject(
  language: string,
): string {
  const resolvedLanguage = resolveLanguage(language)

  return confirmationCopy[resolvedLanguage].subject
}

/**
 * Plain-text fallback used by app/api/appointment/route.ts
 */
export function buildAppointmentConfirmationText(
  data: AppointmentConfirmationData,
): string {
  const language = resolveLanguage(data.language)
  const copy = confirmationCopy[language]

  return [
    copy.greeting(data.fullName),
    '',
    copy.introduction,
    '',
    `${copy.labels.consultation}: ${data.consultation}`,
    `${copy.labels.mode}: ${data.mode}`,
    `${copy.labels.date}: ${data.date}`,
    `${copy.labels.time}: ${data.time}`,
    `${copy.labels.language}: ${data.language || '—'}`,
    '',
    copy.notice,
    '',
    copy.reply,
    '',
    copy.regards,
    'Segreteria Generale',
    'Casa Bernocchi',
    'Bernocchi Globale Holdings',
  ].join('\n')
}

/**
 * Premium HTML confirmation used by app/api/appointment/route.ts
 */
export function buildAppointmentConfirmationEmail(
  data: AppointmentConfirmationData,
): string {
  const language = resolveLanguage(data.language)
  const copy = confirmationCopy[language]

  return renderPremiumEmail({
    htmlLanguage: copy.htmlLanguage,
    preheader: copy.subject,
    eyebrow: copy.eyebrow,
    title: copy.title,
    greeting: copy.greeting(data.fullName),
    introduction: copy.introduction,
    details: [
      {
        label: copy.labels.consultation,
        value: data.consultation,
      },
      {
        label: copy.labels.mode,
        value: data.mode,
      },
      {
        label: copy.labels.date,
        value: data.date,
      },
      {
        label: copy.labels.time,
        value: data.time,
      },
      {
        label: copy.labels.language,
        value: data.language || '—',
      },
    ],
    notice: copy.notice,
    reply: copy.reply,
    regards: copy.regards,
    transaction: copy.transaction,
  })
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
    const response = await fetch(
      'https://api.resend.com/emails',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_ADDRESS,
          to: Array.isArray(to) ? to : [to],
          ...(replyTo
            ? { reply_to: replyTo }
            : {}),
          subject,
          text,
          html:
            html ??
            renderGenericEmail(subject, text),
        }),
      },
    )

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
      detail:
        error instanceof Error
          ? error.message
          : String(error),
    }
  }
}
