/**
 * USP strip ideas: the banner's three selling points (Alpine passes, Scenic roads,
 * Hidden gems), each with its line icon. Every idea renders a real list.
 */
import type { BrandCopy } from './copy'

import { useLayoutEffect, useRef, useState } from 'react'

import { PassIcon, PinesIcon, RoadIcon } from './brand-icons'
import { prefersReducedMotion, useReveal } from './use-reveal'

export const NAVY = '#1E3A5F'

type PointId = 'passes' | 'roads' | 'gems'

const POINTS: {
  id: PointId
  Icon: typeof PassIcon
  /** Home-page section the jump chips (idea 4) scroll to. */
  target: string
}[] = [
  { id: 'passes', Icon: PassIcon, target: 'tours' },
  { id: 'roads', Icon: RoadIcon, target: 'stay-key-title' },
  { id: 'gems', Icon: PinesIcon, target: 'xp-flight-title' },
]

function delay(i: number) {
  return ({ '--lab-delay': `${i * 90}ms` }) as React.CSSProperties
}

/** 1 · Faithful: icon over a letter-spaced label, three columns, hairline dividers, cream. */
export function UspFaithful({ c }: { c: BrandCopy }) {
  const ref = useReveal<HTMLUListElement>()

  return (
    <div className="-mx-4 border-y border-[#1E3A5F]/10 bg-hero-cream px-3 py-4">
      <ul
        ref={ref}
        aria-label={c.listLabel}
        className="grid grid-cols-3 divide-x divide-[#1E3A5F]/20"
        style={{ color: NAVY }}
      >
        {POINTS.map(({ id, Icon }, i) => (
          <li
            key={id}
            className="lab-reveal flex flex-col items-center gap-2 px-1.5 text-center"
            style={delay(i)}
          >
            <Icon size={40} />
            <span className="text-[11px] leading-[14px] font-semibold tracking-[0.1em] uppercase [hyphens:manual]">
              {c.points[id].label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** 2 · Pill cards in a scroll-snap row: icon, label and one descriptive line each. */
export function UspPills({ c }: { c: BrandCopy }) {
  const ref = useReveal<HTMLUListElement>()

  return (
    <div className="-mx-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ul
        ref={ref}
        aria-label={c.listLabel}
        className="flex w-max snap-x snap-mandatory scroll-px-4 gap-2.5 px-4 py-1"
      >
        {POINTS.map(({ id, Icon }, i) => (
          <li
            key={id}
            className="lab-reveal flex w-[268px] shrink-0 snap-start items-center gap-3 rounded-full border border-[#1E3A5F]/12 bg-hero-cream py-2.5 ps-2.5 pe-5"
            style={delay(i)}
          >
            <span
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white"
              style={{ color: NAVY }}
            >
              <Icon size={34} />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span
                className="text-[11px] leading-[14px] font-semibold tracking-[0.1em] uppercase"
                style={{ color: NAVY }}
              >
                {c.points[id].label}
              </span>
              <span className="text-[13px] leading-[17px] text-foreground/80">
                {c.points[id].line}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * 3 · Ticker: one very low line of the three words with tiny icons and dots. On the home
 * page it slides up under the search box, so the box sits on the hero's cream foot.
 * It never wraps: when the line with icons is wider than the screen (German at 360px),
 * the icons drop out and only the words and dots stay.
 */
export function UspTicker({
  c,
  heroEdge = false,
}: {
  c: BrandCopy
  heroEdge?: boolean
}) {
  const ref = useReveal<HTMLUListElement>()
  const boxRef = useRef<HTMLDivElement>(null)
  const [bare, setBare] = useState(false)

  useLayoutEffect(() => {
    const box = boxRef.current
    const list = ref.current

    if (!box || !list)
      return
    const fit = () => {
      const iconsWidth = list.querySelectorAll('svg').length ? 0 : 3 * 22

      setBare(list.scrollWidth + iconsWidth > box.clientWidth)
    }
    const ro = new ResizeObserver(fit)

    ro.observe(box)

    return () => ro.disconnect()
  }, [ref, c, bare])

  return (
    <div
      ref={boxRef}
      className={`-mx-4 overflow-x-auto bg-hero-cream [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
        heroEdge ? '-mt-[65px] pt-[38px] pb-2' : 'py-2'
      }`}
    >
      <ul
        ref={ref}
        aria-label={c.listLabel}
        className="lab-reveal mx-auto flex w-max items-center gap-2 px-3"
        style={{ color: NAVY }}
      >
        {POINTS.map(({ id, Icon }, i) => (
          <li key={id} className="flex items-center gap-1.5">
            {i > 0 && (
              <span
                aria-hidden="true"
                className="size-[3px] rounded-full bg-[#D52B1E]"
              />
            )}
            {!bare && <Icon size={16} strokeWidth={1.6} />}
            <span className="text-[12px] leading-4 font-semibold whitespace-nowrap [hyphens:none]">
              {c.points[id].label.replace('\u00AD', '')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * 4 · Jump chips: the three points as buttons that scroll to the home-page section that
 * answers them (passes → Tours, roads → Stay, with its drive times to each pass,
 * hidden gems → the bee-house experience) and move focus to its heading.
 */
export function UspJump({ c }: { c: BrandCopy }) {
  const ref = useReveal<HTMLUListElement>()
  const reduced = prefersReducedMotion()

  const jump = (id: string) => {
    const heading = document.getElementById(id)

    if (!heading)
      return;
    (heading.closest('section') ?? heading).scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    })
    heading.setAttribute('tabindex', '-1')
    heading.focus({ preventScroll: true })
  }

  return (
    <ul ref={ref} aria-label={c.listLabel} className="grid grid-cols-3 gap-2">
      {POINTS.map(({ id, Icon, target }, i) => (
        <li key={id} className="lab-reveal flex" style={delay(i)}>
          <button
            aria-label={`${c.points[id].label.replace('\u00AD', '')}: ${c.jumpHint} ${c.jump[id]}`}
            className="flex min-h-11 w-full flex-col items-center gap-1.5 rounded-2xl border border-[#1E3A5F]/15 bg-hero-cream px-1.5 pt-3 pb-2.5 text-center outline-none focus-visible:focus-ring active:scale-[0.97] motion-safe:transition-transform"
            type="button"
            onClick={() => jump(target)}
          >
            <span style={{ color: NAVY }}>
              <Icon size={32} />
            </span>
            <span
              className="text-[11px] leading-[14px] font-semibold tracking-[0.08em] uppercase"
              style={{ color: NAVY }}
            >
              {c.points[id].label}
            </span>
            <span className="mt-auto flex items-center gap-0.5 text-[12px] leading-4 text-foreground/75">
              {c.jump[id]}
              <svg
                aria-hidden="true"
                fill="none"
                height="12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 12 12"
                width="12"
              >
                <path d="M6 2v8M2.5 6.5 6 10l3.5-3.5" />
              </svg>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/**
 * 5 · Road line: a winding road with a dashed centre line runs across the screen and
 * links the three points like stops on a ride.
 */
export function UspRoad({ c }: { c: BrandCopy }) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <div ref={ref} className="relative -mx-4 px-4 pt-1">
      <svg
        aria-hidden="true"
        className="lab-reveal absolute inset-x-0 top-1 h-[60px] w-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 300 60"
      >
        <path
          d="M-10 44C25 44 30 30 50 30S90 12 120 16 135 44 150 30s40-22 70-14 25 14 30 14S285 44 310 30"
          stroke="#EADFC6"
          strokeLinecap="round"
          strokeWidth="12"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M-10 44C25 44 30 30 50 30S90 12 120 16 135 44 150 30s40-22 70-14 25 14 30 14S285 44 310 30"
          pathLength={1}
          stroke={NAVY}
          strokeDasharray="0.012 0.014"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <ul
        aria-label={c.listLabel}
        className="relative grid grid-cols-3"
        style={{ color: NAVY }}
      >
        {POINTS.map(({ id, Icon }, i) => (
          <li
            key={id}
            className="lab-reveal flex flex-col items-center gap-2 text-center"
            style={delay(i + 1)}
          >
            <span className="flex size-[60px] items-center justify-center rounded-full border border-[#1E3A5F]/15 bg-white shadow-surface">
              <Icon size={36} />
            </span>
            <span className="px-1 text-[11px] leading-[14px] font-semibold tracking-[0.1em] uppercase">
              {c.points[id].label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
