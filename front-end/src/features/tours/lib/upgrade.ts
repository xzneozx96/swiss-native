import type { TourData } from "../types";

import { createTourSeed } from "../seed";

/**
 * Tour data stored by an earlier build of the same DEMO_VERSION lacks Tour fields added since
 * (age bands, participant fields, kind) and the stay and bee house listings with their
 * departures. Fill them from the seed so old browsers keep working.
 * New or changed fixtures still appear only after Reset.
 */
export function upgradeTourData(stored: TourData): TourData {
  const seed = createTourSeed();
  const tourIds = new Set(stored.tours.map((tour) => tour.id));
  const departureIds = new Set(stored.departures.map((d) => d.id));
  const missingListings = seed.tours.filter(
    (tour) => tour.kind !== "tour" && !tourIds.has(tour.id),
  );
  const listingIds = new Set(missingListings.map((tour) => tour.id));

  return {
    ...stored,
    tours: [
      ...stored.tours.map((tour) => {
        const merged = {
          ...seed.tours.find((s) => s.id === tour.id),
          ...tour,
        };

        return merged.kind ? merged : { ...merged, kind: "tour" as const };
      }),
      ...missingListings,
    ],
    departures: [
      ...stored.departures,
      ...seed.departures.filter(
        (d) => listingIds.has(d.tourId) && !departureIds.has(d.id),
      ),
    ],
  };
}
