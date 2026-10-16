import type { LanguageStatus } from "../lib/completeness";
import type { Tour } from "@/features/tours/types";

import { languageStatus, missingText, tourText } from "../lib/completeness";

import { tourDays } from "@/features/tours/lib/selectors";
import { useLocale } from "@/contexts/locale-context";
import { useDemo, useDemoNow } from "@/features/demo";
import { demoNow } from "@/features/demo/clock";
import { createTourSeed } from "@/features/tours/seed";
import { formatMoney } from "@/lib/format";
import { pickText } from "@/lib/localized";

/** The M11 tabs (D3); the ids are the `tab` search param of /store/products. */
export const PRODUCT_TABS = ["tours", "stays", "experiences"] as const;
export type ProductTab = (typeof PRODUCT_TABS)[number];

export function isProductTab(value: unknown): value is ProductTab {
  return PRODUCT_TABS.includes(value as ProductTab);
}

export interface ProductRow {
  id: string;
  kind: Tour["kind"];
  /** Opens M13. */
  href: string;
  name: string;
  photo?: string;
  /** "2 h". */
  meta: string;
  published: boolean;
  /** Archived from the row menu: listed under "Archived" only, hidden from guests. */
  archived: boolean;
  languages: LanguageStatus;
  /** Footer and table facts, in column order: price, upcoming departures. */
  facts: { label: string; value: string; isWarning?: boolean }[];
}

/** Tours that have not started and are not cancelled, as M05 counts them. */
function upcomingCount(
  tour: Tour,
  departures: { tourId: string; startsAt: string; cancelledAt?: string }[],
  now: Date,
) {
  return departures.filter(
    (d) =>
      d.tourId === tour.id &&
      !d.cancelledAt &&
      Date.parse(d.startsAt) > now.getTime(),
  ).length;
}

/** M11 rows, in the seed's order (the host's own order): tours, the stay and the experience. */
export function useMerchantProducts() {
  const { t, language, intlLocale } = useLocale();
  const { state } = useDemo();
  const now = useDemoNow();
  const tourData = state.data.tours ?? createTourSeed();
  const money = (rappen: number) => formatMoney(rappen / 100, intlLocale);
  const pick = (text: Partial<Record<"en" | "de", string>>) =>
    pickText(text, language).text;

  const tourRow = (tour: Tour): ProductRow => ({
    id: tour.id,
    kind: tour.kind,
    href: `#/store/products/tours/${tour.id}`,
    name: pick(tour.name),
    photo: tour.photos[0],
    meta:
      tour.kind === "tour"
        ? t("products.durationDays", { hours: tourDays(tour) })
        : t("products.duration", {
            hours: new Intl.NumberFormat(intlLocale, {
              maximumFractionDigits: 1,
            }).format(tour.durationMinutes / 60),
          }),
    published: tour.published,
    archived: !!tour.archivedAt,
    languages: languageStatus(missingText(tourText(tour))),
    facts: [
      { label: t("products.fact.adults"), value: money(tour.adultPrice) },
      {
        label: t("products.fact.upcoming"),
        value: String(upcomingCount(tour, tourData.departures, now)),
      },
    ],
  });

  const rows = tourData.tours.map(tourRow);

  return {
    tours: rows.filter((r) => r.kind === "tour"),
    stays: rows.filter((r) => r.kind === "stay"),
    experiences: rows.filter((r) => r.kind === "experience"),
  };
}

/**
 * Archive and restore from the M11 row menu (owner, 15.10.2026). Archiving unpublishes the
 * tour, hides it from guests and moves it under "Archived"; bookings that point at it are
 * kept. Restoring brings it back as a draft to publish again.
 */
export function useProductArchive() {
  const { update } = useDemo();

  const set = (id: string, archive: boolean) =>
    update((s) => {
      const at = archive ? demoNow(s.clockStartedAt).toISOString() : undefined;
      const tours = s.data.tours ?? createTourSeed();

      return {
        ...s,
        data: {
          ...s.data,
          tours: {
            ...tours,
            tours: tours.tours.map((t) =>
              t.id === id ? { ...t, archivedAt: at, published: false } : t,
            ),
          },
        },
      };
    });

  return {
    archive: (id: string) => set(id, true),
    restore: (id: string) => set(id, false),
  };
}
