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

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
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
  const safeName = escapeHtml(fullName)
  const safeConsultation = escapeHtml(consultation)
  const safeMode = escapeHtml(mode)
  const safeDate = escapeHtml(date)
  const safeTime = escapeHtml(time)
  const safeLanguage = escapeHtml(language || 'Not specified')

  const websiteUrl = site.url.replace(/\/$/, '')
  const healthUrl = `${websiteUrl}/health`
  const year = new Date().getFullYear()

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Appointment request received — Bernocchi Health</title>

    <style>
      @media only screen and (max-width: 640px) {
        .email-container {
          width: 100% !important;
        }

        .email-padding {
          padding-left: 24px !important;
          padding-right: 24px !important;
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
      Your appointment request has been received by the Segreteria Generale.
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
                  padding: 42px 52px 36px;
                  background-color: #081522;
                  border-bottom: 4px solid #b99752;
                "
              >
                <div
                  style="
                    width: 58px;
                    height: 58px;
                    line-height: 58px;
                    border: 1px solid #b99752;
                    border-radius: 50%;
                    color: #d4b66f;
                    font-family: Georgia, 'Times New Roman', serif;
                    font-size: 30px;
                    text-align: center;
                    margin: 0 auto 20px;
                  "
                >
                  B
                </div>

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
                  Appointment request received
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
                  Dear ${safeName},
                </p>

                <p
                  style="
                    margin: 0;
                    color: #4f5862;
                    font-size: 15px;
                    line-height: 1.8;
                  "
                >
                  Thank you for contacting Bernocchi Health. Your appointment
                  request has been received and placed under the attention of
                  our Segreteria Generale.
                </p>

                <p
                  style="
                    margin: 18px 0 0;
                    color: #4f5862;
                    font-size: 15px;
                    line-height: 1.8;
                  "
                >
                  A member of our office will review the requested date and
                  contact you personally to confirm availability and the next
                  steps.
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
                  Request summary
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
                      Consultation
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
                      Modality
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
                      Preferred date
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
                      Preferred time
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
                      Preferred language
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
                        Visit Bernocchi Health
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
                  This communication confirms receipt of your request. It does
                  not yet constitute a confirmed appointment, and no payment
                  has been taken.
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
                  With our regards,<br>
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
                  ${site.legalName}<br>
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
                  © ${year} Casa Bernocchi. Confidential institutional
                  communication.
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
            This message was generated because an appointment request was
            submitted at ${site.domain}.
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
