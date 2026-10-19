import { createFileRoute, Navigate } from '@tanstack/react-router'

import { TourDetailPage } from '@/features/tours/discovery'
import { useTours } from '@/features/tours/hooks/use-tours'
import { isTour } from '@/features/tours/lib/selectors'

export const Route = createFileRoute('/_guest/tours/$slug')({
  staticData: { hideTabBar: true, ownsBottomSpace: true },
  // `?book=true` opens C10, the departure and group sheet, over C09 (2.4-r5).
  validateSearch: (search: Record<string, unknown>): { book?: true } => ({
    book: search.book === true ? true : undefined,
  }),
  component: Page,
})

function Page() {
  const slug = Route.useParams().slug
  const isBooking = Route.useSearch().book === true
  const { tours } = useTours()
  const listing = tours.find(tour => tour.slug === slug)

  // The stay and the bee house have no detail page: they book from the home sheet.
  if (listing && !isTour(listing))
    return <Navigate replace to="/" />

  return <TourDetailPage isBooking={isBooking} slug={slug} />
}
