import type { Guest } from "@/features/account/types";
import type { Review } from "@/features/catalog/types";
import type { Mail } from "@/features/notifications/types";
import type { PrivateTourRequest } from "@/features/requests/types";
import type { TourData } from "@/features/tours/types";

/** Who the prototype is acting as: a guest, or the host (Erich Haldi) in the dashboard. */
export type Role = "guest" | "owner";

/** Everything the prototype remembers between reloads. Reset restores the seed. */
export interface DemoData {
  guests: Guest[];
  reviews: Review[];
  /** Listings the guest saved with the heart (UX proposal: favourites are not in the PRD). */
  favouriteListingIds: string[];
  /** Signed-in guest id; null until the guest signs in (C05). */
  signedInGuestId: string | null;
  /** Emails the prototype "sent", newest last; shown in the Mail panel (outline §3). */
  mail: Mail[];
  tours?: TourData;
  privateTourRequests: PrivateTourRequest[];
}

export interface DemoState {
  version: number;
  role: Role;
  /** Real time (ms) when the demo clock started; see clock.ts. */
  clockStartedAt: number;
  data: DemoData;
}
