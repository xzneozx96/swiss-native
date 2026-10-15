import type { Language } from "@/contexts/locale-context";
import type { MessageKey } from "@/i18n/en";
import type { IntlLocale } from "@/lib/format";
import type {
  Departure,
  Tour,
  TourDraft,
  TourParticipants,
} from "@/features/tours/types";
import type { CalendarDate } from "@internationalized/date";

import { parseDate } from "@internationalized/date";
import { useMemo, useState } from "react";

import { useLocale } from "@/contexts/locale-context";
import { zurichDate } from "@/features/catalog/lib/pickup";
import { useTours } from "@/features/tours/hooks/use-tours";
import {
  availableSeats,
  bookingNights,
  firstPaymentAmount,
  participantSeats,
  tourTotal,
  upcomingDepartures,
} from "@/features/tours/lib/selectors";
import { formatMoney, formatShortDate } from "@/lib/format";
import { pickText } from "@/lib/localized";

/** At or below this many free places a day or slot reads as "few left". */
export const LOW_SEATS = 2;
export const MAX_NIGHTS = 14;

const zurichTime = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Europe/Zurich",
});

/** One departure as the picker shows it: a stay night or a bee house visit. */
export interface Slot {
  id: string;
  startsAt: string;
  /** Zurich calendar day, YYYY-MM-DD. */
  day: string;
  /** Zurich wall-clock start and end, HH:mm. */
  time: string;
  end: string;
  seats: number;
  capacity: number;
  policy: Departure["policy"];
}

export type DayState = "open" | "low" | "soldout";

export interface DaySlots {
  day: string;
  date: CalendarDate;
  slots: Slot[];
  /** Most places free in any one slot of the day. */
  seats: number;
  state: DayState;
}

/** The listing's upcoming departures by Zurich day, with free places, on the demo clock. */
export function useSlotModel(tour: Tour) {
  const { data, now } = useTours();
  const todayIso = zurichDate(now);
  // Stable identities: React Aria memoizes against min/max value objects.
  const today = useMemo(() => parseDate(todayIso), [todayIso]);
  const minute = Math.floor(now.getTime() / 60_000);

  const model = useMemo(() => {
    const at = new Date(minute * 60_000);
    const slots: Slot[] = upcomingDepartures(data, tour.id, at).map((d) => {
      const start = new Date(d.startsAt);

      return {
        id: d.id,
        startsAt: d.startsAt,
        day: zurichDate(start),
        time: zurichTime.format(start),
        end: zurichTime.format(
          new Date(start.getTime() + tour.durationMinutes * 60_000),
        ),
        seats: availableSeats(data, d.id, at),
        capacity: d.capacity,
        policy: d.policy,
      };
    });
    const byDay = new Map<string, DaySlots>();

    for (const slot of slots) {
      const entry = byDay.get(slot.day) ?? {
        day: slot.day,
        date: parseDate(slot.day),
        slots: [],
        seats: 0,
        state: "soldout" as DayState,
      };

      entry.slots.push(slot);
      entry.seats = Math.max(entry.seats, slot.seats);
      entry.state =
        entry.seats === 0
          ? "soldout"
          : entry.seats <= LOW_SEATS
            ? "low"
            : "open";
      byDay.set(slot.day, entry);
    }
    const days = [...byDay.values()];
    const bookable = days.filter((d) => d.state !== "soldout");
    const months: CalendarDate[] = [];

    for (const d of bookable) {
      const first = d.date.set({ day: 1 });

      if (!months.some((m) => m.compare(first) === 0)) months.push(first);
    }
    const last = days.length ? days[days.length - 1].date : undefined;

    return {
      slots,
      byDay,
      days,
      bookable,
      months,
      // The stay's last night can still be checked out of the next morning.
      lastDay: last && tour.kind === "stay" ? last.add({ days: 1 }) : last,
    };
  }, [data, tour.id, minute, tour.durationMinutes, tour.kind]);

  return { tour, today, ...model };
}

export type SlotModel = ReturnType<typeof useSlotModel>;

const defaultGroup: TourParticipants = { adults: 2, children: 0, infants: 0 };

