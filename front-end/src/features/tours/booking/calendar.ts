import type { TourBooking } from "../types";

const stamp = (iso: string) =>
  new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

// RFC 5545 text values escape backslash, semicolon, comma and line breaks.
const escape = (text: string) =>
  text.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");

/** C13 "Add to calendar": a one-event iCalendar file for the departure, as a data URL. */
export function calendarHref(
  booking: TourBooking,
  text: { name: string; place: string; note: string },
): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Erich Haldi//Tour booking//EN",
    "BEGIN:VEVENT",
    `UID:${booking.id}@swissnative.example`,
    `DTSTAMP:${stamp(booking.createdAt)}`,
    `DTSTART:${stamp(booking.startsAt)}`,
    `DTEND:${stamp(booking.endsAt)}`,
    `SUMMARY:${escape(text.name)}`,
    `LOCATION:${escape(text.place)}`,
    `DESCRIPTION:${escape(text.note)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
