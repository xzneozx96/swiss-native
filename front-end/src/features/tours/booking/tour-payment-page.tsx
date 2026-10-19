import type { TourBooking } from '../types'

import { Alert } from '@heroui/react'
import { useEffect } from 'react'

import { EmptyState } from '@/components/empty-state'
import { TourIcon } from '@/components/icons'

import { useLocale } from '@/contexts/locale-context'
import { useDemoSelector } from '@/features/demo'
import { demoNow } from '@/features/demo/clock'
import { ProviderPage } from '@/features/payment/components/provider-page'
import { useTourActions, useTours } from '@/features/tours/hooks/use-tours'
import { useSharedClock } from '@/hooks/use-shared-clock'
import { ExpiredNotice, ReconciliationNotice } from './expired-notice'
import { useTourPayment } from './use-tour-payment'

/**
 * The signed-in guest's booking. `now` reads the clock to the minute, for deadlines; `holdNow`
 * ticks every second only while a hold runs, for its countdown, its expiry and the pay check.
 * Only what takes `holdNow` re-renders each second.
 */
export function useOwnedBooking(bookingId: string) {
  const { bookings, guestId, now } = useTours()
  const clockStartedAt = useDemoSelector(s => s.clockStartedAt)
  const { expireHolds } = useTourActions()
  const booking = bookings.find(
    item => item.id === bookingId && item.guestId === guestId,
  )
  const holdNow = demoNow(
    clockStartedAt,
    useSharedClock(booking?.status === 'pending_payment' ? 1_000 : 60_000),
  )
  const expired
    = booking?.status === 'pending_payment'
      && Date.parse(booking.holdUntil) <= holdNow.getTime()

  useEffect(() => {
    if (expired)
      expireHolds()
  }, [expired, expireHolds])

  return { booking, now, holdNow }
}

export function MissingBooking() {
  const { t } = useLocale()

  return (
    <EmptyState
      action={{ label: t('tourBooking.explore'), to: '/tours' }}
      icon={TourIcon}
      message={t('tourBooking.missing')}
    />
  )
}

export function HoldNotice({
  booking,
  now,
}: {
  booking: TourBooking
  now: Date
}) {
  const { t } = useLocale()

  if (booking.status !== 'pending_payment')
    return null
  const seconds = Math.max(
    0,
    Math.ceil((Date.parse(booking.holdUntil) - now.getTime()) / 1000),
  )
  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

  return (
    <Alert className="alert--soft" status="warning">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{t('tourBooking.hold', { time })}</Alert.Title>
        <Alert.Description>{t('tourBooking.holdBody')}</Alert.Description>
      </Alert.Content>
    </Alert>
  )
}

export function TourPaymentPage({ bookingId }: { bookingId: string }) {
  const { booking, holdNow } = useOwnedBooking(bookingId)

  return booking
    ? (
        <PaymentContent booking={booking} now={holdNow} />
      )
    : (
        <MissingBooking />
      )
}

function PaymentContent({ booking, now }: { booking: TourBooking, now: Date }) {
  const view = useTourPayment(booking, now)

  return (
    <div>
      {booking.status === 'pending_payment' && (
        <div className="bg-background p-4">
          <HoldNotice booking={booking} now={now} />
        </div>
      )}
      {booking.status === 'expired' && (
        <div className="flex flex-col gap-3 bg-background p-4">
          <ExpiredNotice booking={booking} />
          <ReconciliationNotice booking={booking} />
        </div>
      )}
      <ProviderPage view={view} />
    </div>
  )
}
