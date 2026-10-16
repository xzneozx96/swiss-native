/** Pieces every cinematic variant shares: cover photos, the lede, chapter contents. */
import type { ChapterId, StoryCopy } from "../copy";

import { Contents, PassStrip, Reveal, ToursRail, VoiceNote } from "../parts";

import { AdviceBanner } from "@/features/discovery/components/advice-banner";
import { ExperienceFlight } from "@/features/discovery/components/experience-flight";
import { QuoteAirmail } from "@/features/discovery/components/quote-airmail";
import { StayKey } from "@/features/discovery/components/stay-key";

export const COVERS: Record<ChapterId, string> = {
  tours: "furka-pass-4",
  bees: "finsterwald-6",
  stay: "stay-1",
};

export const ERICH = "erich-haldi-1";

/** The approved home block(s) that make up each chapter. */
export function ChapterBody({ c, id }: { c: StoryCopy; id: ChapterId }) {
  if (id === "tours") {
    return (
      <>
        <PassStrip c={c} />
        <ToursRail c={c} />
      </>
    );
  }

  return id === "bees" ? <ExperienceFlight /> : <StayKey />;
}

export function ChapterText({
  c,
  id,
  className = "",
}: {
  c: StoryCopy;
  id: ChapterId;
  className?: string;
}) {
  return (
    <Reveal>
      <p
        className={`font-serif text-[17px] leading-7 text-foreground/85 ${className}`}
      >
        {c.chapters[id].body}
      </p>
    </Reveal>
  );
}

export function Lede({ c, dark = false }: { c: StoryCopy; dark?: boolean }) {
  return (
    <Reveal className="flex flex-col gap-4">
      <p className="font-serif text-[24px] leading-9 text-balance">{c.lede}</p>
      <p
        className={`font-serif text-[17px] leading-7 ${dark ? "text-white/80" : "text-foreground/85"}`}
      >
        {c.body}
      </p>
      <VoiceNote c={c} />
    </Reveal>
  );
}

export function SerifContents({
  c,
  dark = false,
}: {
  c: StoryCopy;
  dark?: boolean;
}) {
  return (
    <Contents
      c={c}
      dark={dark}
      numeral={(n) => (
        <span
          aria-hidden
          className={`w-9 shrink-0 font-serif text-xl ${dark ? "text-[#ff9b92]" : "text-accent"}`}
        >
          {n}
        </span>
      )}
    />
  );
}

export function Epilogue() {
  return (
    <section className="flex flex-col gap-6">
      <QuoteAirmail />
      <AdviceBanner />
    </section>
  );
}

/** Discover. Experience. Remember. with the middle word tinted. */
export function Tagline({
  c,
  className = "",
  words,
}: {
  c: StoryCopy;
  className?: string;
  /** Index the words start appearing at, in turn (needs a `data-shown` ancestor). */
  words?: number;
}) {
  return (
    <p className={`flex flex-wrap gap-x-2 font-serif italic ${className}`}>
      {c.tagline.map((word, i) => (
        <span
          key={word}
          className={`${words === undefined ? "" : "reveal-word"} ${i === 1 ? "text-[#ffb4ad]" : ""}`}
          style={{ "--i": (words ?? 0) + i * 2 } as React.CSSProperties}
        >
          {word}
        </span>
      ))}
    </p>
  );
}
