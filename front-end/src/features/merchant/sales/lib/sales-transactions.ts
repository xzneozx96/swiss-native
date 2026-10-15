import type { Rappen } from "@/features/catalog/types";
import type { DemoData } from "@/features/demo/types";

import { zurichDayOf } from "@/features/catalog/lib/pickup";

export type TxStatus = "open" | "completed" | "lost" | "no-show";

export interface SaleLine {
  /** Product or tour id, for the best-seller list. */
  itemId: string;
  quantity: number;
  value: Rappen;
}

/** One tour booking, normalised for the Sales overview. */
export interface SaleTx {
  ref: string;
  /** Zurich day it was placed, YYYY-MM-DD. */
  day: string;
  status: TxStatus;
  /** Booking value; 0 for declined, cancelled and expired holds. */
  value: Rappen;
  /** Still owed on an open transaction. */
  outstanding: Rappen;
  lines: SaleLine[];
}

/** Tour bookings that became bookings (not holds that were never paid or that expired). */
export function saleTransactions(
  data: Pick<DemoData, "tours">,
): Map<string, SaleTx> {
  const txs = new Map<string, SaleTx>();

  for (const b of data.tours?.bookings ?? []) {
    if (b.status === "pending_payment" || b.status === "expired") continue;
    const lost = b.status === "cancelled";
    const paid = b.payments
      .filter((p) => p.status === "succeeded")
      .reduce((sum, p) => sum + p.amount, 0);

    txs.set(b.id, {
      ref: b.ref,
      day: zurichDayOf(b.createdAt),
      status: lost
        ? "lost"
        : b.status === "no_show"
          ? "no-show"
          : b.status === "completed"
            ? "completed"
            : "open",
      value: lost ? 0 : b.total,
      outstanding:
        lost || b.status === "completed" || b.status === "no_show"
          ? 0
          : Math.max(0, b.total - paid),
      lines: [
        {
          itemId: b.tourId,
          quantity: b.adults + b.children + b.infants,
          value: b.total,
        },
      ],
    });
  }

  return txs;
}
