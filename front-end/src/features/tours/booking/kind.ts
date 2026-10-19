import type { TourBooking, TourKind } from '../types'
import type { MessageKey } from '@/i18n/en'

import { useLocale } from '@/contexts/locale-context'
import { useTours } from '@/features/tours/hooks/use-tours'
import { en } from '@/i18n/en'

/**
 * The key to show for a booking's kind: `<key>.<kind>` for a stay or an experience, then
 * `<key>.listing` (both), then the tour wording.
 */
export function kindKey(key: MessageKey, kind: TourKind): MessageKey {
  const variant = [`${key}.${kind}`, `${key}.listing`].find(
    candidate => kind !== 'tour' && candidate in en,
  )

  return (variant ?? key) as MessageKey
}

export function useBookingKind(booking: Pick<TourBooking, 'tourId'>): TourKind {
  const { tours } = useTours()

  return tours.find(item => item.id === booking.tourId)?.kind ?? 'tour'
}

/** `t` for one kind: the same key reads "stay" or "experience" where a tour says "tour". */
export function useKindT(kind: TourKind) {
  const { t } = useLocale()

  return (key: MessageKey, params?: Record<string, string | number>) =>
    t(kindKey(key, kind), params)
}
