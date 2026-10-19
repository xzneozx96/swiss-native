import type { IdeaProps } from './parts'

import { useReveal } from '@/hooks/use-reveal'

import { LovesHeading } from './parts'

// String length and resting tilt per tag, so the three hang like a real rail, not a grid.
const HANG = [
  { string: 22, tilt: -4 },
  { string: 48, tilt: 3 },
  { string: 30, tilt: -2 },
]

/**
 * A. Luggage tags: three kraft tags on strings from a brass rail. Each swings once from
 * its knot when first seen, one after another, then rests at a slight tilt.
 */
export function IdeaTags({ c }: IdeaProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      aria-labelledby="loves-tags"
      className="flex flex-col gap-4"
    >
      <LovesHeading c={c} id="loves-tags" />
      <div className="relative pt-1">
        <div aria-hidden className="lv-rail mx-1 h-2.5 rounded-full" />
        <ul className="grid grid-cols-3 gap-2.5 px-1">
          {c.loves.map((love, i) => (
            <li
              key={love.id}
              className="lv-hang flex flex-col items-center"
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
              <div className="lv-tag relative flex w-full flex-col items-center px-2.5 pt-7 pb-3 text-center">
                <span
                  aria-hidden
                  className="lv-eyelet absolute top-2.5 size-3 rounded-full"
                />
                <h3 className="font-script text-[30px] leading-8 text-[#3b2a1a]">
                  {love.word}
                </h3>
                <p className="mt-1.5 font-serif text-[13px] leading-[17px] text-[#3b2a1a]/85">
                  {love.line}
                </p>
                <p className="mt-2.5 w-full border-t border-dashed border-[#3b2a1a]/30 pt-1.5 text-[10px] leading-3 font-semibold tracking-[0.08em] text-[#3b2a1a]/65 uppercase">
                  {c.tags[i]}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
