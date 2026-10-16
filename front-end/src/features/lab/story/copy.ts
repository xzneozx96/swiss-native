/**
 * Lab-only strings for the story home. Facts come from the client's document "Thuy Si -
 * Hanh Trinh Erich" (October 2026) and the client's banner (name, "Switzerland on two
 * wheels", "Entdecken. Erleben. Erinnern."). The first-person text is written from
 * Erich's stories, not quoted, so every direction shows `voiceNote` with it (PRD §11).
 * The bees are a plan for 2027; the stay's rooms and price are not known yet.
 */
export type StoryLanguage = "en" | "de";

export const PASSES = [
  { name: "Furka", m: 2429, photo: "furka-pass-4" },
  { name: "Grimsel", m: 2165, photo: "grimsel-pass-1" },
  { name: "Susten", m: 2224, photo: "susten-pass-1" },
  { name: "Gotthard", m: 2107, photo: "gotthard-pass-1" },
  { name: "Nufenen", m: 2478, photo: "nufenen-pass-1" },
] as const;

export const storyCopy = {
  en: {
    hello: "Grüezi, I'm",
    name: "Erich Haldi",
    role: "Switzerland on two wheels",
    tagline: ["Discover.", "Experience.", "Remember."],
    photoAlt: "Erich Haldi on his motorbike above an Alpine valley and lake",
    lede: "When people hear Switzerland, they think of snowy peaks, blue lakes and trains that are never late. My home is more than a pretty picture.",
    body: "It is roads cut by hand through the rock, herders who read the weather in the wind, and beekeepers who can guess the honey from the flowers of the season. Let me show you, slower than the postcards.",
    voiceNote: "Told in Erich's voice, written from his stories.",
    tocTitle: "What I offer",
    searchLabel: "Search",
    chapters: {
      tours: {
        n: "I",
        kicker: "Chapter I",
        label: "Motorbike tours",
        when: "5 to 7 days",
        title: "Five passes, five ways to understand a country",
        body: "Before cars, people crossed the Alps on foot and with mule trains carrying salt, wine and letters. Every bend is a piece of that history, not just a photo spot. We ride Furka, Grimsel, Susten, Gotthard and Nufenen together.",
        cta: "See all tours",
        lines: {
          Furka: "The Rhône Glacier, and Goldfinger's bends",
          Grimsel: "An old trade route, now lakes and dams",
          Susten: "Bridges and tunnels drawn on the rock",
          Gotthard: "The cobbled Tremola, bend after bend",
          Nufenen: "The highest road pass all in Switzerland",
        } as Record<string, string>,
        photoAlt: "The Furka Pass road winding into the valley",
        stat: { value: "5", label: "passes, up to 2,478 m" },
      },
      bees: {
        n: "II",
        kicker: "Chapter II",
        label: "The bee house",
        when: "From 2027",
        title: "In Finsterwald, a bee house waits for its bees",
        body: "Finsterwald lies in the Entlebuch, a UNESCO Biosphere of forest, meadow and moor. The beauty here is quiet: light through the leaves, the smell of grass after rain. I have a bee house here and plan to keep bees from 2027. Before the first jar of honey comes the preparation.",
        photoAlt: "A wooden bee house with painted flight boards",
        stat: { value: "2027", label: "the first flight" },
      },
      stay: {
        n: "III",
        kicker: "Chapter III",
        label: "Stay in Finsterwald",
        when: "Ask for dates",
        title: "Come back to Finsterwald for the night",
        body: "After a day on the passes, sleep where the story starts: a quiet village about 1,060 m up, an easy drive from the start of every pass ride.",
        photoAlt: "A farmhouse in the Entlebuch",
        stat: { value: "1,060 m", label: "a quiet village in the Entlebuch" },
      },
    },
    day: {
      intro: "One way to picture it",
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      note: "A picture, not a schedule: the tours last 5 to 7 days.",
    },
    epilogue: "Until we meet",
    reel: {
      label: "Erich's story in four pictures",
      pause: "Pause",
      play: "Play",
      prev: "Previous picture",
      next: "Next picture",
      open: "Read the chapter",
      scroll: "Scroll for the whole story",
    },
    masthead: "A Swiss story",
    issue: "Finsterwald · Entlebuch",
  },
  de: {
    hello: "Grüezi, ich bin",
    name: "Erich Haldi",
    role: "Die Schweiz auf zwei Rädern",
    tagline: ["Entdecken.", "Erleben.", "Erinnern."],
    photoAlt: "Erich Haldi auf seinem Motorrad über einem Alpental mit See",
    lede: "Wer Schweiz hört, denkt an Schneegipfel, blaue Seen und Züge, die nie zu spät sind. Meine Heimat ist mehr als ein schönes Bild.",
    body: "Sie ist Strassen, von Hand in den Fels geschlagen, Hirten, die das Wetter im Wind lesen, und Imker, die am Blühen der Saison den Honig erraten. Ich zeige sie Ihnen, langsamer als die Postkarten.",
    voiceNote: "In Erichs Stimme erzählt, nach seinen Geschichten geschrieben.",
    tocTitle: "Was ich anbiete",
    searchLabel: "Suchen",
    chapters: {
      tours: {
        n: "I",
        kicker: "Kapitel I",
        label: "Motorradtouren",
        when: "5 bis 7 Tage",
        title: "Fünf Pässe, fünf Wege, ein Land zu verstehen",
        body: "Vor dem Auto querte man die Alpen zu Fuss und mit Saumzügen voller Salz, Wein und Briefe. Jede Kurve ist ein Stück dieser Geschichte, nicht nur ein Fotomotiv. Wir fahren Furka, Grimsel, Susten, Gotthard und Nufenen zusammen.",
        cta: "Alle Touren ansehen",
        lines: {
          Furka: "Der Rhonegletscher und Goldfingers Kurven",
          Grimsel: "Ein alter Handelsweg, heute Seen und Staumauern",
          Susten: "Brücken und Tunnel, in den Fels gezeichnet",
          Gotthard: "Die gepflasterte Tremola, Kehre um Kehre",
          Nufenen: "Der höchste Strassenpass ganz in der Schweiz",
        } as Record<string, string>,
        photoAlt: "Die Furkapassstrasse windet sich ins Tal",
        stat: { value: "5", label: "Pässe, bis 2478 m" },
      },
      bees: {
        n: "II",
        kicker: "Kapitel II",
        label: "Das Bienenhaus",
        when: "Ab 2027",
        title: "In Finsterwald wartet ein Bienenhaus auf seine Bienen",
        body: "Finsterwald liegt im Entlebuch, einer UNESCO Biosphäre aus Wald, Wiese und Moor. Die Schönheit hier ist leise: Licht durch die Blätter, der Duft von Gras nach dem Regen. Ich habe hier ein Bienenhaus und will ab 2027 Bienen halten. Vor dem ersten Glas Honig kommt die Vorbereitung.",
        photoAlt: "Ein hölzernes Bienenhaus mit bemalten Flugbrettern",
        stat: { value: "2027", label: "der erste Flug" },
      },
      stay: {
        n: "III",
        kicker: "Kapitel III",
        label: "Übernachten in Finsterwald",
        when: "Daten anfragen",
        title: "Zurück nach Finsterwald für die Nacht",
        body: "Nach einem Tag auf den Pässen schlafen Sie dort, wo die Geschichte beginnt: in einem ruhigen Dorf auf etwa 1060 m, nicht weit vom Start jeder Passfahrt.",
        photoAlt: "Ein Bauernhaus im Entlebuch",
        stat: { value: "1060 m", label: "ein ruhiges Dorf im Entlebuch" },
      },
    },
    day: {
      intro: "So kann man es sich vorstellen",
      morning: "Morgen",
      afternoon: "Nachmittag",
      evening: "Abend",
      note: "Ein Bild, kein Programm: die Touren dauern 5 bis 7 Tage.",
    },
    epilogue: "Bis bald",
    reel: {
      label: "Erichs Geschichte in vier Bildern",
      pause: "Pause",
      play: "Abspielen",
      prev: "Vorheriges Bild",
      next: "Nächstes Bild",
      open: "Zum Kapitel",
      scroll: "Scrollen für die ganze Geschichte",
    },
    masthead: "Eine Schweizer Geschichte",
    issue: "Finsterwald · Entlebuch",
  },
};

