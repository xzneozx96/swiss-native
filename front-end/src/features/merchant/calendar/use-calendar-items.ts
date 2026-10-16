import type { CalendarItem, ShownLabel } from "./calendar-core";

import { useMemo } from "react";

import { swissDate, zurichLocal } from "./calendar-core";

import { useLocale } from "@/contexts/locale-context";
import { departureSeats } from "@/features/tours/lib/selectors";
import { useTours } from "@/features/tours/hooks/use-tours";
import {
  departureBookings,
  departureEnd,
  departurePhase,
  tourWork,
} from "@/features/tours/merchant/lib/work";
import { phaseChip } from "@/features/tours/merchant/shared";
import { formatMoney } from "@/lib/format";
import { pickText } from "@/lib/localized";

/**
 * What the calendar shows, from the same state the departure screens read: one event per tour
 * departure, experience start and stay night (cancelled ones left out). Today comes from the
 * demo clock, to the minute.
 */
/** Experiences start every 30 minutes, so each start fills one slot of the grid. */
const SLOT_MINUTES = 30;

export function useCalendarItems() {
  const { t, language, intlLocale } = useLocale();
  const { data, now } = useTours();
  const minute = Math.floor(now.getTime() / 60_000);

  const items = useMemo(() => {
    const clock = new Date(minute * 60_000);
    return data.departures.flatMap((departure) => {
      const tour = data.tours.find((entry) => entry.id === departure.tourId);

      if (!tour || departure.cancelledAt) return [];
      const seats = departureSeats(data, departure.id, clock);
      const bookings = departureBookings(data, departure.id);
      const active = bookings
        .filter(
          (b) =>
            !["pending_payment", "expired", "cancelled"].includes(b.status),
        )
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      const start = new Date(departure.startsAt);
      const stop = new Date(departureEnd(departure, tour));
      const phase = phaseChip[departurePhase(departure, tour, clock)];
      const owed = tourWork(bookings, clock).toCollect;
      const payment: ShownLabel =
        owed > 0
          ? {
              text: `${t("tourMerchant.toCollect")}: ${formatMoney(owed / 100, intlLocale)}`,
              tone: "warning",
            }
          : active.length
            ? { text: t("tours.payment.paid"), tone: "success" }
            : { text: t("tours.payment.none"), tone: "neutral" };
      const startLocal = zurichLocal(start);
      const stopLocal = zurichLocal(stop);
      const kind = tour.kind;

      return {
        listing: kind,
        id: `tour:${departure.id}`,
        departureId: departure.id,
        title: pickText(tour.name, language).text,
        date: swissDate(start),
        time: startLocal.slice(11, 16),
        end: stopLocal.slice(11, 16),
        start: kind === "stay" ? swissDate(start) : startLocal,
        stop:
          kind === "experience"
            ? zurichLocal(new Date(start.getTime() + SLOT_MINUTES * 60_000))
            : kind === "stay"
              ? ""
              : stopLocal,
        allDay: kind === "stay",
        booked: seats.confirmed,
        held: seats.held,
        capacity: seats.capacity,
        lead: active[0]?.contactName ?? "",
        more: Math.max(0, active.length - 1),
        meetingPoint: pickText(tour.meetingPoint, language).text,
        phase: { text: t(phase.key), tone: phase.tone },
        payment,
      } satisfies CalendarItem;
    });
  }, [data, minute, language, intlLocale, t]);

  const clock = new Date(minute * 60_000);

  return {
    items,
    today: swissDate(clock),
    /** The calendar's "now", as Zurich wall-clock time. */
    now: zurichLocal(clock),
  };
}
