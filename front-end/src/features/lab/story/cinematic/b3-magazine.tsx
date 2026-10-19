/**
 * B3 · Magazine. The first screen is a magazine cover: Erich's name as the masthead on
 * the sky, and the three offers as cover lines that jump to their chapters. Each chapter
 * opens on a photo carrying one big number (5 passes, 2027, 1,060 m), with the title
 * set below it like a feature headline.
 */
import type { ChapterId, StoryCopy } from '../copy'

import { ChevronRightIcon } from '@/components/icons'
import { SearchButton } from '@/components/layout/top-bar-buttons'

import { useScrolledPast } from '@/hooks/use-scrolled-past'

import { CHAPTERS } from '../copy'
import { chapterId, Photo, Reveal, scrollToChapter, StoryBar } from '../parts'
import {
  ChapterBody,
  ChapterText,
  COVERS,
  Epilogue,
  ERICH,
  Lede,
  Tagline,
} from './shared'

function Feature({ c, id }: { c: StoryCopy, id: ChapterId }) {
  const ch = c.chapters[id]

  return (
    <div className="flex flex-col gap-4">
      <div className="relative -mx-4 aspect-[4/5] overflow-hidden">
        <Photo
          alt={ch.photoAlt}
          className="absolute inset-0 size-full"
          slug={COVERS[id]}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <Reveal className="absolute inset-x-0 bottom-0 flex flex-col p-5 text-white">
          <span className="font-serif text-[104px] leading-[96px] font-medium tracking-tight">
            {ch.stat.value}
          </span>
          <span className="font-serif text-lg italic">{ch.stat.label}</span>
        </Reveal>
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-navy uppercase">
          {ch.kicker}
        </span>
      </div>
      <Reveal className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
          {ch.label} · {ch.when}
        </span>
        <h2
          className="scroll-mt-24 font-serif text-[30px] leading-9 text-balance"
          id={chapterId(id)}
        >
          {ch.title}
        </h2>
      </Reveal>
    </div>
  )
}

export function CinematicMagazine({ c }: { c: StoryCopy }) {
  const [prologueEnd, scrolledPast] = useScrolledPast<HTMLDivElement>()

  return (
    <>
      <StoryBar c={c} visible={scrolledPast} />
      <div className="flex flex-col gap-10 px-4 pb-6">
        <header className="relative -mx-4 overflow-hidden text-white">
          <Photo
            alt={c.photoAlt}
            className="aspect-[540/700] w-full object-[62%_0%]"
            slug={ERICH}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-transparent via-35% to-black/85" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute inset-x-0 top-0 flex flex-col px-4 pt-[calc(env(safe-area-inset-top,0px)+8px)] text-navy">
            <div className="flex h-12 items-center justify-between">
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase">
                {c.masthead}
              </span>
              <SearchButton label={c.searchLabel} to="/search" tone="glass" />
            </div>
            <h1 className="-mt-1 font-serif text-[68px] leading-[0.9] font-semibold tracking-[-0.03em]">
              {c.name.split(' ').map(part => (
                <span key={part} className="block">
                  {part}
                </span>
              ))}
            </h1>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4">
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase">
              {c.role}
            </span>
            <Tagline c={c} className="-mt-1 text-xl" />
            <ul className="flex flex-col divide-y divide-white/25 border-t border-white/40">
              {CHAPTERS.map((id) => {
                const ch = c.chapters[id]

                return (
                  <li key={id}>
                    <button
                      className="flex min-h-12 w-full items-center gap-3 text-start outline-none focus-visible:focus-ring active:opacity-60"
                      type="button"
                      onClick={() => scrollToChapter(id)}
                    >
                      <span className="w-7 font-serif text-[#ffb4ad]">
                        {ch.n}
                      </span>
                      <span className="min-w-0 flex-1 font-serif text-[17px]">
                        {ch.label}
                      </span>
                      <span className="text-xs opacity-80">{ch.when}</span>
                      <ChevronRightIcon size={16} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </header>
        <div ref={prologueEnd} aria-hidden className="-mt-10 h-px" />

        <Lede c={c} />

        {CHAPTERS.map(id => (
          <section key={id} className="flex flex-col gap-5">
            <Feature c={c} id={id} />
            <ChapterText c={c} id={id} />
            <ChapterBody c={c} id={id} />
          </section>
        ))}

        <Epilogue />
      </div>
    </>
  )
}
