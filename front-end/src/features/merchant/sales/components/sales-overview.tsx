import type {
  SalesBar,
  SalesKpi,
  SalesOverviewView,
} from "../hooks/use-sales-overview";
import type { SalesPeriodId } from "../lib/periods";
import type { DataTableColumn } from "@/components/data-table";
import type { DayRange } from "@/features/merchant/today/lib/analytics";

import {
  Button,
  DateField,
  DateRangePicker,
  Dropdown,
  Label,
  RangeCalendar,
  Skeleton,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useSalesOverview } from "../hooks/use-sales-overview";

import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ChevronDownIcon, ReportsIcon } from "@/components/icons";
import { DeltaChip } from "@/components/stat-card";
import { useLocale } from "@/contexts/locale-context";
import {
  TooltipCard,
  Widget,
} from "@/features/merchant/today/components/overview-analytics";
import { WidgetSkeleton } from "@/features/merchant/today/components/overview-pages";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";

const noAnimation = { isAnimationActive: false } as const;
/** Tours teal (owner 15.10.2026), in every chart of the page. */
const TOUR_COLOUR = "var(--chart-4)";
const tick = { fill: "var(--muted)", fontSize: 11 };

/** The period dropdown; "Custom range" adds a date range field next to it. */
export function PeriodPicker({
  view,
  period,
  custom,
  onPeriod,
  onCustom,
}: {
  view: SalesOverviewView;
  period: SalesPeriodId;
  custom: DayRange | null;
  onPeriod: (p: SalesPeriodId) => void;
  onCustom: (r: DayRange) => void;
}) {
  const { t } = useLocale();
  const label = view.periods.find((p) => p.id === period)?.label ?? "";
  const range = custom ?? view.current;

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
      <Dropdown>
        <Button
          aria-label={`${t("salesOverview.period")}: ${label}`}
          variant="tertiary"
        >
          {label}
          <ChevronDownIcon aria-hidden size={16} />
        </Button>
        <Dropdown.Popover placement="bottom end">
          <Dropdown.Menu
            aria-label={t("salesOverview.period")}
            selectedKeys={new Set([period])}
            selectionMode="single"
            onSelectionChange={(keys) => {
              const [next] = [...keys];

              if (next) onPeriod(next as SalesPeriodId);
            }}
          >
            {view.periods.map((p) => (
              <Dropdown.Item key={p.id} id={p.id} textValue={p.label}>
                <Label>{p.label}</Label>
                <Dropdown.ItemIndicator />
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      {period === "custom" && (
        <DateRangePicker
          aria-label={t("salesOverview.dates")}
          maxValue={parseDate(view.today)}
          minValue={parseDate(view.firstDay)}
          value={{ start: parseDate(range.start), end: parseDate(range.end) }}
          onChange={(v) =>
            v && onCustom({ start: v.start.toString(), end: v.end.toString() })
          }
        >
          <DateField.Group>
            <DateField.Input slot="start">
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateRangePicker.RangeSeparator />
            <DateField.Input slot="end">
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateField.Suffix>
              <DateRangePicker.Trigger aria-label={t("salesOverview.dates")}>
                <DateRangePicker.TriggerIndicator />
              </DateRangePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <DateRangePicker.Popover>
            <RangeCalendar aria-label={t("salesOverview.dates")}>
              <RangeCalendar.Header>
                <RangeCalendar.Heading />
                <RangeCalendar.NavButton slot="previous" />
                <RangeCalendar.NavButton slot="next" />
              </RangeCalendar.Header>
              <RangeCalendar.Grid>
                <RangeCalendar.GridHeader>
                  {(day) => (
                    <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
                  )}
                </RangeCalendar.GridHeader>
                <RangeCalendar.GridBody>
                  {(date) => <RangeCalendar.Cell date={date} />}
                </RangeCalendar.GridBody>
              </RangeCalendar.Grid>
            </RangeCalendar>
          </DateRangePicker.Popover>
        </DateRangePicker>
      )}
    </div>
  );
}

/**
 * One figure as a chart card: its total and change, a short note, the figure per hour,
 * day, week or month, and what it counts. Four of these replace the cards and the chart.
 */
export function FigureChart({
  kpi,
  view,
}: {
  kpi: SalesKpi;
  view: SalesOverviewView;
}) {
  const { t, intlLocale } = useLocale();
  const compact = new Intl.NumberFormat(intlLocale, {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  const tooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: readonly { payload?: SalesBar }[];
  }) => {
    const bar = payload?.[0]?.payload;

    if (!active || !bar) return null;

    return (
      <TooltipCard
        heading={
          bar.partial
            ? `${bar.heading} · ${t("salesOverview.partial")}`
            : bar.heading
        }
        rows={[
          {
            key: "now",
            colour: TOUR_COLOUR,
            label: kpi.label,
            value: bar.valueText,
          },
          ...(bar.previousText
            ? [
                {
                  key: "before",
                  colour: "var(--chart-3)",
                  label: t("salesOverview.previous"),
                  value: bar.previousText,
                },
              ]
            : []),
        ]}
      />
    );
  };

  return (
    <Widget
      className="h-full"
      description={kpi.note ?? undefined}
      footer={kpi.hint}
      id={`sales-chart-${kpi.id}`}
      title={kpi.label}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">
          {kpi.value}
        </span>
        {kpi.delta && <DeltaChip {...kpi.delta} />}
        <span className="ms-auto text-xs text-muted">{view.bucketLabel}</span>
      </div>
      <div className="mt-3 h-40 min-w-0">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart
            data={kpi.bars}
            margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
            title={`${kpi.label} ${view.bucketLabel}`}
          >
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="tick"
              interval="preserveStartEnd"
              minTickGap={12}
              tick={tick}
              tickLine={false}
            />
            <YAxis
              allowDecimals={kpi.isMoney}
              axisLine={false}
              tick={tick}
              tickCount={4}
              tickFormatter={(v: number) =>
                compact.format(kpi.isMoney ? v / 100 : v)
              }
              tickLine={false}
              width={40}
            />
            <Tooltip content={tooltip} cursor={false} />
            <Bar
              {...noAnimation}
              dataKey="value"
              maxBarSize={24}
              radius={[6, 6, 6, 6]}
            >
              {kpi.bars.map((b) => (
                <Cell
                  key={b.key}
                  fill={TOUR_COLOUR}
                  fillOpacity={b.partial ? 0.45 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
}

/** The best sellers: the top 5 tours of the period. */
export function TopSellers({ rows }: { rows: SalesOverviewView["top"] }) {
  const { t } = useLocale();

  return (
    <Widget
      className="h-full"
      description={t("salesOverview.top.description")}
      id="sales-top-sellers"
      title={t("salesOverview.top.title")}
    >
      <SellersTable rows={rows} />
    </Widget>
  );
}

function SellersTable({ rows }: { rows: SalesOverviewView["top"] }) {
  const { t } = useLocale();
  const columns: DataTableColumn<SalesOverviewView["top"][number]>[] = [
    {
      id: "rank",
      header: <span className="sr-only">#</span>,
      headerClassName: "w-6",
      cellClassName: "text-muted tabular-nums",
      render: (r) => rows.indexOf(r) + 1,
    },
    {
      id: "product",
      header: t("salesOverview.top.product"),
      isRowHeader: true,
      render: (r) => (
        <>
          <span className="block font-medium">{r.name}</span>
          <span className="text-xs text-muted sm:hidden">{r.sold}</span>
        </>
      ),
    },
    {
      id: "sold",
      header: t("salesOverview.top.sold"),
      headerClassName: "hidden text-end sm:table-cell",
      cellClassName:
        "hidden text-end whitespace-nowrap text-muted tabular-nums sm:table-cell",
      render: (r) => r.sold,
    },
    {
      id: "value",
      header: t("salesOverview.value"),
      headerClassName: "text-end",
      cellClassName: "text-end font-medium whitespace-nowrap tabular-nums",
      render: (r) => r.value,
    },
    {
      id: "share",
      header: t("salesOverview.top.share"),
      headerClassName: "hidden text-end sm:table-cell",
      cellClassName: "hidden text-end text-muted tabular-nums sm:table-cell",
      render: (r) => r.share,
    },
  ];

  return (
    <DataTable
      columns={columns}
      empty={{ icon: ReportsIcon, message: t("salesOverview.top.empty") }}
      getRowId={(r) => r.id}
      label={t("salesOverview.top.title")}
      rows={rows}
      variant="card"
    />
  );
}

/** Bars of the demo-week shape while loading. */
const SKELETON_BARS = [30, 55, 40, 70, 45, 85, 60];

/** Sales while loading: the header, four chart cards and top sellers. */
function SalesSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <WidgetSkeleton key={i}>
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-36 rounded-lg" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <div className="mt-4 flex h-36 items-end justify-around gap-3 border-b border-separator">
              {SKELETON_BARS.map((h, b) => (
                <Skeleton
                  key={b}
                  className="w-5 rounded-t-md rounded-b-none"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </WidgetSkeleton>
        ))}
      </div>
      <WidgetSkeleton>
        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 flex-1 rounded-lg" />
              <Skeleton className="h-4 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </WidgetSkeleton>
    </div>
  );
}

/**
 * M02 Overview › Sales (owner review 15.10.2026): one period (dropdown, default the last 7
 * days), a chart per figure, and the top tours.
 */
export function SalesOverview() {
  const { t } = useLocale();
  const isLoading = useSimulatedLoading();
  const [period, setPeriod] = useState<SalesPeriodId>("7d");
  const [custom, setCustom] = useState<DayRange | null>(null);
  const view = useSalesOverview(period, period === "custom" ? custom : null);

  if (isLoading) return <SalesSkeleton />;

  return (
    <section aria-labelledby="sales-heading" className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3 sm:items-end">
        <div className="flex min-w-0 flex-col">
          <h2 className="text-heading" id="sales-heading">
            {t("salesOverview.heading")}
          </h2>
          <p className="text-sm text-muted">
            {view.rangeText} · {view.comparison}
          </p>
        </div>
        <PeriodPicker
          custom={custom}
          period={period}
          view={view}
          onCustom={setCustom}
          onPeriod={(p) => {
            if (p === "custom" && !custom) setCustom(view.current);
            setPeriod(p);
          }}
        />
      </div>
      {view.isEmpty ? (
        <div className="rounded-3xl bg-surface shadow-surface">
          <EmptyState icon={ReportsIcon} message={t("overview.empty")} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {view.kpis.map((k) => (
              <FigureChart key={k.id} kpi={k} view={view} />
            ))}
          </div>
          <TopSellers rows={view.top} />
        </>
      )}
    </section>
  );
}
