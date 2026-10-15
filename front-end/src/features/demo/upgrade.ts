import type { DemoData } from "./types";

import { createSeedState } from "./seed";

import { sampleTourReviews } from "@/features/tours/reviews/seed";
import { createTourSeed } from "@/features/tours/seed";
import { upgradeTourData } from "@/features/tours/lib/upgrade";
import { isChapterStory, storyFromChapters } from "@/lib/rich-text";

/**
 * Long stories stored before 15.10.2026 have illustrated chapters; they become one rich
 * body per language, with the same photos, titles and text (owner, rich long story).
 */
function currentStory<T>(story: T): T {
  return isChapterStory(story) ? (storyFromChapters(story) as T) : story;
}

/** Collections added after the first build; demo data saved before then has none of them. */
type AddedKey = "privateTourRequests" | "favouriteListingIds";

/**
 * Demo data as an earlier build of the same DEMO_VERSION may have stored it. The keepsake
 * shop is gone: its products, sub-categories, orders, cart, pickup places and favourites are
 * dropped. Before 2.17 the trip answers were kept once per guest in `tripProfiles`.
 */
export type StoredDemoData = Omit<DemoData, AddedKey> &
  Partial<Pick<DemoData, AddedKey>> & {
    tripProfiles?: unknown;
    products?: unknown;
    subcategories?: unknown;
    orders?: unknown;
    cart?: unknown;
    nextOrderNumber?: unknown;
    pickupPlaces?: unknown;
    favouriteProductIds?: unknown;
  };

/**
 * Fills what an earlier build did not store, from the seed (outline D5), so nobody's demo
 * state is wiped. Stored values win, even empty lists. Changed fixtures appear after Reset.
 */
export function upgradeDemoData({
  tripProfiles: _tripProfiles,
  products: _products,
  subcategories: _subcategories,
  orders: _orders,
  cart: _cart,
  nextOrderNumber: _nextOrderNumber,
  pickupPlaces: _pickupPlaces,
  favouriteProductIds: _favouriteProductIds,
  ...stored
}: StoredDemoData): DemoData {
  const seed = createSeedState().data;
  const tours = upgradeTourData(stored.tours ?? createTourSeed());
  const reviews = stored.reviews.filter((review) =>
    review.productId.startsWith("tour:"),
  );
  const reviewIds = new Set(reviews.map((review) => review.id));

  return {
    ...stored,
    tours: {
      ...tours,
      tours: tours.tours.map((tour) => ({
        ...tour,
        longStory: currentStory(tour.longStory),
      })),
    },
    reviews: [
      ...reviews,
      ...structuredClone(
        sampleTourReviews.filter((review) => !reviewIds.has(review.id)),
      ),
    ],
    favouriteListingIds: stored.favouriteListingIds ?? seed.favouriteListingIds,
    privateTourRequests: stored.privateTourRequests ?? seed.privateTourRequests,
  };
}
