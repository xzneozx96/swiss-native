import type { StoryCopy } from '../story-copy'

import { useReveal } from '@/hooks/use-reveal'

// String length and resting tilt per tag, so they hang like a real rail, not a grid.
const HANG = [
  { string: 20, tilt: -2 },
  { string: 44, tilt: 2 },
  { string: 28, tilt: -1.5 },
]

/**
 * Erich's three loves as luggage tags hanging from a brass rail: a short story on each,
 * and a destination line like on a real tag. The tags swing once from their strings when
 * first seen, and the row swipes sideways on a phone.
 */
export function ErichTags({ c }: { c: StoryCopy }) {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      aria-labelledby="story-tags"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
          {c.tags.kicker}
        </span>
        <h2 className="text-heading" id="story-tags">
          {c.tags.title}
        </h2>
      </div>
      <div className="-mx-4 snap-x snap-mandatory scroll-px-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative w-max min-w-full px-4 pt-1">
          <div
            aria-hidden
            className="lv-rail absolute inset-x-3 top-1 h-2.5 rounded-full"
          />
          <ul className="flex gap-4">
            {c.tags.items.map((item, i) => (
              <li
                key={item.word}
                className="lv-hang flex w-[236px] shrink-0 snap-center flex-col items-center first:snap-start last:snap-end"
                style={
                  {
                    '--tilt': `${HANG[i].tilt}deg`,
                    '--d': `${200 + i * 180}ms`,
                  } as React.CSSProperties
                }
              >
                <span
                  aria-hidden
                  className="lv-string w-px"
                  style={{ height: HANG[i].string }}
                />
                <div className="lv-tag relative flex w-full flex-col px-5 pt-9 pb-4">
                  <span
                    aria-hidden
                    className="lv-eyelet absolute top-3 left-1/2 size-3.5 -translate-x-1/2 rounded-full"
                  />
                  <span className="text-[11px] font-semibold tracking-[0.16em] text-[#3b2a1a]/60 uppercase">
                    {item.no}
                  </span>
                  <h3 className="font-script text-[40px] leading-10 text-[#3b2a1a]">
                    {item.word}
                  </h3>
                  <p className="mt-2 font-serif text-[16px] leading-6 text-[#3b2a1a]/90">
                    {item.story}
                  </p>
                  <p className="mt-4 border-t border-dashed border-[#3b2a1a]/35 pt-2 text-[11px] leading-4 font-semibold tracking-[0.1em] text-[#3b2a1a]/70 uppercase">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
