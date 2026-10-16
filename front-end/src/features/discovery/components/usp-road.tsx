/**
 * The client's three selling points as a road (brand lab round 2, idea 6, chosen
 * 16.10.2026). The road comes out from under the hero's search box, runs down the left
 * through three stops (Alpine passes, Scenic roads, Hidden gems), each with one line of
 * text, and fades out pointing at the Tours heading. Navy and cream only: no red line,
 * so it does not echo the Experience section's red flight line.
 *
 * The path is built in pixels from the measured stop positions, so the road always
 * meets the search box and passes under every stop, in any language and at any width.
 */
import { useLayoutEffect, useRef, useState } from "react";

import { PassIcon, PinesIcon, RoadIcon } from "./route-icons";

import { useLocale } from "@/contexts/locale-context";
import { useReveal } from "@/hooks/use-reveal";

const copy = {
  en: {
    label: "Highlights",
    points: {
      passes: {
        title: "Alpine passes",
        line: "Furka, Grimsel, Susten, Gotthard, Nufenen",
      },
      roads: {
        title: "Scenic roads",
        line: "Hairpins, long climbs and quiet valley roads",
      },
      gems: {
        title: "Hidden gems",
        line: "Small places away from the main routes",
      },
    },
  },
  de: {
    label: "Höhepunkte",
    points: {
      passes: {
        title: "Alpenpässe",
        line: "Furka, Grimsel, Susten, Gotthard, Nufenen",
      },
      roads: {
        title: "Panoramastrassen",
        line: "Kehren, lange Anstiege und ruhige Talstrassen",
      },
      gems: {
        title: "Verborgene Perlen",
        line: "Kleine Orte abseits der grossen Routen",
      },
    },
  },
};

const POINTS = [
  { id: "passes", Icon: PassIcon },
  { id: "roads", Icon: RoadIcon },
  { id: "gems", Icon: PinesIcon },
] as const;

/** Road surface: a warm cream that reads on the page ground and on white. */
const ROAD = "#EADFC6";
/** How far the road starts above the strip, hidden under the search box. */
const UNDER = 24;
/** How far the road runs on below the last stop, fading out. */
const TAIL = 34;
/** Sideways swing of the road between two stops. */
const SWING = 20;
const CX = 32;

function roadPath(stops: number[], height: number) {
  const ys = stops.map((y) => y + UNDER);
  const end = height + UNDER + TAIL;
  let d = `M${CX} 0L${CX} ${ys[0]}`;

  [...ys.slice(1), end].forEach((y, i) => {
    const from = ys[i];
    const half = (y - from) / 2;
    const x = CX + (i % 2 ? -SWING : SWING);

    d += `C${x} ${from + half} ${x} ${y - half} ${CX} ${y}`;
  });

  return d;
}

export function UspRoad() {
  const { language } = useLocale();
  const c = copy[language];
  const ref = useReveal<HTMLDivElement>();
  const listRef = useRef<HTMLUListElement>(null);
  const [geometry, setGeometry] = useState<{
    height: number;
    stops: number[];
  } | null>(null);

  // Offsets ignore the reveal's translate, so the road is placed for the final layout.
  useLayoutEffect(() => {
    const list = listRef.current;
    const root = ref.current;

    if (!list || !root) return;
    const measure = () => {
      const stops = [...list.querySelectorAll<HTMLElement>("[data-stop]")].map(
        (el) => {
          const item = el.parentElement as HTMLElement;

          return list.offsetTop + item.offsetTop + item.offsetHeight / 2;
        },
      );

      setGeometry({ height: root.offsetHeight, stops });
    };
    const ro = new ResizeObserver(measure);

    ro.observe(list);
    measure();

    return () => ro.disconnect();
  }, [ref, language]);

  return (
    <div ref={ref} className="relative pt-4" lang={language}>
      {geometry && (
        <svg
          aria-hidden="true"
          className="reveal pointer-events-none absolute start-2 w-16 [mask-image:linear-gradient(to_bottom,black_calc(100%_-_44px),transparent)]"
          fill="none"
          height={geometry.height + UNDER + TAIL}
          style={{ top: -UNDER }}
          viewBox={`0 0 64 ${geometry.height + UNDER + TAIL}`}
          width="64"
        >
          <path
            d={roadPath(geometry.stops, geometry.height)}
            stroke={ROAD}
            strokeLinecap="round"
            strokeWidth="12"
          />
          <path
            className="stroke-navy"
            d={roadPath(geometry.stops, geometry.height)}
            strokeDasharray="5 6"
            strokeWidth="1.5"
          />
        </svg>
      )}
      <ul
        ref={listRef}
        aria-label={c.label}
        className="relative flex flex-col gap-7"
      >
        {POINTS.map(({ id, Icon }, i) => (
          <li
            key={id}
            className="reveal flex items-center gap-3"
            style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
          >
            <span
              data-stop
              className="ms-2 flex w-16 shrink-0 justify-center text-navy"
            >
              <span className="flex size-[50px] items-center justify-center rounded-full border border-navy/15 bg-white shadow-surface">
                <Icon size={30} />
              </span>
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[11px] leading-[14px] font-semibold tracking-[0.1em] text-navy uppercase">
                {c.points[id].title}
              </span>
              <span className="text-[13px] leading-[18px] text-foreground/80">
                {c.points[id].line}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
