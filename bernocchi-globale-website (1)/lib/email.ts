import { site } from '@/lib/content'

/**
 * CASA BERNOCCHI — EMAIL DELIVERY
 * --------------------------------
 * Transactional emails delivered through Resend.
 *
 * Required environment variable:
 *   RESEND_API_KEY
 *
 * Optional environment variables:
 *   CONTACT_RECIPIENT_EMAIL
 *   CONTACT_FROM_EMAIL
 */

export const SEGRETERIA_RECIPIENT =
  process.env.CONTACT_RECIPIENT_EMAIL ??
  'segreteria@bernocchiglobale.it'

const FROM_ADDRESS =
  process.env.CONTACT_FROM_EMAIL ??
  `${site.name} <onboarding@resend.dev>`

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

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function renderTextContent(text: string): string {
  const lines = text.split('\n')
  const sections: string[] = []
  let paragraphLines: string[] = []
  let detailRows: string[] = []

  function flushParagraph() {
    if (paragraphLines.length === 0) return

    sections.push(`
      <p class="body-copy" style="
        margin:0 0 18px;
        color:#28303d;
        font-family:Georgia, 'Times New Roman', serif;
        font-size:16px;
        line-height:1.75;
      ">
        ${paragraphLines.map(escapeHtml).join('<br>')}
      </p>
    `)

    paragraphLines = []
  }

  function flushDetails() {
    if (detailRows.length === 0) return

    sections.push(`
      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        class="detail-table"
        style="
          width:100%;
          margin:8px 0 24px;
          border-collapse:separate;
          border-spacing:0;
          overflow:hidden;
          border:1px solid #ded5c3;
          border-radius:4px;
          background:#faf7f0;
        "
      >
        ${detailRows.join('')}
      </table>
    `)

    detailRows = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line) {
      flushParagraph()
      flushDetails()
      continue
    }

    const separatorIndex = line.indexOf(':')

    if (
      separatorIndex > 0 &&
      separatorIndex < 42 &&
      !line.startsWith('http')
    ) {
      flushParagraph()

      const label = escapeHtml(line.slice(0, separatorIndex).trim())
      const value = escapeHtml(line.slice(separatorIndex + 1).trim())

      detailRows.push(`
        <tr>
          <td
            class="detail-label"
            style="
              width:38%;
              padding:13px 15px;
              border-bottom:1px solid #e7dfd1;
              color:#74613e;
              font-family:Arial, Helvetica, sans-serif;
              font-size:11px;
              font-weight:700;
              line-height:1.4;
              letter-spacing:1.3px;
              text-transform:uppercase;
              vertical-align:top;
            "
          >
            ${label}
          </td>
          <td
            class="detail-value"
            style="
              padding:13px 15px;
              border-bottom:1px solid #e7dfd1;
              color:#182131;
              font-family:Arial, Helvetica, sans-serif;
              font-size:14px;
              line-height:1.55;
              vertical-align:top;
            "
          >
            ${value || '—'}
          </td>
        </tr>
      `)
    } else {
      flushDetails()
      paragraphLines.push(line)
    }
  }

  flushParagraph()
  flushDetails()

  return sections.join('')
}

