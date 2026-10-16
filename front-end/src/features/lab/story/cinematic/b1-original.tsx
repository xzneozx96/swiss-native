/**
 * B1 · Original (chosen direction, 16.10.2026). Erich on his bike fades into a navy band
 * with his name; each chapter opens on a full-bleed photo with its title over a dark
 * fade, then the approved home blocks.
 */
import type { ChapterId, StoryCopy } from "../copy";

import { CHAPTERS } from "../copy";
import { Photo, Reveal, StoryBar, TopRow, chapterId } from "../parts";

import {
  COVERS,
  ChapterBody,
  ChapterText,
  ERICH,
  Epilogue,
  Lede,
  SerifContents,
  Tagline,
} from "./shared";

import { useScrolledPast } from "@/hooks/use-scrolled-past";

function Cover({ c, id }: { c: StoryCopy; id: ChapterId }) {
  const ch = c.chapters[id];

  return (
    <div className="relative -mx-4 h-[62svh] min-h-[380px] overflow-hidden">
      <Photo
        alt={ch.photoAlt}
        className="absolute inset-0 size-full"
        slug={COVERS[id]}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <Reveal className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 text-white">
        <span className="text-xs font-semibold tracking-[0.16em] uppercase opacity-85">
          {ch.kicker} · {ch.when}
        </span>
        <h2
          className="scroll-mt-24 font-serif text-[30px] leading-9 text-balance"
          id={chapterId(id)}
        >
          {ch.title}
        </h2>
      </Reveal>
    </div>
  );
}

export function CinematicOriginal({ c }: { c: StoryCopy }) {
  const [prologueEnd, scrolledPast] = useScrolledPast<HTMLDivElement>();

  return (
    <>
      <StoryBar c={c} visible={scrolledPast} />
      <div className="flex flex-col gap-10 px-4 pb-6">
        {/* The photo is a small crop of the client's banner, so it is shown near its
            own size, fading into a navy band that carries the name. */}
        <header className="-mx-4 bg-navy text-white">
          <div className="relative">
            <Photo
              alt={c.photoAlt}
              className="aspect-[540/548] w-full"
              slug={ERICH}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent via-40% to-navy" />
            <div className="absolute inset-x-0 top-0 px-4 pt-[calc(env(safe-area-inset-top,0px)+8px)]">
              <TopRow c={c} tone="glass" />
            </div>
          </div>
          <Reveal className="relative -mt-16 flex flex-col gap-1 px-5 pb-8">
            <span className="text-sm opacity-85">{c.hello}</span>
            <h1 className="font-script text-[60px] leading-[54px]">{c.name}</h1>
            <span className="text-xs font-semibold tracking-[0.16em] uppercase">
              {c.role}
            </span>
            <Tagline c={c} className="mt-3 text-lg" />
          </Reveal>
        </header>
        <div ref={prologueEnd} aria-hidden className="-mt-10 h-px" />

        <Lede c={c} />
        <SerifContents c={c} />

        {CHAPTERS.map((id) => (
          <section key={id} className="flex flex-col gap-5">
            <Cover c={c} id={id} />
            <ChapterText c={c} id={id} />
            <ChapterBody c={c} id={id} />
          </section>
        ))}

        <Epilogue />
      </div>
    </>
  );
}
