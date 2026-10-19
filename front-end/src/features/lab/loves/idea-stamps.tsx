import type { IdeaProps } from './parts'

import { useId } from 'react'

import { useReveal } from '@/hooks/use-reveal'

import { LovesHeading } from './parts'

const COLONS = /:/g

const INKS = ['#c9302a', '#253f78', '#2e6a46']
const TILTS = [-9, 6, -4]

function Ink({ id }: { id: string }) {
  // Warps the edges a little, then punches small holes where the ink did not take.
  return (
    <filter height="130%" id={id} width="130%" x="-15%" y="-15%">
      <feTurbulence
        baseFrequency="0.05"
        numOctaves="2"
        result="warp"
        seed="7"
        type="fractalNoise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="warp"
        result="rough"
        scale="3.5"
      />
      <feTurbulence
        baseFrequency="1.1"
        numOctaves="1"
        result="grain"
        seed="3"
        type="fractalNoise"
      />
      <feColorMatrix
        in="grain"
        result="holes"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 6.1"
      />
      <feComposite in="rough" in2="holes" operator="in" />
    </filter>
  )
}

function Stamp({
  shape,
  ink,
  word,
  top,
  detail,
  label,
}: {
  shape: 0 | 1 | 2
  ink: string
  word: string
  top: string
  detail: string
  label: string
}) {
  const uid = useId().replace(COLONS, '')
  // Long words (Homeland) shrink so they stay inside the frame.
  const fit = (size: number, room: number) =>
    Math.min(size, room / (word.length * 0.72))
  const f = `ink-${uid}`
  const text = {
    fill: ink,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    letterSpacing: '0.14em',
  } as const

  return (
    <svg
      aria-label={label}
      className="h-auto w-[136px] shrink-0"
      role="img"
      viewBox="0 0 140 140"
    >
      <defs>
        <Ink id={f} />
        <path d="M22 70 A48 48 0 0 1 118 70" id={`top-${uid}`} />
        <path d="M18 70 A52 52 0 0 0 122 70" id={`bot-${uid}`} />
      </defs>
      <g fill="none" filter={`url(#${f})`} opacity="0.88" stroke={ink}>
        {shape === 0 && (
          <>
            <circle cx="70" cy="70" r="64" strokeWidth="3.5" />
            <circle cx="70" cy="70" r="40" strokeWidth="1.5" />
            <text fontSize="11" stroke="none" style={text}>
              <textPath
                href={`#top-${uid}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {top.toUpperCase()}
              </textPath>
            </text>
            <text fontSize="11" stroke="none" style={text}>
              <textPath
                href={`#bot-${uid}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {`★ ${detail.toUpperCase()} ★`}
              </textPath>
            </text>
            <text
              fontSize={fit(15, 70)}
              stroke="none"
              style={{ ...text, letterSpacing: '0.04em' }}
              textAnchor="middle"
              x="70"
              y="75"
            >
              {word.toUpperCase()}
            </text>
          </>
        )}
        {shape === 1 && (
          <>
            <ellipse cx="70" cy="70" rx="66" ry="46" strokeWidth="3.5" />
            <ellipse cx="70" cy="70" rx="58" ry="38" strokeWidth="1.2" />
            <text
              fontSize="10"
              stroke="none"
              style={text}
              textAnchor="middle"
              x="70"
              y="52"
            >
              {top.toUpperCase()}
            </text>
            <line strokeWidth="1.2" x1="28" x2="112" y1="58" y2="58" />
            <text
              fontSize={fit(21, 96)}
              stroke="none"
              style={{ ...text, letterSpacing: '0.02em' }}
              textAnchor="middle"
              x="70"
              y="80"
            >
              {word.toUpperCase()}
            </text>
            <line strokeWidth="1.2" x1="28" x2="112" y1="87" y2="87" />
            <text
              fontSize="10"
              stroke="none"
              style={text}
              textAnchor="middle"
              x="70"
              y="99"
            >
              {detail.toUpperCase()}
            </text>
          </>
        )}
        {shape === 2 && (
          <>
            <rect
              height="84"
              rx="6"
              strokeWidth="3.5"
              width="128"
              x="6"
              y="28"
            />
            <rect
              height="74"
              rx="3"
              strokeWidth="1.2"
              width="118"
              x="11"
              y="33"
            />
            <text
              fontSize="10"
              stroke="none"
              style={text}
              textAnchor="middle"
              x="70"
              y="51"
            >
              {top.toUpperCase()}
            </text>
            <text
              fontSize={fit(20, 98)}
              stroke="none"
              style={{ ...text, letterSpacing: '0.02em' }}
              textAnchor="middle"
              x="70"
              y="78"
            >
              {word.toUpperCase()}
            </text>
            <text
              fontSize="8.5"
              stroke="none"
              style={text}
              textAnchor="middle"
              x="70"
              y="97"
            >
              {detail.toUpperCase()}
            </text>
          </>
        )}
      </g>
    </svg>
  )
}

/**
 * B. Passport stamps: a passport page with one stamp per love, round, oval and square,
 * in three inks. They thump down one after another when the page is first seen; Erich's
 * line sits beside each stamp.
 */
export function IdeaStamps({ c }: IdeaProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      aria-labelledby="loves-stamps"
      className="flex flex-col gap-4"
    >
      <LovesHeading c={c} id="loves-stamps" />
      <ul className="lv-passport flex flex-col gap-1 rounded-[22px] px-4 py-5">
        {c.loves.map((love, i) => {
          const s = c.stamps[i]

          return (
            <li
              key={love.id}
              className={`flex items-center gap-3 ${i === 1 ? 'flex-row-reverse text-right' : ''}`}
            >
              <div
                className="lv-stamp"
                style={
                  {
                    '--tilt': `${TILTS[i]}deg`,
                    '--d': `${250 + i * 420}ms`,
                  } as React.CSSProperties
                }
              >
                <Stamp
                  detail={s.detail}
                  ink={INKS[i]}
                  label={c.stampAlt(love.word, s.top, s.detail)}
                  shape={i as 0 | 1 | 2}
                  top={s.top}
                  word={love.word}
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <h3
                  className="font-script text-[28px] leading-7"
                  style={{ color: INKS[i] }}
                >
                  {love.word}
                </h3>
                <p className="font-serif text-[15px] leading-[21px] text-foreground/85">
                  {love.line}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
