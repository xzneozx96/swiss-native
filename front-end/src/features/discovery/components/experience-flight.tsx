/**
 * Home-page section about Erich's Bee House in Finsterwald (B · Flugbahn). Deep forest
 * green; one red flight line draws itself as you scroll, from the bee house to spring
 * blossom, through a waggle dance, into the summer forest and on to 2027.
 *
 * The line is built from measured anchors, never from fixed coordinates: each stop has
 * one red node (on a photo's edge, or at the start of the dance), and the path runs
 * through them in order. Between rows it only travels inside the empty row gap; inside
 * a row it stays in the photo column, passing behind the photos. Bees are planned from
 * 2027; the first-season dates are bookable from the sheet the main button opens.
 */
import { useLayoutEffect, useRef, useState } from "react";

import { ArrowRightIcon } from "@/components/icons";
import { useLocale } from "@/contexts/locale-context";
import { shop } from "@/features/catalog/seed";
import { ListingBookingSheet } from "@/features/tours/discovery/listing-booking-sheet";
import { photoUrl } from "@/lib/photos";

const copy = {
  en: {
    title: "Where the bees will fly",
    sub: "From Erich's bee house in Finsterwald out into the UNESCO Biosphere Entlebuch: forest, meadow and moor.",
    stations: [
      {
        title: "The bee house",
        text: "Dry, airy, flowers and water nearby. Empty until 2027.",
      },
      {
        title: "Spring blossom",
        text: "Dandelion and meadow flowers. Spring honey is often light and floral.",
      },
      {
        title: "The waggle dance",
        text: "Back home, a bee dances the way: direction and distance to the food.",
      },
      {
        title: "Summer forest",
        text: "Honeydew from the trees: darker honey, malty, resinous.",
      },
    ],
    end: "First flight",
    endWhen: "planned for 2027",
    note: "Honey notes are typical of the region, not a promise.",
    cta: "Reserve a spot",
    ask: "Ask Erich by email",
    alts: [
      "Gabled wooden bee house with painted flight boards",
      "A bee on a dandelion",
      "Forest and meadows on a slope in Entlebuch",
    ],
  },
  de: {
    title: "Wohin die Bienen fliegen werden",
    sub: "Von Erichs Bienenhaus in Finsterwald hinaus in die UNESCO Biosphäre Entlebuch: Wald, Wiese und Moor.",
    stations: [
      {
        title: "Das Bienenhaus",
        text: "Trocken, luftig, Blüten und Wasser in der Nähe. Leer bis 2027.",
      },
      {
        title: "Frühlingsblüten",
        text: "Löwenzahn und Wiesenblumen. Frühlingshonig ist oft hell und blumig.",
      },
      {
        title: "Der Schwänzeltanz",
        text: "Zurück im Stock tanzt die Biene den Weg: Richtung und Distanz zum Futter.",
      },
      {
        title: "Sommerwald",
        text: "Honigtau aus den Bäumen: dunkler Honig, malzig, harzig.",
      },
    ],
    end: "Erster Flug",
    endWhen: "geplant für 2027",
    note: "Die Honignoten sind typisch für die Region, kein Versprechen.",
    cta: "Platz reservieren",
    ask: "Erich per E-Mail fragen",
    alts: [
      "Bienenhaus aus Holz mit Giebel und bemalten Flugbrettern",
      "Eine Biene auf einem Löwenzahn",
      "Wald und Wiesen an einem Hang im Entlebuch",
    ],
  },
};

const RED = "#E3352A";

interface Point {
  x: number;
  y: number;
}

interface Geometry {
  width: number;
  height: number;
  d: string;
  dance: Point;
  target: Point;
}

const f = (n: number) => n.toFixed(1);

/**
 * Straight down a clear column. Longer drops meander a little, like a bee, within 12px
 * of the column line, and always arrive heading straight down.
 */
function descend(x: number, from: number, to: number) {
  const len = to - from;

  return len < 48
    ? `L ${f(x)} ${f(to)}`
    : `C ${f(x + 12)} ${f(from + len * 0.3)} ${f(x - 12)} ${f(to - len * 0.45)} ${f(x)} ${f(to)}`;
}

/**
 * From an exit point down into the gap between two rows, across it in one S-curve that
 * never leaves the gap, then down to the next entry point.
 */