export type StoryCopy = (typeof storyCopy)["en"];
export type ChapterId = keyof StoryCopy["chapters"];

export const CHAPTERS: ChapterId[] = ["tours", "bees", "stay"];

export const labChrome = {
  en: {
    title: "Story home lab",
    direction: "Direction",
    variant: "Variant",
    language: "Language",
    variants: [
      [
        "Original",
        "As chosen: Erich on top, a full-bleed photo opens each chapter.",
      ],
      [
        "Scroll-over",
        "Photos stay pinned; each chapter's page slides up over its photo.",
      ],
      [
        "Magazine",
        "Cover-style masthead on the sky; chapters open on one big number.",
      ],
      [
        "Story reel",
        "Opens with four tap-through pictures, like phone stories.",
      ],
      ["Letterbox", "Wide film frames, slow zoom, words appear one by one."],
    ],
    names: ["Journal", "Cinematic", "A day"],
    notes: [
      "Warm paper, a polaroid of Erich, handwritten chapter numbers and a red thread.",
      "Full-bleed photo openings for Erich and each chapter, big serif titles.",
      "The offers framed as morning, afternoon and evening. Risky: tours last days.",
    ],
  },
  de: {
    title: "Labor: Startseite als Geschichte",
    direction: "Richtung",
    variant: "Variante",
    language: "Sprache",
    variants: [
      [
        "Original",
        "Wie gewählt: Erich oben, jedes Kapitel öffnet mit einem randlosen Foto.",
      ],
      [
        "Darüberschieben",
        "Fotos bleiben stehen; die Kapitelseite gleitet darüber.",
      ],
      [
        "Magazin",
        "Titelblatt auf dem Himmel; Kapitel öffnen mit einer grossen Zahl.",
      ],
      [
        "Story-Reel",
        "Beginnt mit vier Bildern zum Durchtippen, wie Handy-Storys.",
      ],
      [
        "Breitbild",
        "Breite Filmbilder, langsamer Zoom, Wörter erscheinen einzeln.",
      ],
    ],
    names: ["Tagebuch", "Kino", "Ein Tag"],
    notes: [
      "Warmes Papier, ein Polaroid von Erich, handgeschriebene Kapitelnummern, ein roter Faden.",
      "Randlose Fotoöffnungen für Erich und jedes Kapitel, grosse Serifentitel.",
      "Die Angebote als Morgen, Nachmittag und Abend. Riskant: Touren dauern Tage.",
    ],
  },
} as const;
