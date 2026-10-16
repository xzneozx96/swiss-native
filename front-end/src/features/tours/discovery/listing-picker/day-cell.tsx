import type { PickerFormat, SlotChoice, SlotModel, StayBooking } from "./model";
import type { CalendarDate, DateValue } from "@internationalized/date";

import { Calendar } from "@heroui/react";
import { toCalendarDate } from "@internationalized/date";
import { useLayoutEffect, useRef } from "react";

import { nightFits } from "./model";

/**
 * React Aria computes the cell's aria-label and drops ours, so the role ("check-in", "night 2")
 * is written onto the cell button after every render.
 */
function CellName({ label }: { label: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    ref.current?.closest('[role="button"]')?.setAttribute("aria-label", label);
  });

  return <span ref={ref} hidden />;
}

type Part = "in" | "night" | "out" | "last" | null;

/**
 * One month-grid day. The cell carries the red band of a stay; the rounded pill inside it holds
 * the number, the dot or seat count, and the check-out mark.
 */
export function DayCell({
  date,
  model,
  f,
  stay,
  tour,
}: {
  date: CalendarDate;
  model: SlotModel;
  f: PickerFormat;
  /** Stay only: draws the check-in, nights and check-out. */
  stay?: StayBooking;
  /** Multi-day tour: draws the run from its first day to its last. */
  tour?: SlotChoice;
}) {
  const info = model.byDay.get(date.toString());
  const isToday = date.compare(model.today) === 0;
  const state = info?.state;
  const range = stay?.range;
  const run =
    tour && tour.span > 1 && tour.slot && tour.start && tour.end
      ? { start: tour.start, end: tour.end }
      : null;
  const part: Part = run
    ? date.compare(run.start) === 0
      ? "in"
      : date.compare(run.end) === 0
        ? "last"
        : date.compare(run.start) > 0 && date.compare(run.end) < 0
          ? "night"
          : null
    : !range
      ? null
      : date.compare(range.checkIn) === 0
        ? "in"
        : date.compare(range.checkOut) === 0
          ? "out"
          : date.compare(range.checkIn) > 0 && date.compare(range.checkOut) < 0
            ? "night"
            : null;
  const awaiting = Boolean(range?.awaiting && stay?.maxOut);
  const afterMax =
    awaiting && stay?.maxOut ? date.compare(stay.maxOut) > 0 : false;
  const fits = stay
    ? nightFits(model, date, stay.used)
    : state === "open" || state === "low";
  // A night the group cannot take, offered only as the end of the stay.
  const checkOutOnly =
    awaiting &&
    !part &&
    !fits &&
    Boolean(stay?.maxOut && date.compare(stay.maxOut) === 0);
  // The band reaches 1px past the cell on both sides, so no seam shows between columns.
  const band =
    part === "night"
      ? "-inset-x-px"
      : part === "in"
        ? "start-1/2 -end-px"
        : part === "out" || part === "last"
          ? "-start-px end-1/2"
          : "";
  const pill =
    part === "in" || part === "last"
      ? "bg-accent font-semibold text-accent-foreground"
      : part === "night"
        ? "font-semibold text-accent-foreground"
        : part === "out"
          ? "bg-surface font-semibold text-foreground ring-2 ring-accent ring-inset"
          : checkOutOnly
            ? `border-[1.5px] border-dashed border-muted font-semibold text-foreground ${state === "soldout" ? "line-through" : ""}`
            : afterMax
              ? `font-normal text-muted ${state === "soldout" ? "line-through" : ""}`
              : fits
                ? "bg-surface-secondary font-semibold text-foreground group-hover:bg-default-hover group-data-[selected=true]:bg-accent group-data-[selected=true]:text-accent-foreground"
                : `font-normal text-muted ${state === "soldout" ? "line-through" : ""}`;
  const nightNo = run
    ? date.compare(run.start) + 1
    : range && part
      ? date.compare(range.checkIn) + 1
      : 0;
  const role = run
    ? part === "in"
      ? f.t("roleStart")
      : part === "last"
        ? f.t("roleEnd")
        : part === "night"
          ? f.t("roleDay", { n: nightNo })
          : ""
    : part === "in"
      ? f.t("roleCheckIn")
      : part === "night"
        ? f.t("roleNight", { n: nightNo })
        : part === "out"
          ? f.t("roleCheckOut")
          : checkOutOnly
            ? state === "soldout"
              ? f.t("checkOutOnly")
              : f.t("tooFewCheckOut")
            : "";
  const label = [
    f.fullDate(date),
    role,
    info && part !== "out" && !checkOutOnly ? f.seatsLeft(info.seats) : "",
  ]
    .filter(Boolean)
    .join(", ");
  const showLow = state === "low" && !part && !afterMax;
  const showDot = state === "open" && fits && !part && !afterMax;

  return (
    <Calendar.Cell
      className="group relative flex h-13 w-full min-w-0 aspect-auto items-stretch rounded-none bg-transparent p-0.5 hover:bg-transparent data-[disabled=true]:no-underline data-[disabled=true]:opacity-100 data-[outside-month=true]:invisible data-[pressed=true]:bg-transparent data-[selected=true]:bg-transparent data-[today=true]:bg-transparent data-[today=true]:text-inherit data-[unavailable=true]:opacity-100"
      date={date}
    >
      {({ formattedDate, isOutsideMonth, isSelected }) =>
        isOutsideMonth ? null : (
          <>
            {band && (
              <span
                aria-hidden
                className={`absolute inset-y-0.5 bg-accent ${band}`}
              />
            )}
            <span
              // Today's ring follows the demo clock; HeroUI's own marks the real date.
              className={`relative flex w-full flex-col items-center justify-center gap-0.5 rounded-xl text-[15px] tabular-nums ${pill} ${
                isToday && !part
                  ? "ring-[1.5px] ring-foreground ring-inset"
                  : ""
              }`}
            >
              <span className="leading-5">{formattedDate}</span>
              <span
                aria-hidden
                className="flex h-3 items-center gap-0.5 text-[10px] leading-3 font-semibold no-underline"
              >
                {part === "out" && (
                  <span className="text-accent-soft-foreground">
                    {f.t("out")}
                  </span>
                )}
                {showDot && (
                  <span
                    className={`size-1 rounded-full ${isSelected ? "bg-accent-foreground" : "bg-foreground"}`}
                  />
                )}
                {showLow && (
                  <>
                    <span
                      className={`size-1 shrink-0 rounded-full ${isSelected ? "bg-accent-foreground" : "bg-(--status-warning-fill)"}`}
                    />
                    <span
                      className={`whitespace-nowrap ${isSelected ? "text-accent-foreground" : "text-warning"}`}
                    >
                      {f.t("left", { n: info!.seats })}
                    </span>
                  </>
                )}
              </span>
            </span>
            <CellName label={label} />
          </>
        )
      }
    </Calendar.Cell>
  );
}

/** Experience: a day with at least one free visit. */
export function isBookable(model: SlotModel) {
  return (date: DateValue) => {
    const state = model.byDay.get(toCalendarDate(date).toString())?.state;

    return state === "open" || state === "low";
  };
}

/** Stay: what the two-tap range accepts right now. */
export function isStayTappable(stay: StayBooking) {
  return (date: DateValue) => stay.isTappable(toCalendarDate(date));
}