/** The draft's group when it belongs to this listing, else two adults. */
function startGroup(tour: Tour, draft: TourDraft): TourParticipants {
  return draft.tourId === tour.id
    ? {
        adults: Math.max(1, draft.adults),
        children: draft.children,
        infants: draft.infants,
      }
    : defaultGroup;
}

// ---------------------------------------------------------------------------------------------
// Stay: a range of nights, one departure per night
// ---------------------------------------------------------------------------------------------

/** Places free on one night, or 0 when there is no check-in that night. */
function nightSeats(model: SlotModel, date: CalendarDate) {
  return model.byDay.get(date.toString())?.seats ?? 0;
}

export function nightFits(model: SlotModel, date: CalendarDate, used: number) {
  return (
    date.compare(model.today) >= 0 &&
    nightSeats(model, date) >= Math.max(1, used)
  );
}

/** The latest valid check-out: the first night the group does not fit, or 14 nights on. */
export function latestCheckOut(
  model: SlotModel,
  checkIn: CalendarDate,
  used: number,
) {
  for (let n = 1; n < MAX_NIGHTS; n++) {
    const night = checkIn.add({ days: n });

    if (!nightFits(model, night, used)) return night;
  }

  return checkIn.add({ days: MAX_NIGHTS });
}

export interface StayRange {
  checkIn: CalendarDate;
  checkOut: CalendarDate;
  /** Check-in set, the next tap may choose check-out. */
  awaiting: boolean;
}

/** The draft's nights when they are still all bookable, as a finished range. */
function draftRange(
  model: SlotModel,
  draft: TourDraft,
  used: number,
): StayRange | null {
  if (draft.tourId !== model.tour.id) return null;
  const dates = bookingNights(draft).map((id) =>
    model.slots.find((s) => s.id === id),
  );

  if (!dates.length || dates.some((s) => !s)) return null;
  const checkIn = parseDate(dates[0]!.day);
  const fits = dates.every(
    (s, i) =>
      s!.day === checkIn.add({ days: i }).toString() &&
      nightFits(model, parseDate(s!.day), used),
  );

  return fits
    ? {
        checkIn,
        checkOut: checkIn.add({ days: dates.length }),
        awaiting: false,
      }
    : null;
}

export function useStayBooking(model: SlotModel, f: PickerFormat) {
  const { draft } = useTours();
  const [group, setGroup] = useState(() => startGroup(model.tour, draft));
  const used = participantSeats(group);
  const [range, setRange] = useState<StayRange | null>(() => {
    const n = participantSeats(startGroup(model.tour, draft));
    const restored = draftRange(model, draft, n);

    if (restored) return restored;
    const first = model.days.find((d) => nightFits(model, d.date, n));

    return first
      ? {
          checkIn: first.date,
          checkOut: first.date.add({ days: 1 }),
          // A finished one-night stay: the next tap starts a new check-in anywhere.
          awaiting: false,
        }
      : null;
  });
  const [announcement, setAnnouncement] = useState("");
  const maxOut = range ? latestCheckOut(model, range.checkIn, used) : undefined;

  const nights = range
    ? Array.from({ length: range.checkOut.compare(range.checkIn) }, (_, i) =>
        range.checkIn.add({ days: i }),
      )
    : [];
  const nightSlots = nights.map((d) => model.byDay.get(d.toString())?.slots[0]);
  const fewest = nights.length
    ? Math.min(...nights.map((d) => nightSeats(model, d)))
    : 0;
  const firstNight = nightSlots[0];
  const total = tourTotal(model.tour, group, nights.length);
  const dueToday = firstNight
    ? firstPaymentAmount(firstNight.policy, total)
    : 0;
  const overCapacity = Boolean(range) && used > fewest;

  const startAt = (date: CalendarDate) => {
    setRange({
      checkIn: date,
      checkOut: date.add({ days: 1 }),
      awaiting: true,
    });
    setAnnouncement(f.t("announceCheckIn", { date: f.day(date) }));
  };

  /**
   * Two-tap range: check-in, then check-out. Check-out may be the first night the group does
   * not fit, or any day up to it (14 nights at most); the range never crosses such a night.
   * While choosing check-out, a later night that fits still starts a new check-in, so the
   * guest is never stuck before the first blocked night.
   */
  const tap = (date: CalendarDate): "check-in" | "check-out" | null => {
    if (range?.awaiting && maxOut) {
      if (date.compare(range.checkIn) === 0) {
        startAt(date);

        return "check-in";
      }
      if (date.compare(range.checkIn) > 0 && date.compare(maxOut) <= 0) {
        const next = { ...range, checkOut: date, awaiting: false };

        setRange(next);
        setAnnouncement(
          f.t("announceRange", {
            from: f.day(next.checkIn),
            to: f.day(date),
            nights: f.nights(date.compare(next.checkIn)),
          }),
        );

        return "check-out";
      }
    }
    if (!nightFits(model, date, used)) return null;
    startAt(date);

    return "check-in";
  };

  /** Which dates a tap would accept now. */
  const isTappable = (date: CalendarDate) => {
    if (range?.awaiting && maxOut) {
      const c = date.compare(range.checkIn);

      if (c === 0) return true;
      if (c > 0 && date.compare(maxOut) <= 0) return true;
    }

    return nightFits(model, date, used);
  };

  return {
    kind: "stay" as const,
    group,
    setGroup,
    used,
    range,
    maxOut,
    nights,
    /** The departures of the chosen nights, in order; empty without a bookable range. */
    nightIds:
      range && nightSlots.every(Boolean) ? nightSlots.map((s) => s!.id) : [],
    fewest,
    tap,
    isTappable,
    announcement,
    seatsCap: range ? fewest : 99,
    overCapacity,
    valid:
      Boolean(range) &&
      nightSlots.every(Boolean) &&
      !overCapacity &&
      group.adults >= 1,
    total,
    dueToday,
    summary: range
      ? `${f.day(range.checkIn)} → ${f.day(range.checkOut)} · ${f.nights(
          nights.length,
        )} · ${f.t("fewest", { n: fewest })}`
      : f.t("noDate"),
    /** One line for the footer. */
    short: range
      ? `${f.day(range.checkIn)} → ${f.day(range.checkOut)} · ${f.nights(nights.length)}`
      : f.t("noDate"),
  };
}

