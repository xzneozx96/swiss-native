/**
 * Words of the story home (C01, B4 "Story reel", approved 16.10.2026). Facts come from the
 * client's document "Thuy Si - Hanh Trinh Erich" (October 2026) and the client's banner
 * (name, "Switzerland on two wheels", "Entdecken. Erleben. Erinnern."). The first-person
 * text is written from Erich's stories, not quoted, so `voiceNote` is always shown with
 * it (PRD §11). The bees are a plan for 2027.
 */
export type StoryChapterId = "tours" | "bees" | "stay";

export const STORY_CHAPTERS: StoryChapterId[] = ["tours", "bees", "stay"];

/** The reel's pictures: Erich, then the image that sums up each offer. */
export const REEL_PHOTOS: Record<StoryChapterId | "erich", string> = {
  erich: "erich-haldi-1",
  tours: "furka-pass-4",
  bees: "finsterwald-6",
  stay: "stay-1",
};

/**
 * Chapter covers. The bee chapter opens on the Entlebuch landscape, because the bee
 * house itself is the first stop of the flight just below it.
 */
export const COVER_PHOTOS: Record<StoryChapterId, string> = {
  tours: "furka-pass-4",
  bees: "finsterwald-1",
  stay: "stay-1",
};

export const EPILOGUE_PHOTO = "finsterwald-2";

/**
 * Each pass shows the scene its line tells of. The tour cards below use each pass's
 * first photo, and the chapter cover is furka-pass-4, so none of these repeat them.
 */
export const STORY_PASSES = [
  { name: "Furka", m: 2429, photo: "furka-pass-2" },
  { name: "Grimsel", m: 2165, photo: "grimsel-pass-4" },
  { name: "Susten", m: 2224, photo: "susten-pass-2" },
  { name: "Gotthard", m: 2107, photo: "gotthard-pass-3" },
  { name: "Nufenen", m: 2478, photo: "nufenen-pass-4" },
] as const;

export type StoryPass = (typeof STORY_PASSES)[number]["name"];

interface Chapter {
  kicker: string;
  label: string;
  when: string;
  title: string;
  body: string;
  photoAlt: string;
}

export interface StoryCopy {
  hello: string;
  name: string;
  role: string;
  tagline: [string, string, string];
  photoAlt: string;
  lede: string;
  body: string;
  voiceNote: string;
  chapters: Record<StoryChapterId, Chapter>;
  passLines: Record<StoryPass, string>;
  passes: { title: string; subtitle: string };
  tours: { title: string; subtitle: string };
  epilogue: string;
  reel: {
    label: string;
    pause: string;
    play: string;
    prev: string;
    next: string;
    open: string;
    /** "Picture 2 of 4", for screen readers. */
    position: (n: number, total: number) => string;
  };
}

