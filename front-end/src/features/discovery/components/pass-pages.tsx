/**
 * The five pass stories (from the client's guide, 17.10.2026) as pages: an overview at
 * /passes and one story per pass at /passes/:pass. Written in Erich's voice, so each page
 * ends with the same voice note as the home text. A story is a photo-led opening, the
 * story itself, "a closer look" with the other four photos, and the neighbouring passes.
 */
import type { PassId } from "../pass-stories";

import { buttonVariants } from "@heroui/react";
import { Link } from "@tanstack/react-router";

import {
  PASS_HEIGHTS,
  PASS_IDS,
  passPhotos,
  passesCopy,
} from "../pass-stories";
import { storyCopy } from "../story-copy";

import { ArrowRightIcon, BackIcon, ChevronRightIcon } from "@/components/icons";
import { useLocale } from "@/contexts/locale-context";
import { shop } from "@/features/catalog/seed";
import { useReveal } from "@/hooks/use-reveal";
import { photoUrl } from "@/lib/photos";

const heightLabel = (id: PassId) =>
  `${PASS_HEIGHTS[id].toLocaleString("de-CH")} m`;

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

function BackLink({ to, label }: { to: "/" | "/passes"; label: string }) {
  return (
    <Link
      aria-label={label}
      className="glass absolute start-4 top-[calc(env(safe-area-inset-top,0px)+12px)] z-10 flex size-11 items-center justify-center rounded-full text-white outline-none focus-visible:focus-ring active:scale-95"
      to={to}
    >
      <BackIcon size={22} />
    </Link>
  );
}

