import type { SearchResultGroup } from "@/features/search/components/global-search";

import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";

import { useLocale } from "@/contexts/locale-context";
import { useDemo } from "@/features/demo";
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

  const query = q.trim().toLocaleLowerCase(intlLocale);
  const matches = (...texts: (string | undefined)[]) =>
    texts.some((text) => text?.toLocaleLowerCase(intlLocale).includes(query));

  const groups: SearchResultGroup[] = [];

  if (query) {
    const tours = (state.data.tours?.tours ?? []).filter(
      (tour) =>
        tour.published &&
        matches(
          pickText(tour.name, language).text,
          pickText(tour.summary, language).text,
        ),
    );

    if (tours.length)
      groups.push({
        title: t("search.group.tours"),
        rows: tours.map((tour) => ({
          key: tour.id,
          title: pickText(tour.name, language).text,
          meta: `${t("tourDiscovery.duration", { hours: tour.durationMinutes / 60 })} · ${t("home.from")} ${formatMoney(tour.adultPrice / 100, intlLocale)}`,
          photo: tour.photos[0],
          link: { to: "/tours/$slug", params: { slug: tour.slug } },
        })),
      });
  }

  return (
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
  );
}
