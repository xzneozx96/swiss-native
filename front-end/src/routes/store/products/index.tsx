import type { ProductTab } from "@/features/merchant/products/hooks/use-merchant-products";

import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { MerchantProducts } from "@/features/merchant/products/components/merchant-products";
import { isProductTab } from "@/features/merchant/products/hooks/use-merchant-products";

interface ProductsSearch {
  /** Selected tab (D3); absent = Tours. */
  tab?: Exclude<ProductTab, "tours">;
}

// M11 Products. M13 is /store/products/tours/$tourId.
export const Route = createFileRoute("/store/products/")({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    tab:
      isProductTab(search.tab) && search.tab !== "tours"
        ? search.tab
        : undefined,
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { tab = "tours" } = Route.useSearch();
  const navigate = useNavigate({ from: "/store/products/" });

  return (
    <MerchantProducts
      tab={tab}
      onTabChange={(next) =>
        void navigate({
          search: next === "tours" ? {} : { tab: next },
          replace: true,
          resetScroll: false,
        })
      }
    />
  );
}
