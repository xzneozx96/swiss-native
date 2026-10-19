/**
 * Lab copy for Erich's three loves (#/lab/loves). Erich speaks in the first person, about
 * his travel life only. Heights and the 5 to 7 tour days match story-copy.ts; Finsterwald
 * at about 1,060 m matches the stay chapter.
 */
export type LovesLanguage = 'en' | 'de'

export type LoveId = 'motors' | 'travel' | 'homeland'

export interface Love {
  id: LoveId
  word: string
  line: string
}

export interface LovesCopy {
  kicker: string
  title: string
  loves: [Love, Love, Love]
  /** A. Luggage tags: the small detail written on each tag. */
  tags: [string, string, string]
  /** B. Passport stamps: the text around/inside each stamp. */
  stamps: { top: string, detail: string }[]
  stampAlt: (word: string, top: string, detail: string) => string
  /** C. Photo rail. */
  rail: { label: string, alts: [string, string, string] }
  /** D. Marker sentence: plain text, with the three loves' words marked by index. */
  sentence: (string | { mark: 0 | 1 | 2, text: string })[]
  /** E. Odometer: the reading, its unit and caption. */
  odometer: { value: number, unit: string, caption: string }[]
}

export const lovesCopy: Record<LovesLanguage, LovesCopy> = {
  en: {
    kicker: 'What I ride for',
    title: 'My three loves',
    loves: [
      {
        id: 'motors',
        word: 'Motors',
        line: 'I check my bike before every start. Then the bends are mine.',
      },
      {
        id: 'travel',
        word: 'Travel',
        line: 'I plan every stop myself: coffee, viewpoints, lunch with a view.',
      },
      {
        id: 'homeland',
        word: 'Homeland',
        line: 'I show you my home past the postcards: villages, dishes, trade routes.',
      },
    ],
    tags: [
      'Nufenen · 2,478 m',
      '5 to 7 days · no rush',
      'Finsterwald · 1,060 m',
    ],
    stamps: [
      { top: 'Nufenenpass', detail: '2478 m' },
      { top: 'Grimselpass', detail: '2165 m' },
      { top: 'Finsterwald', detail: 'Entlebuch · 1060 m' },
    ],
    stampAlt: (word, top, detail) => `Stamp: ${word}, ${top}, ${detail}`,
    rail: {
      label: 'My three loves, in pictures',
      alts: [
        'The cobbled hairpins of the Tremola on the Gotthard Pass',
        'Hotel Belvedere on a bend of the Furka Pass road',
        'Meadows and forest of the UNESCO Biosphere Entlebuch',
      ],
    },
    sentence: [
      'I ride for the ',
      { mark: 0, text: 'bends' },
      ', I travel for the ',
      { mark: 1, text: 'stops' },
      ', and I do it all for ',
      { mark: 2, text: 'home' },
      '.',
    ],
    odometer: [
      {
        value: 2478,
        unit: 'm',
        caption: 'The Nufenen, the highest pass I ride.',
      },
      {
        value: 7,
        unit: 'days',
        caption: 'My longest tour. Every stop planned by me.',
      },
      {
        value: 1060,
        unit: 'm',
        caption: 'Finsterwald, the village where my story starts.',
      },
    ],
  },
  de: {
    kicker: 'Wofür ich fahre',
    title: 'Meine drei Lieben',
    loves: [
      {
        id: 'motors',
        word: 'Motoren',
        line: 'Vor jedem Start prüfe ich mein Motorrad. Dann gehören die Kurven mir.',
      },
      {
        id: 'travel',
        word: 'Reisen',
        line: 'Jeden Halt plane ich selbst: Kaffee, Aussicht, Mittagessen mit Blick.',
      },
      {
        id: 'homeland',
        word: 'Heimat',
        line: 'Ich zeige Ihnen meine Heimat hinter den Postkarten: Dörfer, Gerichte, Säumerwege.',
      },
    ],
    tags: [
      'Nufenen · 2478 m',
      '5 bis 7 Tage · ohne Eile',
      'Finsterwald · 1060 m',
    ],
    stamps: [
      { top: 'Nufenenpass', detail: '2478 m' },
      { top: 'Grimselpass', detail: '2165 m' },
      { top: 'Finsterwald', detail: 'Entlebuch · 1060 m' },
    ],
    stampAlt: (word, top, detail) => `Stempel: ${word}, ${top}, ${detail}`,
    rail: {
      label: 'Meine drei Lieben in Bildern',
      alts: [
        'Die gepflasterten Kehren der Tremola am Gotthardpass',
        'Das Hotel Belvedere in einer Kurve der Furkapassstrasse',
        'Wiesen und Wald der UNESCO Biosphäre Entlebuch',
      ],
    },
    sentence: [
      'Ich fahre für die ',
      { mark: 0, text: 'Kurven' },
      ', reise für die ',
      { mark: 1, text: 'Pausen' },
      ' und tue alles für meine ',
      { mark: 2, text: 'Heimat' },
      '.',
    ],
    odometer: [
      {
        value: 2478,
        unit: 'm',
        caption: 'Der Nufenen, der höchste Pass, den ich fahre.',
      },
      {
        value: 7,
        unit: 'Tage',
        caption: 'Meine längste Tour. Jeden Halt plane ich selbst.',
      },
      {
        value: 1060,
        unit: 'm',
        caption: 'Finsterwald, das Dorf, wo meine Geschichte beginnt.',
      },
    ],
  },
}

export const labChrome: Record<
  LovesLanguage,
  {
    title: string
    idea: string
    language: string
    names: string[]
    notes: string[]
    context: string
  }
> = {
  en: {
    title: 'Lab · Erich\'s three loves',
    idea: 'Idea',
    language: 'Language',
    names: ['Tags', 'Stamps', 'Photos', 'Sentence', 'Odometer'],
    notes: [
      'Three luggage tags on a rail; they swing once when first seen.',
      'Passport page: three ink stamps thump down one after another.',
      'Tall photo cards to swipe, a big handwritten word on each.',
      'One serif sentence; its three words get marked in red, in turn.',
      'Light odometer: digits roll up to each reading on first view.',
    ],
    context: 'Intro above, tours chapter below, as on the home.',
  },
  de: {
    title: 'Lab · Erichs drei Lieben',
    idea: 'Idee',
    language: 'Sprache',
    names: ['Anhänger', 'Stempel', 'Fotos', 'Satz', 'Zähler'],
    notes: [
      'Drei Gepäckanhänger an einer Stange; sie schwingen beim ersten Blick.',
      'Passseite: drei Stempel knallen nacheinander aufs Papier.',
      'Hohe Fotokarten zum Wischen, je ein grosses handgeschriebenes Wort.',
      'Ein Satz in Serif; drei Wörter werden nacheinander rot markiert.',
      'Heller Kilometerzähler: die Ziffern rollen beim ersten Blick hoch.',
    ],
    context:
      'Oben die Einleitung, unten das Tourenkapitel, wie auf der Startseite.',
  },
}
