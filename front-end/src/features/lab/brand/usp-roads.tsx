/**
 * USP strip ideas 6-11, round 2: variations on the chosen road line (idea 5). Same DNA:
 * a cream road band with a dashed navy centre line linking the three points (Alpine
 * passes, Scenic roads, Hidden gems), white stops with the navy line icons, small
 * letter-spaced labels. Red is used only for small dots, never for a line, so nothing
 * echoes the red flight line of the dark-green Experience block further down.
 * Paths that must meet the stops exactly are built in pixels from the measured width.
 */
import type { BrandCopy } from './copy'
import type { Round2Copy } from './round2-copy'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { PassIcon, PinesIcon, RoadIcon } from './brand-icons'
import { useReducedMotion, useReveal } from './use-reveal'

const RIDGE_END = /L\d+(?:\.\d+)? \d+Z$/

const NAVY = '#1E3A5F'
const ROAD = '#EADFC6'
const RED = '#D52B1E'

const POINTS = [
  { id: 'passes', Icon: PassIcon },
  { id: 'roads', Icon: RoadIcon },
  { id: 'gems', Icon: PinesIcon },
] as const

interface Props {
  c: BrandCopy
  r: Round2Copy
}

const plain = (label: string) => label.replace('\u00AD', '')

function delay(ms: number) {
  return ({ '--lab-delay': `${ms}ms` }) as React.CSSProperties
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current

    if (!el)
      return
    setWidth(el.clientWidth)
    const ro = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    )

    ro.observe(el)

    return () => ro.disconnect()
  }, [])

  return [ref, width] as const
}

type Pt = [number, number]

/** A road through the points; each stretch bows by its offset (+ down, - up). */
function bowed(points: Pt[], offsets: number[]) {
  let d = `M${points[0][0]} ${points[0][1]}`

  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1]
    const [bx, by] = points[i]
    const half = (bx - ax) / 2
    const k = offsets[i - 1] ?? 0

    d += `C${ax + half} ${ay + k} ${bx - half} ${by + k} ${bx} ${by}`
  }

  return d
}

/**
 * A smooth road through the points: each stretch bows to one side and the next to the
 * other, so the curve stays smooth through every stop.
 */
function roadThrough(points: Pt[], bow: number, firstSide = -1) {
  return bowed(
    points,
    points.map((_, i) => bow * (i % 2 ? -firstSide : firstSide)),
  )
}

/** The road band with its dashed centre line. */
function Road({
  d,
  width = 12,
  className = '',
}: {
  d: string
  width?: number
  className?: string
}) {
  return (
    <g className={className} fill="none" strokeLinecap="round">
      <path d={d} stroke={ROAD} strokeWidth={width} />
      <path d={d} stroke={NAVY} strokeDasharray="5 6" strokeWidth="1.5" />
    </g>
  )
}

