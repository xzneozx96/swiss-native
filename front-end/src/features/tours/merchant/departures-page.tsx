import type { Departure, Tour } from '../types'
import type { DeparturePhase, TourWork } from './lib/work'
import type { DataTableColumn } from '@/components/data-table'
import type { EmptyStateProps } from '@/components/empty-state'
import type { StatusTone } from '@/components/status-chip'
import type { MessageKey } from '@/i18n/en'

import { Link } from '@tanstack/react-router'

import { DataTable } from '@/components/data-table'
import { DateTile } from '@/components/date-tile'

import {
  ArrowUpRightIcon,
  BookingsIcon,
  ChevronRightIcon,
} from '@/components/icons'
import { MerchantPageHeader } from '@/components/layout/merchant-page-header'
import { Media } from '@/components/media'

import { RowActions } from '@/components/row-actions'
import { StatusChip } from '@/components/status-chip'
import { useLocale } from '@/contexts/locale-context'
import { zurichDate } from '@/features/catalog/lib/pickup'
import { useSimulatedLoading } from '@/hooks/use-simulated-loading'
import { pickText } from '@/lib/localized'
import { useTours } from '../hooks/use-tours'
import { departureSeats } from '../lib/selectors'
import { departureBookings, departurePhase, tourWork } from './lib/work'
import {
  KindChip,
  phaseChip,
  ticketSurface,
  ToneLine,
  useStartText,
  useTourFormatting,
} from './shared'
import { useOverdueCheck } from './use-overdue-check'

interface Row {
  departure: Departure
  tour?: Tour
  phase: DeparturePhase
  seats: ReturnType<typeof departureSeats>
  work: TourWork
}

/**
 * One line of the schedule: a departure, or a bee house day with its many visit starts under
 * one header (the visits start every 30 minutes, so one ticket each would bury the stays).
 */
interface Item extends Row {
  id: string
  /** Set for a bee house day: its visits, soonest first. */
  slots?: Row[]
}

function sumSeats(rows: Row[]): Row['seats'] {
  return {
    confirmed: rows.reduce((n, r) => n + r.seats.confirmed, 0),
    held: rows.reduce((n, r) => n + r.seats.held, 0),
    available: rows.reduce(
      (n, r) => n + (bookable(r.phase) ? r.seats.available : 0),
      0,
    ),
    capacity: rows.reduce((n, r) => n + r.seats.capacity, 0),
  }
}

function sumWork(rows: Row[]): TourWork {
  return {
    toRecord: rows.flatMap(r => r.work.toRecord),
    overdue: rows.flatMap(r => r.work.overdue),
    owing: rows.flatMap(r => r.work.owing),
    reconcile: rows.flatMap(r => r.work.reconcile),
    toCollect: rows.reduce((n, r) => n + r.work.toCollect, 0),
  }
}

/** Rows in order, each bee house day folded into one item where its first visit stands. */
function groupDays(rows: Row[]): Item[] {
  const items: Item[] = []
  const days = new Map<string, Item>()

  for (const row of rows) {
    if (row.tour?.kind !== 'experience') {
      items.push({ ...row, id: row.departure.id })
      continue
    }
    const key = zurichDate(new Date(row.departure.startsAt))
    const day = days.get(key)

    if (day) {
      day.slots!.push(row)
    }
    else {
      const item: Item = { ...row, id: `day-${key}`, slots: [row] }

      days.set(key, item)
      items.push(item)
    }
  }

  return items.map((item) => {
    if (!item.slots || item.slots.length < 2) {
      return item.slots
        ? { ...item.slots[0], id: item.slots[0].departure.id }
        : item
    }
    const slots = [...item.slots].sort(
      (a, b) =>
        Date.parse(a.departure.startsAt) - Date.parse(b.departure.startsAt),
    )
    const phases = slots.map(r => r.phase)

    return {
      ...item,
      departure: slots[0].departure,
      slots,
      phase: phases.includes('open')
        ? 'open'
        : phases.every(p => p === phases[0])
          ? phases[0]
          : 'closed',
      seats: sumSeats(slots),
      work: sumWork(slots),
    }
  })
}

const attention: {
  key: MessageKey
  tone: StatusTone
  count: (w: TourWork) => number
}[] = [
  {
    key: 'tourMerchant.attention.toRecord',
    tone: 'warning',
    count: w => w.toRecord.length,
  },
  {
    key: 'tourMerchant.attention.overdue',
    tone: 'danger',
    count: w => w.overdue.length,
  },
  {
    key: 'tourMerchant.attention.owing',
    tone: 'warning',
    count: w => w.owing.length,
  },
  {
    key: 'tourMerchant.attention.reconcile',
    tone: 'danger',
    count: w => w.reconcile.length,
  },
]

