/**
 * Quote ideas 5-10, round 2: variations on the chosen postcard (idea 3). Same DNA each
 * time: Caveat handwriting in navy ink, the red heart, Erich's sign-off, a paper object
 * slightly turned, resting on the page with a soft shadow. Each varies one axis: paper
 * stock, photo, interaction, print detail, mounting, motion.
 */
import type { BrandCopy } from "./copy";
import type { Round2Copy } from "./round2-copy";

import { useId, useState } from "react";

import { Heart, PineSilhouette } from "./brand-icons";
import {
  CARD_SHADOW,
  INK,
  PineRow,
  Postmark,
  QuoteLine,
  Stamp,
} from "./postcard-parts";
import { useReveal } from "./use-reveal";

import { photoUrl } from "@/lib/photos";

interface Props {
  c: BrandCopy;
  r: Round2Copy;
}

/** A jagged edge for tape ends and torn paper, the same on every render. */
function jagged(steps: number, depth: number, seed: number) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const wobble = Math.abs(Math.sin(i * 12.9898 + seed) * 43758.5453) % 1;

    return { at: (i / steps) * 100, depth: wobble * depth };
  });
}

const tapeEdge = (() => {
  const left = jagged(8, 5, 1).map((p) => `${p.depth}% ${p.at}%`);
  const right = jagged(8, 5, 7)
    .reverse()
    .map((p) => `${100 - p.depth}% ${p.at}%`);

  return `polygon(${[...left, ...right].join(",")})`;
})();

const tornTop = (() => {
  const top = jagged(60, 10, 3).map((p) => `${p.at}% ${p.depth}px`);

  return `polygon(${top.join(",")}, 100% 100%, 0 100%)`;
})();

/* -------------------------------------------------------------------------- */

const KRAFT: React.CSSProperties = {
  backgroundColor: "#DFC8A2",
  backgroundImage:
    "radial-gradient(rgba(110,75,35,0.07) 0.7px, transparent 1.2px), radial-gradient(rgba(255,255,255,0.16) 0.7px, transparent 1.2px), linear-gradient(160deg, rgba(255,255,255,0.2), rgba(0,0,0,0.05))",
  backgroundSize: "5px 7px, 9px 6px, 100% 100%",
  backgroundPosition: "0 0, 3px 4px, 0 0",
};

/**
 * 5 · Kraft, taped, leaning: a light kraft card held by a strip of red washi tape. On the
 * home page it leans over the top edge of the Stay card below, so the two touch.
 */
export function QuoteKraft({ c, inContext }: Props & { inContext: boolean }) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`relative z-10 px-4 pt-4 ${inContext ? "-mb-12" : ""}`}
    >
      <figure
        className="lab-reveal relative rotate-[2deg] rounded-[3px] px-6 pt-9 pb-5 shadow-[0_2px_3px_rgba(60,40,10,0.12),0_26px_30px_-14px_rgba(60,40,10,0.4)]"
        style={KRAFT}
      >
        <span
          aria-hidden="true"
          className="absolute -top-3.5 left-1/2 h-8 w-32 -translate-x-1/2 -rotate-[4deg] opacity-90"
          style={{
            clipPath: tapeEdge,
            background:
              "repeating-linear-gradient(135deg, rgba(213,43,30,0.82) 0 7px, rgba(250,238,230,0.82) 7px 14px)",
          }}
        />
        <blockquote
          className="lab-script text-[26px] leading-[29px] font-medium text-pretty"
          style={{ color: "#1B2F4A" }}
        >
          <p>
            <QuoteLine text={c.quote} />
          </p>
        </blockquote>
        <figcaption className="mt-3 flex items-end justify-between gap-3">
          <PineSilhouette className="h-9 shrink-0 text-[#1B2F4A]/30" />
          <span
            className="lab-script text-[22px] leading-6 font-semibold"
            style={{ color: "#1B2F4A" }}
          >
            — {c.author}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

