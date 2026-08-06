import { site } from './content.ts'

/**
 * CASA BERNOCCHI — PREMIUM EMAIL SYSTEM
 * --------------------------------------
 * Transactional email delivery through Resend.
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

const WHATSAPP_RECEIPT_URL =
  'https://wa.me/50683703939?text=Adjunto%20el%20comprobante%20del%20dep%C3%B3sito%20de%20reserva%20de%20mi%20cita.'

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

export type ConfirmedAppointmentData = AppointmentConfirmationData & {
  meetUrl?: string
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
      'Reserva provisional de su cita — Depósito pendiente',

    eyebrow:
      'Confirmación institucional',

    title:
      'Su solicitud ha sido recibida',

    greeting: (name: string) =>
      `Estimado/a ${name},`,

    introduction:
      'Gracias por confiar en Bernocchi Health. La Segreteria Generale ha recibido correctamente su solicitud y ha registrado los siguientes datos para la reserva de su atención.',

    labels: {
      consultation: 'Consulta',
      mode: 'Modalidad',
      date: 'Fecha solicitada',
      time: 'Hora solicitada',
      language: 'Idioma preferido',
    },

    reservationTitle:
      'Reserva provisional',

    reservationNotice:
      'La fecha y la hora seleccionadas constituyen una reserva provisional. El espacio quedará confirmado únicamente después de que la Segreteria Generale verifique el depósito de reserva y remita la confirmación definitiva.',

    paymentEyebrow:
      'SINPE Móvil',

    paymentTitle:
      'Depósito de reserva',

    paymentAmount:
      '₡25.000 CRC',

    paymentExplanation:
      'Este depósito es un monto fijo de reserva y no representa un porcentaje del precio de la consulta. Será acreditado al importe final de la atención, cuyos honorarios se expresan en dólares estadounidenses.',

    paymentNumberLabel:
      'Número SINPE Móvil',

    paymentNumber:
      '+506 8370-3939',

    paymentHolderLabel:
      'Titular',

    paymentHolder:
      'Sociedad de Responsabilidad Limitada',

    legalIdLabel:
      'Cédula jurídica',

    legalId:
      '3-102-888680',

    receiptTitle:
      'Envío del comprobante',

    receiptText:
      'Después de realizar el depósito, remita el comprobante mediante WhatsApp o respondiendo directamente a este correo. Indique el nombre completo de la persona para quien se solicita la cita.',

    whatsappButton:
      'Enviar comprobante por WhatsApp',

    policiesTitle:
      'Condiciones de reserva',

    policies: [
      'El horario permanecerá reservado provisionalmente durante 30 minutos. Si el comprobante no es recibido dentro de ese plazo, el espacio podrá quedar nuevamente disponible.',
      'Se permite una reprogramación sin penalización cuando sea solicitada con al menos 24 horas de anticipación. La nueva fecha estará sujeta a disponibilidad y deberá programarse dentro de los 30 días siguientes.',
      'Las cancelaciones comunicadas con menos de 24 horas de anticipación y las ausencias sin aviso implican la pérdida del depósito de reserva.',
      'La consulta finalizará a la hora originalmente programada. Un retraso superior a 20 minutos podrá considerarse ausencia.',
      'Cuando Bernocchi Health deba cancelar o modificar la cita, el depósito podrá trasladarse íntegramente a una nueva fecha o devolverse.',
      'El saldo restante deberá cancelarse antes del inicio de la consulta, conforme a las instrucciones remitidas por la Segreteria Generale.',
    ],

    finalNotice:
      'La cita quedará oficialmente confirmada únicamente cuando la Segreteria Generale verifique el comprobante y envíe una segunda comunicación de confirmación.',

    reply:
      'Para cualquier aclaración adicional, puede responder directamente a este correo.',

    regards:
      'Con nuestra más alta consideración',

    transaction:
      'Esta comunicación fue generada después de una solicitud realizada desde el sitio oficial de Casa Bernocchi.',
  },

  it: {
    htmlLanguage: 'it',

    subject:
      'Prenotazione provvisoria — Deposito in attesa',

    eyebrow:
      'Conferma istituzionale',

    title:
      'La Sua richiesta è stata ricevuta',

    greeting: (name: string) =>
      `Gentile ${name},`,

    introduction:
      'La ringraziamo per la fiducia accordata a Bernocchi Health. La Segreteria Generale ha ricevuto correttamente la Sua richiesta e ha registrato i seguenti dati.',

    labels: {
      consultation: 'Consulenza',
      mode: 'Modalità',
      date: 'Data richiesta',
      time: 'Orario richiesto',
      language: 'Lingua preferita',
    },

    reservationTitle:
      'Prenotazione provvisoria',

    reservationNotice:
      'La data e l’orario selezionati costituiscono una prenotazione provvisoria. L’appuntamento sarà confermato esclusivamente dopo la verifica del deposito da parte della Segreteria Generale.',

    paymentEyebrow:
      'SINPE Móvil',

    paymentTitle:
      'Deposito di prenotazione',

    paymentAmount:
      '₡25.000 CRC',

    paymentExplanation:
      'Il deposito è un importo fisso di prenotazione e non rappresenta una percentuale del prezzo della consulenza. Sarà accreditato all’importo finale, espresso in dollari statunitensi.',

    paymentNumberLabel:
      'Numero SINPE Móvil',

    paymentNumber:
      '+506 8370-3939',

    paymentHolderLabel:
      'Intestatario',

    paymentHolder:
      'Sociedad de Responsabilidad Limitada',

    legalIdLabel:
      'Identificazione giuridica',

    legalId:
      '3-102-888680',

    receiptTitle:
      'Invio della ricevuta',

    receiptText:
      'Dopo il pagamento, invii la ricevuta tramite WhatsApp oppure rispondendo direttamente a questa comunicazione. Indichi il nome completo della persona interessata.',

    whatsappButton:
      'Inviare la ricevuta tramite WhatsApp',

    policiesTitle:
      'Condizioni di prenotazione',

    policies: [
      'L’orario resterà riservato provvisoriamente per 30 minuti. In assenza della ricevuta entro tale termine, lo spazio potrà tornare disponibile.',
      'È consentita una riprogrammazione senza penalità con almeno 24 ore di preavviso, soggetta a disponibilità e da effettuarsi entro i 30 giorni successivi.',
      'Le cancellazioni comunicate con meno di 24 ore di anticipo e le assenze comportano la perdita del deposito.',
      'La consulenza terminerà all’orario originariamente previsto. Un ritardo superiore a 20 minuti potrà essere considerato assenza.',
      'Qualora Bernocchi Health debba modificare o annullare l’appuntamento, il deposito potrà essere trasferito integralmente o rimborsato.',
      'Il saldo restante dovrà essere corrisposto prima dell’inizio della consulenza.',
    ],

    finalNotice:
      'L’appuntamento sarà ufficialmente confermato esclusivamente dopo la verifica della ricevuta e l’invio di una seconda comunicazione da parte della Segreteria Generale.',

    reply:
      'Per qualsiasi ulteriore chiarimento, può rispondere direttamente a questa comunicazione.',

    regards:
      'Con la nostra più alta considerazione',

    transaction:
      'Questa comunicazione è stata generata a seguito di una richiesta effettuata tramite il sito ufficiale di Casa Bernocchi.',
  },

  en: {
    htmlLanguage: 'en',

    subject:
      'Provisional appointment reservation — Deposit pending',

    eyebrow:
      'Institutional confirmation',

    title:
      'Your request has been received',

    greeting: (name: string) =>
      `Dear ${name},`,

    introduction:
      'Thank you for placing your trust in Bernocchi Health. The Segreteria Generale has received your request and registered the following appointment details.',

    labels: {
      consultation: 'Consultation',
      mode: 'Mode',
      date: 'Requested date',
      time: 'Requested time',
      language: 'Preferred language',
    },

    reservationTitle:
      'Provisional reservation',

    reservationNotice:
      'The selected date and time constitute a provisional reservation. The appointment will be confirmed only after the Segreteria Generale verifies the reservation deposit.',

    paymentEyebrow:
      'SINPE Móvil',

    paymentTitle:
      'Reservation deposit',

    paymentAmount:
      '₡25,000 CRC',

    paymentExplanation:
      'This is a fixed reservation deposit and does not represent a percentage of the consultation price. It will be credited toward the final amount, which is expressed in United States dollars.',

    paymentNumberLabel:
      'SINPE Móvil number',

    paymentNumber:
      '+506 8370-3939',

    paymentHolderLabel:
      'Account holder',

    paymentHolder:
      'Sociedad de Responsabilidad Limitada',

    legalIdLabel:
      'Legal identification',

    legalId:
      '3-102-888680',

    receiptTitle:
      'Sending your receipt',

    receiptText:
      'After completing the deposit, send the receipt through WhatsApp or reply directly to this email. Please include the full name of the person requesting the appointment.',

    whatsappButton:
      'Send receipt through WhatsApp',

    policiesTitle:
      'Reservation conditions',

    policies: [
      'The time slot will remain provisionally reserved for 30 minutes. If the receipt is not received within that period, the slot may become available again.',
      'One rescheduling is permitted without penalty when requested at least 24 hours in advance, subject to availability and within the following 30 days.',
      'Cancellations made with less than 24 hours’ notice and missed appointments result in the loss of the reservation deposit.',
      'The consultation will end at the originally scheduled time. A delay exceeding 20 minutes may be considered a missed appointment.',
      'When Bernocchi Health must modify or cancel the appointment, the deposit may be transferred in full or refunded.',
      'The remaining balance must be paid before the consultation begins.',
    ],

    finalNotice:
      'The appointment will be officially confirmed only after the Segreteria Generale verifies the receipt and sends a second confirmation email.',

    reply:
      'For any further clarification, you may reply directly to this email.',

    regards:
      'With our highest consideration',

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

function renderPolicies(
  policies: readonly string[],
): string {
  return policies
    .map(
      (policy, index) => `
        <tr>
          <td
            width="28"
            valign="top"
            style="
              padding:0 10px 15px 0;
              color:#b9964a;
              font-family:Georgia, 'Times New Roman', serif;
              font-size:16px;
              line-height:1.6;
            "
          >
            ${String(index + 1).padStart(2, '0')}
          </td>

          <td
            class="policy-text"
            valign="top"
            style="
              padding:0 0 15px;
              color:#4a4f58;
              font-family:Arial, Helvetica, sans-serif;
              font-size:12px;
              line-height:1.7;
            "
          >
            ${escapeHtml(policy)}
          </td>
        </tr>
      `,
    )
    .join('')
}

function renderPremiumShell({
  htmlLanguage,
  preheader,
  eyebrow,
  title,
  bodyHtml,
  regards,
  transaction,
}: {
  htmlLanguage: string
  preheader: string
  eyebrow: string
  title: string
  bodyHtml: string
  regards: string
  transaction: string
}): string {
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

    a {
      text-decoration: none;
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

      .payment-amount {
        font-size: 29px !important;
      }

      .button-cell {
        display: block !important;
        width: 100% !important;
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
      .signature-name,
      .section-title {
        color: #f3efe5 !important;
      }

      .detail-table,
      .notice-box,
      .policy-box {
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
      .policy-text,
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

              ${bodyHtml}

              <!-- SIGNATURE -->
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  width:100%;
                  margin-top:32px;
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

function renderAppointmentBody(
  data: AppointmentConfirmationData,
  language: EmailLanguage,
): string {
  const copy = confirmationCopy[language]

  const details: DetailRow[] = [
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
  ]

  return `
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
      ${escapeHtml(copy.greeting(data.fullName))}
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
      ${escapeHtml(copy.introduction)}
    </p>

    <!-- APPOINTMENT DETAILS -->
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

    <!-- PROVISIONAL RESERVATION -->
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      class="notice-box"
      style="
        width:100%;
        margin:27px 0;
        border:1px solid #ddcfb5;
        border-left:3px solid #b9964a;
        background:#f7f2e8;
      "
    >
      <tr>
        <td style="padding:20px 22px;">
          <div
            class="section-title"
            style="
              color:#172235;
              font-family:Georgia, 'Times New Roman', serif;
              font-size:19px;
              line-height:1.4;
            "
          >
            ${escapeHtml(copy.reservationTitle)}
          </div>

          <div
            class="notice-text"
            style="
              margin-top:8px;
              color:#4e4b45;
              font-family:Arial, Helvetica, sans-serif;
              font-size:13px;
              line-height:1.75;
            "
          >
            ${escapeHtml(copy.reservationNotice)}
          </div>
        </td>
      </tr>
    </table>

    <!-- SINPE PAYMENT -->
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="
        width:100%;
        margin:30px 0;
        border-collapse:separate;
        border-spacing:0;
        background:#07131f;
        border:1px solid #b9964a;
        border-radius:5px;
        overflow:hidden;
      "
    >
      <tr>
        <td
          align="center"
          style="
            padding:25px 24px 11px;
          "
        >
          <div
            style="
              display:inline-block;
              min-width:28px;
              height:28px;
              padding:0 7px;
              border:1px solid #c6a45d;
              border-radius:50%;
              color:#d0ad65;
              font-family:Georgia, 'Times New Roman', serif;
              font-size:17px;
              line-height:28px;
              text-align:center;
            "
          >
            ₡
          </div>

          <div
            style="
              margin-top:12px;
              color:#c6a45d;
              font-family:Arial, Helvetica, sans-serif;
              font-size:10px;
              font-weight:700;
              letter-spacing:2.4px;
              text-transform:uppercase;
            "
          >
            ${escapeHtml(copy.paymentEyebrow)}
          </div>

          <div
            style="
              margin-top:8px;
              color:#f3efe5;
              font-family:Georgia, 'Times New Roman', serif;
              font-size:21px;
              line-height:1.4;
            "
          >
            ${escapeHtml(copy.paymentTitle)}
          </div>

          <div
            class="payment-amount"
            style="
              margin-top:10px;
              color:#d0ad65;
              font-family:Georgia, 'Times New Roman', serif;
              font-size:35px;
              line-height:1.25;
            "
          >
            ${escapeHtml(copy.paymentAmount)}
          </div>
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:12px 27px 24px;
          "
        >
          <div
            style="
              color:#c1c8d0;
              font-family:Arial, Helvetica, sans-serif;
              font-size:12px;
              line-height:1.75;
              text-align:center;
            "
          >
            ${escapeHtml(copy.paymentExplanation)}
          </div>
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:0 27px 25px;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width:100%;
              border-top:1px solid #33404e;
            "
          >
            <tr>
              <td
                style="
                  padding:14px 0 5px;
                  color:#c6a45d;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:9px;
                  font-weight:700;
                  letter-spacing:1.2px;
                  text-transform:uppercase;
                "
              >
                ${escapeHtml(copy.paymentNumberLabel)}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:0 0 12px;
                  color:#f3efe5;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:16px;
                  line-height:1.5;
                "
              >
                ${escapeHtml(copy.paymentNumber)}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:12px 0 5px;
                  border-top:1px solid #33404e;
                  color:#c6a45d;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:9px;
                  font-weight:700;
                  letter-spacing:1.2px;
                  text-transform:uppercase;
                "
              >
                ${escapeHtml(copy.paymentHolderLabel)}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:0 0 12px;
                  color:#f3efe5;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:14px;
                  line-height:1.5;
                "
              >
                ${escapeHtml(copy.paymentHolder)}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:12px 0 5px;
                  border-top:1px solid #33404e;
                  color:#c6a45d;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:9px;
                  font-weight:700;
                  letter-spacing:1.2px;
                  text-transform:uppercase;
                "
              >
                ${escapeHtml(copy.legalIdLabel)}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:0;
                  color:#f3efe5;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:14px;
                  line-height:1.5;
                "
              >
                ${escapeHtml(copy.legalId)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- RECEIPT -->
    <div
      class="section-title"
      style="
        margin-top:29px;
        color:#172235;
        font-family:Georgia, 'Times New Roman', serif;
        font-size:21px;
        line-height:1.4;
      "
    >
      ${escapeHtml(copy.receiptTitle)}
    </div>

    <p
      class="body-copy"
      style="
        margin:10px 0 20px;
        color:#4a4f58;
        font-family:Arial, Helvetica, sans-serif;
        font-size:13px;
        line-height:1.75;
      "
    >
      ${escapeHtml(copy.receiptText)}
    </p>

    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="margin:0 0 31px;"
    >
      <tr>
        <td
          align="center"
          bgcolor="#B9964A"
          style="
            border-radius:3px;
            background:#b9964a;
          "
        >
          <a
            href="${WHATSAPP_RECEIPT_URL}"
            target="_blank"
            style="
              display:inline-block;
              padding:13px 21px;
              color:#07131f;
              font-family:Arial, Helvetica, sans-serif;
              font-size:11px;
              font-weight:700;
              line-height:1.4;
              letter-spacing:0.7px;
              text-transform:uppercase;
            "
          >
            ${escapeHtml(copy.whatsappButton)}
          </a>
        </td>
      </tr>
    </table>

    <!-- POLICIES -->
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      class="policy-box"
      style="
        width:100%;
        margin:26px 0;
        border:1px solid #d9cebb;
        background:#faf7f0;
      "
    >
      <tr>
        <td style="padding:23px 22px 8px;">
          <div
            class="section-title"
            style="
              color:#172235;
              font-family:Georgia, 'Times New Roman', serif;
              font-size:21px;
              line-height:1.4;
            "
          >
            ${escapeHtml(copy.policiesTitle)}
          </div>
        </td>
      </tr>

      <tr>
        <td style="padding:13px 22px 9px;">
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
          >
            ${renderPolicies(copy.policies)}
          </table>
        </td>
      </tr>
    </table>

    <!-- FINAL CONFIRMATION NOTICE -->
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      class="notice-box"
      style="
        width:100%;
        margin:26px 0 21px;
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
            font-weight:600;
            line-height:1.75;
          "
        >
          ${escapeHtml(copy.finalNotice)}
        </td>
      </tr>
    </table>

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
      ${escapeHtml(copy.reply)}
    </p>
  `
}

function renderGenericEmail(
  subject: string,
  text: string,
): string {
  const bodyHtml = text
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

  return renderPremiumShell({
    htmlLanguage: 'en',
    preheader: subject,
    eyebrow: 'Comunicazione istituzionale',
    title: subject,
    bodyHtml,
    regards: 'Con i nostri riguardi',
    transaction:
      'This transactional communication was generated following a request submitted through the official Casa Bernocchi website.',
  })
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
    copy.reservationTitle,
    copy.reservationNotice,
    '',
    copy.paymentTitle,
    copy.paymentAmount,
    `${copy.paymentNumberLabel}: ${copy.paymentNumber}`,
    `${copy.paymentHolderLabel}: ${copy.paymentHolder}`,
    `${copy.legalIdLabel}: ${copy.legalId}`,
    '',
    copy.paymentExplanation,
    '',
    copy.receiptTitle,
    copy.receiptText,
    `WhatsApp: ${copy.paymentNumber}`,
    '',
    copy.policiesTitle,
    ...copy.policies.map(
      (policy, index) => `${index + 1}. ${policy}`,
    ),
    '',
    copy.finalNotice,
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

  return renderPremiumShell({
    htmlLanguage: copy.htmlLanguage,
    preheader: copy.subject,
    eyebrow: copy.eyebrow,
    title: copy.title,
    bodyHtml: renderAppointmentBody(data, language),
    regards: copy.regards,
    transaction: copy.transaction,
  })
}

const confirmedCopy = {
  es: { subject: 'Cita confirmada — Bernocchi Health', eyebrow: 'Confirmación definitiva', title: 'Su cita ha sido confirmada', greeting: (name: string) => `Estimado/a ${name},`, body: 'La Segreteria Generale verificó el depósito de ₡25.000 CRC, acreditado íntegramente al importe final de la consulta. Los honorarios profesionales se expresan en USD.', meet: 'Acceder a la consulta virtual', regards: 'Con nuestra más alta consideración', transaction: 'Confirmación definitiva emitida por Casa Bernocchi.' },
  en: { subject: 'Appointment confirmed — Bernocchi Health', eyebrow: 'Final confirmation', title: 'Your appointment is confirmed', greeting: (name: string) => `Dear ${name},`, body: 'The Segreteria Generale verified the ₡25,000 CRC deposit, credited in full toward the final consultation amount. Professional fees are expressed in USD.', meet: 'Join the virtual consultation', regards: 'With our highest consideration', transaction: 'Final confirmation issued by Casa Bernocchi.' },
  it: { subject: 'Appuntamento confermato — Bernocchi Health', eyebrow: 'Conferma definitiva', title: 'Il Suo appuntamento è confermato', greeting: (name: string) => `Gentile ${name},`, body: 'La Segreteria Generale ha verificato il deposito di ₡25.000 CRC, interamente accreditato all’importo finale della consulenza. Gli onorari professionali sono espressi in USD.', meet: 'Accedere alla consulenza virtuale', regards: 'Con la nostra più alta considerazione', transaction: 'Conferma definitiva emessa da Casa Bernocchi.' },
} as const

export function getConfirmedAppointmentSubject(language: string) {
  return confirmedCopy[resolveLanguage(language)].subject
}

export function buildConfirmedAppointmentText(data: ConfirmedAppointmentData) {
  const copy = confirmedCopy[resolveLanguage(data.language)]
  return [copy.greeting(data.fullName), '', copy.body, '', `Consulta / Consultation / Consulenza: ${data.consultation}`, `Modalidad / Mode / Modalità: ${data.mode}`, `Fecha / Date / Data: ${data.date}`, `Hora / Time / Ora: ${data.time}`, `Idioma / Language / Lingua: ${data.language}`, ...(data.meetUrl ? ['', `${copy.meet}: ${data.meetUrl}`] : []), '', copy.regards, 'Segreteria Generale', 'Casa Bernocchi'].join('\n')
}

export function buildConfirmedAppointmentEmail(data: ConfirmedAppointmentData) {
  const language = resolveLanguage(data.language); const copy = confirmedCopy[language]
  const provisional = confirmationCopy[language]
  const details = [
    { label: provisional.labels.consultation, value: data.consultation },
    { label: provisional.labels.mode, value: data.mode },
    { label: provisional.labels.date, value: data.date },
    { label: provisional.labels.time, value: data.time },
    { label: provisional.labels.language, value: data.language },
  ]
  const meet = data.meetUrl ? `<p style="margin:26px 0;text-align:center"><a href="${escapeHtml(data.meetUrl)}" style="display:inline-block;background:#B9964A;color:#07131F;padding:14px 24px;border-radius:3px;font-family:Arial,Helvetica,sans-serif;font-weight:700">${escapeHtml(copy.meet)}</a></p>` : ''
  const bodyHtml = `<p class="body-copy" style="color:#28313e;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.7">${escapeHtml(copy.greeting(data.fullName))}</p><p class="body-copy" style="color:#343b46;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.8">${escapeHtml(copy.body)}</p><table role="presentation" width="100%" class="detail-table" style="width:100%;margin:27px 0;border:1px solid #d9cebb;border-collapse:separate;background:#faf7f0">${renderDetails(details)}</table>${meet}`
  return renderPremiumShell({ htmlLanguage: language, preheader: copy.subject, eyebrow: copy.eyebrow, title: copy.title, bodyHtml, regards: copy.regards, transaction: copy.transaction })
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
