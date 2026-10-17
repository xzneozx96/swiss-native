import type { StoryChapterId, StoryCopy } from "../story-copy";

import { Link } from "@tanstack/react-router";

import {
  COVER_PHOTOS,
  EPILOGUE_PHOTO,
  STORY_PASSES,
  storyChapterId,
} from "../story-copy";

import { AdviceBanner } from "./advice-banner";
import { QuoteAirmail } from "./quote-airmail";
import { Rail } from "./section";

import { useReveal } from "@/hooks/use-reveal";
import { photoUrl } from "@/lib/photos";

/**
 * A chapter of the story home: a full-bleed photo with the chapter's title over a dark
 * fade, Erich's paragraph, then the chapter's own blocks (`children`). The heading's
 * scroll margin keeps its kicker clear of the collapsing header when the reel jumps here.
 */
export function StoryChapter({
  c,
  id,
  children,
}: {
  c: StoryCopy;
  id: StoryChapterId;
  children: React.ReactNode;
}) {
  const ch = c.chapters[id];
  const titleRef = useReveal<HTMLDivElement>();
  const bodyRef = useReveal<HTMLParagraphElement>();

  return (
    <section
      aria-labelledby={storyChapterId(id)}
      className="flex flex-col gap-5"
    >
      <div className="relative -mx-4 h-[56svh] min-h-[360px] overflow-hidden">
        <img
          alt={ch.photoAlt}
          className="absolute inset-0 size-full object-cover"
          decoding="async"
          loading="lazy"
          src={photoUrl(COVER_PHOTOS[id])}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div
          ref={titleRef}
          className="reveal absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 text-white"
        >
          <span className="text-xs font-semibold tracking-[0.16em] uppercase opacity-85">
            {ch.kicker} · {ch.when}
          </span>
          <h2
            className="scroll-mt-24 font-serif text-[30px] leading-9 text-balance"
            id={storyChapterId(id)}
          >
            {ch.title}
          </h2>
        </div>
      </div>
      <p
        ref={bodyRef}
        className="reveal font-serif text-[17px] leading-7 text-foreground/85"
      >
        {ch.body}
      </p>
      {children}
    </section>
  );
}

/** The five passes with heights and one line each, as a snap row of photo cards. */
export function PassStrip({ c }: { c: StoryCopy }) {
  return (
    <Rail label={c.passes.title}>
      {STORY_PASSES.map((p) => (
        <li
          key={p.name}
          className="relative w-44 shrink-0 snap-start overflow-hidden rounded-2xl"
        >
          <Link
            className="block outline-none focus-visible:focus-ring active:scale-[0.98]"
            params={{ pass: p.name.toLowerCase() }}
            to="/passes/$pass"
          >
            <img
              alt=""
              className="aspect-[3/4] w-full object-cover"
              decoding="async"
              loading="lazy"
              src={photoUrl(p.photo)}
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/20 to-transparent p-3 text-white">
              <span className="font-script text-[28px] leading-7">
                {p.name}
              </span>
              <span className="text-xs font-semibold tabular-nums">
                {p.m.toLocaleString("de-CH")} m
              </span>
              <span className="mt-1 text-xs leading-4 text-white/85">
                {c.passLines[p.name]}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </Rail>
  );
}

/**
 * The last scene: a dimmed Entlebuch landscape fading to near black, with the chapter-
 * style kicker, Erich's handwritten line as the airmail card, and the Ask Erich close.
 */
export function StoryEpilogue({ c }: { c: StoryCopy }) {
  return (
    // The scene runs on under the tab bar: its negative margin cancels the page's own
    // bottom padding (pb-4) and the guest frame's room for the tab bar and music
    // launcher, and its inner padding gives that room back.
    <section className="relative -mx-4 -mb-[calc(env(safe-area-inset-bottom,0px)+152px)] overflow-hidden bg-[#0d0f12] pb-[calc(env(safe-area-inset-bottom,0px)+136px)]">
      <img
        alt=""
        className="absolute inset-x-0 top-0 h-[70%] w-full object-cover opacity-60"
        decoding="async"
        loading="lazy"
        src={photoUrl(EPILOGUE_PHOTO)}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0f12]/70 via-[#0d0f12]/40 via-30% to-[#0d0f12] to-70%" />
      <div className="relative flex flex-col gap-8 px-4 pt-12 pb-14">
        <p className="text-center text-xs font-semibold tracking-[0.16em] text-white/75 uppercase">
          {c.epilogue}
        </p>
        <QuoteAirmail />
        <AdviceBanner />
      </div>
    </section>
  );
}
