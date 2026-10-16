/**
 * The stay chapter's block on the story home (C · Schlüssel), under the chapter's cover
 * and paragraph. A full-width linen wall with the stay as one object: a red guesthouse
 * key tag with a brass key, hanging from a hook. The tag names the place; tap it and it
 * turns over to show the amenities, swinging on the hook as it turns. It also swings
 * once when it first comes into view. The chapter above introduces the stay, so the
 * wall carries no heading of its own.
 *
 * Verified, not invented: the stay is at Erich's bee house in Finsterwald (told by the
 * client); the bus line and the driving times to the start of each pass ride come from
 * public sources and a route calculation from the village of Finsterwald (not the exact
 * building, which is not known). Which amenities the stay really has is not known yet:
 * each entry in `AMENITIES` is `confirmed: false` until the client says so, and shows as
 * a dim icon in a dashed ring. Setting it to true fills the ring.
 */
import type { IconComponent } from "@/components/icons";

import { useEffect, useId, useRef, useState } from "react";

import {
  ArrowRightIcon,
  BathIcon,
  BedIcon,
  BreakfastIcon,
  MealIcon,
  ParkingIcon,
  WifiIcon,
} from "@/components/icons";
import { useLocale } from "@/contexts/locale-context";
import { shop } from "@/features/catalog/seed";
import { ListingBookingSheet } from "@/features/tours/discovery/listing-booking-sheet";

/**
 * The amenities a rider looks for, shown as icons. Flip `confirmed` once the client
 * confirms each one: until then the icon is drawn dim with a dashed ring.
 */
const AMENITIES: {
  id: string;
  icon: IconComponent;
  en: string;
  de: string;
  confirmed: boolean;
}[] = [
  {
    id: "rooms",
    icon: BedIcon,
    en: "Bedrooms",
    de: "Zimmer",
    confirmed: false,
  },
  { id: "bath", icon: BathIcon, en: "Bathroom", de: "Bad", confirmed: false },
  {
    id: "breakfast",
    icon: BreakfastIcon,
    en: "Breakfast",
    de: "Frühstück",
    confirmed: false,
  },
  { id: "wifi", icon: WifiIcon, en: "Wi-Fi", de: "WLAN", confirmed: false },
  {
    id: "parking",
    icon: ParkingIcon,
    en: "Motorcycle parking",
    de: "Motorradparkplatz",
    confirmed: false,
  },
  {
    id: "evening",
    icon: MealIcon,
    en: "Evening meal",
    de: "Abendessen",
    confirmed: false,
  },
];

const copy = {
  en: {
    name: "Stay at Erich's bee house",
    place: "Finsterwald · Entlebuch",
    altitude: "about 1,060 m",
    host: "Hosted by Erich Haldi",
    turn: "Turn the key tag over",
    hint: "Tap the tag to turn it over",
    hintBack: "Tap again for the front",
    amenities: "Amenities",
    routeTitle: "From here to the passes",
    routeSub: "Car, from the village of Finsterwald to where each ride starts.",
    routes: [
      { pass: "Susten", from: "Innertkirchen", time: "1 h 15", km: 62 },
      { pass: "Gotthard", from: "Schöllenen", time: "1 h 30", km: 96 },
      { pass: "Grimsel", from: "Handeck", time: "1 h 35", km: 77 },
      { pass: "Furka", from: "Realp", time: "1 h 40", km: 106 },
      { pass: "Nufenen", from: "Ulrichen", time: "2 h", km: 106 },
    ],
    routeNote:
      "Typical times without traffic. Snow can close the passes. Without a car: train from Lucerne to Entlebuch, then bus 232 to Finsterwald, about 10 minutes.",
    unknown: "Rooms, beds, breakfast and price: ask Erich.",
    cta: "Book a stay",
    ask: "Ask Erich by email",
  },
  de: {
    name: "Zu Gast bei Erichs Bienenhaus",
    place: "Finsterwald · Entlebuch",
    altitude: "ca. 1060 m ü. M.",
    host: "Gastgeber: Erich Haldi",
    turn: "Schlüsselanhänger umdrehen",
    hint: "Tippe auf den Anhänger, um ihn umzudrehen",
    hintBack: "Nochmals tippen für die Vorderseite",
    amenities: "Ausstattung",
    routeTitle: "Von hier zu den Pässen",
    routeSub: "Mit dem Auto, vom Dorf Finsterwald bis zum Start jeder Fahrt.",
    routes: [
      { pass: "Susten", from: "Innertkirchen", time: "1 Std. 15", km: 62 },
      { pass: "Gotthard", from: "Schöllenen", time: "1 Std. 30", km: 96 },
      { pass: "Grimsel", from: "Handeck", time: "1 Std. 35", km: 77 },
      { pass: "Furka", from: "Realp", time: "1 Std. 40", km: 106 },
      { pass: "Nufenen", from: "Ulrichen", time: "2 Std.", km: 106 },
    ],
    routeNote:
      "Übliche Zeiten ohne Verkehr. Schnee kann die Pässe sperren. Ohne Auto: Bahn von Luzern nach Entlebuch, dann Bus 232 nach Finsterwald, etwa 10 Minuten.",
    unknown: "Zimmer, Betten, Frühstück und Preis: bitte Erich fragen.",
    cta: "Aufenthalt buchen",
    ask: "Erich per E-Mail fragen",
  },
};

