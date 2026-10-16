/**
 * B4 · Story reel. The page opens with four full-screen pictures that play like phone
 * stories: Erich, then one per offer. Bars at the top fill as each plays; tapping the
 * left or right side steps back or on, the button pauses, and each offer frame jumps
 * to its chapter. Under reduced motion the reel starts paused. Below the reel the
 * story continues as in B1.
 */
import type { ChapterId, StoryCopy } from "../copy";

import { useState } from "react";

import { CHAPTERS } from "../copy";
import { Photo, Reveal, StoryBar, chapterId, scrollToChapter } from "../parts";

import {
  COVERS,
  ChapterBody,
  ChapterText,
  ERICH,
  Epilogue,
  Lede,
  Tagline,
} from "./shared";

import { ArrowRightIcon } from "@/components/icons";
import { SearchButton } from "@/components/layout/top-bar-buttons";
import { useScrolledPast } from "@/hooks/use-scrolled-past";

const DURATION_MS = 6000;

type Frame = { kind: "erich" } | { kind: "chapter"; id: ChapterId };

const FRAMES: Frame[] = [
  { kind: "erich" },
  ...CHAPTERS.map((id) => ({ kind: "chapter" as const, id })),
];

function FrameContent({ c, frame }: { c: StoryCopy; frame: Frame }) {
  if (frame.kind === "erich") {
    return (
      <>
        <span className="story-fade text-sm opacity-85">{c.hello}</span>
        <span
          className="story-fade font-script text-[60px] leading-[54px]"
          style={{ "--story-delay": "120ms" } as React.CSSProperties}
        >
          {c.name}
        </span>
        <span
          className="story-fade text-xs font-semibold tracking-[0.16em] uppercase"
          style={{ "--story-delay": "240ms" } as React.CSSProperties}
        >
          {c.role}
        </span>
        <div
          className="story-fade"
          style={{ "--story-delay": "360ms" } as React.CSSProperties}
        >
          <Tagline c={c} className="mt-3 text-lg" />
        </div>
      </>
    );
  }
  const ch = c.chapters[frame.id];

  return (
    <>
      <span className="story-fade text-xs font-semibold tracking-[0.16em] uppercase opacity-85">
        {ch.kicker} · {ch.when}
      </span>
      <span
        className="story-fade font-serif text-[30px] leading-9 text-balance"
        style={{ "--story-delay": "120ms" } as React.CSSProperties}
      >
        {ch.title}
      </span>
      <button
        className="story-fade relative z-20 mt-3 flex min-h-11 items-center gap-2 self-start rounded-full bg-white px-5 text-sm font-semibold text-foreground outline-none focus-visible:focus-ring active:scale-[0.98]"
        style={{ "--story-delay": "260ms" } as React.CSSProperties}
        type="button"
        onClick={() => scrollToChapter(frame.id)}
      >
        {c.reel.open}
        <ArrowRightIcon size={16} />
      </button>
    </>
  );
}

function Reel({ c }: { c: StoryCopy }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const frame = FRAMES[index];
  const go = (step: number) =>
    setIndex((i) => (i + step + FRAMES.length) % FRAMES.length);
  const photo = frame.kind === "erich" ? ERICH : COVERS[frame.id];
  const alt =
    frame.kind === "erich" ? c.photoAlt : c.chapters[frame.id].photoAlt;

  return (
    <section
      aria-label={c.reel.label}
      aria-roledescription="carousel"
      className="relative -mx-4 h-[min(84svh,680px)] min-h-[520px] overflow-hidden bg-black text-white"
    >
      {/* Erich's photo is a small crop, so it keeps its own square shape on top and
          fades into black; the chapter photos are large enough to fill the frame. */}
      <div
        key={photo}
        className={`absolute inset-x-0 top-0 overflow-hidden ${frame.kind === "erich" ? "aspect-[540/620]" : "bottom-0"}`}
      >
        <Photo
          alt={alt}
          className="story-kenburns size-full object-[60%_30%]"
          slug={photo}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent via-30% to-black" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-50% to-black/70" />

      <div className="absolute inset-x-0 top-0 z-20 flex flex-col gap-2 px-3 pt-[calc(env(safe-area-inset-top,0px)+10px)]">
        <div aria-hidden className="flex gap-1">
          {FRAMES.map((_, i) => (
            <span
              key={i}
              className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35"
            >
              {i < index && <span className="block size-full bg-white" />}
              {i === index && (
                <span
                  key={index}
                  className="story-progress block size-full bg-white"
                  data-paused={paused || undefined}
                  style={
                    {
                      "--story-duration": `${DURATION_MS}ms`,
                    } as React.CSSProperties
                  }
                  onAnimationEnd={() => go(1)}
                />
              )}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            aria-label={paused ? c.reel.play : c.reel.pause}
            className="glass flex size-11 items-center justify-center rounded-full outline-none focus-visible:focus-ring active:scale-95"
            type="button"
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? (
              <svg
                aria-hidden
                fill="currentColor"
                height="16"
                viewBox="0 0 16 16"
                width="16"
              >
                <path d="M4 2.5v11l9-5.5z" />
              </svg>
            ) : (
              <svg
                aria-hidden
                fill="currentColor"
                height="16"
                viewBox="0 0 16 16"
                width="16"
              >
                <path d="M4 2h3v12H4zM9 2h3v12H9z" />
              </svg>
            )}
          </button>
          <SearchButton label={c.searchLabel} to="/search" tone="glass" />
        </div>
      </div>

      <button
        aria-label={c.reel.prev}
        className="absolute inset-y-0 left-0 z-10 w-1/3 outline-none"
        type="button"
        onClick={() => go(-1)}
      />
      <button
        aria-label={c.reel.next}
        className="absolute inset-y-0 right-0 z-10 w-2/3 outline-none"
        type="button"
        onClick={() => go(1)}
      />

      <div
        key={index}
        aria-live={paused ? "polite" : "off"}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 p-5 pb-7 [&_button]:pointer-events-auto"
      >
        <FrameContent c={c} frame={frame} />
      </div>
    </section>
  );
}

function Cover({ c, id }: { c: StoryCopy; id: ChapterId }) {
  const ch = c.chapters[id];

  return (
    <div className="relative -mx-4 h-[56svh] min-h-[360px] overflow-hidden">
      <Photo
        alt={ch.photoAlt}
        className="absolute inset-0 size-full"
        slug={COVERS[id]}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
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

export function CinematicReel({ c }: { c: StoryCopy }) {
  const [prologueEnd, scrolledPast] = useScrolledPast<HTMLDivElement>();

  return (
    <>
      <StoryBar c={c} visible={scrolledPast} />
      <div className="flex flex-col gap-10 px-4 pb-6">
        <h1 className="sr-only">
          {c.name}, {c.role}
        </h1>
        <Reel c={c} />
        <div ref={prologueEnd} aria-hidden className="-mt-10 h-px" />
        <Lede c={c} />
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
