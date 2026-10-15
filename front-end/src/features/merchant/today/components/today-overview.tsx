import { Skeleton } from "@heroui/react";

import { WidgetSkeleton } from "./overview-pages";

import {
  NextDeparturesWidget,
  TourCollectWidget,
  TourTaskTiles,
} from "@/features/tours/merchant/today-queue";
import { useOverdueCheck } from "@/features/tours/merchant/use-overdue-check";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";

/** A task tile while loading: icon, name, count. */
function TileSkeleton() {
  return (
    <div
      aria-hidden
      className="flex h-40 flex-col justify-between rounded-3xl bg-surface p-4 shadow-surface"
    >
      <div className="flex justify-between">
        <Skeleton className="size-9 rounded-xl" />
        <Skeleton className="size-8 rounded-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-3/5 rounded-lg" />
        <Skeleton className="h-7 w-8 rounded-lg" />
      </div>
    </div>
  );
}

/** A list row while loading: the date tile and two lines (Next departures). */
function RowsSkeleton() {
  return (
    <ul className="flex flex-col gap-4">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="flex items-center gap-3">
          <Skeleton className="h-16 w-12 shrink-0 rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/2 rounded-lg" />
            <Skeleton className="h-3 w-1/3 rounded-lg" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The tour balance still to collect while loading: total, stacked bar, three legend rows. */
function CollectSkeleton() {
  return (
    <>
      <Skeleton className="h-8 w-40 rounded-lg" />
      <Skeleton className="mt-4 h-3 w-full rounded-full" />
      <div className="mt-4 flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex justify-between gap-3">
            <Skeleton className="h-3.5 w-2/5 rounded-lg" />
            <Skeleton className="h-3.5 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </>
  );
}

/** Today while loading: the task tiles, then the departures and the balance to collect. */
function TodaySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {[0, 1, 2, 3].map((i) => (
          <TileSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <WidgetSkeleton className="lg:col-span-3">
          <RowsSkeleton />
        </WidgetSkeleton>
        <WidgetSkeleton className="lg:col-span-2">
          <CollectSkeleton />
        </WidgetSkeleton>
      </div>
    </div>
  );
}

/**
 * M02 Overview › Today: the tours' open tasks, the next departures and the balance still to
 * collect.
 */
export function TodayOverview() {
  const isLoading = useSimulatedLoading();

  useOverdueCheck();

  if (isLoading) return <TodaySkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <TourTaskTiles showAll />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <NextDeparturesWidget />
        <TourCollectWidget />
      </div>
    </div>
  );
}
