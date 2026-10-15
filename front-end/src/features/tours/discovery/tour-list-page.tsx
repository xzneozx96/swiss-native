import { Link } from "@tanstack/react-router";

import { TourCard } from "./tour-card";

import { EmptyState } from "@/components/empty-state";
import {
  ChevronRightIcon,
  TourIcon,
  TravelGroupIcon,
} from "@/components/icons";
import { Media } from "@/components/media";
import { CompactBar, SearchButton } from "@/components/layout/top-bar-buttons";
import { useScrolledPast } from "@/hooks/use-scrolled-past";
import { useLocale } from "@/contexts/locale-context";
import { useTours } from "@/features/tours/hooks/use-tours";

export function TourListPage() {
  // A tour added in M13 stays off C08 until its first publish; the seeded Pilatus draft
  // still shows as "Coming soon" (owner note, 15.10.2026). An archived tour is gone.
  const tours = useTours().tours.filter(
    (tour) => !tour.unannounced && !tour.archivedAt,
  );
  const { t } = useLocale();
  const [bannerEnd, scrolledPast] = useScrolledPast<HTMLDivElement>();

  return (
    <div className="flex flex-1 flex-col">
      <CompactBar title={t("tourDiscovery.title")} visible={scrolledPast}>
        <SearchButton label={t("search.label")} to="/search" tone="bar" />
      </CompactBar>
      <Media alt="" className="h-[260px]" photo={tours[0]?.photos[0]}>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70"
        />
        <div className="absolute inset-x-4 top-[calc(env(safe-area-inset-top,0px)+12px)] flex items-center justify-end gap-2">
          <SearchButton label={t("search.label")} to="/search" />
        </div>
        <header className="absolute inset-x-4 bottom-10 flex flex-col gap-1 text-white">
          <h1 className="font-serif text-display">
            {t("tourDiscovery.title")}
          </h1>
          <p className="text-body text-white/85">{t("tourDiscovery.intro")}</p>
        </header>
      </Media>
      <div ref={bannerEnd} aria-hidden className="h-px" />
      <div className="relative -mt-6 flex flex-col gap-5 rounded-t-3xl bg-background px-4 pt-5 pb-4">
        {tours.length === 0 ? (
          <EmptyState icon={TourIcon} message={t("tourDiscovery.empty")} />
        ) : (
          <ul className="flex flex-col gap-7">
            {tours.map((tour) => (
              <li key={tour.id}>
                <TourCard tour={tour} />
              </li>
            ))}
          </ul>
        )}
        <PrivateTourEntry />
      </div>
    </div>
  );
}

/**
 * C22's entry below the list (outline step 6), shown even with no tours: a white card with
 * C07's link row, ink rather than red so the tour cards stay the screen's focus.
 */
function PrivateTourEntry() {
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="private-tour-entry"
      className="mt-3 flex flex-col divide-y divide-separator rounded-3xl bg-surface shadow-surface"
    >
      <div className="flex items-start gap-4 p-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-secondary">
          <TravelGroupIcon aria-hidden size={22} />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="font-serif text-card-title" id="private-tour-entry">
            {t("privateTour.entry.title")}
          </h2>
          <p className="text-sm text-muted">{t("privateTour.entry.body")}</p>
        </div>
      </div>
      <Link
        className="flex min-h-12 items-center justify-between gap-3 rounded-b-3xl px-5 text-sm font-medium outline-none hover:bg-surface-secondary focus-visible:focus-ring"
        to="/tours/private-tour"
      >
        {t("privateTour.entry.action")}
        <ChevronRightIcon aria-hidden className="shrink-0" size={18} />
      </Link>
    </section>
  );
}
