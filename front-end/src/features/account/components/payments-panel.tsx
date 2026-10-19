import type { IconComponent } from '@/components/icons'
import type { Payment } from '@/features/payment/types'
import type { TourBooking } from '@/features/tours/types'

import { buttonVariants } from '@heroui/react'
import { Link } from '@tanstack/react-router'

import {
  BankIcon,
  CardIcon,
  CashIcon,
  ChevronRightIcon,
  OrdersIcon,
} from '@/components/icons'

import { Media } from '@/components/media'

import { StatusChip } from '@/components/status-chip'
import { useLocale } from '@/contexts/locale-context'
import {
  useBookingFormat,
  useTourPhoto,
} from '@/features/tours/booking/booking-summary'
import { useBookingLabels } from '@/features/tours/components/booking-status'
import { bookingAmountDue } from '@/features/tours/lib/selectors'
import { pickText } from '@/lib/localized'
import { useAccountPayments } from '../hooks/use-account-payments'
import { itemClass, rowClass, RowIcon, SettingsGroup } from './settings-list'

const methodIcon: Record<Payment['method'], IconComponent> = {
  'online': CardIcon,
  'cash': CashIcon,
  'bank-transfer': BankIcon,
  'other': OrdersIcon,
}

/**
 * Payments (1.12s): what is due now with a Pay button, every payment as a clean row grouped
 * by month, and payment methods. Saved methods are an honest "later": the PRD asks for no
 * stored card or card guarantee and no provider is chosen yet.
 */
export function PaymentsPanel() {
  const { t } = useLocale()
  const { due, months } = useAccountPayments()

  return (
    <>
      {due.length > 0 && (
        <section aria-labelledby="pay-due" className="flex flex-col gap-2">
          <h2 className="px-1 text-sm font-semibold text-muted" id="pay-due">
            {t('account.payments.due.title')}
          </h2>
          <ul className="flex flex-col gap-3">
            {due.map(booking => (
              <DueCard key={booking.id} booking={booking} />
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="pay-history" className="flex flex-col gap-2">
        <h2 className="px-1 text-sm font-semibold text-muted" id="pay-history">
          {t('account.payments.history.title')}
        </h2>
        {months.length === 0
          ? (
              <div className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-4 shadow-surface">
                <RowIcon icon={OrdersIcon} />
                <p className="text-sm text-muted">
                  {t('account.payments.history.none')}
                </p>
              </div>
            )
          : (
              <div className="flex flex-col gap-5">
                {months.map(month => (
                  <div key={month.label} className="flex flex-col gap-2">
                    <h3 className="px-1 text-base font-semibold">{month.label}</h3>
                    <ul className="flex flex-col overflow-hidden rounded-2xl bg-surface shadow-surface">
                      {month.rows.map(p => (
                        <li key={p.id} className={itemClass}>
                          <Link
                            className={rowClass}
                            params={{ bookingId: p.bookingId }}
                            to="/account/bookings/$bookingId"
                          >
                            <RowIcon icon={methodIcon[p.method]} />
                            <span className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
                              <span className="flex w-full flex-col">
                                <span className="flex w-full items-baseline gap-3">
                                  <span className="flex-1 truncate font-medium">
                                    {p.tour}
                                  </span>
                                  <span className="shrink-0 font-semibold tabular-nums">
                                    {p.amount}
                                  </span>
                                </span>
                                <span className="truncate text-sm text-muted tabular-nums">
                                  {p.ref} · {p.meta}
                                </span>
                              </span>
                              <StatusChip tone={p.status.tone}>
                                {p.status.text}
                              </StatusChip>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
      </section>

      <SettingsGroup
        id="pay-methods"
        title={t('account.payments.methods.title')}
      >
        <li className={`${itemClass} flex items-start gap-3 px-4 py-4`}>
          <RowIcon icon={CardIcon} />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="font-medium">
              {t('account.payments.methods.later')}
            </span>
            <span className="text-sm text-muted">
              {t('account.payments.methods.body')}
            </span>
          </span>
        </li>
      </SettingsGroup>
    </>
  )
}

/** An open booking with money due now: the tour, what is due, its payment label, and Pay. */
function DueCard({ booking }: { booking: TourBooking }) {
  const { t, language } = useLocale()
  const { money } = useBookingFormat()
  const { payment } = useBookingLabels(booking)
  const photo = useTourPhoto(booking)
  const due = money(bookingAmountDue(booking))
  const canPay = !booking.payments.some(p => p.status === 'processing')

  return (
    <li className="flex flex-col gap-4 rounded-2xl bg-surface p-4 shadow-surface">
      <Link
        className="-m-2 flex items-center gap-3 rounded-xl p-2 outline-none focus-visible:focus-ring"
        params={{ bookingId: booking.id }}
        to="/account/bookings/$bookingId"
      >
        <Media alt="" className="size-14 shrink-0 rounded-xl" photo={photo} />
        <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
          <span className="line-clamp-1 font-serif text-card-title">
            {pickText(booking.tourName, language).text}
          </span>
          <span className="text-sm text-muted tabular-nums">{booking.ref}</span>
        </span>
        <ChevronRightIcon
          aria-hidden
          className="shrink-0 text-muted"
          size={20}
        />
      </Link>
      <div className="flex flex-col items-start gap-3 border-t border-dashed border-separator pt-4">
        <span className="flex w-full items-baseline justify-between gap-3">
          <span className="text-sm text-muted">
            {t('account.payments.due.amount')}
          </span>
          <span className="text-2xl leading-none font-semibold tabular-nums">
            {due}
          </span>
        </span>
        <StatusChip tone={payment.tone}>{payment.text}</StatusChip>
      </div>
      {canPay && (
        <Link
          className={`${buttonVariants({ variant: 'primary', fullWidth: true })} transition-transform active:scale-[0.98]`}
          params={{ bookingId: booking.id }}
          to="/account/bookings/$bookingId/pay"
        >
          {t('guestOrder.action.pay', { amount: due })}
        </Link>
      )}
    </li>
  )
}
