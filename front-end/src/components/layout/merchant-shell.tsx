import type { IconComponent } from "@/components/icons";
import type { MessageKey } from "@/i18n/en";
import type { LinkProps } from "@tanstack/react-router";

import { Drawer } from "@heroui/react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import {
  BookingsIcon,
  ChevronDownIcon,
  MoreIcon,
  ProductsIcon,
  SettingsIcon,
  TodayIcon,
} from "@/components/icons";
import { MerchantBarSlot } from "@/components/layout/merchant-back-bar";
import { useLocale } from "@/contexts/locale-context";
import { shop } from "@/features/catalog/seed";

export type MerchantSection = "bookings" | "products" | "settings";

type NavItem =
  | { kind: "today"; label: MessageKey; icon: IconComponent }
  | {
      kind: "section";
      section: MerchantSection;
      label: MessageKey;
      icon: IconComponent;
    };

/** Dashboard sections in the order of UX spec §3.2. */
const allItems: NavItem[] = [
  { kind: "today", label: "nav.today", icon: TodayIcon },
  {
    kind: "section",
    section: "bookings",
    label: "nav.bookings",
    icon: BookingsIcon,
  },
  {
    kind: "section",
    section: "products",
    label: "nav.products",
    icon: ProductsIcon,
  },
  {
    kind: "section",
    section: "settings",
    label: "nav.settings",
    icon: SettingsIcon,
  },
];

const sectionRoutes = {
  bookings: "/store/bookings",
  products: "/store/products",
} as const;

const phonePrimary = allItems.slice(0, 3);
const phoneMore = allItems.slice(3);

