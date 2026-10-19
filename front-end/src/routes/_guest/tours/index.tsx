import { createFileRoute } from '@tanstack/react-router'

import { TourListPage } from '@/features/tours/discovery/tour-list-page'

export const Route = createFileRoute('/_guest/tours/')({
  component: Page,
})

function Page() {
  return <TourListPage />
}
