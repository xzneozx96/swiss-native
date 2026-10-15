import type { TripTarget } from "../lib/trip";
import type { TripAnswers, TripRecord } from "../types";

import { tripView, withTrip } from "../lib/trip";

import { useDemo } from "@/features/demo";
import { demoNow } from "@/features/demo/clock";

/**
 * The trip questions of one booking (R09, 2.17). Saving or skipping writes to that booking
 * only, never to the guest's other bookings.
 */
export function useTripProfile(target: TripTarget) {
  const { state, update } = useDemo();
  const guestId = state.data.signedInGuestId;
  const { status, answers } = tripView(state.data, guestId, target);

  const write = (next: (at: string) => TripRecord) =>
    update((s) =>
      guestId
        ? {
            ...s,
            data: withTrip(
              s.data,
              guestId,
              target,
              next(demoNow(s.clockStartedAt).toISOString()),
            ),
          }
        : s,
    );

  return {
    status,
    /** Its own answers once answered; before that, a covering trip's answers or blank. */
    answers,
    save: (next: TripAnswers) => write((at) => ({ ...next, answeredAt: at })),
    skip: () => write((at) => ({ skippedAt: at })),
  };
}
