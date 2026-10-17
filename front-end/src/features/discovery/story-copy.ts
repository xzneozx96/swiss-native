/**
 * Words of the story home (C01, B4 "Story reel", approved 16.10.2026). Facts come from the
 * client's document "Thuy Si - Hanh Trinh Erich" (October 2026) and the client's banner
 * (name, "Switzerland on two wheels", "Entdecken. Erleben. Erinnern."). The first-person
 * text is written from Erich's stories, not quoted, so `voiceNote` is always shown with
 * it (PRD §11). The bees are a plan for 2027.
 */
export type StoryChapterId = "tours" | "stay" | "bees";

export const STORY_CHAPTERS: StoryChapterId[] = ["tours", "stay", "bees"];

export type ReelFrameId = "erich" | "group" | "iseran" | "rest" | "selfie";

export interface ReelFrame {
  id: ReelFrameId;
  photo: string;
  /** CSS object-position that keeps the subject in the tall crop. */
  position: string;
  /** Chapter the picture's button scrolls to, if its story leads there. */
  chapter?: StoryChapterId;
}

/** The reel's pictures: Erich first, then four shots from the road. */
export const REEL_FRAMES: ReelFrame[] = [
  { id: "erich", photo: "erich-haldi-1", position: "60% 30%" },
  { id: "group", photo: "reel-group", position: "55% 50%", chapter: "tours" },
  { id: "iseran", photo: "reel-iseran", position: "50% 60%", chapter: "tours" },
  { id: "rest", photo: "reel-rest-stop", position: "40% 50%" },
  { id: "selfie", photo: "reel-selfie", position: "55% 50%" },
];

/**
 * Chapter covers. The bee chapter opens on the Entlebuch landscape, because the bee
 * house itself is the first stop of the flight just below it.
 */
