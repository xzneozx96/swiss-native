import type { Tour } from "@/features/tours/types";

import { Skeleton } from "@heroui/react";

import { ExperienceFlight } from "./experience-flight";
import { Hero } from "./hero";
import { Rail, Section } from "./section";
import { StayKey } from "./stay-key";

import { BrandLogo } from "@/components/layout/brand-logo";
import { CompactBar, SearchButton } from "@/components/layout/top-bar-buttons";
import { TourCard } from "@/features/tours/discovery/tour-card";
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
 * C01 Discovery home: hero with search, then the host's three services in order, each
 * introduced in its own section: tours, the stay, the experience.
 */
export function DiscoveryHome({
  view,
  isLoading,
}: {
  view: DiscoveryHomeView;
  isLoading: boolean;
}) {
  const { hero, tours } = view;

  const [heroEnd, scrolledPast] = useScrolledPast<HTMLDivElement>();

  return (
    <>
      <CompactBar visible={scrolledPast}>
        <div className="min-w-0 flex-1">
          <BrandLogo compact label={hero.appName} />
        </div>
        <SearchButton label={hero.searchLabel} to="/search" tone="bar" />
      </CompactBar>
      <div className="flex flex-col gap-9 px-4 pb-4">
        <Hero ref={heroEnd} {...hero} />

        <Section
          id="tours"
          seeAll={{ label: tours.seeAll, to: "/tours" }}
          subtitle={tours.subtitle}
          title={tours.title}
        >
          {isLoading ? (
            <RailSkeleton />
          ) : (
            <Rail label={tours.title}>
              {tours.items.map((item) => (
                <li key={item.id}>
                  <TourCard layout="carousel" tour={item} />
                </li>
              ))}
            </Rail>
          )}
        </Section>

        <StayKey />
        <ExperienceFlight />
      </div>
    </>
  );
}
