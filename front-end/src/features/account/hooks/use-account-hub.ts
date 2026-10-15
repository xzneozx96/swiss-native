import { useAccountPayments } from "./use-account-payments";

import { useLocale } from "@/contexts/locale-context";
import { zurichDate } from "@/features/catalog/lib/pickup";
import { useDemo, useDemoNow } from "@/features/demo";
import { renderMail } from "@/features/notifications/components/render-mail";
import { bookingAmountDue } from "@/features/tours/lib/selectors";
import { formatMoney, formatShortDate } from "@/lib/format";

const liveBooking = ["pending_payment", "confirmed"];

/**
 * One line under each hub row (1.12s), so the hub answers "anything for me?" before a tap:
 * the next tour, money due now, the latest email.
 */
export function useAccountHub(guestId: string) {
  const { t, intlLocale } = useLocale();
  const { state } = useDemo();
  const now = useDemoNow();
  const today = zurichDate(now);
  const { due } = useAccountPayments();

  const bookings = (state.data.tours?.bookings ?? []).filter(
    (b) => b.guestId === guestId,
  );
  const nextTour = bookings
    .filter(
      (b) => liveBooking.includes(b.status) && Date.parse(b.startsAt) > +now,
    )
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];

  const dueTotal = due.reduce((sum, b) => sum + bookingAmountDue(b), 0);
  const lastMail = state.data.mail
    .filter((m) => m.to === "guest" && m.guestId === guestId)
    .pop();

  return {
    bookingCount: bookings.length,
    bookings: nextTour
      ? t("account.hub.bookings.next", {
          date: formatShortDate(
            zurichDate(new Date(nextTour.startsAt)),
            today,
            intlLocale,
          ),
        })
      : bookings.length > 0
        ? t("account.hub.bookings.noneUpcoming")
        : t("account.hub.bookings.none"),
    dueCount: due.length,
    payments:
      due.length > 0
        ? t("account.hub.payments.due", {
            amount: formatMoney(dueTotal / 100, intlLocale),
          })
        : t("account.hub.payments.settled"),
    /** The latest email's subject, in that email's own language. */
    mail: lastMail
      ? {
          text: renderMail(lastMail).subject,
          lang: lastMail.language,
        }
      : { text: t("account.hub.mail.none") },
  };
}