function Attention({ work }: { work: TourWork }) {
  const { t } = useLocale()
  const items = attention.filter(a => a.count(work) > 0)

  if (!items.length)
    return <span className="text-sm text-muted">{t('tourMerchant.none')}</span>

  return (
    <div className="flex flex-wrap gap-2">
      {items.map(a => (
        <StatusChip key={a.key} tone={a.tone}>
          {t(a.key, { count: a.count(work) })}
        </StatusChip>
      ))}
    </div>
  )
}

/** Free seats only mean something for a departure guests can still book. */
function bookable(phase: DeparturePhase) {
  return phase === 'open' || phase === 'closed'
}

/**
 * Phones: one ticket per departure, in the M03 pickup-ticket look (1.10b, 1.10c). Date tile,
 * tour and start; the tour photo, beside it the phase and what needs the merchant as coloured
 * dots and words; seats and money in the dashed footer, one fact per row. The whole ticket
 * opens M06.
 */
function DepartureCards({ rows }: { rows: Item[] }) {
  const { t, language } = useLocale()
  const { money, weekday, day, month } = useTourFormatting()
  const startText = useStartText()

  return (
    <ul className="flex flex-col gap-5 lg:hidden">
      {rows.map(({ id, departure, tour, phase, seats, work, slots }) => {
        const items = attention.filter(a => a.count(work) > 0)

        if (slots) {
          return (
            <li key={id}>
              <DayCard
                phase={phase}
                seats={seats}
                slots={slots}
                tour={tour}
                work={work}
              />
            </li>
          )
        }

        return (
          <li key={id}>
            <Link
              className={`${ticketSurface} outline-none hover:bg-surface-secondary focus-visible:focus-ring`}
              params={{ departureId: departure.id }}
              to="/store/bookings/departures/$departureId"
            >
              <div className="flex items-center gap-4 p-4">
                <DateTile
                  date={{
                    weekday: weekday(departure.startsAt),
                    day: day(departure.startsAt),
                    month: month(departure.startsAt),
                  }}
                  muted={phase === 'cancelled'}
                  // Coordinator D1: the lg tile carries M03's 30px day number.
                  size="lg"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg leading-tight font-semibold">
                    {tour && pickText(tour.name, language).text}
                  </h3>
                  <p className="mt-2 text-xs text-muted tabular-nums">
                    {startText(tour?.kind, departure.startsAt)}
                  </p>
                  <div className="mt-2">
                    <KindChip kind={tour?.kind} />
                  </div>
                </div>
                <ChevronRightIcon
                  aria-hidden
                  className="shrink-0 text-muted"
                  size={18}
                />
              </div>
              {/* The tour photo where M03 shows the product photo, same size and radius. */}
              <div className="flex items-center gap-3 p-4">
                <Media
                  alt=""
                  className="size-14 shrink-0 rounded-lg"
                  photo={tour?.photos[0]}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <ToneLine tone={phaseChip[phase].tone}>
                    {t(phaseChip[phase].key)}
                  </ToneLine>
                  {items.length
                    ? (
                        items.map(a => (
                          <ToneLine key={a.key} tone={a.tone}>
                            {t(a.key, { count: a.count(work) })}
                          </ToneLine>
                        ))
                      )
                    : (
                        <ToneLine tone="neutral">{t('tourMerchant.none')}</ToneLine>
                      )}
                </div>
              </div>
              <dl className="flex flex-col gap-2 border-t border-dashed border-separator px-4 py-3.5 text-sm">
                {[
                  [
                    t('tourMerchant.booked'),
                    t('tourMerchant.seatsOf', {
                      count: seats.confirmed,
                      capacity: seats.capacity,
                    }),
                  ],
                  [t('tourMerchant.holds'), seats.held],
                  [
                    t('tourMerchant.available'),
                    bookable(phase) ? seats.available : '—',
                  ],
                  [t('tourMerchant.toCollect'), money(work.toCollect)],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <dt className="shrink-0 text-muted">{label}</dt>
                    <dd
                      className={`text-end tabular-nums ${index === 0 ? 'font-semibold' : 'text-muted'}`}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/** The visit starts of one bee house day as links to their guest lists. */
function SlotLinks({
  slots,
  compact = false,
}: {
  slots: Row[]
  compact?: boolean
}) {
  const { t } = useLocale()
  const { time } = useTourFormatting()

  if (compact) {
    return (
      <span className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
        {slots.map(({ departure, seats }) => (
          <Link
            key={departure.id}
            aria-label={`${time(departure.startsAt)}, ${t(
              'tourMerchant.seatsBooked',
              {
                count: seats.confirmed,
                capacity: seats.capacity,
              },
            )}`}
            className={`rounded-md underline underline-offset-4 outline-none focus-visible:focus-ring ${seats.confirmed + seats.held > 0 ? 'font-semibold text-foreground' : ''}`}
            params={{ departureId: departure.id }}
            to="/store/bookings/departures/$departureId"
          >
            {time(departure.startsAt)}
          </Link>
        ))}
      </span>
    )
  }

  return (
    <ul className="flex flex-col divide-y divide-separator">
      {slots.map(({ departure, seats, phase }) => (
        <li key={departure.id}>
          <Link
            className="flex min-h-12 items-center gap-3 px-4 py-2 text-sm outline-none hover:bg-surface-secondary focus-visible:focus-ring focus-visible:ring-inset"
            params={{ departureId: departure.id }}
            to="/store/bookings/departures/$departureId"
          >
            <span className="w-14 shrink-0 font-semibold tabular-nums">
              {time(departure.startsAt)}
            </span>
            <span className="flex-1 text-muted tabular-nums">
              {t('tourMerchant.seatsBooked', {
                count: seats.confirmed,
                capacity: seats.capacity,
              })}
              {seats.held > 0
                && ` · ${t('tourMerchant.onHold', { held: seats.held })}`}
              {phase !== 'open' && ` · ${t(phaseChip[phase].key)}`}
            </span>
            <ChevronRightIcon
              aria-hidden
              className="shrink-0 text-muted"
              size={16}
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** Phones: a bee house day as one ticket, its date as the header, one line per visit. */
function DayCard({
  tour,
  phase,
  seats,
  work,
  slots,
}: Pick<Item, 'tour' | 'phase' | 'seats' | 'work'> & { slots: Row[] }) {
  const { t, language } = useLocale()
  const { money, weekday, day, month, time } = useTourFormatting()
  const first = slots[0].departure.startsAt
  const last = slots.at(-1)!.departure.startsAt
  const items = attention.filter(a => a.count(work) > 0)

  return (
    <section
      aria-label={`${tour ? pickText(tour.name, language).text : ''}, ${weekday(first)} ${day(first)} ${month(first)}`}
      className={ticketSurface}
    >
      <div className="flex items-center gap-4 p-4">
        <DateTile
          date={{
            weekday: weekday(first),
            day: day(first),
            month: month(first),
          }}
          muted={phase === 'cancelled'}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg leading-tight font-semibold">
            {tour && pickText(tour.name, language).text}
          </h3>
          <p className="mt-2 text-xs text-muted tabular-nums">
            {t('tourMerchant.visitsDay', {
              count: slots.length,
              from: time(first),
              to: time(last),
            })}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <KindChip kind={tour?.kind} />
            {items.map(a => (
              <StatusChip key={a.key} tone={a.tone}>
                {t(a.key, { count: a.count(work) })}
              </StatusChip>
            ))}
          </div>
        </div>
      </div>
      <SlotLinks slots={slots} />
      <dl className="flex flex-col gap-2 border-t border-dashed border-separator px-4 py-3.5 text-sm">
        {[
          [
            t('tourMerchant.booked'),
            t('tourMerchant.seatsOf', {
              count: seats.confirmed,
              capacity: seats.capacity,
            }),
          ],
          [t('tourMerchant.holds'), seats.held],
          [
            t('tourMerchant.available'),
            bookable(phase) ? seats.available : '—',
          ],
          [t('tourMerchant.toCollect'), money(work.toCollect)],
        ].map(([label, value], index) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-4"
          >
            <dt className="shrink-0 text-muted">{label}</dt>
            <dd
              className={`text-end tabular-nums ${index === 0 ? 'font-semibold' : 'text-muted'}`}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function DepartureTable({
  rows,
  label,
  empty,
  isLoading,
}: {
  rows: Item[]
  label: string
  isLoading?: boolean
  /** Shown inside the table (a card on phones) when `rows` is empty. */
  empty?: EmptyStateProps
}) {
  const { t, language } = useLocale()
  const { money, weekday, day, month, time } = useTourFormatting()
  const startText = useStartText()
  // Fixed shares, so the Upcoming and Ended tables line up column by column.
  const columns: DataTableColumn<Item>[] = [
    {
      id: 'departure',
      header: t('tourMerchant.departure'),
      headerClassName: 'w-[28%]',
      isRowHeader: true,
      skeleton: 'two-line',
      render: ({ departure, tour, phase, slots }) => (
        <>
          <span className="block font-semibold">
            {tour && pickText(tour.name, language).text}
          </span>
          <span className="flex flex-wrap items-center gap-2 text-label text-muted tabular-nums">
            {slots
              ? `${weekday(departure.startsAt)} ${day(departure.startsAt)} ${month(
                departure.startsAt,
              )} · ${t('tourMerchant.visitsDay', {
                count: slots.length,
                from: time(slots[0].departure.startsAt),
                to: time(slots.at(-1)!.departure.startsAt),
              })}`
              : startText(tour?.kind, departure.startsAt)}
            <KindChip kind={tour?.kind} />
            {phase !== 'open' && (
              <StatusChip tone={phaseChip[phase].tone}>
                {t(phaseChip[phase].key)}
              </StatusChip>
            )}
          </span>
          {slots && <SlotLinks compact slots={slots} />}
        </>
      ),
    },
    {
      // Booked, holds and free share one column, so the row keeps room for its chips.
      id: 'seats',
      header: t('tourMerchant.seats'),
      headerClassName: 'w-[20%]',
      cellClassName: 'tabular-nums',
      render: ({ phase, seats }) => (
        <>
          <span className="block whitespace-nowrap">
            {t('tourMerchant.seatsBooked', {
              count: seats.confirmed,
              capacity: seats.capacity,
            })}
          </span>
          <span className="block text-label whitespace-nowrap text-muted">
            {t('tourMerchant.seatsDetail', {
              held: seats.held,
              free: bookable(phase) ? seats.available : '—',
            })}
          </span>
        </>
      ),
    },
    {
      id: 'toCollect',
      header: t('tourMerchant.toCollect'),
      headerClassName: 'w-[16%]',
      cellClassName: 'whitespace-nowrap tabular-nums',
      render: ({ work }) => money(work.toCollect),
    },
    {
      id: 'attention',
      header: t('tourMerchant.needsAttention'),
      headerClassName: 'w-[28%]',
      skeleton: 'chip',
      render: ({ work }) => <Attention work={work} />,
    },
  ]

  return (
    <DataTable
      cards={page => <DepartureCards rows={page} />}
      columns={columns}
      contentClassName="table-fixed"
      empty={empty}
      getRowHref={({ departure, slots }) =>
        slots ? undefined : `#/store/bookings/departures/${departure.id}`}
      getRowId={({ id }) => id}
      isLoading={isLoading}
      label={label}
      rowActions={{
        render: ({ departure, tour, slots }) =>
          slots
            ? null
            : (
                <RowActions
                  actions={[
                    {
                      id: 'open',
                      label: t('rowAction.openDeparture'),
                      icon: ArrowUpRightIcon,
                      href: `#/store/bookings/departures/${departure.id}`,
                    },
                  ]}
                  label={t('table.rowActions', {
                    name: tour ? pickText(tour.name, language).text : departure.id,
                  })}
                />
              ),
        headerClassName: 'w-[8%]',
      }}
      rows={rows}
    />
  )
}

/**
 * M05 Departure schedule: upcoming departures soonest first, then ended ones newest first.
 * Seats come from the same selector as the guest flow (C10). Each departure opens M06.
 */
export function TourDeparturesPage() {
  const { data, departures, tours, now } = useTours()
  const { t } = useLocale()

  const isLoading = useSimulatedLoading()

  useOverdueCheck()
  const rows: Row[] = departures.map((departure) => {
    const tour = tours.find(item => item.id === departure.tourId)

    return {
      departure,
      tour,
      phase: departurePhase(departure, tour, now),
      seats: departureSeats(data, departure.id, now),
      work: tourWork(departureBookings(data, departure.id), now),
    }
  })
  // Each start is parsed once, not on every comparison; -1 lists the latest first.
  const byStart = (list: Row[], order: 1 | -1) =>
    list
      .map(row => ({ row, start: Date.parse(row.departure.startsAt) }))
      .sort((a, b) => order * (a.start - b.start))
      .map(({ row }) => row)
  const upcoming = groupDays(
    byStart(
      rows.filter(r => r.phase !== 'ended'),
      1,
    ),
  )
  const ended = groupDays(
    byStart(
      rows.filter(r => r.phase === 'ended'),
      -1,
    ),
  )

  const noDepartures = {
    icon: BookingsIcon,
    message: t('tourMerchant.noDepartures'),
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <MerchantPageHeader
        description={t('tourMerchant.departuresIntro')}
        title={t('tourMerchant.departures')}
      />
      {rows.length === 0 && (
        <DepartureTable
          empty={noDepartures}
          isLoading={isLoading}
          label={t('tourMerchant.departures')}
          rows={[]}
        />
      )}
      {[
        { id: 'upcoming', title: t('tourMerchant.upcoming'), rows: upcoming },
        { id: 'ended', title: t('tourMerchant.ended'), rows: ended },
      ]
        .filter(group => group.rows.length > 0)
        .map(group => (
          <section
            key={group.id}
            aria-labelledby={`departures-${group.id}`}
            className="flex flex-col gap-3"
          >
            <h2 className="text-heading" id={`departures-${group.id}`}>
              {group.title}
            </h2>
            <DepartureTable
              isLoading={isLoading}
              label={group.title}
              rows={group.rows}
            />
          </section>
        ))}
    </div>
  )
}
