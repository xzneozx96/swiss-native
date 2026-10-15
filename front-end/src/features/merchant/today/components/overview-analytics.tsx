import type { PeriodId } from "../lib/analytics";
import type { ReactNode } from "react";

import { Tabs } from "@heroui/react";
import { useId } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

const noAnimation = { isAnimationActive: false } as const;

/**
 * A dashboard widget after HeroUI Pro's Widget: a tinted shell with a header (title,
 * description, actions), an elevated content card, and an optional footer line.
 */
export function Widget({
  id,
  title,
  description,
  actions,
  footer,
  className = "",
  children,
}: {
  id: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className={`flex min-w-0 flex-col rounded-3xl bg-surface-secondary p-1.5 ${className}`}
    >
      <div className="flex min-h-11 items-start justify-between gap-3 px-3.5 pt-2.5 pb-2">
        <div className="flex min-w-0 flex-col">
          <h3 className="font-semibold" id={id}>
            {title}
          </h3>
          {description && (
            <p className="text-xs text-pretty text-muted">{description}</p>
          )}
        </div>
        {actions}
      </div>
      <div className="flex min-w-0 flex-1 flex-col rounded-[1.25rem] bg-surface p-4 shadow-surface">
        {children}
      </div>
      {footer && (
        <div className="px-3.5 pt-2 pb-1 text-xs text-muted">{footer}</div>
      )}
    </section>
  );
}

/** A tooltip card: the value leads in ink, the series name follows in muted text. */
export function TooltipCard({
  heading,
  rows,
}: {
  heading: string;
  rows: { key: string; colour: string; label: string; value: string }[];
}) {
  return (
    <div className="min-w-36 rounded-xl bg-overlay px-3 py-2 text-xs shadow-overlay">
      <p className="mb-1 font-medium text-muted">{heading}</p>
      {rows.map((r) => (
        <p key={r.key} className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-0.5 w-3 shrink-0 rounded-full"
            style={{ background: r.colour }}
          />
          <span className="font-semibold tabular-nums">{r.value}</span>
          <span className="text-muted">{r.label}</span>
        </p>
      ))}
    </div>
  );
}

/** Sparkline: the period's daily values, no axes; decorative (the value and delta say it). */
export function Sparkline({
  values,
  colour,
  height,
}: {
  values: (number | null)[];
  colour: string;
  height: number;
}) {
  const gradient = useId();
  const data = values.map((value, index) => ({ index, value }));

  return (
    <div aria-hidden className="min-w-0" style={{ height }}>
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart
          accessibilityLayer={false}
          data={data}
          margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
        >
          <defs>
            <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={colour} stopOpacity={0.18} />
              <stop offset="100%" stopColor={colour} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={[0, "auto"]} />
          <Area
            {...noAnimation}
            connectNulls
            dataKey="value"
            dot={false}
            fill={`url(#${gradient})`}
            stroke={colour}
            strokeWidth={2}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PeriodTabs({
  period,
  periods,
  label,
  onChange,
}: {
  period: PeriodId;
  periods: { id: PeriodId; label: string }[];
  label: string;
  onChange: (id: PeriodId) => void;
}) {
  return (
    <Tabs
      className="w-full sm:w-auto"
      selectedKey={period}
      onSelectionChange={(key) => onChange(key as PeriodId)}
    >
      <Tabs.ListContainer className="sm:w-96">
        <Tabs.List aria-label={label}>
          {periods.map((p, index) => (
            <Tabs.Tab key={p.id} id={p.id}>
              {index > 0 && <Tabs.Separator />}
              {p.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}