const WALL = "#ECE3D2";
const INK = "#33312E";
const BRASS = "#A9874F";

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);

    mq.addEventListener("change", update);

    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

/** The Swiss cross in its flag proportions (arms 1/6 longer than wide). */
function SwissCross({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 32 32" width={size}>
      <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="currentColor" />
    </svg>
  );
}

/** The tag outline in a 192 x 292 box: a narrow neck with the hole, a bell-shaped body. */
const TAG_PATH =
  "M96 0C118 0 134 14 134 36C134 62 192 84 192 146L192 214C192 258 150 292 96 292C42 292 0 258 0 214L0 146C0 84 58 62 58 36C58 14 74 0 96 0Z";

/** One side of the tag: the silhouette, its hole, and the content laid over it. */
function TagFace({
  from,
  to,
  className = "",
  children,
}: {
  from: string;
  to: string;
  className?: string;
  children: React.ReactNode;
}) {
  const id = useId();

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center [backface-visibility:hidden] ${className}`}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full drop-shadow-[0_22px_18px_rgba(70,45,20,0.32)]"
        viewBox="0 0 192 292"
      >
        <defs>
          <linearGradient id={id} x1="0" x2="0.35" y1="0" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        <path d={TAG_PATH} fill={`url(#${id})`} />
        <circle cx="96" cy="24" fill={WALL} r="9" />
        <path
          d="M87.5 21.5a9 9 0 0 1 17 0"
          fill="none"
          stroke="rgba(0,0,0,0.35)"
          strokeWidth="2"
        />
      </svg>
      <div className="relative flex w-full flex-col items-center">
        {children}
      </div>
    </div>
  );
}

/** A plain bit key, drawn as geometry: bow ring, shaft, two wards. */
function Key() {
  return (
    <svg aria-hidden="true" height="196" viewBox="0 0 48 168" width="56">
      <circle
        cx="24"
        cy="22"
        fill="none"
        r="15"
        stroke={BRASS}
        strokeWidth="7"
      />
      <rect fill={BRASS} height="8" rx="2" width="20" x="14" y="40" />
      <rect fill={BRASS} height="118" rx="3.5" width="7" x="20.5" y="44" />
      <rect fill={BRASS} height="10" rx="1.5" width="15" x="27" y="132" />
      <rect fill={BRASS} height="10" rx="1.5" width="11" x="27" y="150" />
    </svg>
  );
}

