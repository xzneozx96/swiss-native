import { createFileRoute, redirect } from "@tanstack/react-router";

const TAB_PAGES = {
  tours: "/store/products/tours",
  stays: "/store/products/stays",
  experiences: "/store/products/experiences",
} as const;

type Tab = keyof typeof TAB_PAGES;

const isTab = (value: unknown): value is Tab =>
  typeof value === "string" && value in TAB_PAGES;

// M11 Products. The host offers tours, a stay and an experience, so the index opens Tours;
// the old `?tab=` links still land on the right page. M13 is /store/products/tours/$tourId.
export const Route = createFileRoute("/store/products/")({
  validateSearch: (search: Record<string, unknown>): { tab?: Tab } => ({
    tab: isTab(search.tab) ? search.tab : undefined,
  }),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: TAB_PAGES[search.tab ?? "tours"],
      replace: true,
    });
  },
});
