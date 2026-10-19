import type {
  Departure,
  Tour,
  TourBooking,
  TourData,
  TourKind,
  TourParticipants,
  TourPaymentPolicy,
} from '../types'

export function isTour(tour: Pick<Tour, 'kind'>): boolean {
  return tour.kind === 'tour'
}
export function findListing(
  data: TourData,
  kind: Exclude<TourKind, 'tour'>,
): Tour | undefined {
  return data.tours.find(tour => tour.kind === kind)
}
export function participantSeats(group: TourParticipants): number {
  return group.adults + group.children
}
/** The group's price; a stay's prices are per night. */
export function tourTotal(
  tour: Tour,
  group: TourParticipants,
  nights = 1,
): number {
  return (
    (tour.adultPrice * group.adults
      + tour.childPrice * group.children
      + tour.infantPrice * group.infants)
    * nights
  )
}
/** The departures a booking holds places on: every night of a stay, else its one departure. */
export function bookingNights(
  booking: Pick<TourBooking, 'departureId' | 'nightIds'>,
): string[] {
  return booking.nightIds?.length ? booking.nightIds : [booking.departureId]
}
export function bookingPaid(booking: TourBooking): number {
  return booking.payments
    .filter(p => p.status === 'succeeded')
    .reduce((sum, p) => sum + p.amount, 0)
}
export function bookingBalance(booking: TourBooking): number {
  return Math.max(0, booking.total - bookingPaid(booking))
}
export function bookingAmountDue(booking: TourBooking): number {
  return booking.status === 'pending_payment'
    ? Math.max(0, booking.firstAmount - bookingPaid(booking))
    : bookingBalance(booking)
}
// Seat counts run once per departure on schedules and pickers, so the lookups are indexed once
// per array. Keyed on the arrays, not on `data`: a draft keystroke makes a new `data` but keeps
// both arrays, and any change to departures or bookings replaces its array.
const departureIndexes = new WeakMap<
  readonly Departure[],
  Map<string, Departure>
>()
const bookingIndexes = new WeakMap<
  readonly TourBooking[],
  Map<string, TourBooking[]>
>()

function findDeparture(
  data: TourData,
  departureId: string,
): Departure | undefined {
  let index = departureIndexes.get(data.departures)

  if (!index) {
    index = new Map()
    for (const departure of data.departures) {
      if (!index.has(departure.id))
        index.set(departure.id, departure)
    }
    departureIndexes.set(data.departures, index)
  }

  return index.get(departureId)
}
/** The bookings that hold places on a departure (any night of a stay), in booking order. */
export function departureBookings(
  data: TourData,
  departureId: string,
): readonly TourBooking[] {
  let index = bookingIndexes.get(data.bookings)

  if (!index) {
    index = new Map()
    for (const booking of data.bookings) {
      for (const id of bookingNights(booking)) {
        const list = index.get(id)

        if (!list)
          index.set(id, [booking])
        else if (list.at(-1) !== booking)
          list.push(booking)
      }
    }
    bookingIndexes.set(data.bookings, index)
  }

  return index.get(departureId) ?? []
}
export function availableSeats(
  data: TourData,
  departureId: string,
  now: Date,
): number {
  const departure = findDeparture(data, departureId)

  if (!departure)
    return 0
  const held = departureBookings(data, departureId)
    .filter(b =>
      b.status === 'pending_payment'
        ? Date.parse(b.holdUntil) > now.getTime()
        : !['expired', 'cancelled'].includes(b.status),
    )
    .reduce((sum, b) => sum + participantSeats(b), 0)

  return Math.max(0, departure.capacity - held)
}
/** Amount due when the booking is made: 30% sample deposit, the full total, or nothing. */
export function firstPaymentAmount(
  policy: TourPaymentPolicy,
  total: number,
): number {
  if (policy === 'deposit')
    return Math.round(total * 0.3)

  return policy === 'full' ? total : 0
}
/** Open, not cancelled departures of a tour that have not started yet, soonest first. */
export function upcomingDepartures(
  data: TourData,
  tourId: string,
  now: Date,
): Departure[] {
  return data.departures
    .filter(d => d.tourId === tourId && !d.closed && !d.cancelledAt)
    .map(departure => ({ departure, start: Date.parse(departure.startsAt) }))
    .filter(({ start }) => start > now.getTime())
    .sort((a, b) => a.start - b.start)
    .map(({ departure }) => departure)
}
/** The soonest upcoming departure that still has a free seat. */
export function nextAvailableDeparture(
  data: TourData,
  tourId: string,
  now: Date,
): Departure | undefined {
  return upcomingDepartures(data, tourId, now).find(
    d => availableSeats(data, d.id, now) > 0,
  )
}
/**
 * One departure's seats as guest and merchant both count them (AC05): confirmed bookings
 * (delivered, completed and no-show included), active payment holds, and what is still free.
 */
export function departureSeats(
  data: TourData,
  departureId: string,
  now: Date,
): { confirmed: number, held: number, available: number, capacity: number } {
  const bookings = departureBookings(data, departureId)
  const seats = (list: readonly TourBooking[]) =>
    list.reduce((sum, b) => sum + participantSeats(b), 0)

  return {
    confirmed: seats(
      bookings.filter(
        b => !['pending_payment', 'expired', 'cancelled'].includes(b.status),
      ),
    ),
    held: seats(
      bookings.filter(
        b =>
          b.status === 'pending_payment'
          && Date.parse(b.holdUntil) > now.getTime(),
      ),
    ),
    available: availableSeats(data, departureId, now),
    capacity: findDeparture(data, departureId)?.capacity ?? 0,
  }
}
export type BalanceOverdue
  /** The snapshotted policy cancels the booking and releases its seats. */
  = | { stage: 'cancel', since: string }
  /** The policy's grace period is still running. */
    | { stage: 'grace', since: string, until: string }
  /** No automatic step: the merchant decides (also after the grace period or the tour start). */
    | { stage: 'merchant', since: string }
/** A confirmed booking past its balance deadline with money still owed (R07, AC27); null otherwise. */
export function balanceOverdue(
  booking: TourBooking,
  now: Date,
): BalanceOverdue | null {
  const since = booking.balanceDueAt

  if (
    booking.status !== 'confirmed'
    || bookingBalance(booking) === 0
    || Date.parse(since) > now.getTime()
  ) {
    return null
  }
  const policy = booking.overduePolicy

  if (
    policy?.action === 'cancel'
    && Date.parse(booking.startsAt) > now.getTime()
  ) {
    return { stage: 'cancel', since }
  }
  if (policy?.action === 'grace') {
    const until = new Date(
      Date.parse(since) + policy.graceHours * 3_600_000,
    ).toISOString()

    if (Date.parse(until) > now.getTime())
      return { stage: 'grace', since, until }
  }

  return { stage: 'merchant', since }
}
/**
 * Money the provider confirmed for a booking whose hold had already expired (2.7, spec §2.2):
 * it never confirms the booking and is shown as a reconciliation exception, guest and merchant.
 */
export function reconciliationPayments(booking: TourBooking) {
  return booking.status === 'expired'
    ? booking.payments.filter(p => p.status === 'succeeded')
    : []
}
export function reconciliationAmount(booking: TourBooking): number {
  return reconciliationPayments(booking).reduce((sum, p) => sum + p.amount, 0)
}
/** Whole days a motorbike tour lasts (a tour is on the road from its start day to its end day). */
export function tourDays(tour: Pick<Tour, 'kind' | 'durationMinutes'>): number {
  return tour.kind === 'tour' ? Math.floor(tour.durationMinutes / 1440) + 1 : 1
}