export function StayKey() {
  const { language } = useLocale();
  const c = copy[language];
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [booking, setBooking] = useState(false);
  // Each swing alternates between two identical keyframes, so a new one always restarts.
  const [swing, setSwing] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setSwing((n) => n + 1);
      },
      { threshold: 0.7 },
    );

    io.observe(stage);

    return () => io.disconnect();
  }, [reduced]);

  return (
    <section
      aria-label={c.name}
      className="relative -mx-4 flex flex-col overflow-hidden pt-4 pb-8"
      lang={language}
      style={{ background: WALL, color: INK }}
    >
      <style>{`
        .ky-swing-1 { animation: ky-swing-1 2.2s cubic-bezier(.3,.7,.4,1) both; }
        .ky-swing-0 { animation: ky-swing-0 2.2s cubic-bezier(.3,.7,.4,1) both; }
        @keyframes ky-swing-1 { 0% { rotate: 0deg } 14% { rotate: 7deg } 34% { rotate: -5deg } 54% { rotate: 2.8deg } 74% { rotate: -1.2deg } 100% { rotate: 0deg } }
        @keyframes ky-swing-0 { 0% { rotate: 0deg } 14% { rotate: 7deg } 34% { rotate: -5deg } 54% { rotate: 2.8deg } 74% { rotate: -1.2deg } 100% { rotate: 0deg } }
        @media (prefers-reduced-motion: reduce) { .ky-swing-0, .ky-swing-1 { animation: none; } .ky-card { transition: none !important; } }
      `}</style>

      <div ref={stageRef} className="relative h-[408px]">
        {/* The hook rail and its peg. */}
        <span
          aria-hidden="true"
          className="absolute top-[22px] right-10 left-10 h-[3px] rounded-full bg-[#33312E]/20"
        />
        <span
          aria-hidden="true"
          className="absolute top-[16px] left-1/2 z-20 size-[15px] -translate-x-1/2 rounded-full bg-[#4A4440] shadow-[inset_0_-2px_0_rgba(0,0,0,0.25),0_3px_5px_-1px_rgba(0,0,0,0.3)]"
        />

        <div
          className={`absolute top-[23px] left-1/2 origin-top ${swing ? `ky-swing-${swing % 2}` : ""}`}
        >
          {/* Ring from the peg through the tag's hole. */}
          <svg
            aria-hidden="true"
            className="absolute -top-[2px] -left-[17px] z-10"
            height="58"
            viewBox="0 0 34 58"
            width="34"
          >
            <ellipse
              cx="17"
              cy="29"
              fill="none"
              rx="13"
              ry="26"
              stroke={BRASS}
              strokeWidth="3.5"
            />
          </svg>
          {/* The key hangs on the same ring, behind the tag, peeking out on the left. */}
          <div className="absolute top-[30px] -left-[28px] origin-top rotate-[40deg]">
            <Key />
          </div>

          <button
            aria-label={c.turn}
            aria-pressed={flipped}
            className="group absolute top-[28px] -left-[100px] h-[304px] w-[200px] rounded-[48px] outline-none [perspective:900px] focus-visible:ring-2 focus-visible:ring-[#33312E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#ECE3D2]"
            type="button"
            onClick={() => {
              setFlipped((v) => !v);
              if (!reduced) setSwing((n) => n + 1);
            }}
          >
            <div
              className="ky-card relative size-full transition-transform duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] [transform-style:preserve-3d] group-active:scale-[0.985]"
              style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}
            >
              {/* Front: the cross, the place and the host. */}
              <TagFace from="#E33A2C" to="#BB2418">
                <div className="flex flex-col items-center px-6 pt-[78px] text-white">
                  <SwissCross size={28} />
                  <p className="mt-4 font-serif text-[24px] leading-[27px] font-semibold text-balance">
                    {c.name}
                  </p>
                  <p className="mt-2.5 text-[12px] leading-4 font-medium text-white/90">
                    {c.place}
                  </p>
                  <p className="text-[12px] leading-4 font-medium text-white/90 tabular-nums">
                    {c.altitude}
                  </p>
                  <span className="mt-4 h-px w-10 bg-white/50" />
                  <p className="mt-3 text-[12px] leading-4 font-medium text-white/90">
                    {c.host}
                  </p>
                </div>
              </TagFace>

              {/* Back: the amenities as icons, stamped into the tag. */}
              <TagFace
                className="[transform:rotateY(180deg)]"
                from="#C42619"
                to="#9E1F15"
              >
                <div className="flex w-full flex-col items-center px-5 pt-[76px] text-white">
                  <SwissCross size={24} />
                  <span className="mt-3 h-px w-10 bg-white/50" />
                  <ul
                    aria-label={c.amenities}
                    className="mt-7 grid w-full grid-cols-3 gap-x-3 gap-y-7"
                  >
                    {AMENITIES.map(
                      ({ id, icon: Icon, confirmed, ...label }) => (
                        <li key={id} className="flex justify-center">
                          <span
                            className={`flex size-[44px] items-center justify-center rounded-full ${
                              confirmed
                                ? "bg-white text-[#9E1F15]"
                                : "border-[1.5px] border-dashed border-white/70 text-white/80"
                            }`}
                          >
                            <Icon aria-hidden="true" size={25} />
                            <span className="sr-only">{label[language]}</span>
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </TagFace>
            </div>
          </button>
        </div>
      </div>

      <p
        aria-live="polite"
        className="px-5 text-center text-[12px] leading-4 font-semibold text-[#33312E]/65"
      >
        {flipped ? c.hintBack : c.hint}
      </p>

      <div className="mx-5 mt-5 flex flex-col gap-3 rounded-2xl bg-white/60 p-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-serif text-[20px] leading-6 font-semibold">
            {c.routeTitle}
          </h3>
          <p className="text-[12px] leading-4 text-[#33312E]/65">
            {c.routeSub}
          </p>
        </div>
        <ul className="flex flex-col divide-y divide-[#33312E]/10">
          {c.routes.map((r) => (
            <li
              key={r.pass}
              className="flex items-baseline justify-between gap-3 py-2"
            >
              <span className="flex flex-col">
                <span className="font-serif text-[17px] leading-5 font-semibold">
                  {r.pass}
                </span>
                <span className="text-[12px] leading-4 text-[#33312E]/65">
                  {r.from}
                </span>
              </span>
              <span className="text-end text-[14px] leading-5 font-semibold tabular-nums">
                {r.time}
                <span className="block text-[12px] leading-4 font-normal text-[#33312E]/65">
                  {r.km} km
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="text-[12px] leading-4 text-[#33312E]/65">{c.routeNote}</p>
      </div>

      <div className="flex flex-col gap-3 px-5 pt-5">
        <p className="text-center text-[13px] leading-[18px] text-[#33312E]/75">
          {c.unknown}
        </p>
        <button
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-[#33312E] focus-visible:ring-offset-2 active:scale-[0.98]"
          type="button"
          onClick={() => setBooking(true)}
        >
          {c.cta}
          <ArrowRightIcon size={16} />
        </button>
        <a
          className="self-center text-[13px] leading-[18px] font-semibold text-[#33312E]/75 underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-[#33312E]"
          href={`mailto:${shop.email}?subject=${encodeURIComponent(c.name)}`}
        >
          {c.ask}
        </a>
      </div>

      <ListingBookingSheet
        isOpen={booking}
        kind="stay"
        onClose={() => setBooking(false)}
      />
    </section>
  );
}