function Stop({
  Icon,
  size = 56,
  icon = 34,
}: {
  Icon: (typeof POINTS)[number]['Icon']
  size?: number
  icon?: number
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full border border-[#1E3A5F]/15 bg-white shadow-surface"
      style={{ width: size, height: size, color: NAVY }}
    >
      <Icon size={icon} />
    </span>
  )
}

const LABEL
  = 'text-[11px] leading-[14px] font-semibold tracking-[0.1em] uppercase'

/* -------------------------------------------------------------------------- */

/**
 * 6 · Vertical road: the road runs down the left like a route, each point a stop beside
 * it with one line of text. Its end fades out pointing at the Tours heading below.
 */
export function UspRoadVertical({ c }: Props) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <div ref={ref} className="relative">
      <svg
        aria-hidden="true"
        className="lab-reveal absolute start-0 -top-2 h-[calc(100%+38px)] w-16 [mask-image:linear-gradient(to_bottom,black_78%,transparent)]"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 64 300"
      >
        <path
          d="M32-10C58 25 6 55 32 95S58 165 32 200 6 265 32 310"
          stroke={ROAD}
          strokeLinecap="round"
          strokeWidth="12"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M32-10C58 25 6 55 32 95S58 165 32 200 6 265 32 310"
          stroke={NAVY}
          strokeDasharray="5 6"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <ul aria-label={c.listLabel} className="relative flex flex-col gap-7">
        {POINTS.map(({ id, Icon }, i) => (
          <li
            key={id}
            className="lab-reveal flex items-center gap-3"
            style={delay(i * 110)}
          >
            <span className="flex w-16 shrink-0 justify-center">
              <Stop Icon={Icon} icon={30} size={50} />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className={LABEL} style={{ color: NAVY }}>
                {c.points[id].label}
              </span>
              <span className="text-[13px] leading-[18px] text-foreground/80">
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
 * 7 · The ride: on first view the road draws itself from left to right while a small red
 * dot rides along its leading edge, passing under each stop as it lights up. It runs
 * once. Under reduced motion the road is drawn and the dot waits at the end.
 */
export function UspRoadRide({ c }: Props) {
  const ref = useReveal<HTMLDivElement>()
  const [box, w] = useWidth<HTMLDivElement>()
  const reduced = useReducedMotion()
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const motionRef = useRef<SVGAnimateMotionElement>(null)
  const y = 34
  const d = w
    ? roadThrough(
        [
          [-12, y + 8],
          [w / 6, y],
          [w / 2, y],
          [(5 * w) / 6, y],
          [w + 12, y + 8],
        ],
        18,
      )
    : ''

  useEffect(() => {
    const root = ref.current
    const dot = dotRef.current
    const path = pathRef.current

    if (!root || !dot || !path || !d)
      return
    if (reduced) {
      const end = path.getPointAtLength(path.getTotalLength() * 0.9)

      dot.setAttribute('cx', String(end.x))
      dot.setAttribute('cy', String(end.y))
      dot.setAttribute('opacity', '1')

      return
    }
    const ride = () => {
      dot.setAttribute('opacity', '1')
      motionRef.current?.beginElement()
    }

    if (root.hasAttribute('data-shown')) {
      ride()

      return
    }
    const mo = new MutationObserver(() => {
      if (!root.hasAttribute('data-shown'))
        return
      mo.disconnect()
      ride()
    })

    mo.observe(root, { attributes: true })

    return () => mo.disconnect()
  }, [ref, d, reduced])

  return (
    <div ref={ref} className="relative -mx-4">
      <div ref={box} className="absolute inset-x-0 top-0 h-[68px]">
        {w > 0 && (
          <svg
            aria-hidden="true"
            className="absolute inset-0"
            fill="none"
            height="68"
            viewBox={`0 0 ${w} 68`}
            width={w}
          >
            <path
              ref={pathRef}
              className="lab-draw"
              d={d}
              pathLength={1}
              stroke={ROAD}
              strokeLinecap="round"
              strokeWidth="12"
            />
            <path
              className="lab-late"
              d={d}
              stroke={NAVY}
              strokeDasharray="5 6"
              strokeWidth="1.5"
              style={delay(1700)}
            />
            <circle
              ref={dotRef}
              fill={RED}
              opacity="0"
              r="6"
              stroke="white"
              strokeWidth="2"
            >
              {!reduced && (
                <animateMotion
                  ref={motionRef}
                  begin="indefinite"
                  calcMode="spline"
                  dur="2.4s"
                  fill="freeze"
                  keyPoints="0;0.9"
                  keySplines="0.25 0.7 0.3 1"
                  keyTimes="0;1"
                  path={d}
                />
              )}
            </circle>
          </svg>
        )}
      </div>
      <ul
        aria-label={c.listLabel}
        className="relative grid grid-cols-3 px-4 pt-1"
        style={{ color: NAVY }}
      >
        {POINTS.map(({ id, Icon }, i) => (
          <li
            key={id}
            className="lab-reveal flex flex-col items-center gap-2 text-center"
            style={delay([150, 650, 1350][i])}
          >
            <Stop Icon={Icon} icon={36} size={60} />
            <span className={`px-1 ${LABEL}`}>{c.points[id].label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * 8 · Switchbacks: the road climbs in hairpins, and each point is a small enamel sign
 * set inside a bend, like the signs at a pass, with a red dot at the apex.
 */
export function UspRoadHairpin({ c }: Props) {
  const ref = useReveal<HTMLDivElement>()
  const [box, w] = useWidth<HTMLDivElement>()
  const R = 25
  const y0 = 18
  const m = 10
  const xr = w - m - R
  const xl = m + R
  const d = w
    ? `M-12 ${y0}H${xr}A${R} ${R} 0 0 1 ${xr} ${y0 + 2 * R}H${xl}A${R} ${R} 0 0 0 ${xl} ${y0 + 4 * R}H${xr}A${R} ${R} 0 0 1 ${xr} ${y0 + 6 * R}H-12`
    : ''
  const height = y0 + 6 * R + 18
  const apex: Pt[] = [
    [xr + R, y0 + R],
    [xl - R, y0 + 3 * R],
    [xr + R, y0 + 5 * R],
  ]

  return (
    <div ref={ref} className="relative -mx-4" style={{ height }}>
      <div ref={box} className="absolute inset-0">
        {w > 0 && (
          <svg
            aria-hidden="true"
            className="lab-reveal absolute inset-0"
            height={height}
            viewBox={`0 0 ${w} ${height}`}
            width={w}
          >
            <Road d={d} width={13} />
            {apex.map(([x, yy]) => (
              <circle
                key={`${x}-${yy}`}
                cx={x}
                cy={yy}
                fill={RED}
                r="4.5"
                stroke="white"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        )}
      </div>
      <ul aria-label={c.listLabel}>
        {POINTS.map(({ id, Icon }, i) => (
          <li
            key={id}
            className="lab-reveal absolute flex h-[30px] items-center gap-1.5 rounded-[6px] border-[1.5px] border-[#1E3A5F] bg-white ps-1.5 pe-2.5 shadow-surface"
            style={{
              top: y0 + (2 * i + 1) * R - 15,
              ...(i === 1 ? { left: m + 16 } : { right: m + 16 }),
              color: NAVY,
              ...delay(i * 120),
            }}
          >
            <Icon size={20} strokeWidth={1.6} />
            <span className={`${LABEL} whitespace-nowrap`}>
              {plain(c.points[id].label)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * 9 · Over the ridge: a thin mountain ridge across the screen; the road climbs to a
 * saddle at each point, like crossing a pass, with a red dot on top. Icons and labels
 * stand below.
 */
export function UspRoadRidge({ c }: Props) {
  const ref = useReveal<HTMLDivElement>()
  const [box, w] = useWidth<HTMLDivElement>()
  const h = 92
  const xs = [w / 6, w / 2, (5 * w) / 6]
  const saddle = [44, 38, 46]
  const ridge = w
    ? `M0 ${h}L0 52L${w * 0.06} 44L${w * 0.1} 48L${xs[0]} ${saddle[0]}L${w * 0.26} 26L${w * 0.3} 30L${w * 0.35} 12L${w * 0.39} 20L${w * 0.43} 24L${xs[1]} ${saddle[1]}L${w * 0.57} 22L${w * 0.62} 28L${w * 0.67} 10L${w * 0.72} 18L${xs[2]} ${saddle[2]}L${w * 0.9} 30L${w * 0.95} 36L${w} 28L${w} ${h}Z`
    : ''
  const road = w
    ? bowed(
        [
          [-12, h - 4],
          [xs[0], saddle[0] + 7],
          [xs[1], saddle[1] + 7],
          [xs[2], saddle[2] + 7],
          [w + 12, h - 4],
        ],
        // Rise to the first saddle, dip into each valley between, then fall away.
        [0, 34, 34, 0],
      )
    : ''

  return (
    <div ref={ref} className="relative -mx-4 flex flex-col">
      <div ref={box} className="relative" style={{ height: h }}>
        {w > 0 && (
          <svg
            aria-hidden="true"
            className="lab-reveal absolute inset-0"
            height={h}
            viewBox={`0 0 ${w} ${h}`}
            width={w}
          >
            <defs>
              <linearGradient id="lab-ridge" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={NAVY} stopOpacity="0.14" />
                <stop offset="1" stopColor={NAVY} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path d={ridge} fill="url(#lab-ridge)" />
            <path
              d={ridge.replace(RIDGE_END, '')}
              fill="none"
              stroke={NAVY}
              strokeLinejoin="round"
              strokeOpacity="0.45"
              strokeWidth="1.25"
            />
            <Road d={road} width={8} />
            {xs.map((x, i) => (
              <circle
                key={i}
                cx={x}
                cy={saddle[i] + 7}
                fill={RED}
                r="4.5"
                stroke="white"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        )}
      </div>
      <ul
        aria-label={c.listLabel}
        className="grid grid-cols-3 px-4 pt-2"
        style={{ color: NAVY }}
      >
        {POINTS.map(({ id, Icon }, i) => (
          <li
            key={id}
            className="lab-reveal flex flex-col items-center gap-1.5 text-center"
            style={delay(i * 110)}
          >
            <Icon size={30} />
            <span className={`px-1 ${LABEL}`}>{c.points[id].label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * 10 · Signpost: the three points as yellow Swiss trail signs on one post, pointing down
 * the road that winds away beneath them. The tips carry the white-red-white band of
 * the mountain-trail signs.
 */
export function UspRoadSignpost({ c }: Props) {
  const ref = useReveal<HTMLDivElement>()
  const [box, w] = useWidth<HTMLDivElement>()
  const road = w
    ? roadThrough(
        [
          [-12, 30],
          [w * 0.35, 24],
          [w * 0.7, 26],
          [w + 12, 18],
        ],
        12,
      )
    : ''

  return (
    <div ref={ref} className="relative -mx-4">
      <div className="relative flex px-4">
        {/* The post, standing at the roadside. */}
        <span
          aria-hidden="true"
          className="absolute start-[38px] top-0 -bottom-5 w-[7px] rounded-t-sm bg-gradient-to-r from-[#8D8C87] to-[#6F6E6A]"
        />
        <ul
          aria-label={c.listLabel}
          className="relative ms-[30px] flex flex-col gap-1.5"
        >
          {POINTS.map(({ id, Icon }, i) => (
            <li
              key={id}
              className="lab-reveal relative flex h-9 w-[248px] items-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]"
              style={delay(i * 120)}
            >
              <span
                className="flex size-full items-center gap-2 bg-[#F5C400] ps-3 text-[#1F1E1C]"
                style={{
                  clipPath:
                    'polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)',
                }}
              >
                <Icon size={20} strokeWidth={1.7} />
                <span className="text-[11px] leading-[14px] font-bold tracking-[0.08em] whitespace-nowrap uppercase">
                  {plain(c.points[id].label)}
                </span>
                <span
                  aria-hidden="true"
                  className="ms-auto flex h-full w-[38px] flex-col justify-center bg-white"
                >
                  <span className="h-[9px] w-full bg-[#D52B1E]" />
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div ref={box} className="relative mt-1 h-12">
        {w > 0 && (
          <svg
            aria-hidden="true"
            className="lab-reveal absolute inset-0"
            height="48"
            viewBox={`0 0 ${w} 48`}
            width={w}
          >
            <Road d={road} />
          </svg>
        )}
      </div>
    </div>
  )
}

/** Closed wobbly rings around a hill, smoothed through midpoints. */
function contour(cx: number, cy: number, r: number, seed: number) {
  const pts: Pt[] = Array.from({ length: 18 }, (_, k) => {
    const a = (k / 18) * Math.PI * 2
    const rr
      = r * (1 + 0.14 * Math.sin(3 * a + seed) + 0.07 * Math.sin(5 * a + seed))

    return [cx + rr * Math.cos(a) * 1.35, cy + rr * Math.sin(a)]
  })
  const mid = (p: Pt, q: Pt) => `${(p[0] + q[0]) / 2} ${(p[1] + q[1]) / 2}`
  let d = `M${mid(pts[17], pts[0])}`

  pts.forEach((p, k) => {
    d += `Q${p[0]} ${p[1]} ${mid(p, pts[(k + 1) % 18])}`
  })

  return `${d}Z`
}

/**
 * 11 · Map piece: a scrap of topographic map, contour lines and the dashed route through
 * three stops. The five pass names this app rides sit under the first label as small
 * supporting text.
 */
export function UspRoadTopo({ c, r }: Props) {
  const ref = useReveal<HTMLDivElement>()
  const [box, w] = useWidth<HTMLDivElement>()
  const mapH = 128
  const stops: Pt[] = [
    [w / 6, 52],
    [w / 2, 82],
    [(5 * w) / 6, 50],
  ]
  const route = w
    ? roadThrough([[-12, 96], ...stops, [w + 12, 92]], 22, 1)
    : ''

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-[#1E3A5F]/12 bg-[#F7F2E4]"
    >
      <div ref={box} className="relative" style={{ height: mapH }}>
        {w > 0 && (
          <svg
            aria-hidden="true"
            className="absolute inset-0"
            height={mapH}
            viewBox={`0 0 ${w} ${mapH}`}
            width={w}
          >
            <g fill="none" stroke="#9C7A4E">
              {[0, 1, 2, 3, 4].map(i => (
                <path
                  key={`a${i}`}
                  d={contour(w * 0.78, 18, 14 + i * 15, 1.3 + i * 0.4)}
                  strokeOpacity={i === 2 ? 0.45 : 0.28}
                  strokeWidth={i === 2 ? 1.2 : 0.8}
                />
              ))}
              {[0, 1, 2, 3].map(i => (
                <path
                  key={`b${i}`}
                  d={contour(w * 0.22, mapH + 6, 18 + i * 16, 4 + i * 0.5)}
                  strokeOpacity={i === 2 ? 0.45 : 0.28}
                  strokeWidth={i === 2 ? 1.2 : 0.8}
                />
              ))}
            </g>
            <path
              d={route}
              fill="none"
              stroke={NAVY}
              strokeDasharray="6 5"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <g
              fill={NAVY}
              fontFamily="Inter, sans-serif"
              fontSize="9"
              fontWeight="700"
              transform={`translate(${w / 2 - 5} 10)`}
            >
              <path d="M0 14 5 0l5 14-5-3.5z" />
              <text textAnchor="middle" x="5" y="26">
                N
              </text>
            </g>
          </svg>
        )}
        {w > 0
          && POINTS.map(({ id, Icon }, i) => (
            <span
              key={id}
              aria-hidden="true"
              className="lab-reveal absolute -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[#D52B1E] ring-offset-2 ring-offset-[#F7F2E4]"
              style={{
                left: stops[i][0],
                top: stops[i][1],
                ...delay(i * 120),
              }}
            >
              <Stop Icon={Icon} icon={26} size={42} />
            </span>
          ))}
      </div>
      <ul
        aria-label={c.listLabel}
        className="grid grid-cols-3 gap-1 px-2 pt-1 pb-4 text-center"
        style={{ color: NAVY }}
      >
        {POINTS.map(({ id }) => (
          <li key={id} className="flex flex-col items-center gap-1">
            <span className={LABEL}>{c.points[id].label}</span>
            {id === 'passes' && (
              <span className="text-[11px] leading-[14px] text-foreground/75">
                {r.passNames}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
