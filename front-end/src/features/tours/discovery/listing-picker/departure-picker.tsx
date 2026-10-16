import type {
  ListingChoice,
  PickerFormat,
  SlotChoice,
  SlotModel,
  StayBooking,
} from "./model";
import type { TourPaymentPolicy } from "@/features/tours/types";
import type { CalendarDate } from "@internationalized/date";
import type { ReactNode } from "react";

import { Calendar } from "@heroui/react";
import { useState } from "react";

import { DayCell, isBookable, isStayTappable } from "./day-cell";
import {
  CapacityAlert,
  GuestsSection,
  Legend,
  LiveRegion,
  MonthChips,
  PriceLine,
} from "./parts";
import { TimeSlots } from "./time-slots";

/** What differs between the listings that share the picker. */
export interface DeparturePickerConfig {
  /** A muted line under the price (the bee house's first season). */
  note?: string;
  /** The chosen departure's payment rule, e.g. "30% deposit when booking" (tours). */
  policyText?: (policy: TourPaymentPolicy) => string;
  /** One legend line, shown only when departures differ in their payment rule. */
  policyVaries?: string;
  /** Shown instead of the grid when the listing has no upcoming date. */
  empty?: ReactNode;
  /** Shown under the grid when every upcoming date is sold out. */
  soldOut?: ReactNode;
}

/**
 * The booking picker of every listing (Variant A): price, month chips and a month grid that
 * opens on the month of the choice, then the choice itself, then the group. A stay picks a
 * range of nights; a tour or a bee house visit picks a day, then one of its departures (time
 * pills and chips when the day has several, one slot row when it has one).
 */
export function DeparturePicker({
  model,
  choice,
  f,
  config = {},
}: {
  model: SlotModel;
  choice: ListingChoice;
  f: PickerFormat;
  config?: DeparturePickerConfig;
}) {
  const stay = choice.kind === "stay" ? choice : undefined;
  const slots = choice.kind === "slot" ? choice : undefined;
  const title = stay ? f.t("stayDates") : f.t("date");
  const [focused, setFocused] = useState<CalendarDate>(
    () => stay?.range?.checkIn ?? slots?.day ?? model.months[0] ?? model.today,
  );
  const policies = new Set(model.slots.map((s) => s.policy));

  return (
    <>
      <PriceLine f={f} model={model} note={config.note} />
      <section className="flex flex-col gap-3 text-foreground">
        <h3 className="text-heading">{title}</h3>
        {model.days.length === 0 ? (
          (config.empty ?? (
            <p className="text-sm text-muted">{f.t("noDates")}</p>
          ))
        ) : (
          <>
            <MonthChips
              current={focused}
              f={f}
              months={model.months}
              onPick={(month) => {
                const first = model.bookable.find(
                  (d) =>
                    d.date.year === month.year && d.date.month === month.month,
                );

                setFocused(first?.date ?? month);
              }}
            />
            <Calendar
              aria-label={title}
              className="w-full max-w-none"
              firstDayOfWeek="mon"
              focusedValue={focused}
              isDateUnavailable={
                stay
                  ? (d) => !isStayTappable(stay)(d)
                  : (d) => !isBookable(model)(d)
              }
              maxValue={model.lastDay}
              minValue={model.today}
              // The stay draws its own range: the calendar holds no value, so every tap reports.
              value={stay ? null : (slots?.day ?? null)}
              onChange={(d) => {
                if (stay) stay.tap(d);
                else slots?.setDay(d);
              }}
              onFocusChange={setFocused}
            >
              <Calendar.Header className="pb-1">
                <Calendar.Heading className="text-base font-semibold" />
                <Calendar.NavButton
                  className="size-11 rounded-full"
                  slot="previous"
                />
                <Calendar.NavButton
                  className="size-11 rounded-full"
                  slot="next"
                />
              </Calendar.Header>
              {/* Six week rows always, so a month change never moves what is below. */}
              <Calendar.Grid className="grid-rows-[auto_repeat(6,52px)]">
                <Calendar.GridHeader>
                  {(weekday) => (
                    <Calendar.HeaderCell className="pb-1 text-xs">
                      {weekday}
                    </Calendar.HeaderCell>
                  )}
                </Calendar.GridHeader>
                <Calendar.GridBody>
                  {(date) => (
                    <DayCell
                      date={date}
                      f={f}
                      model={model}
                      stay={stay}
                      tour={slots}
                    />
                  )}
                </Calendar.GridBody>
              </Calendar.Grid>
            </Calendar>
            {model.bookable.length === 0 && config.soldOut}
            {stay && <StayPanel f={f} stay={stay} />}
            {slots && (
              <SlotPanel
                choice={slots}
                f={f}
                policyText={config.policyText}
                policyVaries={
                  policies.size > 1 ? config.policyVaries : undefined
                }
              />
            )}
            <CapacityAlert booking={choice} f={f} />
          </>
        )}
      </section>
      <GuestsSection booking={choice} f={f} model={model} />
    </>
  );
}

