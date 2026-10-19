import { createFileRoute } from '@tanstack/react-router'

import { useLocale } from '@/contexts/locale-context'
import { SignInPrompt } from '@/features/auth/components/account-profile'
import { useRequireSignIn } from '@/features/auth/hooks/use-require-sign-in'
import { useDemoSelector } from '@/features/demo'
import { TourBookingList } from '@/features/tours/booking'

export const Route = createFileRoute('/_guest/bookings')({
  component: BookingsPage,
})

function BookingsPage() {
  const { t } = useLocale()
  const guests = useDemoSelector(s => s.data.guests)
  const signedInGuestId = useDemoSelector(s => s.data.signedInGuestId)
  const { requireSignIn } = useRequireSignIn()
  const signedIn = guests.some(g => g.id === signedInGuestId)

  return (
    <div className="flex flex-col gap-8 px-4 pt-[calc(env(safe-area-inset-top,0px)+24px)]">
      <h1 className="font-serif text-display">{t('nav.bookings')}</h1>
      {signedIn
        ? (
            <TourBookingList />
          )
        : (
            <SignInPrompt onSignIn={() => requireSignIn(undefined, '/bookings')} />
          )}
    </div>
  )
}