/** 6 · Polaroid: a photo of the house, the quote handwritten on the white margin below. */
export function QuotePolaroid({ c }: Props) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="flex justify-center px-2 py-3">
      <figure
        className={`lab-reveal w-[88%] -rotate-[2.5deg] bg-white p-3 pb-4 ${CARD_SHADOW}`}
      >
        <img
          alt=""
          className="aspect-[4/3] w-full object-cover object-[50%_60%] [filter:saturate(0.85)_sepia(0.12)]"
          src={photoUrl("finsterwald-6")}
        />
        <blockquote
          className="lab-script mt-3 px-1 text-[23px] leading-[26px] font-medium text-pretty"
          style={{ color: INK }}
        >
          <p>
            <QuoteLine heart={16} text={c.quote} />
          </p>
        </blockquote>
        <figcaption
          className="lab-script mt-1.5 px-1 text-end text-[21px] leading-6 font-semibold"
          style={{ color: INK }}
        >
          — {c.author}
        </figcaption>
      </figure>
    </div>
  );
}

/** The writing side of a postcard: quote, sign-off, stamp, postmark and address lines. */
function WritingSide({ c, markId }: { c: BrandCopy; markId: string }) {
  return (
    <div className="relative grid grid-cols-[1fr_84px]">
      <div className="flex flex-col gap-3 py-5 ps-5 pe-4">
        <blockquote
          className="lab-script text-[24px] leading-[27px] font-medium text-pretty"
          style={{ color: INK }}
        >
          <p>
            <QuoteLine heart={16} text={c.quote} />
          </p>
        </blockquote>
        <figcaption
          className="lab-script self-end text-[21px] leading-6 font-semibold"
          style={{ color: INK }}
        >
          — {c.author}
        </figcaption>
      </div>
      <div className="relative border-s border-[#1E3A5F]/15 px-3 py-4">
        <Stamp className="ms-auto" label={c.stamp} />
        <Postmark
          className="absolute start-0.5 top-[60px] w-[88px] -rotate-12 text-[#1E3A5F]/60"
          id={markId}
          text={c.postmark}
        />
        <div aria-hidden="true" className="mt-14 flex flex-col gap-5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-px bg-[#1E3A5F]/20" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 7 · Flip: the card first shows its photo side (the Entlebuch, with a greeting). Tap it
 * and it turns over to the handwritten side. The quote is always in the page for screen
 * readers; the button only turns the card.
 */
export function QuoteFlip({ c, r }: Props) {
  const ref = useReveal<HTMLDivElement>();
  const markId = useId();
  const [flipped, setFlipped] = useState(false);

  return (
    <div ref={ref} className="lab-reveal px-1 py-3">
      <figure className="relative [perspective:1100px]">
        <div
          className="grid -rotate-[1.5deg] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] [transform-style:preserve-3d] motion-reduce:transition-none"
          style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}
        >
          <div
            aria-hidden="true"
            className={`relative overflow-hidden rounded-[6px] bg-white [grid-area:1/1] [backface-visibility:hidden] ${CARD_SHADOW}`}
          >
            <img
              alt=""
              className="absolute inset-2 size-[calc(100%-16px)] rounded-[3px] object-cover"
              src={photoUrl("finsterwald-1")}
            />
            <div className="absolute inset-2 rounded-[3px] bg-gradient-to-t from-black/60 via-black/0 via-55% to-black/0" />
            <p className="lab-script absolute start-6 end-6 bottom-6 text-[30px] leading-[32px] font-semibold text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]">
              {r.greetings}
            </p>
          </div>
          <div
            className={`overflow-hidden rounded-[6px] bg-[#FFFCF3] [grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)] ${CARD_SHADOW}`}
          >
            <WritingSide c={c} markId={markId} />
          </div>
        </div>
        <button
          aria-label={r.turn}
          aria-pressed={flipped}
          className="absolute inset-0 rounded-[6px] outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
          type="button"
          onClick={() => setFlipped((v) => !v)}
        />
      </figure>
      <p
        aria-live="polite"
        className="mt-4 flex items-center justify-center gap-1.5 text-center text-[12px] leading-4 font-semibold text-foreground/70"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 16 16"
          width="14"
        >
          <path d="M2.5 8a5.5 5.5 0 0 1 9.6-3.7M13.5 8a5.5 5.5 0 0 1-9.6 3.7" />
          <path d="M12.5 1.5v3h-3M3.5 14.5v-3h3" />
        </svg>
        {flipped ? r.turnBack : r.turnHint}
      </p>
    </div>
  );
}

const GRAIN: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(60,40,10,0.05) 0.7px, transparent 1.2px), linear-gradient(170deg, #FFFDF7, #FBF5E6)",
  backgroundSize: "5px 5px, 100% 100%",
};