function hop(from: Point, to: Point, gapTop: number, gapBottom: number) {
  const mid = (gapTop + gapBottom) / 2;
  const h = Math.max(2, (gapBottom - gapTop) / 2 - 8);

  return `${descend(from.x, from.y, mid - h)} C ${f(from.x)} ${f(mid)} ${f(to.x)} ${f(mid)} ${f(to.x)} ${f(mid + h)} L ${f(to.x)} ${f(to.y)}`;
}

/** A waggle run: a straight run down, wiggling side to side. */
function run(x: number, top: number, bottom: number) {
  const steps = 6;
  let d = "";

  for (let i = 1; i <= steps; i++) {
    const dx = i === steps ? 0 : i % 2 ? 4 : -4;

    d += ` L ${f(x + dx)} ${f(top + ((bottom - top) * i) / steps)}`;
  }

  return d;
}

/** Run, loop back on the right, run, loop back on the left, run: the figure of eight. */
function waggle(x: number, top: number, bottom: number) {
  const w = 34;
  const loop = (side: 1 | -1) =>
    ` C ${f(x + side * 2 * w)} ${f(bottom + 12)} ${f(x + side * 2 * w)} ${f(top - 12)} ${f(x)} ${f(top)}`;

  return (
    run(x, top, bottom) +
    loop(1) +
    run(x, top, bottom) +
    loop(-1) +
    run(x, top, bottom)
  );
}

function measure(stage: HTMLElement): Geometry | null {
  const s = stage.getBoundingClientRect();
  const el = (key: string) =>
    stage.querySelector<HTMLElement>(`[data-anchor="${key}"]`);
  const centre = (key: string): Point | null => {
    const node = el(key);

    if (!node) return null;
    const r = node.getBoundingClientRect();

    return {
      x: r.left + r.width / 2 - s.left,
      y: r.top + r.height / 2 - s.top,
    };
  };
  const rows = [...stage.querySelectorAll<HTMLElement>("[data-row]")].map(
    (row) => {
      const r = row.getBoundingClientRect();

      return { top: r.top - s.top, bottom: r.bottom - s.top };
    },
  );
  const start = centre("start");
  const in2 = centre("in-2");
  const out2 = centre("out-2");
  const in4 = centre("in-4");
  const out4 = centre("out-4");
  const danceBox = el("dance")?.getBoundingClientRect();
  const danceHead = el("dance-head")?.getBoundingClientRect();
  const endLines = [...(el("end")?.getClientRects() ?? [])];
  const endLine = endLines.at(-1);

  if (
    !start ||
    !in2 ||
    !out2 ||
    !in4 ||
    !out4 ||
    !danceBox ||
    !danceHead ||
    !endLine ||
    rows.length < 5
  )
    return null;

  // The dance sits beside the heading of stop 03, inside its own reserved block.
  const danceX = danceBox.left + danceBox.width / 2 - s.left;
  const blockTop = danceBox.top - s.top;
  const headMid = danceHead.top + danceHead.height / 2 - s.top;
  const runTop = Math.max(blockTop + 14, headMid - 18);
  const runBottom = runTop + 36;
  const dance = { x: danceX, y: runTop };
  // The target closes "planned for 2027" like a full stop: level with its last line,
  // right of every line, so the curve down from stop 04 never crosses the words.
  const textRight = Math.max(...endLines.map((r) => r.right)) - s.left;
  const target = {
    x: Math.min(out4.x, textRight + 18),
    y: endLine.top + endLine.height / 2 - s.top,
  };

  const d = [
    `M ${f(start.x)} ${f(start.y)}`,
    hop(start, in2, rows[0].bottom, rows[1].top),
    `L ${f(out2.x)} ${f(out2.y)}`,
    hop(out2, { x: danceX, y: blockTop }, rows[1].bottom, rows[2].top),
    `L ${f(dance.x)} ${f(dance.y)}`,
    waggle(dance.x, runTop, runBottom),
    hop({ x: danceX, y: runBottom }, in4, rows[2].bottom, rows[3].top),
    `L ${f(out4.x)} ${f(out4.y)}`,
    `C ${f(out4.x + 12)} ${f(out4.y + (target.y - out4.y) * 0.45)} ${f(target.x)} ${f(target.y - 60)} ${f(target.x)} ${f(target.y)}`,
  ].join(" ");

  return { width: s.width, height: s.height, d, dance, target };
}

