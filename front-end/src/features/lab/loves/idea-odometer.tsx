import type { IdeaProps } from './parts'

import { useReveal } from '@/hooks/use-reveal'

import { LovesHeading } from './parts'

const DIGITS = 4
// Two runs of 0 to 9, so every digit turns a full round before it settles.
const REEL = Array.from({ length: 20 }, (_, i) => i % 10)

function Reading({ value, row }: { value: number, row: number }) {
  const digits = String(value).padStart(DIGITS, '0').split('').map(Number)
  const lead = DIGITS - String(value).length

  return (
    <span aria-hidden className="flex gap-1">
      {digits.map((d, col) => (
        <span
          key={col}
          className={`lv-cell relative h-[1.2em] w-[0.86em] overflow-hidden rounded-lg text-center ${
            col < lead ? 'text-foreground/22' : ''
          }`}
        >
          <span
            className="lv-reel flex flex-col"
            style={
              {
                '--to': 10 + d,
                '--d': `${300 + row * 260 + col * 110}ms`,
              } as React.CSSProperties
            }
          >
            {REEL.map((n, k) => (
              <span key={k} className="h-[1.2em] leading-[1.2em]">
                {n}
              </span>
            ))}
          </span>
          {col === DIGITS - 1 && (
            <span className="absolute inset-x-1.5 bottom-0.5 h-0.5 rounded-full bg-[#E3352A]" />
          )}
        </span>
      ))}
    </span>
  )
}

/**
 * E. Odometer: a light instrument card with three readings, one per love. The digit reels
 * roll up to their reading when first seen, row after row; leading zeros stay dim.
 */
export function IdeaOdometer({ c }: IdeaProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      aria-labelledby="loves-odometer"
      className="flex flex-col gap-4"
    >
      <LovesHeading c={c} id="loves-odometer" />
      <ul className="flex flex-col divide-y divide-separator rounded-[28px] border border-separator bg-surface px-5">
        {c.loves.map((love, i) => {
          const o = c.odometer[i]

          return (
            <li key={love.id} className="flex flex-col gap-2 py-5">
              <div className="flex items-end justify-between gap-3">
                <h3 className="-rotate-2 font-script text-[32px] leading-8 text-[#E3352A]">
                  {love.word}
                </h3>
                <p className="flex items-end gap-1.5">
                  <span className="sr-only">
                    {o.value} {o.unit}
                  </span>
                  <span className="text-[38px] font-semibold tracking-tight tabular-nums">
                    <Reading row={i} value={o.value} />
                  </span>
                  <span
                    aria-hidden
                    className="pb-1.5 text-[13px] font-semibold tracking-[0.1em] text-muted uppercase"
                  >
                    {o.unit}
                  </span>
                </p>
              </div>
              <p className="font-serif text-[15px] leading-[21px] text-foreground/85">
                {o.caption}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
