/**
 * B2 · Scroll-over. Every photo stays pinned while the page slides up over it, like a
 * sheet: Erich stays behind his name panel, and each chapter's photo stays behind the
 * chapter's page until it is covered. Pure CSS (position: sticky), so it scrolls at the
 * phone's own speed.
 */
import type { ChapterId, StoryCopy } from '../copy'

import { useScrolledPast } from '@/hooks/use-scrolled-past'
import { CHAPTERS } from '../copy'

import { chapterId, Photo, Reveal, StoryBar, TopRow } from '../parts'

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

const SHEET
  = 'relative z-10 rounded-t-[28px] shadow-[0_-16px_40px_rgba(0,0,0,0.28)]'

function Grabber({ light = false }: { light?: boolean }) {
  return (
    <span
      aria-hidden
      className={`mx-auto mb-1 block h-1 w-10 rounded-full ${light ? 'bg-white/40' : 'bg-foreground/15'}`}
    />
  )
}

function Scene({ c, id }: { c: StoryCopy, id: ChapterId }) {
  const ch = c.chapters[id]

  return (
    <section className="relative -mx-4">
      <div className="sticky top-0 h-[80svh] min-h-[460px] overflow-hidden">
        <Photo
          alt={ch.photoAlt}
          className="absolute inset-0 size-full"
          slug={COVERS[id]}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
        <div className="absolute inset-x-0 bottom-[20svh] flex flex-col gap-2 p-5 text-white">
          <span className="text-xs font-semibold tracking-[0.16em] uppercase opacity-85">
            {ch.kicker} · {ch.when}
          </span>
          <h2
            className="scroll-mt-24 font-serif text-[32px] leading-[38px] text-balance"
            id={chapterId(id)}
          >
            {ch.title}
          </h2>
        </div>
      </div>
      <div
        className={`${SHEET} -mt-[16svh] flex flex-col gap-5 bg-background px-4 pt-3 pb-12`}
      >
        <Grabber />
        <ChapterText c={c} id={id} />
        <ChapterBody c={c} id={id} />
      </div>
    </section>
  )
}

export function CinematicScrollOver({ c }: { c: StoryCopy }) {
  const [prologueEnd, scrolledPast] = useScrolledPast<HTMLDivElement>()

  return (
    <>
      <StoryBar c={c} visible={scrolledPast} />
      <div className="flex flex-col px-4">
        <header className="relative -mx-4">
          <div className="sticky top-0">
            <Photo
              alt={c.photoAlt}
              className="aspect-[540/548] w-full"
              slug={ERICH}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/40" />
            <div className="absolute inset-x-0 top-0 px-4 pt-[calc(env(safe-area-inset-top,0px)+8px)]">
              <TopRow c={c} tone="glass" />
            </div>
          </div>
          <div className={`${SHEET} -mt-24 bg-navy px-5 pt-3 pb-8 text-white`}>
            <Grabber light />
            <Reveal className="flex flex-col gap-1">
              <span className="text-sm opacity-85">{c.hello}</span>
              <h1 className="font-script text-[60px] leading-[54px]">
                {c.name}
              </h1>
              <span className="text-xs font-semibold tracking-[0.16em] uppercase">
                {c.role}
              </span>
              <Tagline c={c} className="mt-3 text-lg" />
            </Reveal>
          </div>
          <div ref={prologueEnd} aria-hidden className="h-px" />
          <div className="relative z-10 -mt-px flex flex-col gap-10 bg-background px-4 pt-8 pb-12">
            <Lede c={c} />
            <SerifContents c={c} />
          </div>
        </header>

        {CHAPTERS.map(id => (
          <Scene key={id} c={c} id={id} />
        ))}

        <div className="pt-2 pb-6">
          <Epilogue />
        </div>
      </div>
    </>
  )
}
