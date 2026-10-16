import type { Tour } from "@/features/tours/types";

import { Skeleton } from "@heroui/react";

import { storyCopy } from "../story-copy";

import { ExperienceFlight } from "./experience-flight";
import { Rail, Section } from "./section";
import { StayKey } from "./stay-key";
import { PassStrip, StoryChapter, StoryEpilogue } from "./story-chapter";
import { StoryReel } from "./story-reel";

import { BrandLogo } from "@/components/layout/brand-logo";
import { CompactBar, SearchButton } from "@/components/layout/top-bar-buttons";
import { useLocale } from "@/contexts/locale-context";
import { TourCard } from "@/features/tours/discovery/tour-card";
import { useReveal } from "@/hooks/use-reveal";
import { useScrolledPast } from "@/hooks/use-scrolled-past";

export interface DiscoveryHomeView {
  hero: {
    appName: string;
    hello: string;
    title: string;
    photoAlt: string;
    searchLabel: string;
    searchPrompt: string;
  };
  tours: {
    title: string;
    subtitle: string;
    seeAll: string;
    items: Tour[];
  };
}

function RailSkeleton() {
  return (
    <div className="-mx-4 flex gap-3 overflow-hidden px-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex w-60 shrink-0 flex-col gap-3">
          <Skeleton className="aspect-[4/3] rounded-3xl" />
          <Skeleton className="h-5 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/3 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

/**
 * C01 Discovery home as Erich's story (B4 "Story reel", approved 16.10.2026): a reel of
 * four pictures (Erich, then his three offers), his introduction in his voice, then
 * one chapter per offer: tours, the bee house, the stay. Each chapter opens on a photo
 * and keeps its approved blocks, run full width. It ends on a dark epilogue scene with
 * his handwritten line and Ask Erich.
 * Search sits in the reel and in the collapsing header.
 */
export function DiscoveryHome({
  view,
  isLoading,
}: {
  view: DiscoveryHomeView;
  isLoading: boolean;
}) {
  const { hero, tours } = view;
  const { language } = useLocale();
  const c = storyCopy[language];
  const [reelEnd, scrolledPast] = useScrolledPast<HTMLDivElement>();
  const ledeRef = useReveal<HTMLDivElement>();

  return (
    <>
      <CompactBar visible={scrolledPast}>
        <div className="min-w-0 flex-1">
          <BrandLogo compact label={hero.appName} />
        </div>
        <SearchButton label={hero.searchLabel} to="/search" tone="bar" />
      </CompactBar>
      <div className="flex flex-col gap-10 px-4 pb-4">
        <h1 className="sr-only">
          {c.name}, {c.role}
        </h1>
        <StoryReel c={c} searchLabel={hero.searchLabel} />
        <div ref={reelEnd} aria-hidden className="-mt-10 h-px" />

        <div ref={ledeRef} className="reveal flex flex-col gap-4">
          <p className="font-serif text-[24px] leading-9 text-balance">
            {c.lede}
          </p>
          <p className="font-serif text-[17px] leading-7 text-foreground/85">
            {c.body}
          </p>
          <p className="text-xs leading-4 text-muted italic">{c.voiceNote}</p>
        </div>

        <StoryChapter c={c} id="tours">
          <div className="flex flex-col gap-9 pt-2">
            <Section
              id="story-passes"
              level={3}
              subtitle={c.passes.subtitle}
              title={c.passes.title}
            >
              <PassStrip c={c} />
            </Section>
            <Section
              id="tours"
              level={3}
              seeAll={{ label: tours.seeAll, to: "/tours" }}
              subtitle={c.tours.subtitle}
              title={c.tours.title}
            >
              {isLoading ? (
                <RailSkeleton />
              ) : (
                <Rail label={c.tours.title}>
                  {tours.items.map((item) => (
                    <li key={item.id}>
                      <TourCard layout="carousel" tour={item} />
                    </li>
                  ))}
                </Rail>
              )}
            </Section>
          </div>
        </StoryChapter>

        <StoryChapter c={c} id="bees">
          <ExperienceFlight />
        </StoryChapter>

        <StoryChapter c={c} id="stay">
          <StayKey />
        </StoryChapter>

        <StoryEpilogue c={c} />
      </div>
    </>
  );
}
