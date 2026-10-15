import { useCallback } from "react";

import { useDemo } from "@/features/demo";

/**
 * Saved listings (UX proposal: favourites are not in the PRD). Kept in the demo data,
 * so they work without signing in and survive reloads in this browser.
 */
export function useFavourites() {
  const { state, update } = useDemo();
  const ids = state.data.favouriteListingIds;

  const toggle = useCallback(
    (listingId: string) =>
      update((s) => {
        const current = s.data.favouriteListingIds;
        const next = current.includes(listingId)
          ? current.filter((id) => id !== listingId)
          : [...current, listingId];

        return { ...s, data: { ...s.data, favouriteListingIds: next } };
      }),
    [update],
  );

  return {
    isFavourite: (listingId: string) => ids.includes(listingId),
    toggle,
  };
}