/** The choice in words and what is due today: the sheet footer, above its button. */
export function PickerSummary({
  choice,
  f,
}: {
  choice: ListingChoice;
  f: PickerFormat;
}) {
  return (
    <div className="flex flex-col text-sm text-foreground tabular-nums">
      <span className="truncate font-semibold">{choice.short}</span>
      {/* Nothing chosen or nothing due: no amount, rather than "CHF 0.00 due today". */}
      <span className="text-muted">
        {choice.dueToday > 0
          ? f.t("dueToday", { amount: f.money(choice.dueToday) })
          : "\u00a0"}
      </span>
    </div>
  );
}

function StayPanel({ stay, f }: { stay: StayBooking; f: PickerFormat }) {
  const range = stay.range;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted">
        {range?.awaiting && stay.maxOut
          ? f.t("checkOutUntil", { date: f.day(stay.maxOut) })
          : f.t("newStay")}
      </p>
      <p className="rounded-2xl bg-surface-secondary px-4 py-3 text-sm font-semibold tabular-nums">
        {stay.summary}
      </p>
      <LiveRegion text={stay.announcement} />
    </div>
  );
}

function SlotPanel({
  choice,
  f,
  policyText,
  policyVaries,
}: {
  choice: SlotChoice;
  f: PickerFormat;
  policyText?: (policy: TourPaymentPolicy) => string;
  policyVaries?: string;
}) {
  const single = choice.dayInfo?.slots.length === 1;

  return (
    <div className="flex flex-col gap-3">
      <Legend f={f} />
      {policyVaries && <p className="text-xs text-muted">{policyVaries}</p>}
      {choice.dayInfo && choice.span === 1 && (
        <p className="text-sm font-semibold">{f.day(choice.dayInfo.date)}</p>
      )}
      {choice.span > 1 ? (
        <DateRange choice={choice} f={f} policyText={policyText} />
      ) : (
        <TimeSlots booking={choice} f={f} policyText={policyText} />
      )}
      {choice.span === 1 && !single && choice.day && (
        <div aria-live="polite" className="flex flex-col gap-0.5 text-sm">
          <p className="text-muted">{choice.summary}</p>
          {choice.slot && policyText && (
            <p className="font-medium">{policyText(choice.slot.policy)}</p>
          )}
        </div>
      )}
    </div>
  );
}

/** A multi-day tour's dates: first and last day, how many days, places and payment rule. */
function DateRange({
  choice,
  f,
  policyText,
}: {
  choice: SlotChoice;
  f: PickerFormat;
  policyText?: (policy: TourPaymentPolicy) => string;
}) {
  const { start, end, slot } = choice;

  if (!start || !end || !slot) return null;

  return (
    <div
      aria-live="polite"
      className="relative flex flex-col gap-2 rounded-2xl border-2 border-accent bg-accent-soft px-4 py-3 text-sm text-accent-soft-foreground tabular-nums"
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex flex-col">
          <span className="text-xs">{f.t("tourStarts")}</span>
          <span className="text-base font-semibold">{f.day(start)}</span>
        </div>
        <span aria-hidden className="text-base">
          →
        </span>
        <div className="flex flex-col">
          <span className="text-xs">{f.t("tourEnds")}</span>
          <span className="text-base font-semibold">{f.day(end)}</span>
        </div>
      </div>
      <span>
        {f.days(choice.span)} · {f.seatsLeft(slot.seats)}
        {policyText && slot.seats > 0 && ` · ${policyText(slot.policy)}`}
      </span>
    </div>
  );
}
