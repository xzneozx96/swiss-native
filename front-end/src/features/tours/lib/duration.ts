import type { Tour } from '../types'
import type { MessageKey } from '@/i18n/en'

import { tourDays } from './selectors'

/** "3 days" for a motorbike tour, "2 hours" for the bee house visit; `t` is the locale's translate. */
export function durationText(
  t: (key: MessageKey, vars?: Record<string, string | number>) => string,
  tour: Pick<Tour, 'kind' | 'durationMinutes'>,
): string {
  const days = tourDays(tour)

  return tour.kind === 'tour'
    ? t(days === 1 ? 'tourDiscovery.daysOne' : 'tourDiscovery.daysOther', {
        n: days,
      })
    : t('tourDiscovery.duration', { hours: tour.durationMinutes / 60 })
}
