import type { Guest } from "./types";

/** The demo guest who walks the flow. Signs in during C05, so not signed in at start. */
export const demoGuest: Guest = {
  id: "g-erich",
  name: "Erich Haldi",
  email: "erich.haldi@swissnative.com",
  // Default photo: a bundled sample avatar (src/assets/avatars, CC0).
  avatar: "sample:lucas-b",
};

/** Other guests, so merchant screens have work in every state. Invented people. */
export const otherGuests: Guest[] = [
  { id: "g-tom", name: "Tom Becker", email: "tom.becker@example.com" },
  { id: "g-yuki", name: "Yuki Tanaka", email: "yuki.tanaka@example.com" },
  { id: "g-sofia", name: "Sofia Rossi", email: "sofia.rossi@example.com" },
  { id: "g-daniel", name: "Daniel Meier", email: "daniel.meier@example.com" },
  { id: "g-elena", name: "Elena Novak", email: "elena.novak@example.com" },
  { id: "g-lars", name: "Lars Jensen", email: "lars.jensen@example.com" },
  { id: "g-marie", name: "Marie Dubois", email: "marie.dubois@example.com" },
  { id: "g-peter", name: "Peter Schmid", email: "peter.schmid@example.com" },
];
