import type { ProductAction } from "./product-rows";
import type { ProductRow, ProductTab } from "../hooks/use-merchant-products";

import { buttonVariants, toast } from "@heroui/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import {
  useMerchantProducts,
  useProductArchive,
} from "../hooks/use-merchant-products";

import { ProductRows } from "./product-rows";

import { useConfirm } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import {
  FilterButton,
  FilterChips,
  filterGroup,
} from "@/components/filter-bar";
import { OptionIcon, PlusIcon, TourIcon } from "@/components/icons";
import { MerchantPageHeader } from "@/components/layout/merchant-page-header";
import { RouteTabs } from "@/components/route-tabs";
import { useLocale } from "@/contexts/locale-context";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";

type ProductView = "active" | "archived";

/**
 * M11 Products (spec §5.2, D3): M03's page shape. Tabs with counts (tours, and stays and
 * experiences, which come later), each its own page: /store/products/tours, /stays,
 * /experiences. Tours are a list of M03 tickets on phones and a Table from 1024px, each with
 * its publish chip and its EN/DE completeness (R02).
 */
export function MerchantProducts({ tab }: { tab: ProductTab }) {
  const { t } = useLocale();
  const all = useMerchantProducts();
  const archive = useProductArchive();
  const navigate = useNavigate();
  const { confirm, dialog } = useConfirm();
  // Archived tours sit under their own filter. Both ticked shows both; none ticked is no
  // filter, the same as both.
  const [view, setView] = useState<ProductView[]>(["active"]);
  const inView = (r: ProductRow) =>
    !view.length || view.includes(r.archived ? "archived" : "active");
  const tours = all.tours.filter(inView);
  const isLoading = useSimulatedLoading();
  const tabs = [
    {
      id: "tours",
      to: "/store/products/tours",
      label: t("products.tab.tours"),
      badge: all.tours.filter((r) => !r.archived).length,
    },
    // Stays and experiences are a later stage (PRD §7.0): listed, with nothing in them yet.
    {
      id: "stays",
      to: "/store/products/stays",
      label: t("products.tab.stays"),
      badge: t("home.soon"),
    },
    {
      id: "experiences",
      to: "/store/products/experiences",
      label: t("products.tab.experiences"),
      badge: t("home.soon"),
    },
  ] as const;
  const selectedLabel = tabs.find((item) => item.id === tab)?.label ?? "";
  const rootRef = useRef<HTMLDivElement>(null);

  // As M03: a link to a page whose tab starts off-screen in the scrolling
  // list on phones. React Aria mounts the tabs after the first commit, so wait a frame.
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      rootRef.current
        ?.querySelector(`[role="tab"][data-key="${tab}"]`)
        ?.scrollIntoView({ block: "nearest", inline: "nearest" }),
    );

    return () => cancelAnimationFrame(frame);
  }, [tab]);

  const onAction = async (row: ProductRow, action: ProductAction) => {
    if (action === "edit") {
      void navigate({
        to: "/store/products/tours/$tourId",
        params: { tourId: row.id },
      });

      return;
    }
    if (action === "restore") {
      archive.restore(row.id);
      toast.success(t("products.restored", { name: row.name }));

      return;
    }
    const ok = await confirm({
      title: t("products.archive.title", { name: row.name }),
      body: t("products.archive.body.tour"),
      confirmLabel: t("products.action.archive"),
    });

    if (!ok) return;
    archive.archive(row.id);
    toast.success(t("products.archivedToast", { name: row.name }));
  };

  const groups =
    tab === "tours"
      ? [
          filterGroup({
            id: "view",
            label: t("products.view.label"),
            options: (["active", "archived"] as const).map((v) => ({
              id: v,
              label: t(`products.view.${v}`),
              count: all.tours.filter((r) => r.archived === (v === "archived"))
                .length,
            })),
            selected: view,
            onChange: setView,
          }),
        ]
      : null;

  const panel = (id: ProductTab) => {
    if (id === "stays" || id === "experiences") {
      return (
        <EmptyState icon={OptionIcon} message={t(`products.empty.${id}`)} />
      );
    }

    return (
      <ProductRows
        columns={[
          t("products.column.tour"),
          t("products.column.status"),
          t("products.column.price"),
          t("products.column.departures"),
        ]}
        empty={{
          icon: TourIcon,
          message: t(
            view.length === 1 && view[0] === "archived"
              ? "products.empty.archived"
              : "products.empty.tours",
          ),
        }}
        isLoading={isLoading}
        label={selectedLabel}
        resetKey={`${id}|${selectedLabel}|${view.join()}`}
        rows={tours}
        onAction={(row, action) => void onAction(row, action)}
      />
    );
  };

  return (
    <div ref={rootRef} className="flex flex-col gap-4">
      <MerchantPageHeader
        // The screen's one red action; stays and experiences have nothing to add yet.
        action={
          tab === "tours" && (
            <Link
              className={buttonVariants({ size: "sm", className: "shrink-0" })}
              to="/store/products/tours/new"
            >
              <PlusIcon aria-hidden size={16} />
              {t("products.addTour")}
            </Link>
          )
        }
        description={t("products.intro")}
        title={t("products.title")}
      />
      <RouteTabs
        label={t("products.tabsLabel")}
        selected={tab}
        tabs={tabs}
        trailing={groups && <FilterButton groups={groups} />}
      />
      {groups && <FilterChips groups={groups} />}
      {panel(tab)}
      {dialog}
    </div>
  );
}