export const storyCopy: Record<"en" | "de", StoryCopy> = {
  en: {
    hello: "Grüezi, I'm",
    name: "Erich Haldi",
    role: "Switzerland on two wheels",
    tagline: ["Discover.", "Experience.", "Remember."],
    photoAlt: "Erich Haldi on his motorbike above an Alpine valley",
    lede: "When people hear Switzerland, they think of snowy peaks, blue lakes and trains that are never late. My home is more than a pretty picture.",
    body: "It is roads cut by hand through the rock, herders who read the weather in the wind, and beekeepers who can guess the honey from the flowers of the season. Let me show you, slower than the postcards.",
    voiceNote: "Told in Erich's voice, written from his stories.",
    chapters: {
      tours: {
        kicker: "Chapter I",
        label: "Motorbike tours",
        when: "5 to 7 days",
        title: "Five passes, five ways to understand a country",
        body: "Before cars, people crossed the Alps on foot and with mule trains carrying salt, wine and letters. Every bend is a piece of that history, not just a photo spot. We ride Furka, Grimsel, Susten, Gotthard and Nufenen together.",
        photoAlt: "The Furka Pass road winding into the valley",
      },
      bees: {
        kicker: "Chapter II",
        label: "The bee house",
        when: "From 2027",
        title: "In Finsterwald, a bee house waits for its bees",
        body: "Finsterwald lies in the Entlebuch, a UNESCO Biosphere of forest, meadow and moor. The beauty here is quiet: light through the leaves, the smell of grass after rain. I have a bee house here and plan to keep bees from 2027. Before the first jar of honey comes the preparation.",
        photoAlt: "A wooden bee house with painted flight boards",
      },
      stay: {
        kicker: "Chapter III",
        label: "Stay in Finsterwald",
        when: "Ask for dates",
        title: "Come back to Finsterwald for the night",
        body: "After a day on the passes, sleep where the story starts: a quiet village about 1,060 m up, an easy drive from the start of every pass ride.",
        photoAlt: "A farmhouse in the Entlebuch",
      },
    },
    passLines: {
      Furka: "The Rhône Glacier, and Goldfinger's bends",
      Grimsel: "An old trade route, now lakes and dams",
      Susten: "Bridges and tunnels drawn on the rock",
      Gotthard: "The cobbled Tremola, bend after bend",
      Nufenen: "The highest road pass all in Switzerland",
    },
    passes: {
      title: "The five passes",
      subtitle: "Every pass has its own story",
    },
    tours: {
      title: "Choose your tour",
      subtitle: "Guided by Erich, 5 to 7 days",
    },
    epilogue: "Epilogue · Until we meet",
    reel: {
      label: "Erich's story in four pictures",
      pause: "Pause",
      play: "Play",
      prev: "Previous picture",
      next: "Next picture",
      open: "Read the chapter",
      position: (n, total) => `Picture ${n} of ${total}`,
    },
  },
  de: {
    hello: "Grüezi, ich bin",
    name: "Erich Haldi",
    role: "Die Schweiz auf zwei Rädern",
    tagline: ["Entdecken.", "Erleben.", "Erinnern."],
    photoAlt: "Erich Haldi auf seinem Motorrad über einem Alpental",
    lede: "Wer Schweiz hört, denkt an Schneegipfel, blaue Seen und Züge, die nie zu spät sind. Meine Heimat ist mehr als ein schönes Bild.",
    body: "Sie ist Strassen, von Hand in den Fels geschlagen, Hirten, die das Wetter im Wind lesen, und Imker, die am Blühen der Saison den Honig erraten. Ich zeige sie Ihnen, langsamer als die Postkarten.",
    voiceNote: "In Erichs Stimme erzählt, nach seinen Geschichten geschrieben.",
    chapters: {
      tours: {
        kicker: "Kapitel I",
        label: "Motorradtouren",
        when: "5 bis 7 Tage",
        title: "Fünf Pässe, fünf Wege, ein Land zu verstehen",
        body: "Vor dem Auto querte man die Alpen zu Fuss und mit Saumzügen voller Salz, Wein und Briefe. Jede Kurve ist ein Stück dieser Geschichte, nicht nur ein Fotomotiv. Wir fahren Furka, Grimsel, Susten, Gotthard und Nufenen zusammen.",
        photoAlt: "Die Furkapassstrasse windet sich ins Tal",
      },
      bees: {
        kicker: "Kapitel II",
        label: "Das Bienenhaus",
        when: "Ab 2027",
        title: "In Finsterwald wartet ein Bienenhaus auf seine Bienen",
        body: "Finsterwald liegt im Entlebuch, einer UNESCO Biosphäre aus Wald, Wiese und Moor. Die Schönheit hier ist leise: Licht durch die Blätter, der Duft von Gras nach dem Regen. Ich habe hier ein Bienenhaus und will ab 2027 Bienen halten. Vor dem ersten Glas Honig kommt die Vorbereitung.",
        photoAlt: "Ein hölzernes Bienenhaus mit bemalten Flugbrettern",
      },
      stay: {
        kicker: "Kapitel III",
        label: "Übernachten in Finsterwald",
        when: "Daten anfragen",
        title: "Zurück nach Finsterwald für die Nacht",
        body: "Nach einem Tag auf den Pässen schlafen Sie dort, wo die Geschichte beginnt: in einem ruhigen Dorf auf etwa 1060 m, nicht weit vom Start jeder Passfahrt.",
        photoAlt: "Ein Bauernhaus im Entlebuch",
      },
    },
    passLines: {
      Furka: "Der Rhonegletscher und Goldfingers Kurven",
      Grimsel: "Ein alter Handelsweg, heute Seen und Staumauern",
      Susten: "Brücken und Tunnel, in den Fels gezeichnet",
      Gotthard: "Die gepflasterte Tremola, Kehre um Kehre",
      Nufenen: "Der höchste Strassenpass ganz in der Schweiz",
    },
    passes: {
      title: "Die fünf Pässe",
      subtitle: "Jeder Pass hat seine eigene Geschichte",
    },
    tours: {
      title: "Ihre Tour wählen",
      subtitle: "Mit Erich, 5 bis 7 Tage",
    },
    epilogue: "Epilog · Bis bald",
    reel: {
      label: "Erichs Geschichte in vier Bildern",
      pause: "Pause",
      play: "Abspielen",
      prev: "Vorheriges Bild",
      next: "Nächstes Bild",
      open: "Zum Kapitel",
      position: (n, total) => `Bild ${n} von ${total}`,
    },
  },
};

export const storyChapterId = (id: StoryChapterId) => `story-${id}`;

export function scrollToStoryChapter(id: StoryChapterId) {
  document
    .getElementById(storyChapterId(id))
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
