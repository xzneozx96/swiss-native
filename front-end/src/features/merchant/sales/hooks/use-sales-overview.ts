import type { Bucket, SalesPeriodId, SalesRange } from '../lib/periods'
import type { SaleTx } from '../lib/sales-transactions'
import type { DeltaView } from '@/components/stat-card'
import type { PaymentMethod } from '@/features/payment/types'
import type { DayRange } from '@/lib/analytics'

import { useMemo } from 'react'

import { useLocale } from '@/contexts/locale-context'
import { zurichDate, zurichDayOf } from '@/features/catalog/lib/pickup'

import { useDemo, useDemoNow } from '@/features/demo'
import { deltaOf } from '@/lib/analytics'
import {
  calendarDay,
  dateTimeFormat,
  formatMoney,
  numberFormat,
  percentOf,
} from '@/lib/format'
import { pickText } from '@/lib/localized'
import {
  addDays,
  bucketKey,
  bucketOf,
  bucketSlots,
  inSalesRange,
  SALES_PERIODS,
  salesRanges,
} from '../lib/periods'
import { saleTransactions } from '../lib/sales-transactions'

/** A change smaller than this either way counts as stable: grey line, no arrow. */
const STABLE = 0.05

const zurichTime = dateTimeFormat('en-GB', {
  timeZone: 'Europe/Zurich',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})
const timeOf = (iso: string) => zurichTime.format(new Date(iso))

/** One sale (a tour booking) at the minute it was placed. */
interface Sale {
  tx: SaleTx
  day: string
  time: string
  lost: boolean
  value: number
  outstanding: number
  lines: { itemId: string, quantity: number, value: number }[]
}

/** One payment received at the minute it succeeded. */
interface Payment {
  tx: SaleTx
  day: string
  time: string
  amount: number
  method: PaymentMethod
}

export interface SalesKpi {
  id: 'value' | 'collected' | 'sales' | 'unpaid'
  label: string
  value: string
  /** Null when there is nothing to compare with (all time, or the unpaid card). */
  delta: DeltaView | null
  /** Shown under the value instead of a comparison. */
  note: string | null
  /** What the figure counts, under the chart. */
  hint: string
  /** The figure per bar of the chart. */
  bars: SalesBar[]
  /** The y-axis: CHF or a count. */
  isMoney: boolean
}

export interface SalesBar {
  key: string
  tick: string
  heading: string
  /** A week or month the range cuts short; drawn lighter. */
  partial: boolean
  value: number
  valueText: string
  previous: number | null
  previousText: string | null
}

export interface SalesTopRow {
  id: string
  name: string
  sold: string
  value: string
  share: string
}

/**
 * The Sales figures for one period.
 */
