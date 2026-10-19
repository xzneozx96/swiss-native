import type { Mail } from '../types'

import { Suspense } from 'react'

import { useMessages } from '@/contexts/locale-context'
import { useDemoSelector } from '@/features/demo'
import { dateTimeFormat } from '@/lib/format'
import { renderMail } from './render-mail'

/** The emails of one recipient, rendered in the recipient's language. Loaded when the panel opens; an email in a language the page has not loaded yet waits for that language's messages. */
export function MailList({ items }: { items: Mail[] }) {
  const guests = useDemoSelector(s => s.data.guests)

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted">No emails yet.</p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((mail, i) => {
        const guest = guests.find(g => g.id === mail.guestId)
        const to = mail.recipient
          ? mail.recipient
          : mail.to === 'staff'
            ? 'Host (Erich Haldi)'
            : guest
              ? `${guest.name} <${String(mail.params.email ?? guest.email)}>`
              : 'Guest'

        return (
          <Suspense
            key={mail.id}
            fallback={<li aria-busy="true" className="h-14 rounded-2xl border border-separator bg-surface" />}
          >
            <MailItem mail={mail} open={i === 0} to={to} />
          </Suspense>
        )
      })}
    </ul>
  )
}

function MailItem({
  mail,
  open,
  to,
}: {
  mail: Mail
  open: boolean
  to: string
}) {
  const { subject, body } = renderMail(mail, useMessages(mail.language))

  return (
    <li>
      <details
        className="group rounded-2xl border border-separator bg-surface"
        open={open}
      >
        <summary className="flex cursor-pointer list-none flex-col gap-0.5 rounded-2xl px-4 py-3 outline-none focus-visible:focus-ring">
          <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
            <span className="rounded bg-surface-secondary px-1.5">
              {mail.template}
            </span>
            {`${mail.language.toUpperCase()} · ${formatSentAt(mail.at)}`}
          </span>
          <span className="text-sm font-semibold">{subject}</span>
        </summary>
        <div className="flex flex-col gap-3 border-t border-separator px-4 py-3 text-sm">
          <p className="text-xs text-muted">To: {to}</p>
          {body.map((paragraph, n) => (
            <p key={n}>{paragraph}</p>
          ))}
        </div>
      </details>
    </li>
  )
}

function formatSentAt(iso: string): string {
  return dateTimeFormat('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Zurich',
  }).format(new Date(iso))
}
