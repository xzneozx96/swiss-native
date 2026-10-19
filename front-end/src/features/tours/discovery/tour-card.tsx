import type { Tour } from '../types'

import { memo } from 'react'

import { ListingCard } from '@/components/listing-card'
import { StatusChip } from '@/components/status-chip'
import { useLocale } from '@/contexts/locale-context'
import { useProductReviews } from '@/features/catalog/hooks/use-product-reviews'
import { zurichDate } from '@/features/catalog/lib/pickup'
import { useFavourite } from '@/features/tours/hooks/use-favourites'
import { useTours } from '@/features/tours/hooks/use-tours'
import { durationText } from '@/features/tours/lib/duration'
import {
  nextAvailableDeparture,
  upcomingDepartures,
} from '@/features/tours/lib/selectors'
import { formatMoney, formatShortDate } from '@/lib/format'
import { pickText } from '@/lib/localized'

/** A tour on the shared gift and tour card: C08 list (grid) and the home Tours rail (carousel). */
export const TourCard = memo(function TourCard({
  tour,
  layout,
}: {
  tour: Tour
  layout?: 'carousel' | 'grid'
}) {
  const { t, language, intlLocale } = useLocale()
  const { data, now } = useTours()
  const name = pickText(tour.name, language)
  const listingId = `tour:${tour.id}`
  const { saved, toggle } = useFavourite(listingId)
  const reviews = useProductReviews(listingId)
  const next = nextAvailableDeparture(data, tour.id, now)
  const soldOut = !next && upcomingDepartures(data, tour.id, now).length > 0

  return (
    <ListingCard
      disabled={!tour.published}
      favourite={{
        isSaved: saved,
        onToggle: toggle,
        label: t(saved ? 'card.unsave' : 'card.save', { name: name.text }),
      }}
      fromLabel={t('home.from')}
      languageNote={
        name.isFallback
          ? t(
              name.language === 'en'
                ? 'listing.textInEnglish'
                : 'listing.textInGerman',
            )
          : undefined
      }
      layout={layout}
      metadata={durationText(t, tour)}
      name={name.text}
      photo={tour.photos[0]}
      price={formatMoney(tour.adultPrice / 100, intlLocale)}
      rating={
        reviews.count > 0
          ? {
              value: reviews.averageText,
              count: String(reviews.count),
              label: `${reviews.averageLabel}, ${reviews.countLabel}`,
            }
          : undefined
      }
      slug={tour.slug}
      supplementaryMetadata={
        !tour.published
          ? (
              <div className="pt-1">
                <StatusChip tone="neutral">
                  {t('tourDiscovery.comingSoon')}
                </StatusChip>
              </div>
            )
          : next
            ? (
                <p className="text-label text-muted">
                  {t('tourDiscovery.next', {
                    date: formatShortDate(
                      zurichDate(new Date(next.startsAt)),
                      zurichDate(now),
                      intlLocale,
                    ),
                  })}
                </p>
              )
            : (
                <div className="pt-1">
                  <StatusChip tone="neutral">
                    {t(soldOut ? 'tourDiscovery.soldOut' : 'tourDiscovery.noDates')}
                  </StatusChip>
                </div>
              )
      }
    />
  )
})
