/**
 * Lab-only strings for the brand blocks. The selling points and the quote come from the
 * client's marketing banner; the extra lines in idea 2 describe the ride in general terms
 * only (the five passes are the ones this app already names).
 */
export type LabLanguage = "en" | "de";

export const brandCopy = {
  en: {
    listLabel: "Highlights",
    points: {
      passes: {
        label: "Alpine passes",
        line: "Furka, Grimsel, Susten, Gotthard, Nufenen",
      },
      roads: {
        label: "Scenic roads",
        line: "Hairpins, long climbs and quiet valley roads",
      },
      gems: {
        label: "Hidden gems",
        line: "Small places away from the main routes",
      },
    },
    jump: { passes: "Tours", roads: "Stay", gems: "Experience" },
    jumpHint: "Go to section",
    quote:
      "More than roads — it's the people, the places and the little moments that stay with you.",
    author: "Erich Haldi",
    role: "Your host at Swiss Native",
    postmark: "Finsterwald · Entlebuch",
    stamp: "Helvetia",
  },
  de: {
    listLabel: "Höhepunkte",
    points: {
      passes: {
        label: "Alpenpässe",
        line: "Furka, Grimsel, Susten, Gotthard, Nufenen",
      },
      roads: {
        // Soft hyphen: the word can break in a narrow column, as "Panorama-strassen".
        label: "Panorama\u00ADstrassen",
        line: "Kehren, lange Anstiege und ruhige Talstrassen",
      },
      gems: {
        label: "Verborgene Perlen",
        line: "Kleine Orte abseits der grossen Routen",
      },
    },
    jump: { passes: "Touren", roads: "Übernachten", gems: "Erlebnis" },
    jumpHint: "Zum Abschnitt",
    quote:
      "Mehr als Strassen — es sind die Menschen, die Orte und die kleinen Momente, die bleiben.",
    author: "Erich Haldi",
    role: "Ihr Gastgeber bei Swiss Native",
    postmark: "Finsterwald · Entlebuch",
    stamp: "Helvetia",
  },
} as const;

export type BrandCopy = (typeof brandCopy)[LabLanguage];

export const labChrome = {
  en: {
    title: "Brand blocks lab",
    piece: "Piece",
    usp: "USP strip",
    quote: "Quote",
    idea: "Idea",
    language: "Language",
    context: "In context",
    page: "Alone",
    contextShort: "Context",
    position: "Recommended position",
  },
  de: {
    title: "Labor: Markenblöcke",
    piece: "Element",
    usp: "USP-Leiste",
    quote: "Zitat",
    idea: "Idee",
    language: "Sprache",
    context: "Im Kontext",
    page: "Allein",
    contextShort: "Kontext",
    position: "Empfohlene Position",
  },
} as const;
