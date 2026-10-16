import type { SearchResultGroup } from "@/features/search/components/global-search";

import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";

import { useLocale } from "@/contexts/locale-context";
import { useDemo } from "@/features/demo";
import { ListingBookingSheet } from "@/features/tours/discovery/listing-booking-sheet";
import { isTour } from "@/features/tours/lib/selectors";
import { GlobalSearch } from "@/features/search/components/global-search";
import { formatMoney } from "@/lib/format";
import { pickText } from "@/lib/localized";

// Global search from the discovery home (UX proposal: search is not in the spec).
export const Route = createFileRoute("/_guest/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string } =>
    typeof search.q === "string" && search.q ? { q: search.q } : {},
  component: SearchPage,
});

function SearchPage() {
  const { t, language, intlLocale } = useLocale();
  const { state } = useDemo();
  const { q = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const router = useRouter();
  const [booking, setBooking] = useState<"stay" | "experience" | null>(null);

  const query = q.trim().toLocaleLowerCase(intlLocale);
  const matches = (...texts: (string | undefined)[]) =>
    texts.some((text) => text?.toLocaleLowerCase(intlLocale).includes(query));

  const groups: SearchResultGroup[] = [];

  const allTours = state.data.tours?.tours ?? [];
  const textOf = (tour: (typeof allTours)[number]) => [
    pickText(tour.name, language).text,
    pickText(tour.summary, language).text,
  ];
  const meta = (tour: (typeof allTours)[number]) =>
    tour.kind === "tour"
      ? `${t("tourDiscovery.duration", { hours: tour.durationMinutes / 60 })} · ${t("home.from")} ${formatMoney(tour.adultPrice / 100, intlLocale)}`
      : `${t("home.from")} ${formatMoney(tour.adultPrice / 100, intlLocale)}`;
  const row = (tour: (typeof allTours)[number]) => ({
    key: tour.id,
    title: pickText(tour.name, language).text,
    meta: meta(tour),
    photo: tour.photos[0],
    ...(tour.kind === "tour"
      ? { link: { to: "/tours/$slug" as const, params: { slug: tour.slug } } }
      : { onSelect: () => setBooking(tour.kind as "stay" | "experience") }),
  });
  const visible = allTours.filter(
    (tour) => tour.published && (!query || matches(...textOf(tour))),
  );
  const tours = visible.filter(isTour);
  const listings = visible.filter((tour) => !isTour(tour));

  if (query) {
    if (tours.length)
      groups.push({ title: t("search.group.tours"), rows: tours.map(row) });
    if (listings.length)
      groups.push({
        title: t("search.group.stays"),
        rows: listings.map(row),
      });
  } else {
    groups.push({
      title: t("search.group.suggested"),
      rows: [...tours.slice(0, 3), ...listings].map(row),
    });
  }

  return (
    <>
      <GlobalSearch
        backLabel={t("search.back")}
        groups={groups}
        label={t("search.label")}
        noResults={
          query && groups.length === 0
            ? t("search.noResults", { query: q.trim() })
            : null
        }
        placeholder={t("search.placeholder")}
        query={q}
        onBack={() => router.history.back()}
        onQueryChange={(value) =>
          void navigate({ search: { q: value || undefined }, replace: true })
        }
      />
      {booking && (
        <ListingBookingSheet
          isOpen
          kind={booking}
          onClose={() => setBooking(null)}
        />
      )}
    </>
  );
}
