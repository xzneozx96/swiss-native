import type { TripAnswers, TripRecord } from "../types";
import type { DemoData } from "@/features/demo/types";

import { zurichDate } from "@/features/catalog/lib/pickup";

export type TripStatus = "open" | "answered" | "skipped";

/** The booking the trip answers belong to (2.17). */
export interface TripTarget {
  bookingId: string;
}

export const hasTripAnswers = (trip?: TripAnswers) =>
  !!trip && !!(trip.travelStyle || trip.arriveOn || trip.leaveOn);

export const tripStatus = (trip?: TripRecord): TripStatus =>
  hasTripAnswers(trip) ? "answered" : trip?.skippedAt ? "skipped" : "open";

const answersOf = (trip?: TripRecord): TripAnswers => ({
  travelStyle: trip?.travelStyle,
  arriveOn: trip?.arriveOn,
  leaveOn: trip?.leaveOn,
});

/** One of the guest's bookings, with the day the tour runs. */
interface Purchase {
  key: string;
  trip?: TripRecord;
  day: string;
}

function guestPurchases(data: DemoData, guestId: string): Purchase[] {
  return (data.tours?.bookings ?? [])
    .filter((b) => b.guestId === guestId)
    .map((b) => ({
      key: b.id,
      trip: b.trip,
      day: zurichDate(new Date(b.startsAt)),
    }));
}

/**
 * The trip state of a purchase for the signed-in guest. Answered shows its own answers. Otherwise
 * the form starts with the newest answers of another of the guest's bookings whose arrival and
 * departure both cover every day of this one (inclusive), or blank.
 */
export function tripView(
  data: DemoData,
  guestId: string | null,
  target: TripTarget,
): { status: TripStatus; answers: TripAnswers } {
  const keys = new Set([target.bookingId]);
  const all = guestId ? guestPurchases(data, guestId) : [];
  const own = all.filter((p) => keys.has(p.key));
  const trip = own.find((p) => hasTripAnswers(p.trip))?.trip ?? own[0]?.trip;
  const status = tripStatus(trip);

  if (status === "answered") return { status, answers: answersOf(trip) };

  const covers = ({ arriveOn, leaveOn }: TripRecord = {}) =>
    !!arriveOn &&
    !!leaveOn &&
    own.every((p) => arriveOn <= p.day && p.day <= leaveOn);
  const covering = own.length
    ? all
        .filter((p) => !keys.has(p.key) && covers(p.trip))
        .sort((a, b) =>
          (b.trip?.answeredAt ?? "").localeCompare(a.trip?.answeredAt ?? ""),
        )[0]
    : undefined;

  return { status, answers: covering ? answersOf(covering.trip) : {} };
}

/** Stores the trip record on the booking of the target (the guest's own only). */
export function withTrip(
  data: DemoData,
  guestId: string,
  target: TripTarget,
  trip: TripRecord,
): DemoData {
  if (!data.tours) return data;

  return {
    ...data,
    tours: {
      ...data.tours,
      bookings: data.tours.bookings.map((b) =>
        b.id === target.bookingId && b.guestId === guestId ? { ...b, trip } : b,
      ),
    },
  };
}
