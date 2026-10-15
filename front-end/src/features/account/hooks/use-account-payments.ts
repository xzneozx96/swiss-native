import type { StatusTone } from "@/components/status-chip";
import type { Payment } from "@/features/payment/types";
import type { TourBooking } from "@/features/tours/types";
import type { MessageKey } from "@/i18n/en";

import { useLocale } from "@/contexts/locale-context";
import { useDemoNow } from "@/features/demo";
import { isClosedBooking } from "@/features/tours/booking/booking-summary";
import { useTours } from "@/features/tours/hooks/use-tours";
import { bookingAmountDue } from "@/features/tours/lib/selectors";
import { formatOrderDateTime } from "@/lib/dates";
import { formatMoney } from "@/lib/format";
import { pickText } from "@/lib/localized";

const methodKey: Record<Payment["method"], MessageKey> = {
  online: "guestOrder.method.online",
  cash: "guestOrder.method.cash",
  "bank-transfer": "guestOrder.method.bankTransfer",
  other: "guestOrder.method.other",
};

export interface AccountPaymentRow {
  id: string;
  bookingId: string;
  method: Payment["method"];
  amount: string;
  ref: string;
  tour: string;
  /** "Cash · 09.10.2026, 16:20" (payments keep the full numeric date). */
  meta: string;
  status: { text: string; tone: StatusTone };
}

export interface AccountPaymentMonth {
  /** "October 2026" / "Oktober 2026". */
  label: string;
  rows: AccountPaymentRow[];
}

/**
 * Payment info on the account hub: open bookings with money due now, and every payment the
 * guest made or the host recorded, newest first and grouped by month. The PRD stores no
 * cards, so there is no saved-method data to read.
 */
export function useAccountPayments() {
  const { t, language, intlLocale } = useLocale();
  const { bookings, guestId } = useTours();
  const now = useDemoNow();
  const owned = bookings.filter((booking) => booking.guestId === guestId);

  const status = (
    booking: TourBooking,
    p: Payment,
  ): AccountPaymentRow["status"] =>
    booking.lateResults?.some((late) => late.paymentId === p.id)
      ? { text: t("guestOrder.paymentStatus.late"), tone: "warning" }
      : p.status === "succeeded"
        ? { text: t("guestOrder.paymentStatus.succeeded"), tone: "success" }
        : p.status === "processing"
          ? { text: t("guestOrder.paymentStatus.processing"), tone: "info" }
          : { text: t("guestOrder.paymentStatus.failed"), tone: "danger" };

  const monthLabel = new Intl.DateTimeFormat(intlLocale, {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Zurich",
  });

  const months: AccountPaymentMonth[] = [];

  owned
    .flatMap((booking) => booking.payments.map((p) => ({ booking, p })))
    .sort((a, b) => b.p.at.localeCompare(a.p.at))
    .forEach(({ booking, p }) => {
      const label = monthLabel.format(new Date(p.at));
      const row: AccountPaymentRow = {
        id: p.id,
        bookingId: booking.id,
        method: p.method,
        amount: formatMoney(p.amount / 100, intlLocale),
        ref: booking.ref,
        tour: pickText(booking.tourName, language).text,
        meta: `${t(methodKey[p.method])} · ${formatOrderDateTime(p.at, intlLocale)}`,
        status: status(booking, p),
      };
      const last = months[months.length - 1];

      if (last?.label === label) last.rows.push(row);
      else months.push({ label, rows: [row] });
    });

  return {
    due: owned.filter(
      (booking) =>
        !isClosedBooking(booking) &&
        bookingAmountDue(booking) > 0 &&
        !(
          booking.status === "pending_payment" &&
          Date.parse(booking.holdUntil) <= now.getTime()
        ),
    ),
    months,
  };
}