/**
 * 8 · Back of the card: the printed reverse of a Swiss postcard, flat on the page. A
 * four-language header line, a printed frame, a centre rule, a larger stamp, the
 * Finsterwald postmark over it, and ruled lines where the address would go.
 */
export function QuoteBack({ c, r }: Props) {
  const ref = useReveal<HTMLDivElement>();
  const markId = useId();

  return (
    <div ref={ref} className="px-1 py-3">
      <figure
        className={`lab-reveal relative rotate-[0.8deg] rounded-[4px] p-2 ${CARD_SHADOW}`}
        style={GRAIN}
      >
        <div className="rounded-[2px] border border-[#1E3A5F]/25 px-3 pt-2 pb-4">
          <p
            aria-hidden="true"
            className="text-center text-[8px] leading-3 font-semibold tracking-[0.2em] text-[#1E3A5F]/75 uppercase"
          >
            {r.postcardHeader}
          </p>
          <div className="mt-2.5 grid grid-cols-[1fr_1px_86px] gap-3">
            <div className="flex flex-col gap-2 pt-1">
              <blockquote
                className="lab-script text-[22px] leading-[25px] font-medium text-pretty"
                style={{ color: INK }}
              >
                <p>
                  <QuoteLine heart={15} text={c.quote} />
                </p>
              </blockquote>
              <figcaption
                className="lab-script -rotate-2 self-start text-[25px] leading-7 font-bold"
                style={{ color: INK }}
              >
                {c.author}
              </figcaption>
            </div>
            <span aria-hidden="true" className="bg-[#1E3A5F]/25" />
            <div className="relative flex flex-col">
              <Stamp className="ms-auto" label={c.stamp} />
              <Postmark
                centre="LU"
                className="absolute -start-3 top-[52px] w-[96px] -rotate-[8deg] text-[#1E3A5F]/55"
                id={markId}
                text={c.postmark}
              />
              <div
                aria-hidden="true"
                className="mt-auto flex flex-col gap-[18px] pt-16"
              >
                {[100, 100, 100, 62].map((w, i) => (
                  <span
                    key={i}
                    className="h-px bg-[#1E3A5F]/25"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </figure>
    </div>
  );
}

/** A red pushpin seen from above, with its shadow. */
function Pushpin() {
  return (
    <svg
      aria-hidden="true"
      className="absolute -top-3 left-1/2 z-10 -translate-x-1/2"
      height="34"
      viewBox="0 0 34 34"
      width="34"
    >
      <ellipse cx="20" cy="22" fill="rgba(40,25,10,0.22)" rx="9" ry="6" />
      <circle cx="16" cy="15" fill="#B8221A" r="10" />
      <circle cx="16" cy="15" fill="#D52B1E" r="8" />
      <circle cx="13" cy="12" fill="rgba(255,255,255,0.55)" r="2.6" />
    </svg>
  );
}

/**
 * 9 · Notepad page: a lined page torn from a pad, with a red margin rule, pinned to the
 * page with a red pushpin. The handwriting sits on the lines.
 */
export function QuoteNotepad({ c }: Props) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="px-3 pt-5 pb-2">
      <figure className="lab-reveal relative rotate-[1.2deg] [filter:drop-shadow(0_1px_1px_rgba(60,40,10,0.12))_drop-shadow(0_10px_14px_rgba(60,40,10,0.16))]">
        <Pushpin />
        <div
          className="relative bg-[#FFFEF9] pt-11 pe-5 pb-5 ps-12"
          style={{
            clipPath: tornTop,
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 29px, rgba(30,58,95,0.17) 29px 30px)",
            backgroundPosition: "0 7px",
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 start-9 w-px bg-[#D52B1E]/50"
          />
          <blockquote
            className="lab-script text-[25px] leading-[30px] font-medium text-pretty"
            style={{ color: INK }}
          >
            <p>
              <QuoteLine heart={16} text={c.quote} />
            </p>
          </blockquote>
          <figcaption
            className="lab-script text-end text-[22px] leading-[30px] font-semibold"
            style={{ color: INK }}
          >
            — {c.author}
          </figcaption>
        </div>
      </figure>
    </div>
  );
}

const AIRMAIL: React.CSSProperties = {
  background:
    "repeating-linear-gradient(-45deg, #D52B1E 0 10px, #FFFCF3 10px 16px, #1E3A5F 16px 26px, #FFFCF3 26px 32px)",
};

/**
 * 10 · Airmail, written as you watch: a card with an airmail border. When it comes into
 * view the handwriting appears word by word, then the heart and the name. Screen readers
 * get the full quote at once; under reduced motion everything is shown at once.
 */
export function QuoteAirmail({ c, r }: Props) {
  const ref = useReveal<HTMLDivElement>();
  const markId = useId();
  const words = c.quote.split(" ");
  const last = words.length - 1;

  return (
    <div ref={ref} className="px-1 py-3">
      <figure
        className={`relative -rotate-[1.4deg] rounded-[6px] p-[7px] ${CARD_SHADOW}`}
        style={AIRMAIL}
      >
        <div className="relative grid grid-cols-[1fr_80px] overflow-hidden rounded-[3px] bg-[#FFFCF3]">
          <PineRow className="start-3 text-[#1E3A5F]/[0.07]" />
          <div className="relative flex flex-col gap-2 py-4 ps-5 pe-3">
            <p
              aria-hidden="true"
              className="text-[10px] leading-3 font-bold tracking-[0.22em] text-[#1E3A5F] uppercase"
            >
              {r.airmail}
            </p>
            <blockquote
              className="lab-script text-[25px] leading-[28px] font-medium"
              style={{ color: INK }}
            >
              <p>
                <span className="sr-only">{c.quote}</span>
                <span aria-hidden="true">
                  {words.map((w, i) => (
                    <span key={i}>
                      <span
                        className="lab-word"
                        style={{ "--i": i } as React.CSSProperties}
                      >
                        {w}
                        {i === last && (
                          <Heart
                            className="ms-1.5 -translate-y-px align-middle"
                            size={16}
                          />
                        )}
                      </span>{" "}
                    </span>
                  ))}
                </span>
              </p>
            </blockquote>
            <figcaption
              className="lab-script lab-word self-end text-[21px] leading-6 font-semibold"
              style={{ color: INK, "--i": last + 3 } as React.CSSProperties}
            >
              — {c.author}
            </figcaption>
          </div>
          <div className="relative border-s border-[#1E3A5F]/15 px-2.5 py-4">
            <Stamp className="ms-auto" label={c.stamp} />
            <Postmark
              className="absolute -start-1 top-[58px] w-[86px] -rotate-12 text-[#1E3A5F]/60"
              id={markId}
              text={c.postmark}
            />
            <div aria-hidden="true" className="mt-14 flex flex-col gap-5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-px bg-[#1E3A5F]/20" />
              ))}
            </div>
          </div>
        </div>
      </figure>
    </div>
  );
}