export function useSalesOverview(
  period: SalesPeriodId,
  custom: DayRange | null,
) {
  const { t, language, intlLocale } = useLocale()
  const { state } = useDemo()
  const now = useDemoNow()
  const today = zurichDate(now)
  const nowTime = timeOf(now.toISOString())
  const { tours } = state.data

  const { sales, payments, firstDay } = useMemo(() => {
    const sales: Sale[] = []
    const payments: Payment[] = []

    for (const [id, tx] of saleTransactions({ tours })) {
      const source = tours?.bookings.find(b => b.id === id)

      if (!source)
        continue
      sales.push({
        tx,
        day: zurichDayOf(source.createdAt),
        time: timeOf(source.createdAt),
        lost: tx.status === 'lost',
        value: tx.value,
        outstanding: tx.outstanding,
        lines: tx.lines,
      })
      for (const p of source.payments) {
        if (p.status !== 'succeeded')
          continue
        payments.push({
          tx,
          day: zurichDayOf(p.at),
          time: timeOf(p.at),
          amount: p.amount,
          method: p.method,
        })
      }
    }
    const firstDay = sales.reduce(
      (min, s) => (s.day < min ? s.day : min),
      '9999-12-31',
    )

    return { sales, payments, firstDay }
  }, [tours])

  const { current, previous } = salesRanges(
    period,
    today,
    nowTime,
    firstDay < today ? firstDay : today,
    custom,
  )
  const bucket = bucketOf(current)

  const money = (rappen: number) => formatMoney(rappen / 100, intlLocale)
  const count = (n: number) => numberFormat(intlLocale).format(n)
  const pct = (part: number, whole: number) =>
    percentOf(part, whole, intlLocale)

  const placedIn = (r: SalesRange) =>
    sales.filter(s => !s.lost && inSalesRange(s.day, s.time, r))
  const paidIn = (r: SalesRange) =>
    payments.filter(p => inSalesRange(p.day, p.time, r))
  const sum = <X>(list: X[], f: (x: X) => number) =>
    list.reduce((a, x) => a + f(x), 0)

  const cur = {
    placed: placedIn(current),
    paid: paidIn(current),
  }
  const prev = previous && {
    placed: placedIn(previous),
    paid: paidIn(previous),
  }

  /** Each bucket's figure, for the card lines and the chart. */
  const series = (
    r: SalesRange,
    f: (placed: Sale[], paid: Payment[]) => number,
  ) => {
    const b = bucketOf(r)
    const keys = bucketSlots(r, b).map(slot => slot.key)
    const placed = new Map<string, Sale[]>()
    const paid = new Map<string, Payment[]>()

    for (const s of placedIn(r)) {
      const k = bucketKey(s.day, s.time, b, r)

      placed.set(k, [...(placed.get(k) ?? []), s])
    }
    for (const p of paidIn(r)) {
      const k = bucketKey(p.day, p.time, b, r)

      paid.set(k, [...(paid.get(k) ?? []), p])
    }
    // Today: the hours still to come stay empty rather than zero.
    // Yesterday until now: the hours after it are not part of the comparison.
    const lastHour
      = b !== 'hour'
        ? '24'
        : r.until
          ? r.until.slice(0, 2)
          : r.end === today
            ? nowTime.slice(0, 2)
            : '24'

    return keys.map(k =>
      b === 'hour' && k > lastHour
        ? null
        : f(placed.get(k) ?? [], paid.get(k) ?? []),
    )
  }

  const range = (r: DayRange) =>
    (
      dateTimeFormat(intlLocale, {
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC',
      }) as Intl.DateTimeFormat & { formatRange: (a: Date, b: Date) => string }
    ).formatRange(calendarDay(r.start), calendarDay(r.end))
  const rangeText = (r: SalesRange) =>
    r.until
      ? t('salesOverview.until', { range: range(r), time: r.until })
      : range(r)

  const delta = (value: number, before: number, polarity: 'up' | 'down') => {
    // No chip at all when there is nothing earlier: the card says so in words.
    if (!previous || !before)
      return null
    const d = deltaOf(value, before, polarity, intlLocale)
    const change = before ? (value - before) / before : null
    const stable = change !== null && Math.abs(change) < STABLE

    return {
      text: d.delta,
      tone: stable ? 'neutral' : d.tone,
      direction: stable ? 'flat' : d.direction,
      label: d.delta
        ? t('salesOverview.delta', {
            delta: d.delta,
            range: rangeText(previous),
          })
        : t('salesOverview.deltaNone', { range: rangeText(previous) }),
    } satisfies DeltaView
  }

  const valueTotal = sum(cur.placed, s => s.value)
  const paidTotal = sum(cur.paid, p => p.amount)
  const unpaidTotal = sum(cur.placed, s => s.outstanding)

  const valueDelta = delta(
    valueTotal,
    prev ? sum(prev.placed, s => s.value) : 0,
    'up',
  )
  const paidDelta = delta(
    paidTotal,
    prev ? sum(prev.paid, p => p.amount) : 0,
    'up',
  )
  const salesDelta = delta(cur.placed.length, prev?.placed.length ?? 0, 'up')

  const slots = bucketSlots(current, bucket)

  const fmt = (o: Intl.DateTimeFormatOptions) =>
    dateTimeFormat(intlLocale, { ...o, timeZone: 'UTC' })
  const at = (k: string) => calendarDay(k)
  const label = (
    k: string,
    b: Bucket,
    slot: DayRange,
  ): { tick: string, heading: string } => {
    switch (b) {
      case 'hour':
        return { tick: `${k}:00`, heading: `${k}:00–${k}:59` }
      case 'day':
        return {
          tick: fmt({ day: 'numeric', month: 'numeric' }).format(at(k)),
          heading: fmt({
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          }).format(at(k)),
        }
      case 'week':
        return {
          tick: fmt({ day: 'numeric', month: 'short' }).format(at(slot.start)),
          heading: range(slot),
        }
      case 'month':
        return {
          tick: fmt({ month: 'short' }).format(at(k)),
          heading: fmt({ month: 'long', year: 'numeric' }).format(at(k)),
        }
    }
  }
  /** One figure per bar, with the previous period's figure at the same place for the tooltip. */
  const barsOf = (
    f: (placed: Sale[], paid: Payment[]) => number,
    format: (n: number) => string,
  ): SalesBar[] => {
    const now = series(current, f)
    const before = previous ? series(previous, f) : []

    return slots.map((slot, i) => {
      const value = now[i]
      const was = previous ? (before[i] ?? null) : null

      return {
        key: slot.key,
        ...label(slot.key, bucket, slot),
        partial: slot.partial,
        value: value ?? 0,
        valueText: value === null ? '–' : format(value),
        previous: was,
        previousText: was === null ? null : format(was),
      }
    })
  }

  const kpis: SalesKpi[] = [
    {
      id: 'value',
      label: t('salesOverview.value'),
      value: money(valueTotal),
      delta: valueDelta,
      note: valueDelta ? null : t('salesOverview.noCompare'),
      hint: t('salesOverview.value.hint'),
      bars: barsOf(placed => sum(placed, s => s.value), money),
      isMoney: true,
    },
    {
      id: 'collected',
      label: t('salesOverview.collected'),
      value: money(paidTotal),
      delta: paidDelta,
      note: paidDelta ? null : t('salesOverview.noCompare'),
      hint: t('salesOverview.collected.hint'),
      bars: barsOf((_, paid) => sum(paid, p => p.amount), money),
      isMoney: true,
    },
    {
      id: 'sales',
      label: t('salesOverview.orders'),
      value: count(cur.placed.length),
      delta: salesDelta,
      note: salesDelta ? null : t('salesOverview.noCompare'),
      hint: t('salesOverview.orders.hint'),
      bars: barsOf(placed => placed.length, count),
      isMoney: false,
    },
    {
      id: 'unpaid',
      label: t('salesOverview.unpaid'),
      value: money(unpaidTotal),
      delta: null,
      note: t('salesOverview.unpaid.share', {
        share: pct(unpaidTotal, valueTotal),
      }),
      hint: t('salesOverview.unpaid.hint'),
      bars: barsOf(placed => sum(placed, s => s.outstanding), money),
      isMoney: true,
    },
  ]

  // Top sellers: the tours, by sales value.
  const items = new Map<string, { quantity: number, value: number }>()

  for (const s of cur.placed) {
    for (const l of s.lines) {
      const row = items.get(l.itemId) ?? { quantity: 0, value: 0 }

      row.quantity += l.quantity
      row.value += l.value
      items.set(l.itemId, row)
    }
  }
  /** Every tour sold in the period, best first. */
  const sellers: SalesTopRow[] = [...items.entries()]
    .sort((a, b) => b[1].value - a[1].value)
    .map(([id, r]) => {
      const tour = tours?.tours.find(x => x.id === id)

      return {
        id,
        name: tour ? pickText(tour.name, language).text : id,
        sold: t(
          r.quantity === 1
            ? 'salesOverview.top.guests.one'
            : 'salesOverview.top.guests.other',
          { count: r.quantity },
        ),
        value: money(r.value),
        share: pct(r.value, valueTotal),
      }
    })

  // All time, whatever the period: the total, where it stands, the last 30 days against the
  // 30 before, and the last seven months (Overview › Sales only).
  const placedAll = sales.filter(s => !s.lost)
  const totalAll = sum(placedAll, s => s.value)
  const collectedAll = sum(payments, p => p.amount)
  const unpaidAll = sum(placedAll, s => s.outstanding)
  const valueIn = (r: DayRange) =>
    sum(
      placedAll.filter(s => s.day >= r.start && s.day <= r.end),
      s => s.value,
    )
  const last30 = valueIn({ start: addDays(today, -29), end: today })
  const before30 = valueIn({
    start: addDays(today, -59),
    end: addDays(today, -30),
  })
  const change = deltaOf(last30, before30, 'up', intlLocale)
  const firstMonth = `${(firstDay < today ? firstDay : today).slice(0, 8)}01`
  const monthStart = (back: number) => {
    const d = new Date(`${today.slice(0, 8)}01T12:00:00Z`)

    d.setUTCMonth(d.getUTCMonth() - back)

    return d.toISOString().slice(0, 10)
  }
  const monthFmt = (o: Intl.DateTimeFormatOptions, iso: string) =>
    dateTimeFormat(intlLocale, { ...o, timeZone: 'UTC' }).format(
      calendarDay(iso),
    )
  const months = Array.from({ length: 7 }, (_, i) => {
    const id = monthStart(6 - i)
    const total = sum(
      placedAll.filter(s => s.day.slice(0, 7) === id.slice(0, 7)),
      s => s.value,
    )
    const hasData = id >= firstMonth
    const label = monthFmt({ month: 'long', year: 'numeric' }, id)

    return {
      id,
      tick: monthFmt({ month: 'short' }, id),
      label,
      hasData,
      total: hasData ? total : 0,
      valueText: hasData ? money(total) : '–',
      isCurrent: i === 6,
      ariaLabel: t('salesOverview.months.open', {
        month: label,
        value: hasData ? money(total) : '–',
      }),
    }
  })
  const allTime = {
    since: monthFmt(
      { day: 'numeric', month: 'long', year: 'numeric' },
      firstDay < today ? firstDay : today,
    ),
    total: money(totalAll),
    delta: change.delta
      ? ({
          text: change.delta,
          tone: change.tone,
          direction: change.direction,
          label: t('salesOverview.allTime.delta', { delta: change.delta }),
        } satisfies DeltaView)
      : null,
    sentence: t('salesOverview.allTime.sentence', {
      last: money(last30),
      previous: money(before30),
    }),
    parts: [
      {
        id: 'collected',
        label: t('salesOverview.collected'),
        amount: collectedAll,
        value: money(collectedAll),
        colour: 'var(--chart-1)',
      },
      {
        id: 'unpaid',
        label: t('salesOverview.unpaidShort'),
        amount: Math.max(0, unpaidAll),
        value: money(unpaidAll),
        colour: 'var(--chart-1-light)',
      },
    ],
    months,
  }

  return {
    periods: SALES_PERIODS.map(id => ({
      id,
      label: t(`salesOverview.period.${id}`),
    })),
    current,
    previous,
    rangeText: rangeText(current),
    comparison: previous
      ? t('salesOverview.comparedWith', { range: rangeText(previous) })
      : t('salesOverview.noCompare'),
    kpis,
    bucketLabel: t(`salesOverview.bucket.${bucket}`),
    hasPrevious: !!previous,
    top: sellers.slice(0, 5),
    sellers,
    isEmpty: cur.placed.length === 0 && cur.paid.length === 0,
    today,
    firstDay,
    allTime,
  }
}

export type SalesOverviewView = ReturnType<typeof useSalesOverview>
