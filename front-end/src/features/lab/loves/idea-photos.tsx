import type { IdeaProps } from './parts'

import { useReveal } from '@/hooks/use-reveal'

import { photoUrl } from '@/lib/photos'
import { LovesHeading } from './parts'

// The Tremola's hairpins, a stop at the Belvedere on the Furka, the Entlebuch at home.
const PHOTOS = ['gotthard-pass-8', 'furka-pass-1', 'finsterwald-5']

/**
 * C. Photo rail: three tall photo cards that snap as you swipe, each with the love as a
 * big handwritten word, one line, and a small index.
 */
export function IdeaPhotos({ c }: IdeaProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      aria-labelledby="loves-photos"
      className="flex flex-col gap-4"
    >
      <LovesHeading c={c} id="loves-photos" />
      <div className="-mx-4">
        <ul
          aria-label={c.rail.label}
          className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 outline-none [scrollbar-width:none] focus-visible:focus-ring"
          // Keyboard users can scroll the rail once it has focus.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          {c.loves.map((love, i) => (
            <li
              key={love.id}
              className="reveal w-[80%] shrink-0 snap-start"
              style={
                { '--reveal-delay': `${i * 120}ms` } as React.CSSProperties
              }
            >
              <figure className="relative aspect-[3/4.3] overflow-hidden rounded-[28px] bg-default">
                <img
                  alt={c.rail.alts[i]}
                  className="absolute inset-0 size-full object-cover"
                  loading="lazy"
                  src={photoUrl(PHOTOS[i])}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.45)_0%,rgb(0_0_0/0)_32%,rgb(0_0_0/0)_52%,rgb(0_0_0/0.72)_100%)]"
                />
                <span className="absolute top-4 right-5 text-xs font-semibold tracking-[0.12em] text-white/80 tabular-nums">
                  {i + 1}/{c.loves.length}
                </span>
                <figcaption className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                  <h3 className="-ml-0.5 -rotate-3 font-script text-[64px] leading-[60px] drop-shadow-[0_2px_10px_rgb(0_0_0/0.35)]">
                    {love.word}
                  </h3>
                  <p className="font-serif text-[19px] leading-[26px] text-balance">
                    {love.line}
                  </p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
