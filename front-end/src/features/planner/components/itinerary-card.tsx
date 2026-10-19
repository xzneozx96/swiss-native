import type { CSSProperties } from 'react'
import type { Plan } from '../lib/plan'

import { Chip } from '@heroui/react'
import clsx from 'clsx'

import { useLocale } from '@/contexts/locale-context'

import { ui } from '../lib/copy'

const COLS = 'grid grid-cols-[3.25rem_1rem_minmax(0,1fr)] gap-x-3'
function rise(n: number) {
  return ({ '--d': `${Math.min(n, 10) * 55}ms` }) as CSSProperties
}

/** The itinerary the build_itinerary tool returned, as a timeline: day, rail, what the day holds. */
export function ItineraryCard({ plan }: { plan: Plan }) {
  const { language } = useLocale()
  const t = ui[language]
  const isNew = (name: string) => plan.added.includes(name)

  return (
    <article className="animate-rise w-full overflow-hidden rounded-3xl bg-surface shadow-surface">
      <header className="flex flex-col gap-1 px-5 pt-4 pb-3">
        <h3 className="font-serif text-title">{plan.title}</h3>
        <p className="text-sm text-muted">
          {plan.stay === 'base'
            ? language === 'de'
              ? 'Jede Nacht in Andermatt'
              : 'Every night in Andermatt'
            : 'Andermatt · Innertkirchen · Airolo'}
        </p>
      </header>

      <ol className="px-5 pb-4">
        {plan.items.map((item, n) => (
          <li
            key={item.id}
            className={clsx(COLS, 'animate-rise')}
            style={rise(n)}
          >
            <span className="pt-px text-sm font-semibold tabular-nums">
              {item.label}
            </span>
            <div className="relative flex flex-col items-center">
              <span
                aria-hidden
                className="mt-1.5 size-3 shrink-0 rounded-full bg-accent ring-4 ring-surface"
              />
              {n !== plan.items.length - 1 && (
                <span aria-hidden className="w-px flex-1 bg-separator" />
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1 pb-4">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h4 className="font-serif text-body leading-snug font-semibold">
                  {item.name}
                </h4>
                {isNew(item.name) && (
                  <Chip color="success" size="sm" variant="soft">
                    <Chip.Label>{t.isNew}</Chip.Label>
                  </Chip>
                )}
                {item.tag && (
                  <Chip size="sm" variant="secondary">
                    <Chip.Label>{item.tag}</Chip.Label>
                  </Chip>
                )}
              </div>
              <p className="text-sm leading-snug text-muted">{item.text}</p>
              {item.ride && (
                <p className="text-xs leading-4 font-medium">{item.ride}</p>
              )}
              {item.stops && (
                <ol className="mt-1 flex flex-col gap-1.5 border-s border-separator ps-3">
                  {item.stops.map(stop => (
                    <li key={stop.name} className="flex flex-col text-sm">
                      <span className="font-medium">{stop.name}</span>
                      <span className="text-xs leading-4 text-muted">
                        {stop.text}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
              {item.night && (
                <p className="text-xs text-muted">
                  {t.night}: {item.night}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <footer className="flex flex-col gap-3 border-t border-separator bg-surface-secondary/50 px-5 py-4 text-sm">
        {plan.removed.length > 0 && (
          <p>
            <span className="font-medium">{t.removed}</span>
            {' '}
            <span className="text-muted line-through">
              {plan.removed.join(', ')}
            </span>
          </p>
        )}
        <div>
          <p className="font-medium">{t.goodToKnow}</p>
          <ul className="list-disc ps-5 text-muted">
            {plan.notes.map(n => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </footer>
    </article>
  )
}
