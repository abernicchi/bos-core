import 'server-only'

import { sendEmail, SEGRETERIA_RECIPIENT } from '@/lib/email'
import type { PaymentOrder, BookingContact } from './orders'

export async function sendPaymentConfirmation(input: {
  order: PaymentOrder
  contact: BookingContact
  provider: 'paypal' | 'onvo'
  transactionId: string
}) {
  const amountMinor = input.order.provider_amount_minor ?? input.order.amount_minor
  const currency = input.order.provider_currency ?? input.order.currency
  const amount = `${currency} ${(amountMinor / 100).toFixed(2)}`
  const providerName = input.provider === 'paypal' ? 'PayPal' : 'ONVO'

  const results = await Promise.all([
    sendEmail({
      to: input.contact.patient_email,
      replyTo: SEGRETERIA_RECIPIENT,
      subject: 'Pago recibido — Casa Bernocchi',
      text: [
        `Estimado/a ${input.contact.patient_name},`,
        '',
        'Su pago ha sido recibido y conciliado correctamente.',
        `Referencia de reserva: ${input.contact.reference_code}`,
        `Importe: ${amount}`,
        `Proveedor: ${providerName}`,
        `Transacción: ${input.transactionId}`,
        '',
        'La Segreteria Generale remitirá los detalles definitivos de la cita.',
        '',
        'Casa Bernocchi · Segreteria Generale',
      ].join('\n'),
    }),
    sendEmail({
      to: SEGRETERIA_RECIPIENT,
      replyTo: input.contact.patient_email,
      subject: `Pago conciliado — ${input.contact.reference_code}`,
      text: [
        `Pago ${providerName} conciliado`,
        `Reserva: ${input.contact.reference_code}`,
        `Importe: ${amount}`,
        `Transacción: ${input.transactionId}`,
      ].join('\n'),
    }),
  ])

  for (const result of results) {
    if (result.status === 'error') {
      console.error('[Casa Bernocchi] Payment confirmation delivery failed:', result.detail)
    }
  }
}

export async function sendRefundConfirmation(input: {
  order: PaymentOrder
  contact: BookingContact
  status: 'partially_refunded' | 'refunded'
  amountMinor: number
  currency: string
  transactionId: string
}) {
  const amount = `${input.currency} ${(input.amountMinor / 100).toFixed(2)}`
  const isFull = input.status === 'refunded'
  const label = isFull ? 'Reembolso confirmado' : 'Reembolso parcial confirmado'
  const results = await Promise.all([
    sendEmail({
      to: input.contact.patient_email,
      replyTo: SEGRETERIA_RECIPIENT,
      subject: `${label} — Casa Bernocchi`,
      text: [
        `Estimado/a ${input.contact.patient_name},`,
        '',
        `${label}: ${amount}.`,
        `Referencia de reserva: ${input.contact.reference_code}`,
        `Transacción PayPal: ${input.transactionId}`,
        '',
        'El tiempo de acreditación final depende del método de pago y de la entidad emisora.',
        '',
        'Casa Bernocchi · Segreteria Generale',
      ].join('\n'),
    }),
    sendEmail({
      to: SEGRETERIA_RECIPIENT,
      replyTo: input.contact.patient_email,
      subject: `${label} — ${input.contact.reference_code}`,
      text: [
        label,
        `Reserva: ${input.contact.reference_code}`,
        `Importe: ${amount}`,
        `Transacción PayPal: ${input.transactionId}`,
      ].join('\n'),
    }),
  ])

  for (const result of results) {
    if (result.status === 'error') {
      console.error('[Casa Bernocchi] Refund confirmation delivery failed:', result.detail)
    }
  }
}
