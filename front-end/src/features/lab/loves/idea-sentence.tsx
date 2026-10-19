import type { IdeaProps } from './parts'

import { useReveal } from '@/hooks/use-reveal'

import { LovesHeading } from './parts'

const LEADING_PUNCTUATION = /^[,.;:!?]/

// Each mark draws in after the one before it.
const delay = (mark: number) => `${500 + mark * 750}ms`

/** A marker sweep behind the word, an underline twice, and a loop round it. */
function Mark({ mark, small = false }: { mark: 0 | 1 | 2, small?: boolean }) {
  const common = {
    fill: 'none',
    pathLength: 1,
    vectorEffect: 'non-scaling-stroke' as const,
    className: 'lv-draw',
  }
  const style = { '--d': small ? '0ms' : delay(mark) } as React.CSSProperties

  if (mark === 0) {
    return (
      <svg
        aria-hidden
        className={
          small
            ? 'size-full'
            : 'absolute top-[0.32em] -left-[0.12em] -z-10 h-[0.72em] w-[calc(100%+0.24em)]'
        }
        preserveAspectRatio="none"
        style={style}
        viewBox="0 0 100 20"
      >
        <path
          {...common}
          d="M1 12 C 30 8, 70 14, 99 9"
          stroke="rgb(227 53 42 / 0.26)"
          strokeWidth={small ? 8 : 20}
        />
      </svg>
    )
  }

  if (mark === 1) {
    return (
      <svg
        aria-hidden
        className={
          small
            ? 'size-full'
            : 'absolute -bottom-[0.18em] -left-[0.06em] h-[0.34em] w-[calc(100%+0.12em)]'
        }
        preserveAspectRatio="none"
        style={style}
        viewBox="0 0 100 14"
      >
        <path
          {...common}
          d="M2 6 C 30 2, 62 10, 98 4"
          stroke="#E3352A"
          strokeLinecap="round"
          strokeWidth={small ? 2 : 2.6}
        />
        <path
          {...common}
          className="lv-draw lv-draw-2"
          d="M12 11 C 40 8, 70 12, 90 9"
          stroke="#E3352A"
          strokeLinecap="round"
          strokeWidth={small ? 1.5 : 1.8}
        />
      </svg>
    )
  }

  return (
    <svg
      aria-hidden
      className={
        small
          ? 'size-full'
          : 'absolute -top-[0.16em] -left-[0.3em] h-[calc(100%+0.32em)] w-[calc(100%+0.6em)]'
      }
      preserveAspectRatio="none"
      style={style}
      viewBox="0 0 100 50"
    >
      <path
        {...common}
        d="M58 5 C 88 3, 99 20, 93 33 C 84 49, 18 50, 6 33 C -2 20, 16 5, 46 4 C 62 3, 76 7, 84 13"
        stroke="#E3352A"
        strokeLinecap="round"
        strokeWidth={small ? 1.6 : 2.4}
      />
    </svg>
  )
}

/**
 * D. Marker sentence: one serif sentence that holds all three loves. When first seen,
 * its three words are marked in Swiss red one after another, as if by hand; three short
 * lines follow, each with its mark.
 */
export function IdeaSentence({ c }: IdeaProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      aria-labelledby="loves-sentence"
      className="flex flex-col gap-5"
    >
      <LovesHeading c={c} id="loves-sentence" />
      <p className="isolate font-serif text-[31px] leading-[44px] tracking-[-0.01em] text-balance">
        {c.sentence.map((part, i) => {
          const prev = c.sentence[i - 1]
          const next = c.sentence[i + 1]
          // Punctuation right after a marked word stays on its line.
          const stuck
            = typeof next === 'string' ? (LEADING_PUNCTUATION.exec(next)?.[0] ?? '') : ''

          if (typeof part === 'string') {
            return typeof prev === 'object' && LEADING_PUNCTUATION.test(part)
              ? part.slice(1)
              : part
          }

          return (
            <span key={i} className="whitespace-nowrap">
              <span className="relative inline-block">
                {part.text}
                <Mark mark={part.mark} />
              </span>
              {stuck}
            </span>
          )
        })}
      </p>
      <ul className="flex flex-col gap-3 border-t border-separator pt-4">
        {c.loves.map((love, i) => (
          <li
            key={love.id}
            className="reveal grid grid-cols-[28px_1fr] items-start gap-x-3"
            style={
              { '--reveal-delay': `${1200 + i * 150}ms` } as React.CSSProperties
            }
          >
            <span className="mt-1 h-3.5 w-7">
              <Mark small mark={i as 0 | 1 | 2} />
            </span>
            <div className="flex flex-col">
              <h3 className="text-[11px] leading-4 font-semibold tracking-[0.14em] text-accent uppercase">
                {love.word}
              </h3>
              <p className="font-serif text-[15px] leading-[22px] text-foreground/85">
                {love.line}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
