import type { Mail } from '../types'
import type { Dictionary } from '@/contexts/locale-context'
import type { MessageKey } from '@/i18n/en'

import { renderRequestMail } from '@/features/requests/lib/render-request-mail'
import { renderTourMail } from '@/features/tours/merchant/lib/render-mail'

const PLACEHOLDER = /\{(\w+)\}/g

export interface RenderedMail {
  subject: string
  /** Paragraphs of the email body. */
  body: string[]
}

function fill(text: string, vars: Record<string, string | number>): string {
  return text.replace(PLACEHOLDER, (match, name: string) =>
    name in vars ? String(vars[name]) : match)
}

/**
 * Renders a logged email in the recipient's language (spec §6: guests get the language
 * they booked in, the host their UI language), whatever language the prototype shows now.
 * `copy` holds the messages of `mail.language` (`useMessages`). Tour and private tour
 * request mails have their own renderers; the sign-in code (N01) is rendered here.
 */
export function renderMail(mail: Mail, copy: Dictionary): RenderedMail {
  if (mail.bookingId)
    return renderTourMail(mail, copy)
  if (mail.template === 'N17')
    return renderRequestMail(mail, copy)

  if (mail.template !== 'N01' || mail.to !== 'guest') {
    return {
      subject: mail.template,
      body: Object.entries(mail.params).map(([k, v]) => `${k}: ${v}`),
    }
  }
  const vars = { ...mail.params, shop: copy['app.name'] }

  return {
    subject: fill(copy['mail.N01.subject'], vars),
    body: [
      'mail.greeting',
      'mail.N01.code',
      'mail.N01.expiry',
      'mail.N01.ignore',
    ].map(key => fill(copy[key as MessageKey], vars)),
  }
}