function NavLink({
  item,
  className,
  children,
  onClick,
}: {
  item: NavItem;
  className: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { pathname } = useLocation();

  if (item.kind === "today") {
    return (
      <Link
        // Overview stays active on both its pages, Today (/store) and Sales.
        activeOptions={{ exact: true }}
        className={className}
        data-status={isOverviewPath(pathname) ? "active" : undefined}
        to="/store"
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }
  // Sections with their own screens (bookings, products). Settings is still a placeholder.
  if (item.section !== "settings") {
    return (
      <Link
        className={className}
        to={sectionRoutes[item.section]}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      className={className}
      params={{ section: item.section }}
      to="/store/$section"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

const sideLink =
  "flex h-10 items-center gap-3 rounded-2xl px-3 text-sm text-muted outline-none hover:bg-default focus-visible:focus-ring data-[status=active]:bg-default data-[status=active]:font-semibold data-[status=active]:text-foreground";

/** A parent row: no active fill of its own, the open page below carries it. */
const parentLink =
  "flex h-10 items-center gap-3 rounded-2xl px-3 text-sm text-foreground outline-none hover:bg-default focus-visible:focus-ring";

const subLink =
  "flex h-9 items-center rounded-xl ps-11 pe-3 text-sm text-muted outline-none hover:bg-default focus-visible:focus-ring data-[status=active]:bg-default data-[status=active]:font-semibold data-[status=active]:text-foreground";

/** A page listed under its section in the sidebar; the label is already in the UI language. */
export interface MerchantSubPage {
  label: string;
  to: LinkProps["to"];
}

/** M02 Overview's pages, listed under Overview in the sidebar (owner review 15.10.2026). */
const overviewPages = [
  { label: "overviewPages.today", to: "/store" },
  { label: "overviewPages.sales", to: "/store/sales" },
] as const satisfies readonly { label: MessageKey; to: LinkProps["to"] }[];

const isOverviewPath = (pathname: string) =>
  overviewPages.some((page) => page.to === pathname);

const tabLink =
  "group relative flex h-16 w-full flex-col items-center justify-center gap-1 text-xs text-muted outline-none focus-visible:focus-ring data-[status=active]:font-semibold data-[status=active]:text-accent";

/**
 * Merchant dashboard frame (UX spec §3.2). Phones: bottom navigation with Today,
 * Bookings, Products and More (a sheet with the other sections). From 1024px: a sidebar.
 */
export function MerchantShell({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const staffName = shop.ownerName;
  const staffRole = t("staff.owner");
  const [moreOpen, setMoreOpen] = useState(false);
  // Sections with pages start unfolded; the set holds the ones the user folded.
  const [folded, setFolded] = useState<Set<string>>(new Set());
  const [barSlot, setBarSlot] = useState<HTMLElement | null>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const pagesOf = (item: NavItem): MerchantSubPage[] =>
    item.kind === "today"
      ? overviewPages.map((page) => ({ label: t(page.label), to: page.to }))
      : [];
  const labelOf = (item: NavItem) => t(item.label);

  return (
    <div className="flex flex-1">
      {/* The aside stretches with the page; its contents stay pinned while the page scrolls. */}
      <aside className="hidden w-64 shrink-0 border-e border-separator bg-surface lg:block">
        <div className="sticky top-0 flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-0.5 px-3 pt-2">
            <span className="text-heading">{shop.name}</span>
            <span className="text-label text-muted">
              {staffName} · {staffRole}
            </span>
          </div>
          <nav aria-label={t("nav.merchant.label")}>
            <ul className="flex flex-col gap-1">
              {allItems.map((item) => {
                const pages = pagesOf(item);
                const id = `nav-pages-${item.label.replace(".", "-")}`;
                const inside = pages.some((page) => page.to === pathname);
                const isOpen = !folded.has(item.label);

                return (
                  <li key={item.label}>
                    {pages.length ? (
                      // A parent with pages. Inside its section the row folds or unfolds them;
                      // from another section it unfolds them and opens the first page. Folded
                      // while one of its pages is open, it shows where you are.
                      <button
                        aria-controls={id}
                        aria-expanded={isOpen}
                        className={`${parentLink} w-full text-start ${
                          !isOpen && inside ? "bg-default font-semibold" : ""
                        }`}
                        type="button"
                        onClick={() => {
                          const next = new Set(folded);

                          if (isOpen && inside) next.add(item.label);
                          else {
                            next.delete(item.label);
                            void navigate({ to: pages[0].to });
                          }
                          setFolded(next);
                        }}
                      >
                        <item.icon size={20} />
                        <span className="flex-1">{labelOf(item)}</span>
                        <ChevronDownIcon
                          aria-hidden
                          className={`text-muted transition-transform ${isOpen ? "" : "-rotate-90"}`}
                          size={16}
                        />
                      </button>
                    ) : (
                      <NavLink className={sideLink} item={item}>
                        <item.icon size={20} />
                        {labelOf(item)}
                      </NavLink>
                    )}
                    {pages.length > 0 && isOpen && (
                      <ul className="mt-1 flex flex-col gap-0.5" id={id}>
                        {pages.map((page) => (
                          <li key={page.label}>
                            <Link
                              activeOptions={{ exact: true }}
                              className={subLink}
                              to={page.to}
                            >
                              {page.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Phones: no shop header. Detail screens dock their ← title bar here (guest pattern). */}
        <div
          ref={setBarSlot}
          className="sticky top-0 z-20 bg-background/90 backdrop-blur-xl empty:hidden lg:hidden"
        />

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-4 pb-24 lg:px-8 lg:pt-8 lg:pb-8">
          <MerchantBarSlot value={barSlot}>{children}</MerchantBarSlot>
        </main>

        <nav
          aria-label={t("nav.merchant.label")}
          className="fixed inset-x-0 bottom-0 z-20 border-t border-separator bg-surface pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
        >
          <ul className="grid grid-cols-4">
            {phonePrimary.map((item) => (
              <li key={item.label}>
                <NavLink className={tabLink} item={item}>
                  {/* The guest tab pattern: the active tab fills its icon and takes the accent tint. */}
                  <item.icon
                    className="group-data-[status=active]:hidden"
                    size={24}
                  />
                  <item.icon
                    className="hidden group-data-[status=active]:block"
                    size={24}
                    weight="Filled"
                  />
                  {labelOf(item)}
                </NavLink>
              </li>
            ))}
            <li>
              <Drawer isOpen={moreOpen} onOpenChange={setMoreOpen}>
                <Drawer.Trigger className="flex h-16 w-full flex-col items-center justify-center gap-1 text-xs text-muted outline-none focus-visible:focus-ring">
                  <MoreIcon size={24} />
                  {t("nav.more")}
                </Drawer.Trigger>
                <Drawer.Backdrop>
                  <Drawer.Content placement="bottom">
                    <Drawer.Dialog>
                      <Drawer.Handle />
                      <Drawer.Header>
                        <Drawer.Heading>{t("nav.moreTitle")}</Drawer.Heading>
                        <p className="text-label text-muted">
                          {shop.name} · {staffName} · {staffRole}
                        </p>
                      </Drawer.Header>
                      <Drawer.Body>
                        <ul className="flex flex-col gap-1 pb-4">
                          {phoneMore.map((item) => (
                            <li key={item.label}>
                              <NavLink
                                className="flex h-12 items-center gap-3 rounded-2xl px-3 text-base outline-none hover:bg-default focus-visible:focus-ring data-[status=active]:bg-default data-[status=active]:font-semibold"
                                item={item}
                                onClick={() => setMoreOpen(false)}
                              >
                                <item.icon size={20} />
                                {labelOf(item)}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </Drawer.Body>
                    </Drawer.Dialog>
                  </Drawer.Content>
                </Drawer.Backdrop>
              </Drawer>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
