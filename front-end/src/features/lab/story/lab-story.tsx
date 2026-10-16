/**
 * Throwaway design lab (#/lab/story): the home page retold as Erich's story, in three
 * directions. A switcher picks the direction and the language; each direction is a whole
 * home page that reuses the approved home blocks as its chapters. The real home is not
 * changed until a direction is chosen.
 */
import type { StoryLanguage } from "./copy";

import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

import { CinematicOriginal } from "./cinematic/b1-original";
import { CinematicScrollOver } from "./cinematic/b2-scroll-over";
import { CinematicMagazine } from "./cinematic/b3-magazine";
import { CinematicReel } from "./cinematic/b4-reel";
import { CinematicLetterbox } from "./cinematic/b5-letterbox";
import { labChrome, storyCopy } from "./copy";
import { StoryDay } from "./story-day";
import { StoryJournal } from "./story-journal";

import { useLocale } from "@/contexts/locale-context";

export interface StorySearch {
  dir: number;
  /** Variant inside the cinematic direction (B), 1-based. */
  v: number;
  lang: StoryLanguage;
}

export const CINEMATIC = [
  CinematicOriginal,
  CinematicScrollOver,
  CinematicMagazine,
  CinematicReel,
  CinematicLetterbox,
];

export const DIRECTIONS = [StoryJournal, CINEMATIC, StoryDay] as const;

const CINEMATIC_DIR = 2;

function Segment<T extends string | number>({
  label,
  value,
  options,
  field,
  search,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  field: keyof StorySearch;
  search: StorySearch;
}) {
  return (
    <div
      aria-label={label}
      className="flex flex-1 gap-1 rounded-full bg-default p-1"
      role="group"
    >
      {options.map((o) => (
        <Link
          key={String(o.value)}
          replace
          aria-current={o.value === value ? "true" : undefined}
          className={`flex min-h-11 flex-1 items-center justify-center rounded-full px-2 text-[13px] font-semibold outline-none focus-visible:focus-ring ${
            o.value === value
              ? "bg-surface text-foreground shadow-surface"
              : "text-muted"
          }`}
          search={{ ...search, [field]: o.value }}
          to="/lab/story"
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}

export function LabStory({ search }: { search: StorySearch }) {
  const { language, setLanguage } = useLocale();
  const t = labChrome[search.lang];
  const isCinematic = search.dir === CINEMATIC_DIR;
  const Direction = isCinematic
    ? CINEMATIC[search.v - 1]
    : (DIRECTIONS[search.dir - 1] as typeof StoryJournal);
  const note = isCinematic
    ? t.variants[search.v - 1][1]
    : t.notes[search.dir - 1];

  // The reused home blocks read the app language, so the lab keeps it in step.
  useEffect(() => {
    if (language !== search.lang) setLanguage(search.lang);
  }, [language, search.lang, setLanguage]);

  return (
    <div lang={search.lang}>
      <div className="flex flex-col gap-2 border-b border-separator bg-surface px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-3">
        <h1 className="text-[15px] leading-5 font-semibold">{t.title}</h1>
        <Segment
          field="dir"
          label={t.direction}
          options={t.names.map((name, i) => ({
            value: i + 1,
            label: `${String.fromCharCode(65 + i)} · ${name}`,
          }))}
          search={search}
          value={search.dir}
        />
        {isCinematic && (
          <Segment
            field="v"
            label={t.variant}
            options={t.variants.map((_, i) => ({
              value: i + 1,
              label: `B${i + 1}`,
            }))}
            search={search}
            value={search.v}
          />
        )}
        <div className="flex items-center gap-3">
          <p className="min-w-0 flex-1 text-[13px] leading-[18px] text-muted">
            {isCinematic && (
              <span className="font-semibold text-foreground">
                B{search.v} · {t.variants[search.v - 1][0]}{" "}
              </span>
            )}
            {note}
          </p>
          <div className="w-28 shrink-0">
            <Segment
              field="lang"
              label={t.language}
              options={[
                { value: "en" as StoryLanguage, label: "EN" },
                { value: "de" as StoryLanguage, label: "DE" },
              ]}
              search={search}
              value={search.lang}
            />
          </div>
        </div>
      </div>
      <div key={`${search.dir}${search.v}${search.lang}`}>
        <Direction c={storyCopy[search.lang]} />
      </div>
    </div>
  );
}