function Hero({
  photo,
  alt,
  back,
  children,
}: {
  photo: string;
  alt: string;
  back: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-[62svh] min-h-[400px] overflow-hidden bg-black">
      <img
        alt={alt}
        className="story-kenburns absolute inset-0 size-full object-cover"
        src={photoUrl(photo)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 via-55% to-black/35" />
      {back}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5 pb-6 text-white">
        {children}
      </div>
    </div>
  );
}

function Figure({
  photo,
  caption,
  className,
}: {
  photo: string;
  caption: string;
  className: string;
}) {
  return (
    <figure className="flex flex-col gap-1.5">
      <img
        alt=""
        className={`w-full rounded-2xl object-cover ${className}`}
        decoding="async"
        loading="lazy"
        src={photoUrl(photo)}
      />
      <figcaption className="text-xs leading-4 text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}

function NeighbourLink({
  id,
  label,
  align,
}: {
  id: PassId;
  label: string;
  align: "start" | "end";
}) {
  const { language } = useLocale();
  const story = passesCopy[language].stories[id];

  return (
    <Link
      className={`relative flex min-h-24 flex-1 overflow-hidden rounded-2xl bg-black text-white outline-none focus-visible:focus-ring active:scale-[0.98] ${align === "end" ? "text-end" : ""}`}
      params={{ pass: id }}
      to="/passes/$pass"
    >
      <img
        alt=""
        className="absolute inset-0 size-full object-cover opacity-70"
        decoding="async"
        loading="lazy"
        src={photoUrl(passPhotos(id)[0])}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
      <span
        className={`relative flex w-full flex-col justify-end p-3 ${align === "end" ? "items-end" : ""}`}
      >
        <span className="text-[11px] font-semibold tracking-[0.14em] uppercase opacity-85">
          {label}
        </span>
        <span className="font-script text-[26px] leading-7">{story.name}</span>
      </span>
    </Link>
  );
}

export function PassStoryPage({ id }: { id: PassId }) {
  const { language } = useLocale();
  const copy = passesCopy[language];
  const story = copy.stories[id];
  const photos = passPhotos(id);
  const at = PASS_IDS.indexOf(id);
  const previous = PASS_IDS[at - 1];
  const next = PASS_IDS[at + 1];
  const [, wide1, half1, half2, wide2] = photos;
  const [, cap1, cap2, cap3, cap4] = story.captions;

  return (
    <article className="flex flex-col gap-9 pb-6">
      <Hero
        alt={story.heroAlt}
        back={<BackLink label={copy.ui.back} to="/passes" />}
        photo={photos[0]}
      >
        <span className="text-xs font-semibold tracking-[0.16em] uppercase opacity-85">
          {copy.ui.chapter(at + 1, PASS_IDS.length)} · {heightLabel(id)}
        </span>
        <h1 className="font-script text-[64px] leading-[56px]">{story.name}</h1>
        <p className="font-serif text-[20px] leading-7 text-balance italic">
          {story.tagline}
        </p>
        <p className="pt-1 text-xs tracking-[0.12em] uppercase opacity-75">
          {story.themes}
        </p>
      </Hero>

      <div className="flex flex-col gap-4 px-4">
        {story.paragraphs.map((p, i) => (
          <Reveal key={p.slice(0, 24)}>
            <p
              className={
                i === 0
                  ? "font-serif text-[22px] leading-8 text-balance"
                  : "font-serif text-[17px] leading-7 text-foreground/85"
              }
            >
              {p}
            </p>
          </Reveal>
        ))}
      </div>

      <section className="flex flex-col gap-4 px-4">
        <Reveal className="flex flex-col gap-1.5">
          <p className="text-label text-muted">{copy.ui.closerLook}</p>
          <h2 className="font-serif text-[24px] leading-8 text-balance">
            {story.closerTitle}
          </h2>
        </Reveal>
        <Figure caption={cap1} className="aspect-[4/3]" photo={wide1} />
        <div className="grid grid-cols-2 gap-3">
          <Figure caption={cap2} className="aspect-square" photo={half1} />
          <Figure caption={cap3} className="aspect-square" photo={half2} />
        </div>
        <Figure caption={cap4} className="aspect-[4/3]" photo={wide2} />
        <Reveal>
          <p className="font-serif text-[17px] leading-7 text-foreground/85">
            {story.closer}
          </p>
        </Reveal>
        <p className="text-xs leading-4 text-muted italic">
          {storyCopy[language].voiceNote}
        </p>
      </section>

      <nav aria-label={copy.ui.all} className="flex flex-col gap-3 px-4">
        <div className="flex gap-3">
          {previous ? (
            <NeighbourLink
              align="start"
              id={previous}
              label={copy.ui.previous}
            />
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <NeighbourLink align="end" id={next} label={copy.ui.next} />
          ) : (
            <span className="flex-1" />
          )}
        </div>
        <Link
          className="flex min-h-11 items-center justify-center gap-1 rounded-full bg-default text-sm font-semibold outline-none focus-visible:focus-ring active:scale-[0.98]"
          to="/passes"
        >
          {copy.ui.all}
          <ChevronRightIcon size={16} />
        </Link>
      </nav>
    </article>
  );
}

export function PassesIndexPage() {
  const { language } = useLocale();
  const copy = passesCopy[language];
  const { index } = copy;

  return (
    <article className="flex flex-col gap-9 pb-6">
      <Hero
        alt={index.coverAlt}
        back={<BackLink label={copy.ui.back} to="/" />}
        photo="story-gotthard-4"
      >
        <span className="text-xs font-semibold tracking-[0.16em] uppercase opacity-85">
          {index.kicker}
        </span>
        <h1 className="font-serif text-[32px] leading-10 text-balance">
          {index.title}
        </h1>
        <p className="font-serif text-lg italic">{index.subtitle}</p>
      </Hero>

      <div className="flex flex-col gap-4 px-4">
        {index.paragraphs.map((p, i) => (
          <Reveal key={p.slice(0, 24)}>
            <p
              className={
                i === 0
                  ? "font-serif text-[22px] leading-8 text-balance"
                  : "font-serif text-[17px] leading-7 text-foreground/85"
              }
            >
              {p}
            </p>
          </Reveal>
        ))}
      </div>

      <section
        aria-labelledby="passes-chapters"
        className="flex flex-col gap-3 px-4"
      >
        <h2 className="text-heading" id="passes-chapters">
          {index.chapters}
        </h2>
        <ol className="flex flex-col gap-3">
          {PASS_IDS.map((id, i) => {
            const story = copy.stories[id];

            return (
              <li key={id}>
                <Link
                  aria-label={`${story.name}, ${story.tagline}`}
                  className="flex items-center gap-3 rounded-2xl bg-surface p-2 pe-3 shadow-surface outline-none focus-visible:focus-ring active:scale-[0.98]"
                  params={{ pass: id }}
                  to="/passes/$pass"
                >
                  <img
                    alt=""
                    className="size-20 shrink-0 rounded-xl object-cover"
                    decoding="async"
                    loading="lazy"
                    src={photoUrl(passPhotos(id)[0])}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase tabular-nums">
                      {String(i + 1).padStart(2, "0")} · {heightLabel(id)}
                    </span>
                    <span className="font-script text-[28px] leading-8">
                      {story.name}
                    </span>
                    <span className="text-xs leading-4 text-muted">
                      {story.themes}
                    </span>
                  </span>
                  <ChevronRightIcon className="shrink-0 text-muted" size={20} />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="flex flex-col gap-4 px-4">
        <Reveal className="flex flex-col gap-1.5">
          <p className="text-label text-muted">{index.journeyKicker}</p>
          <h2 className="font-serif text-[26px] leading-8 text-balance">
            {index.journeyTitle}
          </h2>
        </Reveal>
        {index.journey.map((p) => (
          <Reveal key={p.slice(0, 24)}>
            <p className="font-serif text-[17px] leading-7 text-foreground/85">
              {p}
            </p>
          </Reveal>
        ))}
        <p className="text-xs leading-4 text-muted italic">
          {storyCopy[language].voiceNote}
        </p>
      </section>

      <section className="mx-4 flex flex-col gap-3 rounded-3xl bg-surface p-5 shadow-surface">
        <h2 className="font-serif text-[22px] leading-7">{index.ctaTitle}</h2>
        <p className="text-body text-muted">{index.ctaBody}</p>
        <a
          className={`${buttonVariants({ variant: "primary" })} transition-transform active:scale-[0.98]`}
          href={`mailto:${shop.email}?subject=${encodeURIComponent(index.ctaSubject)}`}
        >
          {index.ctaAction}
          <ArrowRightIcon size={16} />
        </a>
      </section>

      <p className="px-4 text-xs leading-4 text-muted">{index.notice}</p>
    </article>
  );
}