export type StayBooking = ReturnType<typeof useStayBooking>;

// ---------------------------------------------------------------------------------------------
// One departure: a day, then a start time (bee house visits, tours)
// ---------------------------------------------------------------------------------------------

export function firstFitting(day: DaySlots | undefined, used: number) {
  return day?.slots.find((s) => s.seats >= Math.max(1, used));
}

/** Where a single-departure choice keeps its group and departure: local state or the draft. */
export interface SlotStore {
  group: TourParticipants;
  setGroup: (group: TourParticipants) => void;
  slotId: string;
  setSlotId: (id: string) => void;
}

/** A choice held by the picker itself, starting from the draft when it is this listing's. */
export function useLocalSlotStore(model: SlotModel): SlotStore {
  const { draft } = useTours();
  const [group, setGroup] = useState(() => startGroup(model.tour, draft));
  const [slotId, setSlotId] = useState(() => {
    const n = participantSeats(startGroup(model.tour, draft));
    const kept =
      draft.tourId === model.tour.id
        ? model.slots.find((s) => s.id === draft.departureId && s.seats >= n)
        : undefined;

    return (
      kept?.id ??
      firstFitting(
        model.days.find((d) => firstFitting(d, n)),
        n,
      )?.id ??
      ""
    );
  });

  return { group, setGroup, slotId, setSlotId };
}

/**
 * One departure: a day on the grid, then one of its start times. A day with a single
 * departure takes it whenever it has a place, so the guest sees what is chosen (and the
 * capacity alert when the group is too big); a day with several takes the first that fits.
 */