const PHOTOS = [
  { slug: "finsterwald-6", ratio: "4 / 3", tilt: "-2deg", pos: "50% 60%" },
  { slug: "finsterwald-8", ratio: "4 / 5", tilt: "2.5deg", pos: "42% 45%" },
  { slug: "finsterwald-3", ratio: "4 / 3", tilt: "-1.5deg", pos: "50% 50%" },
];

/** A red node on the line, the visible anchor of a stop. */
const NODE =
  "pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-[#17241C] bg-[#E3352A]";

function Photo({
  index,
  alt,
  anchors,
}: {
  index: number;
  alt: string;
  /** "start" for the first stop (its node is on the lower edge), else "in-N"/"out-N". */
  anchors: { top?: string; bottom: string };
}) {
  const { slug, ratio, tilt, pos } = PHOTOS[index];

  return (
    <div className="xp-pop relative" style={{ rotate: tilt }}>
      <div
        className="overflow-hidden rounded-[18px] bg-[#22342A] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)]"
        style={{ aspectRatio: ratio }}
      >
        <img
          alt={alt}
          className="size-full object-cover"
          decoding="async"
          src={photoUrl(slug)}
          style={{ objectPosition: pos }}
        />
      </div>
      {anchors.top && (
        <span className={`${NODE} top-0 left-1/2`} data-anchor={anchors.top} />
      )}
      <span
        className={
          anchors.bottom === "start"
            ? `${NODE} top-full left-1/2`
            : "pointer-events-none absolute top-full left-1/2 size-0"
        }
        data-anchor={anchors.bottom}
      />
    </div>
  );
}

