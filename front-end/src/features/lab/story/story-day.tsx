/**
 * C · A day. Erich introduces himself in a short card, then the three offers follow one
 * imagined day down a timeline: morning on the passes, afternoon at the bee house,
 * evening in Finsterwald. A line under the intro says it is a picture, not a schedule,
 * because the tours last 5 to 7 days.
 */
import type { ChapterId, StoryCopy } from './copy'

import { AdviceBanner } from '@/features/discovery/components/advice-banner'

import { ExperienceFlight } from '@/features/discovery/components/experience-flight'
import { QuoteAirmail } from '@/features/discovery/components/quote-airmail'
import { StayKey } from '@/features/discovery/components/stay-key'
import { useScrolledPast } from '@/hooks/use-scrolled-past'
import {
  chapterId,
  PassStrip,
  Photo,
  Reveal,
  StoryBar,
  TopRow,
  ToursRail,
  VoiceNote,
} from './parts'

const MOMENT: Record<
  ChapterId,
  { key: 'morning' | 'afternoon' | 'evening', dot: string, sky: string }
> = {
  tours: { key: 'morning', dot: 'bg-[#E7A33E]', sky: 'from-[#FBE7C6]' },
  bees: { key: 'afternoon', dot: 'bg-[#5C8A3A]', sky: 'from-[#E3EFD6]' },
  stay: { key: 'evening', dot: 'bg-navy', sky: 'from-[#D9E1EE]' },
}

function Stop({ c, id }: { c: StoryCopy, id: ChapterId }) {
  const ch = c.chapters[id]
  const m = MOMENT[id]

  return (
    <Reveal
      className={`-mx-4 flex gap-3 bg-gradient-to-b ${m.sky} to-transparent px-4 pt-5`}
    >
      <div className="flex w-5 flex-col items-center">
        <span aria-hidden className={`mt-1 size-3.5 rounded-full ${m.dot}`} />
        <span aria-hidden className="w-px flex-1 bg-foreground/20" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 pb-2">
        <span className="text-xs font-semibold tracking-[0.14em] uppercase">
          {c.day[m.key]} · {ch.label}
        </span>
        <h2
          className="scroll-mt-24 font-serif text-title text-balance"
          id={chapterId(id)}
        >
          {ch.title}
        </h2>
        <p className="font-serif text-[17px] leading-7 text-foreground/85">
          {ch.body}
        </p>
      </div>
    </Reveal>
  )
}

export function StoryDay({ c }: { c: StoryCopy }) {
  const [prologueEnd, scrolledPast] = useScrolledPast<HTMLDivElement>()

  return (
    <>
      <StoryBar c={c} visible={scrolledPast} />
      <div className="flex flex-col gap-8 pb-6 px-4">
        <header className="flex flex-col gap-5 pt-[calc(env(safe-area-inset-top,0px)+8px)]">
          <TopRow c={c} />
          <div className="flex items-center gap-4">
            <Photo
              alt={c.photoAlt}
              className="size-24 shrink-0 rounded-full object-[60%_15%] shadow-surface ring-4 ring-white"
              slug="erich-haldi-1"
            />
            <div className="flex min-w-0 flex-col">
              <span className="text-sm text-muted">{c.hello}</span>
              <h1 className="font-script text-[44px] leading-[44px] text-navy">
                {c.name}
              </h1>
              <span className="text-xs font-semibold tracking-[0.14em] uppercase">
                {c.role}
              </span>
            </div>
          </div>
          <Reveal className="flex flex-col gap-3">
            <p className="font-serif text-[19px] leading-8">{c.lede}</p>
            <p className="font-serif text-[17px] leading-7 text-foreground/85">
              {c.body}
            </p>
            <VoiceNote c={c} />
          </Reveal>
          <div ref={prologueEnd} aria-hidden className="h-px" />
          <div className="flex flex-col gap-0.5 rounded-2xl bg-surface-secondary p-4">
            <span className="font-serif text-card-title">{c.day.intro}</span>
            <span className="text-sm text-muted">{c.day.note}</span>
          </div>
        </header>

        <section className="flex flex-col gap-5">
          <Stop c={c} id="tours" />
          <Photo
            alt={c.chapters.tours.photoAlt}
            className="aspect-[16/10] w-full rounded-3xl"
            slug="furka-pass-4"
          />
          <PassStrip c={c} />
          <ToursRail c={c} />
        </section>

        <section className="flex flex-col gap-5">
          <Stop c={c} id="bees" />
          <ExperienceFlight />
        </section>

        <section className="flex flex-col gap-5">
          <Stop c={c} id="stay" />
          <StayKey />
        </section>

        <section className="flex flex-col gap-6">
          <QuoteAirmail />
          <AdviceBanner />
        </section>
      </div>
    </>
  )
}
