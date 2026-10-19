import { createFileRoute } from '@tanstack/react-router'

import { TourDeparturesPage } from '@/features/tours/merchant/departures-page'

export const Route = createFileRoute('/store/bookings/')({
  component: Page,
})

function Page() {
  return <TourDeparturesPage />
}
