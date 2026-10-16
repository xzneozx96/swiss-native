/**
 * The client's handwritten line as an airmail postcard (brand lab round 2, idea 10,
 * chosen 16.10.2026), between the Stay and Experience sections. When the card first
 * comes into view the words appear one by one, then the heart and Erich's name. Screen
 * readers get the whole quote at once; under reduced motion it is all shown at once.
 * Stamp, postmark and address lines are decoration.
 */
import { useId } from "react";

import { Heart, PineSilhouette } from "./route-icons";

import { useLocale } from "@/contexts/locale-context";
import { useReveal } from "@/hooks/use-reveal";

const copy = {
  en: {
    quote:
      "More than roads — it's the people, the places and the little moments that stay with you.",
    author: "Erich Haldi",
  },
  de: {
    quote:
      "Mehr als Strassen — es sind die Menschen, die Orte und die kleinen Momente, die bleiben.",
    author: "Erich Haldi",
  },
};

/** Words that are the same on every Swiss card, so not translated. */
const AIRMAIL = "Par avion";
const POSTMARK = "Finsterwald · Entlebuch";
const STAMP = "Helvetia";

/** Card paper; navy ink on it is about 11:1. */
const PAPER = "#FFFCF3";

const BORDER: React.CSSProperties = {
  background: `repeating-linear-gradient(-45deg, var(--accent) 0 10px, ${PAPER} 10px 16px, var(--navy) 16px 26px, ${PAPER} 26px 32px)`,
};

/** Holes only in the padding ring: a solid content-box layer plus a grid of holes. */
const PERFORATION: React.CSSProperties = {
  maskImage:
    "linear-gradient(#000 0 0), radial-gradient(circle at center, transparent 2px, #000 2.6px)",
  maskClip: "content-box, border-box",
  maskOrigin: "content-box, border-box",
  maskSize: "auto, 7px 7px",
  maskPosition: "0 0, -3.5px -3.5px",
  maskRepeat: "no-repeat, repeat",
};

function Stamp() {
  return (
    <div
      aria-hidden="true"
      className="ms-auto flex h-[77px] w-[63px] bg-white p-[5px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.14)]"
      style={PERFORATION}
    >
      <div className="flex size-full flex-col items-center justify-between bg-accent px-1 pt-1.5 pb-1 text-white">
        <PineSilhouette className="h-[38px]" />
        <span className="text-[7px] leading-[8px] font-bold tracking-[0.12em] uppercase">
          {STAMP}
        </span>
      </div>
    </div>
  );
}

/** A round postmark with the place name running round it, and wavy cancel lines. */
function Postmark() {
  const ring = `postmark-${useId().replace(/\W/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      className="absolute -start-1 top-[58px] w-[86px] -rotate-12 text-navy/60"
      viewBox="0 0 104 64"
    >
      <defs>
        <path d="M32 32m-22 0a22 22 0 1 1 44 0a22 22 0 1 1 -44 0" id={ring} />
      </defs>
      <circle
        cx="32"
        cy="32"
        fill="none"
        r="28"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle
        cx="32"
        cy="32"
        fill="none"
        r="16"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <text
        fill="currentColor"
        fontFamily="Inter, sans-serif"
        fontSize="6.4"
        fontWeight="600"
        letterSpacing="0.6"
      >
        <textPath href={`#${ring}`}>{POSTMARK.toUpperCase()}</textPath>
      </text>
      <text
        fill="currentColor"
        fontFamily="Inter, sans-serif"
        fontSize="7"
        fontWeight="700"
        textAnchor="middle"
        x="32"
        y="34.5"
      >
        CH
      </text>
      {[22, 30, 38].map((y) => (
        <path
          key={y}
          d={`M62 ${y}c5-4 9 4 14 0s9 4 14 0 9 4 12 0`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}

export function QuoteAirmail() {
  const { language } = useLocale();
  const c = copy[language];
  const ref = useReveal<HTMLDivElement>();
  const words = c.quote.split(" ");
  const last = words.length - 1;

  return (
    <div ref={ref} className="px-1 py-3" lang={language}>
      <figure
        className="relative -rotate-[1.4deg] rounded-[6px] p-[7px] shadow-[0_1px_2px_rgba(60,40,10,0.08),0_10px_24px_-6px_rgba(60,40,10,0.22)]"
        style={BORDER}
      >
        <div
          className="relative grid grid-cols-[1fr_80px] overflow-hidden rounded-[3px]"
          style={{ background: PAPER }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute start-3 bottom-0 flex items-end gap-0.5 text-navy/[0.07]"
          >
            <PineSilhouette className="h-[70px]" />
            <PineSilhouette className="h-[96px]" />
            <PineSilhouette className="h-[58px]" />
          </div>
          <div className="relative flex flex-col gap-2 py-4 ps-5 pe-3 text-navy">
            <p
              aria-hidden="true"
              className="text-[10px] leading-3 font-bold tracking-[0.22em] uppercase"
            >
              {AIRMAIL}
            </p>
            <blockquote className="font-script text-[25px] leading-[28px] font-medium">
              <p>
                <span className="sr-only">{c.quote}</span>
                <span aria-hidden="true">
                  {words.map((w, i) => (
                    <span key={i}>
                      <span
                        className="reveal-word"
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
              className="reveal-word self-end font-script text-[21px] leading-6 font-semibold"
              style={{ "--i": last + 3 } as React.CSSProperties}
            >
              — {c.author}
            </figcaption>
          </div>
          <div className="relative border-s border-navy/15 px-2.5 py-4">
            <Stamp />
            <Postmark />
            <div aria-hidden="true" className="mt-14 flex flex-col gap-5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-px bg-navy/20" />
              ))}
            </div>
          </div>
        </div>
      </figure>
    </div>
  );
}