function renderCasaBernocchiEmail({
  subject,
  text,
}: {
  subject: string
  text: string
}): string {
  const safeSubject = escapeHtml(subject)
  const content = renderTextContent(text)

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >
  <meta name="color-scheme" content="light dark">
  <meta
    name="supported-color-schemes"
    content="light dark"
  >

  <title>${safeSubject}</title>

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

      .email-padding {
        padding-left: 24px !important;
        padding-right: 24px !important;
      }

      .brand-title {
        font-size: 25px !important;
      }

      .email-heading {
        font-size: 26px !important;
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
        background-color: #070b12 !important;
      }

      .email-card {
        background-color: #101722 !important;
        border-color: #293241 !important;
      }

      .content-area {
        background-color: #101722 !important;
      }

      .email-heading,
      .body-copy,
      .detail-value {
        color: #f3eee4 !important;
      }

      .muted-copy {
        color: #b7af9f !important;
      }

      .detail-table {
        background-color: #151d29 !important;
        border-color: #374152 !important;
      }

      .detail-label {
        color: #d0ad69 !important;
        border-color: #374152 !important;
      }

      .detail-value {
        border-color: #374152 !important;
      }

      .signature-box {
        background-color: #151d29 !important;
        border-color: #3c4656 !important;
      }

      .signature-name {
        color: #f3eee4 !important;
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
    "
  >
    ${safeSubject} — Casa Bernocchi
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
        style="padding:36px 12px;"
      >
        <table
          role="presentation"
          width="600"
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="email-shell email-card"
          style="
            width:600px;
            max-width:600px;
            background:#ffffff;
            border:1px solid #d9d0bf;
            border-radius:6px;
            overflow:hidden;
            box-shadow:0 14px 38px rgba(10,18,30,0.12);
          "
        >
          <!-- Institutional header -->
          <tr>
            <td
              align="center"
              class="email-padding"
              style="
                padding:40px 48px 34px;
                background:#091321;
                border-bottom:3px solid #b99551;
              "
            >
              <table
                role="presentation"
                cellspacing="0"
                cellpadding="0"
                border="0"
              >
                <tr>
                  <td align="center">
                    <div
                      style="
                        width:64px;
                        height:64px;
                        line-height:64px;
                        border:1px solid #c5a35f;
                        border-radius:50%;
                        color:#d3b573;
                        font-family:Georgia, 'Times New Roman', serif;
                        font-size:22px;
                        letter-spacing:2px;
                        text-align:center;
                      "
                    >
                      CB
                    </div>
                  </td>
                </tr>
              </table>

              <div
                class="brand-title"
                style="
                  margin-top:18px;
                  color:#f3eee4;
                  font-family:Georgia, 'Times New Roman', serif;
                  font-size:29px;
                  line-height:1.2;
                  letter-spacing:0.4px;
                "
              >
                Casa Bernocchi
              </div>

              <div
                style="
                  margin-top:8px;
                  color:#c5a35f;
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
                  width:54px;
                  height:1px;
                  margin:22px auto 0;
                  background:#c5a35f;
                "
              ></div>
            </td>
          </tr>

          <!-- Main content -->
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
                  margin-bottom:12px;
                  color:#a38246;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:10px;
                  font-weight:700;
                  line-height:1.4;
                  letter-spacing:2.2px;
                  text-transform:uppercase;
                "
              >
                Comunicazione istituzionale
              </div>

              <h1
                class="email-heading"
                style="
                  margin:0 0 25px;
                  color:#142034;
                  font-family:Georgia, 'Times New Roman', serif;
                  font-size:31px;
                  font-weight:400;
                  line-height:1.25;
                "
              >
                ${safeSubject}
              </h1>

              ${content}

              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="signature-box"
                style="
                  width:100%;
                  margin-top:30px;
                  background:#f7f2e8;
                  border:1px solid #ded3bf;
                  border-left:3px solid #b99551;
                "
              >
                <tr>
                  <td style="padding:20px 22px;">
                    <div
                      class="muted-copy"
                      style="
                        color:#6c675f;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:11px;
                        line-height:1.5;
                        letter-spacing:1.2px;
                        text-transform:uppercase;
                      "
                    >
                      Con i nostri riguardi
                    </div>

                    <div
                      class="signature-name"
                      style="
                        margin-top:7px;
                        color:#182131;
                        font-family:Georgia, 'Times New Roman', serif;
                        font-size:19px;
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
                        line-height:1.5;
                      "
                    >
                      Casa Bernocchi · Bernocchi Globale Holdings
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              align="center"
              class="email-padding"
              style="
                padding:25px 42px;
                background:#091321;
              "
            >
              <div
                style="
                  color:#d3b573;
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
                  color:#aeb6c1;
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
                  color:#707b8a;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:9px;
                  line-height:1.55;
                "
              >
                This transactional communication was generated following
                a request submitted through the official Casa Bernocchi website.
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

export async function sendEmail({
  to,
  subject,
  text,
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
        html: renderCasaBernocchiEmail({
          subject,
          text,
        }),
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
      detail:
        error instanceof Error
          ? error.message
          : String(error),
    }
  }
}
