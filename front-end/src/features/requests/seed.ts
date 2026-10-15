import type { PrivateTourRequest } from "./types";

import { demoAt } from "@/features/demo/clock";

/** Two C22 requests for M20 from invented guests: one new, one the shop has answered (D9). */
export const privateTourRequestSeed: PrivateTourRequest[] = [
  {
    id: "pt-1",
    sentAt: demoAt({ days: -1, hours: 11 }),
    language: "en",
    email: "j.morgan@example.com",
    groupSize: 6,
    dateFrom: "2026-10-24",
    dateTo: "2026-10-25",
    interests:
      "A family trip with grandparents in their eighties. A gentle walk through the old town with a coffee stop would be ideal.",
  },
  {
    id: "pt-2",
    sentAt: demoAt({ days: -7, hours: 4 }),
    language: "de",
    email: "s.baumann@example.com",
    groupSize: 14,
    dateFrom: "2026-10-16",
    dateTo: "2026-10-17",
    interests:
      "Ausflug mit unserem Team. Gern Geschichte der Altstadt, zum Schluss ein Apéro.",
  },
];
