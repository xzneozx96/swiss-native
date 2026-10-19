import type { LanguageStatus } from '../lib/completeness'
import type { Tour } from '@/features/tours/types'

import { useLocale } from '@/contexts/locale-context'

import { useDemoActions, useDemoNow, useDemoSelector } from '@/features/demo'
import { demoNow } from '@/features/demo/clock'
import { tourDays } from '@/features/tours/lib/selectors'
import { createTourSeed } from '@/features/tours/seed'
import { formatMoney, numberFormat } from '@/lib/format'
import { pickText } from '@/lib/localized'
import { languageStatus, missingText, tourText } from '../lib/completeness'

export interface ProductRow {
  id: string
  kind: Tour['kind']
  /** Opens M13. */
  href: string
  name: string
  photo?: string
  /** "2 h". */
  meta: string
  published: boolean
  /** Archived from the row menu: listed under "Archived" only, hidden from guests. */
  archived: boolean
  languages: LanguageStatus
  /** Footer and table facts, in column order: price, upcoming departures. */
  facts: { label: string, value: string, isWarning?: boolean }[]
}

/** Per tour, the departures that have not started and are not cancelled, as M05 counts them. */
function upcomingCounts(
  departures: { tourId: string, startsAt: string, cancelledAt?: string }[],
  now: Date,
) {
  const counts = new Map<string, number>()

  for (const d of departures) {
    if (!d.cancelledAt && Date.parse(d.startsAt) > now.getTime())
      counts.set(d.tourId, (counts.get(d.tourId) ?? 0) + 1)
  }

  return counts
}

/** M11 rows, in the seed's order (the host's own order): tours, the stay and the experience. */
export function useMerchantProducts() {
  const { t, language, intlLocale } = useLocale()
  const tours = useDemoSelector(s => s.data.tours)
  const now = useDemoNow()
  const tourData = tours ?? createTourSeed()
  const upcoming = upcomingCounts(tourData.departures, now)
  const money = (rappen: number) => formatMoney(rappen / 100, intlLocale)
  const pick = (text: Partial<Record<'en' | 'de', string>>) =>
    pickText(text, language).text

  const tourRow = (tour: Tour): ProductRow => ({
    id: tour.id,
    kind: tour.kind,
    href: `#/store/products/tours/${tour.id}`,
    name: pick(tour.name),
    photo: tour.photos[0],
    meta:
      tour.kind === 'tour'
        ? t('products.durationDays', { hours: tourDays(tour) })
        : t('products.duration', {
            hours: numberFormat(intlLocale, {
              maximumFractionDigits: 1,
            }).format(tour.durationMinutes / 60),
          }),
    published: tour.published,
    archived: !!tour.archivedAt,
    languages: languageStatus(missingText(tourText(tour))),
    facts: [
      { label: t('products.fact.adults'), value: money(tour.adultPrice) },
      {
        label: t('products.fact.upcoming'),
        value: String(upcoming.get(tour.id) ?? 0),
      },
    ],
  })

  const rows = tourData.tours.map(tourRow)

  return {
    tours: rows.filter(r => r.kind === 'tour'),
    stays: rows.filter(r => r.kind === 'stay'),
    experiences: rows.filter(r => r.kind === 'experience'),
  }
}

/**
 * Archive and restore from the M11 row menu (owner, 15.10.2026). Archiving unpublishes the
 * tour, hides it from guests and moves it under "Archived"; bookings that point at it are
 * kept. Restoring brings it back as a draft to publish again.
 */
export function useProductArchive() {
  const { update } = useDemoActions()

  const set = (id: string, archive: boolean) =>
    update((s) => {
      const at = archive ? demoNow(s.clockStartedAt).toISOString() : undefined
      const tours = s.data.tours ?? createTourSeed()

      return {
        ...s,
        data: {
          ...s.data,
          tours: {
            ...tours,
            tours: tours.tours.map(t =>
              t.id === id ? { ...t, archivedAt: at, published: false } : t,
            ),
          },
        },
      }
    })

  return {
    archive: (id: string) => set(id, true),
    restore: (id: string) => set(id, false),
  }
}