export const COVER_PHOTOS: Record<StoryChapterId, string> = {
  tours: "furka-pass-4",
  stay: "stay-1",
  bees: "finsterwald-1",
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
  connectors: Record<
    "tags" | "tours" | "stay" | "bees" | "epilogue",
    { kicker: string; line: string }
  >;
  /** Three luggage tags from the road: one short story each, with a destination line. */
  tags: {
    kicker: string;
    title: string;
    items: { no: string; word: string; story: string; detail: string }[];
  };
  chapters: Record<StoryChapterId, Chapter>;
  passLines: Record<StoryPass, string>;
  passes: { title: string; subtitle: string; seeAll: string };
  tours: { title: string; subtitle: string };
  epilogue: string;
  reel: {
    frames: Record<
      Exclude<ReelFrameId, "erich">,
      { kicker: string; title: string; photoAlt: string }
    >;
    label: string;
    pause: string;
    play: string;
    prev: string;
    next: string;
    open: string;
    /** "Picture 2 of 5", for screen readers. */
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
    connectors: {
      tags: {
        kicker: "Before we ride",
        line: "Let me open my saddlebag and show you what I carry.",
      },
      tours: {
        kicker: "Ready to go",
        line: "Bags packed, engine warm. The first pass is waiting.",
      },
      stay: {
        kicker: "Next stop · Finsterwald",
        line: "After the passes, a bed is waiting where the story starts.",
      },
      bees: {
        kicker: "Same village · 2027",
        line: "And close by, a house is waiting for its bees.",
      },
      epilogue: {
        kicker: "The road ahead",
        line: "That is my corner of Switzerland. Let's ride it together.",
      },
    },
    tags: {
      kicker: "Tags from the road",
      title: "Three things I carry on every ride",
      items: [
        {
          no: "No. 1",
          word: "Motors",
          story:
            "Every morning starts the same: mirrors wiped, tyres checked, the engine warming in the cold air. Then the first bend comes, and the day belongs to the road.",
          detail: "Nufenen · 2,478 m",
        },
        {
          no: "No. 2",
          word: "Travel",
          story:
            "I never rush a tour. We stop where the light is good: coffee on a village square, lunch above the clouds, a bend where everyone reaches for their phone.",
          detail: "5 to 7 days · no rush",
        },
        {
          no: "No. 3",
          word: "Homeland",
          story:
            "Behind every pass lies a village, a dish and a story older than the road. Past the postcards, this is the Switzerland I want you to know.",
          detail: "Finsterwald · 1,060 m",
        },
      ],
    },
    chapters: {
      tours: {
        kicker: "Chapter I",
        label: "Motorbike tours",
        when: "5 to 7 days",
        title: "Five passes, five ways to understand a country",
        body: "Before cars, people crossed the Alps on foot and with mule trains carrying salt, wine and letters. Every bend is a piece of that history, not just a photo spot. We ride Furka, Grimsel, Susten, Gotthard and Nufenen together.",
        photoAlt: "The Furka Pass road winding into the valley",
      },
      stay: {
        kicker: "Chapter II",
        label: "Stay in Finsterwald",
        when: "Ask for dates",
        title: "Come back to Finsterwald for the night",
        body: "After a day on the passes, sleep where the story starts: a quiet village about 1,060 m up, an easy drive from the start of every pass ride.",
        photoAlt: "A farmhouse in the Entlebuch",
      },
      bees: {
        kicker: "Chapter III",
        label: "The bee house",
        when: "From 2027",
        title: "In Finsterwald, a bee house waits for its bees",
        body: "Finsterwald lies in the Entlebuch, a UNESCO Biosphere of forest, meadow and moor. The beauty here is quiet: light through the leaves, the smell of grass after rain. I have a bee house here and plan to keep bees from 2027. Before the first jar of honey comes the preparation.",
        photoAlt: "A wooden bee house with painted flight boards",
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
      seeAll: "Read the stories",
    },
    tours: {
      title: "Choose your tour",
      subtitle: "Guided by Erich, 5 to 7 days",
    },
    epilogue: "Epilogue · Until we meet",
    reel: {
      frames: {
        group: {
          kicker: "Small groups",
          title: "Good company makes every bend better",
          photoAlt:
            "Three riders on adventure motorbikes pausing at the side of a sunny mountain road",
        },
        iseran: {
          kicker: "Col de l'Iseran · 2,770 m",
          title: "Some views you only reach by bike",
          photoAlt:
            "Three riders and a BMW motorbike in front of the Col de l'Iseran sign under a deep blue sky",
        },
        rest: {
          kicker: "Rest stops",
          title: "A thumbs up, a coffee, then the next bend",
          photoAlt:
            "Three riders smiling beside their motorbikes at a rest stop, one with a thumbs up",
        },
        selfie: {
          kicker: "On the road",
          title: "Early starts, quiet roads, clear mountain air",
          photoAlt:
            "Two riders waiting on a mountain road with a rocky ridge behind them, seen past a helmet in the foreground",
        },
      },
      label: "Erich's story in five pictures",
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
    connectors: {
      tags: {
        kicker: "Bevor wir fahren",
        line: "Ich öffne meine Satteltasche und zeige Ihnen, was ich dabeihabe.",
      },
      tours: {
        kicker: "Startklar",
        line: "Gepäck verstaut, Motor warm. Der erste Pass wartet.",
      },
      stay: {
        kicker: "Nächster Halt · Finsterwald",
        line: "Nach den Pässen wartet ein Bett dort, wo die Geschichte beginnt.",
      },
      bees: {
        kicker: "Im selben Dorf · 2027",
        line: "Und ganz in der Nähe wartet ein Haus auf seine Bienen.",
      },
      epilogue: {
        kicker: "Der Weg voraus",
        line: "Das ist meine Ecke der Schweiz. Fahren wir sie zusammen.",
      },
    },
    tags: {
      kicker: "Anhänger von unterwegs",
      title: "Drei Dinge, die ich auf jeder Fahrt dabeihabe",
      items: [
        {
          no: "Nr. 1",
          word: "Motoren",
          story:
            "Jeder Morgen beginnt gleich: Spiegel geputzt, Reifen geprüft, der Motor warm in der kühlen Luft. Dann kommt die erste Kurve, und der Tag gehört der Strasse.",
          detail: "Nufenen · 2478 m",
        },
        {
          no: "Nr. 2",
          word: "Reisen",
          story:
            "Eine Tour hetze ich nie. Wir halten, wo das Licht schön ist: Kaffee auf dem Dorfplatz, Mittagessen über den Wolken, eine Kurve, in der alle zum Handy greifen.",
          detail: "5 bis 7 Tage · ohne Eile",
        },
        {
          no: "Nr. 3",
          word: "Heimat",
          story:
            "Hinter jedem Pass liegt ein Dorf, ein Gericht und eine Geschichte, älter als die Strasse. Hinter den Postkarten: Das ist die Schweiz, die ich Ihnen zeigen will.",
          detail: "Finsterwald · 1060 m",
        },
      ],
    },
    chapters: {
      tours: {
        kicker: "Kapitel I",
        label: "Motorradtouren",
        when: "5 bis 7 Tage",
        title: "Fünf Pässe, fünf Wege, ein Land zu verstehen",
        body: "Vor dem Auto querte man die Alpen zu Fuss und mit Saumzügen voller Salz, Wein und Briefe. Jede Kurve ist ein Stück dieser Geschichte, nicht nur ein Fotomotiv. Wir fahren Furka, Grimsel, Susten, Gotthard und Nufenen zusammen.",
        photoAlt: "Die Furkapassstrasse windet sich ins Tal",
      },
      stay: {
        kicker: "Kapitel II",
        label: "Übernachten in Finsterwald",
        when: "Daten anfragen",
        title: "Zurück nach Finsterwald für die Nacht",
        body: "Nach einem Tag auf den Pässen schlafen Sie dort, wo die Geschichte beginnt: in einem ruhigen Dorf auf etwa 1060 m, nicht weit vom Start jeder Passfahrt.",
        photoAlt: "Ein Bauernhaus im Entlebuch",
      },
      bees: {
        kicker: "Kapitel III",
        label: "Das Bienenhaus",
        when: "Ab 2027",
        title: "In Finsterwald wartet ein Bienenhaus auf seine Bienen",
        body: "Finsterwald liegt im Entlebuch, einer UNESCO Biosphäre aus Wald, Wiese und Moor. Die Schönheit hier ist leise: Licht durch die Blätter, der Duft von Gras nach dem Regen. Ich habe hier ein Bienenhaus und will ab 2027 Bienen halten. Vor dem ersten Glas Honig kommt die Vorbereitung.",
        photoAlt: "Ein hölzernes Bienenhaus mit bemalten Flugbrettern",
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
      seeAll: "Geschichten lesen",
    },
    tours: {
      title: "Ihre Tour wählen",
      subtitle: "Mit Erich, 5 bis 7 Tage",
    },
    epilogue: "Epilog · Bis bald",
    reel: {
      frames: {
        group: {
          kicker: "Kleine Gruppen",
          title: "Gute Gesellschaft macht jede Kurve schöner",
          photoAlt:
            "Drei Fahrer auf Reisemotorrädern halten am Rand einer sonnigen Bergstrasse",
        },
        iseran: {
          kicker: "Col de l'Iseran · 2770 m",
          title: "Manche Aussichten erreicht man nur mit dem Motorrad",
          photoAlt:
            "Drei Fahrer und eine BMW vor dem Schild des Col de l'Iseran unter tiefblauem Himmel",
        },
        rest: {
          kicker: "Pausen",
          title: "Daumen hoch, ein Kaffee, dann die nächste Kurve",
          photoAlt:
            "Drei lächelnde Fahrer neben ihren Motorrädern an einem Rastplatz, einer mit erhobenem Daumen",
        },
        selfie: {
          kicker: "Unterwegs",
          title: "Früh los, stille Strassen, klare Bergluft",
          photoAlt:
            "Zwei Fahrer warten auf einer Bergstrasse vor einem felsigen Grat, im Vordergrund ein Helm",
        },
      },
      label: "Erichs Geschichte in fünf Bildern",
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