export function useSlotChoice(
  model: SlotModel,
  f: PickerFormat,
  store: SlotStore,
) {
  const { group, setGroup, slotId, setSlotId } = store;
  const used = participantSeats(group);
  const slot = model.slots.find((s) => s.id === slotId);
  const [dayState, setDayState] = useState<CalendarDate | null>(() =>
    slot ? parseDate(slot.day) : null,
  );
  // A departure chosen elsewhere (another sheet, the draft) brings its day along.
  const day =
    slot && dayState?.toString() !== slot.day ? parseDate(slot.day) : dayState;
  const dayInfo = day ? model.byDay.get(day.toString()) : undefined;
  const seats = slot?.seats ?? 0;
  const overCapacity = Boolean(slot) && used > seats;
  const total = tourTotal(model.tour, group);
  const dueToday = slot ? firstPaymentAmount(slot.policy, total) : 0;

  const setDay = (date: CalendarDate) => {
    const info = model.byDay.get(date.toString());
    const only = info?.slots.length === 1 ? info.slots[0] : undefined;

    setDayState(date);
    setSlotId(
      firstFitting(info, used)?.id ?? (only && only.seats > 0 ? only.id : ""),
    );
  };
  const pick = (id: string) => {
    const next = model.slots.find((s) => s.id === id);

    if (next) setDayState(parseDate(next.day));
    setSlotId(id);
  };
  /** The next slot after this day where the whole group fits. */
  const nextFit = dayInfo
    ? model.slots.find(
        (s) => s.day > dayInfo.day && s.seats >= Math.max(1, used),
      )
    : undefined;

  return {
    kind: "slot" as const,
    group,
    setGroup,
    used,
    day,
    dayInfo,
    setDay,
    slot,
    slotId,
    setSlotId: pick,
    nextFit,
    seatsCap: slot ? seats : 99,
    overCapacity,
    valid: Boolean(slot) && seats > 0 && !overCapacity && group.adults >= 1,
    total,
    dueToday,
    summary: slot
      ? `${f.day(parseDate(slot.day))} · ${slot.time}–${slot.end} · ${f.seatsLeft(
          slot.seats,
        )}`
      : f.t(day ? "noTime" : "noDay"),
    short: slot
      ? `${f.day(parseDate(slot.day))} · ${slot.time}–${slot.end}`
      : f.t(day ? "noTime" : "noDay"),
  };
}

export type SlotChoice = ReturnType<typeof useSlotChoice>;
export type ListingChoice = StayBooking | SlotChoice;

// ---------------------------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------------------------

type PickerKey = MessageKey extends infer K
  ? K extends `tourDiscovery.picker.${infer Rest}`
    ? Rest
    : never
  : never;

/** Formatting for the current language; dates are Zurich calendar days. */
export function usePickerFormat(
  today: CalendarDate,
  /** A tour counts "seats available" where the stay and the bee house count places. */
  overrides: { seatsLeft?: (n: number) => string } = {},
) {
  const { t: translate, language } = useLocale();
  const f = pickerFormat(language, today, (key, vars) =>
    translate(`tourDiscovery.picker.${key}` as MessageKey, vars),
  );

  return { ...f, seatsLeft: overrides.seatsLeft ?? f.seatsLeft };
}

function pickerFormat(
  language: Language,
  today: CalendarDate,
  t: (key: PickerKey, vars?: Record<string, string | number>) => string,
) {
  const locale: IntlLocale = language === "de" ? "de-CH" : "en-CH";
  const monthShort = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  });
  const weekday = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone: "UTC",
  });
  const full = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const utc = (d: CalendarDate) =>
    new Date(Date.UTC(d.year, d.month - 1, d.day));
  // German short months end in a dot ("Okt."); chips drop it.
  const short = (d: CalendarDate) =>
    monthShort.format(utc(d)).replace(/\.$/, "");

  return {
    language,
    locale,
    t,
    money: (rappen: number) => formatMoney(rappen / 100, locale),
    day: (d: CalendarDate) =>
      formatShortDate(d.toString(), today.toString(), locale),
    fullDate: (d: CalendarDate) => full.format(utc(d)),
    /** "Oct 2026" / "Okt 2026": a month chip, always with the full year. */
    monthChip: (d: CalendarDate) => `${short(d)} ${d.year}`,
    weekday: (d: CalendarDate) => weekday.format(utc(d)).replace(/\.$/, ""),
    seatsLeft: (n: number) =>
      n === 0
        ? t("soldOut")
        : n === 1
          ? t("placeLeft")
          : t("placesLeft", { n }),
    nights: (n: number) => (n === 1 ? t("nightOne") : t("nightOther", { n })),
    name: (tour: Tour) => pickText(tour.name, language).text,
  };
}

export type PickerFormat = ReturnType<typeof pickerFormat>;
