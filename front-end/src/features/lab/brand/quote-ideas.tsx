/**
 * Quote ideas: the banner's handwritten line, always a figure with a blockquote. The
 * client's pen-and-ink chalet sketch is not ours, so the ideas use our own photos
 * (the bee house stand-in finsterwald-6 and an Entlebuch chalet, finsterwald-4) or SVG.
 */
import type { BrandCopy } from "./copy";

import { Heart, PineSilhouette } from "./brand-icons";
import { NAVY } from "./usp-ideas";
import { useReveal } from "./use-reveal";

import { photoUrl } from "@/lib/photos";

/** The quote text with the red heart kept on the same line as its last word. */
function QuoteText({ text, heart = 18 }: { text: string; heart?: number }) {
  const cut = text.lastIndexOf(" ");

  return (
    <>
      {text.slice(0, cut + 1)}
      <span className="whitespace-nowrap">
        {text.slice(cut + 1)}
        <Heart className="ms-1.5 -translate-y-px align-middle" size={heart} />
      </span>
    </>
  );
}

/** 1 · Faithful: handwritten script on cream, left-aligned, a small round photo of the house. */
export function QuoteFaithful({ c }: { c: BrandCopy }) {
  const ref = useReveal<HTMLElement>();

  return (
    <figure
      ref={ref}
      className="-mx-4 flex items-center gap-4 border-y border-[#1E3A5F]/10 bg-hero-cream px-5 py-6"
    >
      <blockquote
        className="lab-reveal lab-script min-w-0 flex-1 text-[27px] leading-[30px] font-medium text-balance"
        style={{ color: NAVY }}
      >
        <p>
          <QuoteText text={c.quote} />
        </p>
      </blockquote>
      <img
        alt=""
        className="lab-reveal size-[92px] shrink-0 rounded-full object-cover object-[50%_60%] ring-1 ring-[#1E3A5F]/25 ring-offset-4 ring-offset-hero-cream [filter:grayscale(0.85)_sepia(0.25)_contrast(1.05)]"
        src={photoUrl("finsterwald-6")}
        style={{ "--lab-delay": "120ms" } as React.CSSProperties}
      />
    </figure>
  );
}

/** 2 · Pull quote: big centred serif with an oversized red quotation mark, Erich's name below. */
export function QuotePull({ c }: { c: BrandCopy }) {
  const ref = useReveal<HTMLElement>();

  return (
    <figure
      ref={ref}
      className="flex flex-col items-center px-2 pt-2 text-center"
    >
      <span
        aria-hidden="true"
        className="lab-reveal h-[52px] font-serif text-[104px] leading-[104px] text-accent"
      >
        “
      </span>
      <blockquote className="lab-reveal font-serif text-[24px] leading-[31px] font-medium tracking-[-0.01em] text-balance italic">
        <p>
          <QuoteText heart={20} text={c.quote} />
        </p>
      </blockquote>
      <figcaption
        className="lab-reveal mt-5 flex flex-col items-center gap-0.5"
        style={{ "--lab-delay": "120ms" } as React.CSSProperties}
      >
        <span aria-hidden="true" className="mb-2 h-px w-8 bg-foreground/30" />
        <span className="font-serif text-[17px] leading-5 font-semibold">
          {c.author}
        </span>
        <span className="text-[13px] leading-[18px] text-muted">{c.role}</span>
      </figcaption>
    </figure>
  );
}

/** The postmark: a circle with the place name running round it, and wavy cancel lines. */
function Postmark({ text }: { text: string }) {
  return (
    <svg
      aria-hidden="true"
      className="absolute start-0.5 top-[60px] w-[92px] -rotate-12 text-[#1E3A5F]/60"
      viewBox="0 0 104 64"
    >
      <defs>
        <path
          d="M32 32m-22 0a22 22 0 1 1 44 0a22 22 0 1 1 -44 0"
          id="lab-postmark-ring"
        />
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
        <textPath href="#lab-postmark-ring">{text.toUpperCase()}</textPath>
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

/** 3 · Postcard: the quote handwritten on a slightly turned card with a stamp and a pine. */
export function QuotePostcard({ c }: { c: BrandCopy }) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="px-1 py-3">
      <figure className="lab-reveal relative -rotate-[1.8deg] overflow-hidden rounded-[6px] bg-[#FFFCF3] shadow-[0_1px_2px_rgba(60,40,10,0.08),0_10px_24px_-6px_rgba(60,40,10,0.22)]">
        {/* Pines along the bottom edge, faint. */}
        <div
          aria-hidden="true"
          className="absolute start-3 bottom-0 flex items-end gap-0.5 text-[#1E3A5F]/[0.09]"
        >
          <PineSilhouette className="h-[70px]" />
          <PineSilhouette className="h-[96px]" />
          <PineSilhouette className="h-[58px]" />
        </div>
        <div className="relative grid grid-cols-[1fr_88px]">
          <div className="flex flex-col gap-3 py-5 ps-5 pe-4">
            <blockquote
              className="lab-script text-[25px] leading-[28px] font-medium text-pretty"
              style={{ color: NAVY }}
            >
              <p>
                <QuoteText heart={17} text={c.quote} />
              </p>
            </blockquote>
            <figcaption
              className="lab-script self-end text-[22px] leading-6 font-semibold"
              style={{ color: NAVY }}
            >
              — {c.author.split(" ")[0]}
              <span className="sr-only"> ({c.author})</span>
            </figcaption>
          </div>
          <div className="relative border-s border-[#1E3A5F]/15 py-4 pe-3 ps-3">
            {/* The stamp: perforated edge, a pine, HELVETIA. */}
            <div
              aria-hidden="true"
              className="ms-auto flex h-[77px] w-[63px] bg-white p-[5px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]"
              style={PERFORATION}
            >
              <div className="flex size-full flex-col items-center justify-between bg-[#D52B1E] px-1 pt-1.5 pb-1 text-white">
                <PineSilhouette className="h-[38px]" />
                <span className="text-[7px] leading-[8px] font-bold tracking-[0.12em] uppercase">
                  {c.stamp}
                </span>
              </div>
            </div>
            <Postmark text={c.postmark} />
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

/** 4 · Photo: the quote over a full-bleed photo of a chalet, on a soft dark scrim. */
export function QuotePhoto({ c }: { c: BrandCopy }) {
  const ref = useReveal<HTMLElement>();

  return (
    <figure
      ref={ref}
      className="relative -mx-4 flex min-h-[460px] flex-col justify-end overflow-hidden"
    >
      <img
        alt=""
        className="absolute inset-0 size-full object-cover object-[60%_50%]"
        src={photoUrl("finsterwald-4")}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/25 via-45% to-black/75"
      />
      <div className="relative flex flex-col gap-3 px-6 pt-24 pb-8">
        <blockquote className="lab-reveal lab-script text-[32px] leading-[34px] font-medium text-balance text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">
          <p>
            <QuoteText heart={22} text={c.quote} />
          </p>
        </blockquote>
        <figcaption
          className="lab-reveal text-[13px] leading-[18px] font-medium text-white/90"
          style={{ "--lab-delay": "120ms" } as React.CSSProperties}
        >
          {c.author} · {c.role}
        </figcaption>
      </div>
    </figure>
  );
}
