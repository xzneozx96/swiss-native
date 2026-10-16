/**
 * Shared pieces of the postcard family (round 2): the quote with its heart, the red
 * pine stamp, the round postmark. Copied from idea 3 so its file stays untouched.
 */
import { Heart, PineSilhouette } from "./brand-icons";

export const INK = "#1E3A5F";

/** The quote with the red heart kept on the same line as its last word. */
export function QuoteLine({
  text,
  heart = 18,
}: {
  text: string;
  heart?: number;
}) {
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

/** The red stamp: perforated white edge, a pine, HELVETIA. Decorative. */
export function Stamp({
  label = "Helvetia",
  large = false,
  className = "",
}: {
  label?: string;
  large?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex bg-white p-[5px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.14)] ${
        large ? "h-[91px] w-[77px]" : "h-[77px] w-[63px]"
      } ${className}`}
      style={PERFORATION}
    >
      <div className="flex size-full flex-col items-center justify-between bg-[#D52B1E] px-1 pt-1.5 pb-1 text-white">
        <PineSilhouette className={large ? "h-[46px]" : "h-[38px]"} />
        <span className="text-[7px] leading-[8px] font-bold tracking-[0.12em] uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}

/** A round postmark with a place name running round it, and wavy cancel lines. */
export function Postmark({
  id,
  text,
  centre = "CH",
  className = "",
}: {
  /** Unique id for the text path. */
  id: string;
  text: string;
  centre?: string;
  className?: string;
}) {
  const ring = `pm-${id.replace(/\W/g, "")}`;

  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 104 64">
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
        <textPath href={`#${ring}`}>{text.toUpperCase()}</textPath>
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
        {centre}
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

/** Faint pines along a card's bottom edge. */
export function PineRow({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 flex items-end gap-0.5 ${className}`}
    >
      <PineSilhouette className="h-[70px]" />
      <PineSilhouette className="h-[96px]" />
      <PineSilhouette className="h-[58px]" />
    </div>
  );
}

export const CARD_SHADOW =
  "shadow-[0_1px_2px_rgba(60,40,10,0.08),0_10px_24px_-6px_rgba(60,40,10,0.22)]";
