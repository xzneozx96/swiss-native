import type { Lang, PassId } from "../data/passes";

import { BASE_STOP, loc, passStops, passTour, stayTour } from "../data/passes";

import { tourDays } from "@/features/tours/lib/selectors";

export interface PlanInput {
  ride: "own" | "passenger" | "unsure";
  riders: number;
  /** The tour the plan is for: the first pass the guest picked, or the one they switched to. */
  pass: PassId;
  /** Every pass the guest picked, in order. */
  picks: PassId[];
  departureId: string;
  /** ISO start of the chosen departure. */
  startsAt: string;
  /** "stay". */
  tweaks: string[];
}

export interface PlanStop {
  time: string;
  name: string;
  text: string;
}

export interface PlanItem {
  id: string;
  /** "Day 1", "Days 3 to 5" or a label for what follows the tour. */
  label: string;
  /** The date or date range of the item. */
  date: string;
  name: string;
  text: string;
  stops?: PlanStop[];
  tag?: string;
}

export interface Plan {
  pass: PassId;
  slug: string;
  title: string;
  days: number;
  dateRange: string;
  /** CHF per rider and for the group. */
  perRider: number;
  total: number;
  riders: number;
  items: PlanItem[];
  included: string[];
  notes: string[];
  added: string[];
  removed: string[];
}

const L = (lang: Lang, en: string, de: string) => (lang === "de" ? de : en);

const DAY = 86_400_000;
const locale = (lang: Lang) => (lang === "de" ? "de-CH" : "en-GB");

const dateFormat = (lang: Lang, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(locale(lang), {
    timeZone: "Europe/Zurich",
    ...options,
  });

export const shortDate = (lang: Lang, ms: number) =>
  dateFormat(lang, { weekday: "short", day: "numeric", month: "short" }).format(
    ms,
  );

const clock = (lang: Lang, ms: number) =>
  dateFormat(lang, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(ms);

/** The calendar day (YYYY-MM-DD) of an instant in Zurich. */
export const zurichDay = (ms: number) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich" }).format(ms);

/** A tour's length in days, from its duration (as on the tour page). */
export const passDays = (id: PassId) => tourDays(passTour(id));

const firstSentence = (text: string) => text.split(/(?<=\.)\s/)[0] ?? text;

const chf = (rappen: number) => Math.round(rappen / 100);

/**
 * The plan is the tour as the tour page describes it, put on the chosen dates: day one at
 * the base, the ride-out day with its stops at the times the tour gives, and the other days
 * as free rides from the base, shaped with the host. Nothing here is invented: names,
 * texts, times, length, price and conditions all come from the tour.
 */
export function buildPlan(input: PlanInput, lang: Lang): Plan {
  const tour = passTour(input.pass);
  const days = passDays(input.pass);
  const start = Date.parse(input.startsAt);
  const dayDate = (n: number) => shortDate(lang, start + (n - 1) * DAY);
  const base = BASE_STOP(input.pass);
  const stops = passStops(input.pass);
  const others = input.picks.filter((p) => p !== input.pass);
  const items: PlanItem[] = [];

  items.push({
    id: "day-1",
    label: `${L(lang, "Day", "Tag")} 1`,
    date: dayDate(1),
    name: loc(base.name, lang),
    text: loc(base.description, lang),
  });

  items.push({
    id: "day-2",
    label: `${L(lang, "Day", "Tag")} 2`,
    date: dayDate(2),
    name: L(lang, "The ride-out day", "Der Ausfahrtstag"),
    text: loc(tour.summary, lang),
    stops: stops.map((s) => ({
      time: clock(lang, start + (s.minutesFromStart - 1440) * 60_000),
      name: loc(s.name, lang),
      text: firstSentence(loc(s.description, lang)),
    })),
  });

  if (days > 2) {
    items.push({
      id: "free-days",
      label:
        days > 3
          ? `${L(lang, "Days", "Tage")} 3–${days}`
          : `${L(lang, "Day", "Tag")} 3`,
      date:
        days > 3
          ? `${shortDate(lang, start + 2 * DAY)} – ${shortDate(lang, start + (days - 1) * DAY)}`
          : dayDate(3),
      name: L(lang, "Free rides from Andermatt", "Freie Fahrten ab Andermatt"),
      text:
        (base.note ? loc(base.note, lang) : "") +
        (others.length
          ? ` ${L(lang, "You also picked", "Sie haben auch gewählt")} ${others
              .map((p) => loc(passTour(p).name, lang))
              .join(
                ", ",
              )}${L(lang, ": ask Erich whether one of these days suits it.", ": fragen Sie Erich, ob einer dieser Tage dafür passt.")}`
          : ""),
    });
  }

  if (input.tweaks.includes("stay")) {
    const stay = stayTour();
    const description = loc(stay.description, lang)
      .split(/(?<=\.)\s/)
      .slice(0, 2)
      .join(" ");

    items.push({
      id: "stay",
      label: L(lang, "After", "Danach"),
      date: "",
      name: loc(stay.name, lang),
      text: `${description} ${L(lang, "From", "Ab")} CHF ${chf(stay.adultPrice)} ${L(lang, "per night, booked separately.", "pro Nacht, separat gebucht.")}`,
      tag: L(lang, "Optional", "Optional"),
    });
  }

  const name = loc(tour.name, lang);

  return {
    pass: input.pass,
    slug: tour.slug,
    title: name,
    days,
    dateRange: `${shortDate(lang, start)} – ${shortDate(lang, start + (days - 1) * DAY)}`,
    perRider: chf(tour.adultPrice),
    total: chf(tour.adultPrice) * input.riders,
    riders: input.riders,
    items,
    included: tour.included.map((i) => loc(i, lang)),
    notes: [
      `${L(lang, "Meeting point", "Treffpunkt")}: ${loc(tour.meetingPoint, lang)}`,
      loc(tour.excluded, lang),
      loc(tour.conditions, lang),
    ],
    added: [],
    removed: [],
  };
}

/** Compares with the plan before the last adjustment, so the reply can say what changed. */
export function buildWithDiff(input: PlanInput, lang: Lang): Plan {
  const plan = buildPlan(input, lang);

  if (!input.tweaks.length) return plan;
  const before = buildPlan(
    { ...input, tweaks: input.tweaks.slice(0, -1) },
    lang,
  );
  const names = (p: Plan) => p.items.map((i) => i.name);

  return {
    ...plan,
    added: names(plan).filter((n) => !names(before).includes(n)),
    removed: names(before).filter((n) => !names(plan).includes(n)),
  };
}
