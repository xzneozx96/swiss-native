// Built once: a new Intl formatter costs about 50 µs, and analytics ask for thousands of days.
const zurichDay = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Zurich",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Calendar date in Europe/Zurich as YYYY-MM-DD (the business time zone, spec §1.5). */
export function zurichDate(at: Date): string {
  return zurichDay.format(at);
}

const dayCache = new Map<string, string>();

/** zurichDate of an ISO timestamp, cached: analytics ask for the same instants many times. */
export function zurichDayOf(iso: string): string {
  let day = dayCache.get(iso);

  if (!day) {
    day = zurichDate(new Date(iso));
    dayCache.set(iso, day);
  }

  return day;
}
