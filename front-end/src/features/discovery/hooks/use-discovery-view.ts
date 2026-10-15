import type { DiscoveryHomeView } from "../components/discovery-home";

import { useLocale } from "@/contexts/locale-context";
import { useDemo } from "@/features/demo";

/** Builds the discovery home from the tour data and the language. */
export function useDiscoveryView(): DiscoveryHomeView {
  const { t } = useLocale();
  const { state } = useDemo();

  const tours = (state.data.tours?.tours ?? []).filter(
    (tour) => tour.published,
  );

  return {
    hero: {
      appName: t("app.name"),
      hello: t("home.hello"),
      title: t("home.heroTitle"),
      photoAlt: t("home.photoAlt"),
      searchLabel: t("search.open"),
      searchPrompt: t("home.searchPrompt"),
    },
    tours: {
      title: t("home.tours.title"),
      subtitle: t("home.tours.subtitle"),
      seeAll: t("home.seeAll"),
      items: tours,
    },
  };
}
