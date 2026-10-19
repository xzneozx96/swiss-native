import { useCallback } from 'react'

import { useDemoActions, useDemoSelector } from '@/features/demo'

/**
 * One listing's saved state (UX proposal: favourites are not in the PRD). Kept in the demo data,
 * so it works without signing in and survives reloads in this browser. It re-renders only when
 * this listing's flag flips, not on every other save.
 */
export function useFavourite(listingId: string) {
  const { update } = useDemoActions()
  const saved = useDemoSelector(s =>
    s.data.favouriteListingIds.includes(listingId),
  )
  const toggle = useCallback(
    () =>
      update((s) => {
        const current = s.data.favouriteListingIds
        const next = current.includes(listingId)
          ? current.filter(id => id !== listingId)
          : [...current, listingId]

        return { ...s, data: { ...s.data, favouriteListingIds: next } }
      }),
    [update, listingId],
  )

  return { saved, toggle }
}
