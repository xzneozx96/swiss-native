import { createFileRoute } from "@tanstack/react-router";

import { useLocale } from "@/contexts/locale-context";
import { SignInPrompt } from "@/features/auth/components/account-profile";
import { useRequireSignIn } from "@/features/auth/hooks/use-require-sign-in";
import { useDemo } from "@/features/demo";
import { TourBookingList } from "@/features/tours/booking";

export const Route = createFileRoute("/_guest/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  const { t } = useLocale();
  const { state } = useDemo();
  const { requireSignIn } = useRequireSignIn();
  const signedIn = state.data.guests.some(
    (g) => g.id === state.data.signedInGuestId,
  );

  return (
    <div className="flex flex-col gap-8 px-4 pt-[calc(env(safe-area-inset-top,0px)+24px)]">
      <h1 className="font-serif text-display">{t("nav.bookings")}</h1>
      {signedIn ? (
        <TourBookingList />
      ) : (
        <SignInPrompt onSignIn={() => requireSignIn(undefined, "/bookings")} />
      )}
    </div>
  );
}
