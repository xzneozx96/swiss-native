import type { ListingChoice, PickerFormat, SlotModel } from "./model";
import type { CalendarDate } from "@internationalized/date";

import { Alert } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

import { QuantityStepper } from "@/components/quantity-stepper";

/** A pill as the month chips draw it: 44px, fully rounded, dark ink when chosen. */
export function pillClass(active: boolean, muted = false) {
  return `flex h-11 shrink-0 items-center justify-center rounded-full border px-4 text-sm font-medium whitespace-nowrap tabular-nums transition-colors focus-visible:focus-ring ${
    active
      ? "border-foreground bg-foreground text-background"
      : `border-border bg-surface hover:bg-default ${muted ? "text-muted" : "text-foreground"}`
  }`;
}

/** One price for the whole listing, shown once above the dates. */
export function PriceLine({
  model,
  f,
  note,
}: {
  model: SlotModel;
  f: PickerFormat;
  note?: string;
}) {
  const isStay = model.tour.kind === "stay";

  return (
    <div className="flex flex-col gap-0.5 text-foreground">
      <p className="text-base">
        <span className="font-semibold tabular-nums">
          {f.money(model.tour.adultPrice)}
        </span>{" "}
        <span className="text-muted">
          {isStay ? f.t("perAdultNight") : f.t("perAdult")}
        </span>
      </p>
      <p className="text-sm text-muted">
        {model.tour.infantPrice
          ? f.t("childInfantPrice", {
              price: f.money(model.tour.childPrice),
              infant: f.money(model.tour.infantPrice),
            })
          : f.t("childPrice", { price: f.money(model.tour.childPrice) })}
      </p>
      {note && <p className="pt-2 text-sm text-muted">{note}</p>}
    </div>
  );
}

/** Visually hidden, polite: what the last tap did. */
export function LiveRegion({ text }: { text: string }) {
  return (
    <p aria-live="polite" className="sr-only">
      {text}
    </p>
  );
}

/** C10's group rows: one QuantityStepper per age band, capped by the places left. */
export function GuestsSection({
  model,
  booking,
  f,
}: {
  model: SlotModel;
  booking: ListingChoice;
  f: PickerFormat;
}) {
  const { tour } = model;
  const { group, setGroup, seatsCap: cap } = booking;
  const bands = tour.ageBands;

  return (
    <section className="flex flex-col gap-3 text-foreground">
      <h3 className="text-heading">{f.t("guests")}</h3>
      <div className="flex flex-col divide-y divide-separator [&_.number-field\_\_group]:shrink-0 [&>*]:py-3 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
        <QuantityStepper
          hint={`${f.t("agesFrom", { from: bands.adultFrom })} · ${f.t("each", {
            price: f.money(tour.adultPrice),
          })}`}
          label={f.t("adults")}
          max={Math.max(group.adults, cap - group.children, 1)}
          min={1}
          value={group.adults}
          onChange={(adults) => setGroup({ ...group, adults })}
        />
        <QuantityStepper
          hint={`${f.t("agesRange", {
            from: bands.childFrom,
            to: bands.adultFrom - 1,
          })} · ${f.t("each", { price: f.money(tour.childPrice) })}`}
          label={f.t("children")}
          max={Math.max(group.children, cap - group.adults, 0)}
          min={0}
          value={group.children}
          onChange={(children) => setGroup({ ...group, children })}
        />
        <QuantityStepper
          hint={`${f.t("agesRange", { from: 0, to: bands.childFrom - 1 })} · ${
            tour.infantPrice
              ? f.t("each", { price: f.money(tour.infantPrice) })
              : f.t("free")
          } · ${f.t("noSeat")}`}
          label={f.t("infants")}
          max={6}
          min={0}
          value={group.infants}
          onChange={(infants) => setGroup({ ...group, infants })}
        />
      </div>
    </section>
  );
}

/** Shown where the choice is made: the group no longer fits the chosen dates or time. */
export function CapacityAlert({
  booking,
  f,
}: {
  booking: ListingChoice;
  f: PickerFormat;
}) {
  if (!booking.overCapacity) return null;
  const n =
    booking.kind === "stay" ? booking.fewest : (booking.slot?.seats ?? 0);

  return (
    <Alert className="alert--soft" status="warning">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Description>
          {n === 1 ? f.t("tooManyOne") : f.t("tooMany", { n })}
        </Alert.Description>
      </Alert.Content>
    </Alert>
  );
}

/**
 * The month chips: only months that have a bookable date, "Oct 2026". They scroll sideways;
 * an edge fades out on whichever side has more chips.
 */
export function MonthChips({
  months,
  current,
  f,
  onPick,
}: {
  months: CalendarDate[];
  current: CalendarDate;
  f: PickerFormat;
  onPick: (month: CalendarDate) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });
  const measure = () => {
    const el = ref.current;

    if (!el) return;
    setEdges({
      start: el.scrollLeft > 2,
      end: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
    });
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);

    return () => window.removeEventListener("resize", measure);
  }, [months.length]);

  // Keep the active chip in view when the month changes from the grid.
  useEffect(() => {
    const el = ref.current;
    const chip = el?.querySelector<HTMLElement>('[aria-pressed="true"]');

    if (el && chip) {
      const left =
        chip.getBoundingClientRect().left -
        el.getBoundingClientRect().left +
        el.scrollLeft;

      if (
        left < el.scrollLeft ||
        left + chip.offsetWidth > el.scrollLeft + el.clientWidth
      )
        el.scrollTo({ left: left - 20, behavior: "auto" });
    }
  }, [current.year, current.month]);

  if (months.length < 2) return null;
  const fade = 28;
  const mask = `linear-gradient(to right, ${edges.start ? "transparent" : "#000"} 0, #000 ${
    edges.start ? fade : 0
  }px, #000 calc(100% - ${edges.end ? fade : 0}px), ${edges.end ? "transparent" : "#000"} 100%)`;

  return (
    <div
      ref={ref}
      aria-label={f.t("jumpTo")}
      className="flex gap-2 overflow-x-auto [scrollbar-width:none]"
      role="group"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      onScroll={measure}
    >
      {months.map((month) => {
        const active =
          month.year === current.year && month.month === current.month;

        return (
          <button
            key={month.toString()}
            aria-pressed={active}
            className={pillClass(active)}
            type="button"
            onClick={() => onPick(month)}
          >
            {f.monthChip(month)}
          </button>
        );
      })}
    </div>
  );
}

/** Dot, amber dot and struck-through number: the key for the month grid. */
export function Legend({ f }: { f: PickerFormat }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
      <li className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-foreground" />
        {f.t("legendOpen")}
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-(--status-warning-fill)" />
        {f.t("legendLow")}
      </li>
      <li className="flex items-center gap-1.5">
        <span className="line-through">12</span>
        {f.t("legendFull")}
      </li>
    </ul>
  );
}
