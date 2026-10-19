import type { TourData } from '../types'

import { createTourSeed } from '../seed'

/** The bee house's two fixed visits a day (10:00, 14:00) before the 30-minute starts. */
const oldVisit = /^experience-\d{4}-\d{2}-\d{2}-(?:10|14)$/

/**
 * Tour data stored by an earlier build of the same DEMO_VERSION lacks Tour fields added since
 * (age bands, participant fields, kind) and the stay and bee house listings with their
 * departures. Fill them from the seed so old browsers keep working: every seeded stay or
 * bee house departure missing by id is added, and the old fixed bee house visits nobody booked
 * are dropped. New or changed fixtures still appear only after Reset.
 */
export function upgradeTourData(stored: TourData): TourData {
  const seed = createTourSeed()
  const tourIds = new Set(stored.tours.map(tour => tour.id))
  const booked = new Set(stored.bookings.map(b => b.departureId))
  const kept = stored.departures.filter(
    d => !oldVisit.test(d.id) || booked.has(d.id),
  )
  const departureIds = new Set(kept.map(d => d.id))
  const missingListings = seed.tours.filter(
    tour => tour.kind !== 'tour' && !tourIds.has(tour.id),
  )
  const listingIds = new Set(
    seed.tours.filter(tour => tour.kind !== 'tour').map(tour => tour.id),
  )

  return {
    ...stored,
    tours: [
      ...stored.tours.map((tour) => {
        const merged = {
          ...seed.tours.find(s => s.id === tour.id),
          ...tour,
        }

        return merged.kind ? merged : { ...merged, kind: 'tour' as const }
      }),
      ...missingListings,
    ],
    departures: [
      ...kept,
      ...seed.departures.filter(
        d => listingIds.has(d.tourId) && !departureIds.has(d.id),
      ),
    ],
  }
}
