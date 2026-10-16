import { createFileRoute } from "@tanstack/react-router";

import { CalendarPage } from "@/features/merchant/calendar/calendar-page";

// Calendar: every tour departure, experience start and stay night by day, week or month
// (owner review 15.10.2026).
export const Route = createFileRoute("/store/calendar")({
  component: CalendarPage,
});
