/**
 * The home page's opening (C01 B4 "Story reel", approved 16.10.2026): four pictures that
 * play like phone stories. Erich first, then one per offer: tours, the bee house, the
 * stay. Bars at the top fill as each plays; tapping the left third steps back, the rest
 * steps on; the button pauses; each offer picture has a button down to its chapter.
 *
 * It pauses while scrolled out of view, and starts paused under reduced motion (the
 * photo push-in and word fades are off there too). Erich's photo is a small crop of the
 * client's banner, so it keeps its own shape at the top and fades into black; the
 * chapter photos are large enough to fill the frame.
 */
import type { StoryChapterId, StoryCopy } from "../story-copy";

import { useEffect, useRef, useState } from "react";

import {
  STORY_CHAPTERS,
  REEL_PHOTOS,
  scrollToStoryChapter,
} from "../story-copy";

import { ArrowRightIcon } from "@/components/icons";
import { SearchButton } from "@/components/layout/top-bar-buttons";
import { photoUrl } from "@/lib/photos";

const DURATION_MS = 6000;

type Frame = "erich" | StoryChapterId;

const FRAMES: Frame[] = ["erich", ...STORY_CHAPTERS];

const delay = (ms: number) =>
  ({ "--story-delay": `${ms}ms` }) as React.CSSProperties;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Discover. Experience. Remember. with the middle word tinted. */
export function StoryTagline({
  c,
  className = "",
}: {
  c: StoryCopy;
  className?: string;
}) {
  return (
    <p className={`flex flex-wrap gap-x-2 font-serif italic ${className}`}>
      {c.tagline.map((word, i) => (
        <span key={word} className={i === 1 ? "text-[#ffb4ad]" : undefined}>
          {word}
        </span>
      ))}
    </p>
  );
}

function FrameText({ c, frame }: { c: StoryCopy; frame: Frame }) {
  if (frame === "erich") {
    return (
      <>
        <span className="story-fade text-sm opacity-85">{c.hello}</span>
        <span
          className="story-fade font-script text-[60px] leading-[54px]"
          style={delay(120)}
        >
          {c.name}
        </span>
        <span
          className="story-fade text-xs font-semibold tracking-[0.16em] uppercase"
          style={delay(240)}
        >
          {c.role}
        </span>
        <div className="story-fade" style={delay(360)}>
          <StoryTagline c={c} className="mt-3 text-lg" />
        </div>
      </>
    );
  }
  const ch = c.chapters[frame];

  return (
    <>
      <span className="story-fade text-xs font-semibold tracking-[0.16em] uppercase opacity-85">
        {ch.kicker} · {ch.when}
      </span>
      <span
        className="story-fade font-serif text-[30px] leading-9 text-balance"
        style={delay(120)}
      >
        {ch.title}
      </span>
      <button
        className="story-fade pointer-events-auto mt-3 flex min-h-11 items-center gap-2 self-start rounded-full bg-white px-5 text-sm font-semibold text-foreground outline-none focus-visible:focus-ring active:scale-[0.98]"
        style={delay(260)}
        type="button"
        onClick={() => scrollToStoryChapter(frame)}
      >
        {c.reel.open}
        <ArrowRightIcon size={16} />
      </button>
    </>
  );
}

function PlayPauseIcon({ paused }: { paused: boolean }) {
  return (
    <svg
      aria-hidden
      fill="currentColor"
      height="16"
      viewBox="0 0 16 16"
      width="16"
    >
      <path d={paused ? "M4 2.5v11l9-5.5z" : "M4 2h3v12H4zM9 2h3v12H9z"} />
    </svg>
  );
}

export function StoryReel({
  c,
  searchLabel,
}: {
  c: StoryCopy;
  searchLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(prefersReducedMotion);
  const [inView, setInView] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const frame = FRAMES[index];
  const isErich = frame === "erich";
  const go = (step: number) =>
    setIndex((i) => (i + step + FRAMES.length) % FRAMES.length);

  useEffect(() => {
    const el = ref.current;

    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 },
    );

    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label={c.reel.label}
      aria-roledescription="carousel"
      className="relative -mx-4 h-[min(84svh,680px)] min-h-[520px] overflow-hidden bg-black text-white"
    >
      <div
        key={frame}
        className={`absolute inset-x-0 top-0 overflow-hidden ${isErich ? "aspect-[540/620]" : "bottom-0"}`}
      >
        <img
          alt={isErich ? c.photoAlt : c.chapters[frame].photoAlt}
          className="story-kenburns size-full object-cover object-[60%_30%]"
          src={photoUrl(REEL_PHOTOS[frame])}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent via-30% to-black" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-50% to-black/70" />

      <div className="absolute inset-x-0 top-0 z-20 flex flex-col gap-2 px-3 pt-[calc(env(safe-area-inset-top,0px)+10px)]">
        <div aria-hidden className="flex gap-1">
          {FRAMES.map((f, i) => (
            <span
              key={f}
              className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35"
            >
              {i < index && <span className="block size-full bg-white" />}
              {i === index && (
                <span
                  key={index}
                  className="story-progress block size-full bg-white"
                  data-paused={paused || !inView || undefined}
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
            <PlayPauseIcon paused={paused} />
          </button>
          <SearchButton label={searchLabel} to="/search" tone="glass" />
        </div>
      </div>

      <button
        aria-label={c.reel.prev}
        className="absolute inset-y-0 left-0 z-10 w-1/3 outline-none focus-visible:bg-white/10"
        type="button"
        onClick={() => go(-1)}
      />
      <button
        aria-label={c.reel.next}
        className="absolute inset-y-0 right-0 z-10 w-2/3 outline-none focus-visible:bg-white/10"
        type="button"
        onClick={() => go(1)}
      />

      <div
        key={index}
        aria-live={paused ? "polite" : "off"}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 p-5 pb-7"
      >
        <span className="sr-only">
          {c.reel.position(index + 1, FRAMES.length)}
        </span>
        <FrameText c={c} frame={frame} />
      </div>
    </section>
  );
}
