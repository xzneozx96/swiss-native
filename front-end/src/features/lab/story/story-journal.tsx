/**
 * A · Journal. Warm paper; Erich as a taped polaroid with his name in handwriting; a
 * contents list of the three offers; each chapter opens with a big handwritten red
 * numeral and is tied to the next by a hand-drawn red thread. The approved home blocks
 * sit inside the chapters unchanged.
 */
import type { ChapterId, StoryCopy } from './copy'

import { AdviceBanner } from '@/features/discovery/components/advice-banner'

import { ExperienceFlight } from '@/features/discovery/components/experience-flight'
import { QuoteAirmail } from '@/features/discovery/components/quote-airmail'
import { StayKey } from '@/features/discovery/components/stay-key'
import { useScrolledPast } from '@/hooks/use-scrolled-past'
import {
  chapterId,
  Contents,
  PassStrip,
  Photo,
  Reveal,
  StoryBar,
  TopRow,
  ToursRail,
  VoiceNote,
} from './parts'

function Numeral({ n, size = 'sm' }: { n: string, size?: 'sm' | 'lg' }) {
  return (
    <span
      aria-hidden
      className={`shrink-0 font-script text-accent ${size === 'lg' ? 'text-[64px] leading-[56px]' : 'w-11 text-[30px] leading-8'}`}
    >
      {n}
    </span>
  )
}

/** A loose red line drawn by hand, from one chapter down to the next. */
function Thread() {
  return (
    <svg
      aria-hidden
      className="mx-auto h-16 w-10 text-accent/70"
      fill="none"
      viewBox="0 0 40 64"
    >
      <path
        d="M20 2c-9 10 10 16 2 26s-12 18 0 34"
        stroke="currentColor"
        strokeDasharray="4 5"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function Opener({ c, id }: { c: StoryCopy, id: ChapterId }) {
  const ch = c.chapters[id]

  return (
    <Reveal className="flex flex-col gap-2">
      <div className="flex items-end gap-3">
        <Numeral n={ch.n} size="lg" />
        <div className="flex flex-col pb-1.5">
          <span className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
            {ch.kicker} · {ch.when}
          </span>
          <span className="font-serif text-card-title">{ch.label}</span>
        </div>
      </div>
      <h2
        className="scroll-mt-24 font-serif text-title text-balance"
        id={chapterId(id)}
      >
        {ch.title}
      </h2>
      <p className="font-serif text-[17px] leading-7 text-foreground/85">
        {ch.body}
      </p>
    </Reveal>
  )
}

export function StoryJournal({ c }: { c: StoryCopy }) {
  const [prologueEnd, scrolledPast] = useScrolledPast<HTMLDivElement>()

  return (
    <>
      <StoryBar c={c} visible={scrolledPast} />
      <div className="bg-hero-cream px-4 pb-6">
        <header className="flex flex-col gap-6 pt-[calc(env(safe-area-inset-top,0px)+8px)]">
          <TopRow c={c} />
          <div className="relative mx-auto mt-2 w-[82%] -rotate-2 bg-white p-2.5 pb-10 shadow-overlay">
            <span
              aria-hidden
              className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-3 bg-accent/70"
            />
            <Photo
              alt={c.photoAlt}
              className="aspect-square w-full object-[60%_20%]"
              slug="erich-haldi-1"
            />
            <span
              aria-hidden
              className="absolute right-4 bottom-1.5 font-script text-2xl text-navy"
            >
              Erich
            </span>
          </div>
          <Reveal className="flex flex-col gap-1">
            <span className="text-sm text-muted">{c.hello}</span>
            <h1 className="font-script text-[56px] leading-[52px] text-navy">
              {c.name}
            </h1>
            <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase">
              <span
                aria-hidden
                className="relative size-3.5 rounded-[2px] bg-accent before:absolute before:inset-x-[3px] before:top-[6px] before:h-[2px] before:bg-white after:absolute after:inset-y-[3px] after:left-[6px] after:w-[2px] after:bg-white"
              />
              {c.role}
            </span>
            <p className="mt-2 font-serif text-xl text-navy italic">
              {c.tagline.join(' ')}
            </p>
          </Reveal>
          <Reveal className="flex flex-col gap-3">
            <p className="font-serif text-[19px] leading-8">{c.lede}</p>
            <p className="font-serif text-[17px] leading-7 text-foreground/85">
              {c.body}
            </p>
            <VoiceNote c={c} />
          </Reveal>
          <div ref={prologueEnd} aria-hidden className="h-px" />
          <Contents c={c} numeral={n => <Numeral n={n} />} />
        </header>

        <Thread />
        <section className="flex flex-col gap-5">
          <Opener c={c} id="tours" />
          <PassStrip c={c} />
          <ToursRail c={c} />
        </section>

        <Thread />
        <section className="flex flex-col gap-5">
          <Opener c={c} id="bees" />
          <ExperienceFlight />
        </section>

        <Thread />
        <section className="flex flex-col gap-5">
          <Opener c={c} id="stay" />
          <StayKey />
        </section>

        <Thread />
        <section className="flex flex-col gap-6">
          <p className="text-center font-script text-[34px] leading-9 text-navy">
            {c.epilogue}
          </p>
          <QuoteAirmail />
          <AdviceBanner />
        </section>
      </div>
    </>
  )
}
