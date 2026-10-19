/**
 * B5 · Letterbox. Black film bands carry the titles, like a film's opening: Erich's
 * photo pushes in slowly, his name and the tagline appear word by word. Each chapter
 * opens on a black band with a centred chapter card and a wide 2.39:1 frame, then
 * returns to the light page for the approved blocks.
 */
import type { ChapterId, StoryCopy } from '../copy'

import { BrandLogo } from '@/components/layout/brand-logo'
import { SearchButton } from '@/components/layout/top-bar-buttons'

import { useReveal } from '@/hooks/use-reveal'

import { useScrolledPast } from '@/hooks/use-scrolled-past'
import { CHAPTERS } from '../copy'
import { chapterId, Photo, StoryBar } from '../parts'
import {
  ChapterBody,
  ChapterText,
  COVERS,
  Epilogue,
  ERICH,
  Lede,
  SerifContents,
  Tagline,
} from './shared'

const FILM = 'bg-[#0d0f12] text-white'

function Words({ text, from = 0 }: { text: string, from?: number }) {
  return text.split(' ').map((word, i) => (
    <span
      key={`${word}${i}`}
      className="reveal-word me-[0.25em] last:me-0"
      style={{ '--i': from + i } as React.CSSProperties}
    >
      {word}
    </span>
  ))
}

function ChapterCard({ c, id }: { c: StoryCopy, id: ChapterId }) {
  const ch = c.chapters[id]
  const ref = useReveal<HTMLDivElement>()

  return (
    <div ref={ref} className={`-mx-4 flex flex-col gap-5 py-10 ${FILM}`}>
      <div className="flex flex-col items-center gap-1 px-6 text-center">
        <span className="reveal text-[11px] font-semibold tracking-[0.32em] text-white/60 uppercase">
          {ch.kicker}
        </span>
        <span className="reveal font-serif text-sm text-white/70 italic">
          {ch.label} · {ch.when}
        </span>
      </div>
      <div className="aspect-[2.39/1] overflow-hidden">
        <Photo
          alt={ch.photoAlt}
          className="story-kenburns size-full"
          slug={COVERS[id]}
        />
      </div>
      <h2
        className="scroll-mt-24 px-6 text-center font-serif text-[28px] leading-[34px] text-balance"
        id={chapterId(id)}
      >
        <Words text={ch.title} />
      </h2>
    </div>
  )
}

export function CinematicLetterbox({ c }: { c: StoryCopy }) {
  const [prologueEnd, scrolledPast] = useScrolledPast<HTMLDivElement>()
  const titleRef = useReveal<HTMLDivElement>()

  return (
    <>
      <StoryBar c={c} visible={scrolledPast} />
      <div className="flex flex-col gap-10 px-4 pb-6">
        <header className={`-mx-4 flex flex-col ${FILM}`}>
          <div className="flex h-12 items-center gap-2 px-4 pt-[env(safe-area-inset-top,0px)] [&_img]:brightness-0 [&_img]:invert">
            <div className="min-w-0 flex-1">
              <BrandLogo compact label={c.name} />
            </div>
            <SearchButton label={c.searchLabel} to="/search" tone="glass" />
          </div>
          <p className="pt-6 pb-4 text-center text-[11px] font-semibold tracking-[0.32em] text-white/60 uppercase">
            {c.masthead}
          </p>
          <div className="relative overflow-hidden">
            <Photo
              alt={c.photoAlt}
              className="story-kenburns aspect-[540/548] w-full object-[60%_30%]"
              slug={ERICH}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d0f12] via-transparent via-20% to-[#0d0f12]" />
          </div>
          <div
            ref={titleRef}
            className="relative -mt-20 flex flex-col items-center gap-1 px-5 pb-12 text-center"
          >
            <span className="text-sm text-white/70">
              <Words text={c.hello} />
            </span>
            <h1 className="font-script text-[64px] leading-[58px]">
              <Words from={3} text={c.name} />
            </h1>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase">
              <Words from={5} text={c.role} />
            </span>
            <Tagline c={c} className="mt-4 justify-center text-lg" words={10} />
          </div>
        </header>
        <div ref={prologueEnd} aria-hidden className="-mt-10 h-px" />

        <Lede c={c} />
        <SerifContents c={c} />

        {CHAPTERS.map(id => (
          <section key={id} className="flex flex-col gap-6">
            <ChapterCard c={c} id={id} />
            <ChapterText c={c} id={id} />
            <ChapterBody c={c} id={id} />
          </section>
        ))}

        <Epilogue />
      </div>
    </>
  )
}
