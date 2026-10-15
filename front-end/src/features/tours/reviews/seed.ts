import type { Review } from "@/features/catalog/types";

/** Illustrative prototype reviews, not customer endorsements or real bookings. */
export const sampleTourReviews: Review[] = [
  {
    id: "sample-tour-old-town-1",
    productId: "tour:old-town",
    guestName: "Anna K.",
    rating: 5,
    text: {
      en: "Standing at the Rhone Glacier viewpoint while the guide explained how far the ice used to reach was the moment of the day. Nobody rushed us.",
      de: "Am Aussichtspunkt beim Rhonegletscher zu stehen und zu hören, wie weit das Eis früher reichte, war der Moment des Tages. Niemand hat uns gehetzt.",
    },
    createdAt: "2026-10-12T19:00:00+02:00",
    purchasedAt: "2026-10-12T13:00:00+02:00",
    photos: ["furka-pass-2"],
  },
  {
    id: "sample-tour-old-town-2",
    productId: "tour:old-town",
    guestName: "Lukas M.",
    rating: 5,
    text: {
      en: "Hairpin after hairpin, and every stop had a story. I had ridden the Furka before but never knew about the old hotel.",
      de: "Kehre um Kehre, und jeder Halt hatte eine Geschichte. Ich bin die Furka schon gefahren, vom alten Hotel wusste ich nichts.",
    },
    createdAt: "2026-10-11T18:00:00+02:00",
    purchasedAt: "2026-10-11T13:00:00+02:00",
  },
  {
    id: "sample-tour-old-town-3",
    productId: "tour:old-town",
    guestName: "Sophie R.",
    rating: 4,
    text: {
      en: "Pack warm layers: it was cold at the summit even in sunshine. The pace was relaxed and the stops were well chosen.",
      de: "Warme Schichten einpacken: Auf der Passhöhe war es trotz Sonne kalt. Das Tempo war entspannt und die Stopps gut gewählt.",
    },
    createdAt: "2026-10-09T18:00:00+02:00",
    purchasedAt: "2026-10-09T13:00:00+02:00",
    photos: ["furka-pass-5"],
    reply: {
      text: "Danke, Sophie! Auf über 2400 Metern ist es wirklich schnell frisch. Schön, dass Ihnen das Tempo und die Stopps gefallen haben.",
      language: "de",
      by: "Erich Haldi",
      at: "2026-10-10T09:15:00+02:00",
    },
  },
  {
    id: "sample-tour-old-town-4",
    productId: "tour:old-town",
    guestName: "Daniel W.",
    rating: 5,
    text: {
      en: "A good mix of riding and stopping. The Goldfinger story made the road feel like a film set.",
      de: "Eine gute Mischung aus Fahren und Anhalten. Mit der Goldfinger-Geschichte fühlte sich die Strasse wie ein Filmset an.",
    },
    createdAt: "2026-10-08T18:00:00+02:00",
    purchasedAt: "2026-10-08T13:00:00+02:00",
  },
  {
    id: "sample-tour-old-town-5",
    productId: "tour:old-town",
    guestName: "Maya S.",
    rating: 5,
    text: {
      en: "Plenty of time for photos at Gletsch and the glacier. The route finished in the Goms with everyone smiling.",
      de: "Genug Zeit für Fotos in Gletsch und am Gletscher. Die Route endete im Goms mit lachenden Gesichtern.",
    },
    createdAt: "2026-10-06T17:00:00+02:00",
    purchasedAt: "2026-10-06T13:00:00+02:00",
    photos: ["furka-pass-6"],
  },
  {
    id: "sample-tour-old-town-6",
    productId: "tour:old-town",
    guestName: "Felix B.",
    rating: 4,
    text: {
      en: "Great scenery and a friendly group. A little wind on the exposed bends, so check the weather before you go.",
      de: "Tolle Landschaft und eine nette Gruppe. Auf den exponierten Kurven etwas Wind, also vorher das Wetter prüfen.",
    },
    createdAt: "2026-10-05T17:00:00+02:00",
    purchasedAt: "2026-10-05T13:00:00+02:00",
  },
  {
    id: "sample-tour-lake-1",
    productId: "tour:lake",
    guestName: "Clara H.",
    rating: 5,
    text: {
      en: "The reservoirs under a clear sky were unreal. I liked hearing how the road went from a mule track to hydropower.",
      de: "Die Stauseen unter klarem Himmel waren unwirklich. Ich fand es toll zu hören, wie aus dem Saumpfad eine Strasse und dann ein Kraftwerk wurde.",
    },
    createdAt: "2026-10-12T18:00:00+02:00",
    purchasedAt: "2026-10-12T13:00:00+02:00",
    photos: ["grimsel-pass-1"],
  },
  {
    id: "sample-tour-lake-2",
    productId: "tour:lake",
    guestName: "Noah T.",
    rating: 4,
    text: {
      en: "A beautiful day with plenty of bends. The summit lake was windy but worth the stop.",
      de: "Ein schöner Tag mit vielen Kurven. Am Passsee war es windig, der Halt hat sich trotzdem gelohnt.",
    },
    createdAt: "2026-10-09T18:00:00+02:00",
    purchasedAt: "2026-10-09T13:00:00+02:00",
  },
  {
    id: "sample-tour-lake-3",
    productId: "tour:lake",
    guestName: "Emma F.",
    rating: 5,
    text: {
      en: "The stories behind the dams and the old trade route made the whole pass feel much bigger than the road itself.",
      de: "Die Geschichten hinter den Staumauern und dem alten Handelsweg liessen den ganzen Pass viel grösser wirken als nur die Strasse.",
    },
    createdAt: "2026-10-05T18:00:00+02:00",
    purchasedAt: "2026-10-05T13:00:00+02:00",
    photos: ["grimsel-pass-3"],
  },
];
