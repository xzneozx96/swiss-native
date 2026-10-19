import type { Mail } from '../types'

import { useMessages } from '@/contexts/locale-context'
import { renderMail } from './render-mail'

/** A logged email's subject in the email's own language. Suspends while that language loads. */
export function MailSubject({ mail }: { mail: Mail }) {
  return renderMail(mail, useMessages(mail.language)).subject
}
