import { createFileRoute } from '@tanstack/react-router'

import { GuestTourBookingPage } from '@/features/tours/booking/guest-tour-booking-page'

export const Route = createFileRoute('/_guest/account_/bookings/$bookingId')({
  staticData: { hideTabBar: true, ownsBottomSpace: true },
  component: Page,
})

function Page() {
  return <GuestTourBookingPage bookingId={Route.useParams().bookingId} />
}
