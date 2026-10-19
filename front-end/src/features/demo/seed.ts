import type { DemoState } from './types'

import { demoGuest, otherGuests } from '@/features/account/seed'
import { privateTourRequestSeed } from '@/features/requests/seed'
import { sampleTourReviews } from '@/features/tours/reviews/seed'
import { createTourSeed } from '@/features/tours/seed'

/** Bump when the stored shape changes, so old browser data is replaced by the seed. */
export const DEMO_VERSION = 22

export function createSeedState(realNow: number = Date.now()): DemoState {
  return {
    version: DEMO_VERSION,
    role: 'guest',
    clockStartedAt: realNow,
    data: {
      // Deep copies so the module-level seed is never mutated.
      guests: [demoGuest, ...otherGuests],
      reviews: structuredClone(sampleTourReviews),
      favouriteListingIds: [],
      signedInGuestId: null,
      mail: [],
      tours: createTourSeed(),
      privateTourRequests: structuredClone(privateTourRequestSeed),
    },
  }
}
