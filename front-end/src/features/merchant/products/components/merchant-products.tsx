import type { ProductAction } from "./product-rows";
import type { ProductRow, ProductTab } from "../hooks/use-merchant-products";

import { Skeleton, Tabs, buttonVariants, toast } from "@heroui/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import {
  useMerchantProducts,
  useProductArchive,
} from "../hooks/use-merchant-products";

import { ProductRows } from "./product-rows";

import { useConfirm } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { MerchantPageHeader } from "@/components/layout/merchant-page-header";
import { MerchantFilter } from "@/components/merchant-filter";
import { OptionIcon, PlusIcon, TourIcon } from "@/components/icons";
import { useLocale } from "@/contexts/locale-context";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";

type ProductView = "active" | "archived";

function RowsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-44 rounded-3xl lg:h-16" />
      ))}
    </div>
  );
}

/**
 * M11 Products (spec §5.2, D3): M03's page shape. Tabs with counts (tours, and the stays and
 * experiences that are still to come), the tours as a list of M03 tickets on phones and a
 * Table from 1024px. Each tour shows its publish chip and its EN/DE completeness (R02).
 */
export function MerchantProducts({
  tab,
  onTabChange,
}: {
  tab: ProductTab;
  onTabChange: (tab: ProductTab) => void;
}) {
  const { t } = useLocale();
  const all = useMerchantProducts();
  const archive = useProductArchive();
  const navigate = useNavigate();
  const { confirm, dialog } = useConfirm();
  // Archived tours sit under their own filter.
  // Both ticked shows both; none ticked is no filter, the same as both.
  const [view, setView] = useState<ProductView[]>(["active"]);
  const inView = (r: ProductRow) =>
    !view.length || view.includes(r.archived ? "archived" : "active");
  const tours = all.tours.filter(inView);
  const isLoading = useSimulatedLoading();
  const tabs = [
    {
      id: "tours",
      label: t("products.tab.tours"),
      count: all.tours.filter((r) => !r.archived).length,
    },
    // Stays and experiences are a later stage (PRD §7.0): listed, with nothing in them yet.
    { id: "stays", label: t("products.tab.stays"), count: 0, soon: true },
    {
      id: "experiences",
      label: t("products.tab.experiences"),
      count: 0,
      soon: true,
    },
  ] as const;
  const selectedLabel = tabs.find((item) => item.id === tab)?.label ?? "";

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

  const viewFilter = () => {
    const options = (["active", "archived"] as const).map((v) => ({
      id: v,
      label: t(`products.view.${v}`),
      count: all.tours.filter((r) => r.archived === (v === "archived")).length,
    }));

    return (
      <MerchantFilter
        label={t("products.view.label")}
        options={options}
        selected={view}
        onChange={setView}
      />
    );
  };

  const panel = (id: ProductTab) => {
    if (isLoading) return <RowsSkeleton />;
    if (id === "stays" || id === "experiences") {
      return (
        <EmptyState icon={OptionIcon} message={t(`products.empty.${id}`)} />
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {viewFilter()}
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
          label={selectedLabel}
          resetKey={`${id}|${selectedLabel}|${view.join()}`}
          rows={tours}
          onAction={(row, action) => void onAction(row, action)}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <MerchantPageHeader
        // The screen's one red action.
        action={
          <Link
            className={buttonVariants({ size: "sm", className: "shrink-0" })}
            to="/store/products/tours/new"
          >
            <PlusIcon aria-hidden size={16} />
            {t("products.addTour")}
          </Link>
        }
        description={t("products.intro")}
        title={t("products.title")}
      />
      <Tabs
        className="w-full"
        selectedKey={tab}
        onSelectionChange={(key) => onTabChange(key as ProductTab)}
      >
        <Tabs.ListContainer className="w-fit max-w-full">
          <Tabs.List aria-label={t("products.tabsLabel")}>
            {tabs.map((item, index) => (
              <Tabs.Tab
                key={item.id}
                className="whitespace-nowrap"
                id={item.id}
              >
                {index > 0 && <Tabs.Separator />}
                {item.label}
                <span className="ms-1.5 min-w-5 rounded-full bg-default px-1.5 text-xs leading-5 tabular-nums">
                  {"soon" in item ? t("home.soon") : item.count}
                </span>
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
        {tabs.map((item) => (
          <Tabs.Panel key={item.id} className="px-0 pb-0" id={item.id}>
            {panel(item.id)}
          </Tabs.Panel>
        ))}
      </Tabs>
      {dialog}
    </div>
  );
}
