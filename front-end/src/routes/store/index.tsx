import { createFileRoute } from "@tanstack/react-router";

import { OverviewFrame } from "@/features/merchant/today/components/overview-pages";
import { TodayOverview } from "@/features/merchant/today/components/today-overview";

// M02 Overview › Today: the merchant's first screen, for the host. What needs
// doing today: the tours' open tasks, next departures and balance to collect.
export const Route = createFileRoute("/store/")({ component: TodayPage });

function TodayPage() {
  return (
    <OverviewFrame page="today">
      <TodayOverview />
    </OverviewFrame>
  );
}
