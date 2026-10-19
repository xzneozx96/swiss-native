import { expect, it } from 'vitest'

import { demoNow } from '@/features/demo/clock'
import { createSeedState } from '@/features/demo/seed'
import { bookingNights, departureBookings, upcomingDepartures } from '@/features/tours/lib/selectors'

function seed() {
  const state = createSeedState()

  return { data: state.data.tours!, now: demoNow(state.clockStartedAt) }
}

it('departureBookings lists every booking that covers the departure, in booking order', () => {
  const { data } = seed()

  for (const departure of data.departures) {
    const expected = data.bookings.filter(b => bookingNights(b).includes(departure.id))

    expect(departureBookings(data, departure.id)).toEqual(expected)
  }
  expect(departureBookings(data, 'no-such-departure')).toEqual([])
})

it('departureBookings follows a new bookings array, not a cached one', () => {
  const { data } = seed()
  const departureId = data.departures[0].id
  const before = departureBookings(data, departureId)
  const added = { ...data.bookings[0], id: 'added', departureId, nightIds: [departureId] }
  const next = { ...data, bookings: [...data.bookings, added] }

  expect(departureBookings(next, departureId)).toHaveLength(
    next.bookings.filter(b => bookingNights(b).includes(departureId)).length,
  )
  expect(departureBookings(data, departureId)).toEqual(before)
})

it('upcomingDepartures are open, in the future, earliest first', () => {
  const { data, now } = seed()

  for (const tour of data.tours) {
    const list = upcomingDepartures(data, tour.id, now)
    const starts = list.map(d => Date.parse(d.startsAt))

    expect(list.every(d => d.tourId === tour.id && !d.closed && !d.cancelledAt)).toBe(true)
    expect(starts.every(start => start > now.getTime())).toBe(true)
    expect(starts).toEqual([...starts].sort((a, b) => a - b))
  }
})