function Stop({
  index,
  title,
  text,
  headAnchor,
}: {
  index: number;
  title: string;
  text: string;
  headAnchor?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-[11px] leading-4 font-semibold text-[#F1EEE4]/55 tabular-nums">
        0{index + 1}
      </span>
      <h3
        className="font-serif text-[19px] leading-[22px] font-semibold hyphens-auto"
        data-anchor={headAnchor}
      >
        {title}
      </h3>
      <p className="text-[13px] leading-[18px] text-[#F1EEE4]/75 hyphens-auto">
        {text}
      </p>
    </div>
  );
}

const PHOTO_LEFT = "grid grid-cols-[46%_minmax(0,1fr)] items-start gap-x-4";
const PHOTO_RIGHT = "grid grid-cols-[minmax(0,1fr)_46%] items-start gap-x-4";

export function ExperienceFlight() {
  const { language } = useLocale();
  const c = copy[language];
  const stageRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [booking, setBooking] = useState(false);

  // Re-measure on every size change of the stage (width, wrapping copy, web fonts).
  useLayoutEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;
    const update = () => setGeo(measure(stage));
    const ro = new ResizeObserver(update);

    ro.observe(stage);
    void document.fonts?.ready.then(update);

    return () => ro.disconnect();
  }, [language]);

  return (
    <section
      aria-labelledby="xp-flight-title"
      className="xp-flight relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-[#17241C] pt-7 pb-6 text-[#F1EEE4] shadow-overlay"
      lang={language}
    >
      <style>{`
        .xp-flight .xp-draw { stroke-dasharray: 1; stroke-dashoffset: 0; }
        .xp-flight .xp-bee { display: none; }
        .xp-flight .xp-end { animation: xp-end-pulse 2.4s ease-out infinite; }
        @keyframes xp-end-pulse { 0% { scale: 1; opacity: .55; } 70%,100% { scale: 3.2; opacity: 0; } }
        @supports (animation-timeline: view()) {
          @media (prefers-reduced-motion: no-preference) {
            .xp-flight .xp-stage { view-timeline-name: --xp-flight; }
            .xp-flight .xp-draw { animation: xp-draw linear both; animation-timeline: --xp-flight; animation-range: entry 35% exit 40%; }
            .xp-flight .xp-bee { display: block; animation: xp-fly linear both; animation-timeline: --xp-flight; animation-range: entry 35% exit 40%; }
            .xp-flight .xp-pop { animation: xp-pop linear both; animation-timeline: view(); animation-range: entry 5% entry 60%; }
          }
        }
        @keyframes xp-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes xp-fly { from { offset-distance: 0%; } to { offset-distance: 100%; } }
        @keyframes xp-pop { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .xp-flight .xp-end { animation: none; } }
      `}</style>

      <header className="flex flex-col gap-3 px-5">
        <h2
          className="font-serif text-[40px] leading-[42px] font-semibold tracking-[-0.02em] text-balance"
          id="xp-flight-title"
        >
          {c.title}
        </h2>
        <p className="max-w-[34ch] text-[15px] leading-[22px] text-[#F1EEE4]/75">
          {c.sub}
        </p>
      </header>

      <div ref={stageRef} className="xp-stage relative">
        {geo && (
          <>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0"
              height={geo.height}
              viewBox={`0 0 ${geo.width} ${geo.height}`}
              width={geo.width}
            >
              <path
                d={geo.d}
                fill="none"
                pathLength={1}
                stroke="#F1EEE4"
                strokeDasharray="0.003 0.009"
                strokeLinecap="round"
                strokeOpacity={0.35}
                strokeWidth={2}
              />
              <path
                className="xp-draw"
                d={geo.d}
                fill="none"
                pathLength={1}
                stroke={RED}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3.5}
              />
            </svg>
            <span
              aria-hidden="true"
              className="xp-bee pointer-events-none absolute top-0 left-0 size-3 rounded-full bg-[#F1EEE4] shadow-[0_0_0_3px_#E3352A]"
              style={{ offsetPath: `path("${geo.d}")`, offsetRotate: "0deg" }}
            />
          </>
        )}

        <ol className="relative flex flex-col gap-16 px-5">
          <li data-row className={PHOTO_LEFT}>
            <Photo alt={c.alts[0]} anchors={{ bottom: "start" }} index={0} />
            <Stop index={0} {...c.stations[0]} />
          </li>
          <li data-row className={PHOTO_RIGHT}>
            <Stop index={1} {...c.stations[1]} />
            <Photo
              alt={c.alts[1]}
              anchors={{ top: "in-2", bottom: "out-2" }}
              index={1}
            />
          </li>
          <li data-row className={PHOTO_LEFT}>
            <div aria-hidden="true" className="h-[96px]" data-anchor="dance" />
            <Stop headAnchor="dance-head" index={2} {...c.stations[2]} />
          </li>
          <li data-row className={PHOTO_RIGHT}>
            <Stop index={3} {...c.stations[3]} />
            <Photo
              alt={c.alts[2]}
              anchors={{ top: "in-4", bottom: "out-4" }}
              index={2}
            />
          </li>
          <li data-row className={PHOTO_RIGHT}>
            <p className="flex flex-col items-start">
              <span className="text-[12px] leading-4 font-semibold text-[#F1EEE4]/60">
                {c.end}
              </span>
              <span className="font-serif text-[30px] leading-[34px] font-semibold">
                {/* Inline, so each wrapped line has its own rect to aim at. */}
                <span data-anchor="end">{c.endWhen}</span>
              </span>
            </p>
          </li>
        </ol>

        {geo && (
          <>
            <span
              className={NODE}
              style={{ left: geo.dance.x, top: geo.dance.y }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute"
              style={{ left: geo.target.x, top: geo.target.y }}
            >
              <span className="xp-end absolute -top-[7px] -left-[7px] size-3.5 rounded-full bg-[#E3352A]" />
              <span className="absolute -top-[7px] -left-[7px] size-3.5 rounded-full bg-[#E3352A]" />
            </span>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 px-5 pt-2">
        <button
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-[#F1EEE4] active:scale-[0.98]"
          type="button"
          onClick={() => setBooking(true)}
        >
          {c.cta}
          <ArrowRightIcon size={16} />
        </button>
        <a
          className="self-center text-[13px] leading-[18px] font-semibold text-[#F1EEE4]/75 underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-[#F1EEE4]"
          href={`mailto:${shop.email}?subject=${encodeURIComponent(c.title)}`}
        >
          {c.ask}
        </a>
        <p className="text-center text-[12px] leading-4 text-[#F1EEE4]/55">
          {c.note}
        </p>
      </div>

      <ListingBookingSheet
        isOpen={booking}
        kind="experience"
        onClose={() => setBooking(false)}
      />
    </section>
  );
}
