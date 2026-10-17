import type { Lang, PassId } from "../data/passes";

import { BASE_STOP, loc, passTour, stayTour } from "../data/passes";

export interface PlanInput {
  ride: "own" | "passenger" | "unsure";
  riders: number;
  /** 6 to 9 for June to September 2027. */
  month: number;
  /** 5 to 7. */
  days: number;
  /** "base": every night in Andermatt. "move": change base along the way. */
  stay: "base" | "move";
  /** "base", "move", "longer", "shorter", "finsterwald". The last stay one wins. */
  tweaks: string[];
}

export interface PlanStop {
  name: string;
  text: string;
}

export interface PlanItem {
  id: string;
  label: string;
  name: string;
  text: string;
  /** Where the night is spent. */
  night?: string;
  /** How far and how long the riding is, when known. */
  ride?: string;
  stops?: PlanStop[];
  tag?: string;
}

export interface Plan {
  title: string;
  days: number;
  stay: "base" | "move";
  items: PlanItem[];
  notes: string[];
  added: string[];
  removed: string[];
}

const L = (lang: Lang, en: string, de: string) => (lang === "de" ? de : en);

export const effectiveDays = (input: PlanInput) => {
  const longer = input.tweaks.includes("longer") ? 1 : 0;
  const shorter = input.tweaks.includes("shorter") ? 1 : 0;

  return Math.min(7, Math.max(5, input.days + longer - shorter));
};

export const effectiveStay = (input: PlanInput): "base" | "move" => {
  const chosen = [...input.tweaks]
    .reverse()
    .find((t) => t === "base" || t === "move");

  return (chosen as "base" | "move" | undefined) ?? input.stay;
};

const firstSentence = (text: string) => text.split(/(?<=\.)\s/)[0] ?? text;

/** Stops of a pass tour by id, in the order given, with the tour's own words. */
function stops(lang: Lang, pass: PassId, ids: string[]): PlanStop[] {
  const all = passTour(pass).itinerary;

  return ids.flatMap((id) => {
    const stop = all.find((s) => s.id === id);

    return stop
      ? [
          {
            name: loc(stop.name, lang),
            text: firstSentence(loc(stop.description, lang)),
          },
        ]
      : [];
  });
}

/**
 * The three-pass loops are the classic ones around Andermatt: Furka, Grimsel and Susten (about
 * 120 km, around 2.5 hours of riding, 3 to 5 with stops), and Gotthard, Nufenen and Furka
 * again (about 105 to 135 km, around 2.5 hours of riding). Lengths are from published routes
 * (Andermatt Tourism's roadbook, Switzerland Tourism); the stops are the pass tours' own.
 */
const loopA = (lang: Lang) => [
  ...stops(lang, "furka", ["realp", "furka-summit", "belvedere", "gletsch"]),
  ...stops(lang, "grimsel", ["grimsel-summit", "hospiz", "raeterichsboden"]),
  ...stops(lang, "susten", ["gadmen", "steingletscher", "summit", "wassen"]),
  ...stops(lang, "gotthard", ["schoellenen"]),
];

const loopB = (lang: Lang) => [
  ...stops(lang, "gotthard", ["hospice", "tremola", "airolo"]),
  ...stops(lang, "nufenen", ["bedretto", "allacqua", "summit", "ulrichen"]),
  ...stops(lang, "furka", ["gletsch", "belvedere", "realp"]),
];

export function buildPlan(input: PlanInput, lang: Lang): Plan {
  const days = effectiveDays(input);
  const stay = effectiveStay(input);
  const day = (n: number) => `${L(lang, "Day", "Tag")} ${n}`;
  const items: PlanItem[] = [];
  const base = BASE_STOP("furka");
  const andermatt = "Andermatt";
  const innertkirchen = "Innertkirchen";
  const airolo = "Airolo";

  const ride = {
    a: L(
      lang,
      "About 120 km, around 2.5 hours of riding; 3 to 5 hours with stops.",
      "Rund 120 km, etwa 2,5 Stunden Fahrzeit; mit Halten 3 bis 5 Stunden.",
    ),
    b: L(
      lang,
      "About 105 to 135 km, around 2.5 hours of riding before stops.",
      "Rund 105 bis 135 km, etwa 2,5 Stunden Fahrzeit vor den Halten.",
    ),
  };

  items.push({
    id: "d1",
    label: day(1),
    name: loc(base.name, lang),
    text: loc(base.description, lang),
    night: andermatt,
  });

  if (stay === "base") {
    items.push({
      id: "d2",
      label: day(2),
      name: L(lang, "Furka, Grimsel and Susten", "Furka, Grimsel und Susten"),
      text: L(
        lang,
        "The classic three-pass loop from Andermatt: up the Furka past the Rhône Glacier, over the Grimsel to Innertkirchen, then up the Susten and back through the Schöllenen gorge.",
        "Die klassische Dreipässe-Runde ab Andermatt: über die Furka am Rhonegletscher vorbei, über die Grimsel nach Innertkirchen, dann über den Susten und durch die Schöllenen zurück.",
      ),
      ride: ride.a,
      night: andermatt,
      stops: loopA(lang),
    });
    items.push({
      id: "d3",
      label: day(3),
      name: L(
        lang,
        "Gotthard, Nufenen and Furka",
        "Gotthard, Nufenen und Furka",
      ),
      text: L(
        lang,
        "The second loop, south and back: over the Gotthard and down the cobbled Tremola to Airolo, up the Nufenen to Ulrichen, then over the Furka again from the other side.",
        "Die zweite Runde, nach Süden und zurück: über den Gotthard und die gepflasterte Tremola nach Airolo, über den Nufenen nach Ulrichen und dann nochmals über die Furka von der anderen Seite.",
      ),
      ride: ride.b,
      night: andermatt,
      stops: loopB(lang),
    });
  } else {
    items.push({
      id: "d2",
      label: day(2),
      name: L(
        lang,
        "Furka and Grimsel to Innertkirchen",
        "Furka und Grimsel bis Innertkirchen",
      ),
      text: L(
        lang,
        "Out of Andermatt over the Furka past the Rhône Glacier, then over the Grimsel and down to the Haslital. A shorter day than the full loop, so there is time at the stops.",
        "Von Andermatt über die Furka am Rhonegletscher vorbei, dann über die Grimsel hinunter ins Haslital. Ein kürzerer Tag als die ganze Runde, mit Zeit für die Halte.",
      ),
      night: `${innertkirchen} ${L(lang, "(or Meiringen)", "(oder Meiringen)")}`,
      stops: [
        ...stops(lang, "furka", [
          "realp",
          "furka-summit",
          "belvedere",
          "gletsch",
        ]),
        ...stops(lang, "grimsel", [
          "grimsel-summit",
          "hospiz",
          "raeterichsboden",
        ]),
      ],
    });
    items.push({
      id: "d3",
      label: day(3),
      name: L(
        lang,
        "Susten and Gotthard to Airolo",
        "Susten und Gotthard bis Airolo",
      ),
      text: L(
        lang,
        "Up the Susten and down to Wassen, through the Schöllenen gorge to Andermatt, then over the Gotthard and down the Tremola into Ticino.",
        "Über den Susten hinunter nach Wassen, durch die Schöllenen nach Andermatt, dann über den Gotthard und die Tremola ins Tessin.",
      ),
      night: airolo,
      stops: [
        ...stops(lang, "susten", [
          "gadmen",
          "steingletscher",
          "summit",
          "wassen",
        ]),
        ...stops(lang, "gotthard", [
          "schoellenen",
          "hospice",
          "tremola",
          "airolo",
        ]),
      ],
    });
    items.push({
      id: "d4",
      label: day(4),
      name: L(
        lang,
        "Nufenen and Furka back to Andermatt",
        "Nufenen und Furka zurück nach Andermatt",
      ),
      text: L(
        lang,
        "Up the Val Bedretto and over the Nufenen to Ulrichen, then over the Furka once more from the Valais side, back to where the week began.",
        "Durch das Bedrettotal und über den Nufenen nach Ulrichen, dann nochmals über die Furka von der Walliser Seite zurück dorthin, wo die Woche begann.",
      ),
      night: andermatt,
      stops: [
        ...stops(lang, "nufenen", [
          "bedretto",
          "allacqua",
          "summit",
          "ulrichen",
        ]),
        ...stops(lang, "furka", ["gletsch", "belvedere", "realp"]),
      ],
    });
  }

  const ridden = items.length;
  const reserve: PlanItem = {
    id: "reserve",
    label: "",
    name: L(lang, "A day in reserve", "Ein Reservetag"),
    text: L(
      lang,
      "Passes can close for snow or weather, and a ride-out day can change. This day keeps the loops from being lost: if everything went well, walk the Schöllenen gorge and the Devil's Bridge, or ride the pass you liked best again.",
      "Pässe können wegen Schnee oder Wetter schliessen, ein Ausfahrtstag kann sich ändern. Dieser Tag sorgt dafür, dass keine Runde ausfällt: Ist alles gut gegangen, laufen Sie durch die Schöllenen zur Teufelsbrücke oder fahren den Pass, der Ihnen am besten gefiel, noch einmal.",
    ),
    tag: L(lang, "Reserve", "Reserve"),
    night: andermatt,
  };
  const favourite: PlanItem = {
    id: "favourite",
    label: "",
    name: L(lang, "Your favourite pass again", "Ihr Lieblingspass noch einmal"),
    text: L(
      lang,
      "Pick it with Erich over breakfast, once you know which one you liked best. Riding a pass in the other direction shows it differently.",
      "Wählen Sie ihn mit Erich beim Frühstück, wenn Sie wissen, welcher Ihnen am besten gefiel. Ein Pass in der Gegenrichtung zeigt sich anders.",
    ),
    night: andermatt,
  };
  const farewell: PlanItem = {
    id: "farewell",
    label: "",
    name: L(lang, "Farewell", "Abschied"),
    text: L(
      lang,
      "A last coffee with Erich in Andermatt, and the ride home.",
      "Ein letzter Kaffee mit Erich in Andermatt, und die Heimfahrt.",
    ),
  };

  const slow: PlanItem = {
    id: "slow",
    label: "",
    name: L(lang, "A slow day in Andermatt", "Ein ruhiger Tag in Andermatt"),
    text: L(
      lang,
      "No pass. The Schöllenen gorge and the Devil's Bridge, a walk through Andermatt, and time to compare photos before the last evening.",
      "Kein Pass. Die Schöllenen und die Teufelsbrücke, ein Spaziergang durch Andermatt und Zeit, die Fotos zu vergleichen, bevor der letzte Abend kommt.",
    ),
    night: andermatt,
  };
  const reserveAndFarewell: PlanItem = {
    ...reserve,
    id: "reserve-farewell",
    name: L(lang, "Reserve day and farewell", "Reservetag und Abschied"),
    text: `${reserve.text} ${farewell.text}`,
    night: undefined,
  };
  const slots = days - ridden;
  const extra: PlanItem[] =
    slots <= 1
      ? [reserveAndFarewell]
      : slots === 2
        ? [reserve, farewell]
        : slots === 3
          ? [reserve, favourite, farewell]
          : [reserve, favourite, slow, farewell];

  extra.forEach((item, i) => {
    items.push({ ...item, label: day(ridden + i + 1) });
  });

  if (input.tweaks.includes("finsterwald")) {
    const night = stayTour();
    const description = loc(night.description, lang)
      .split(/(?<=\.)\s/)
      .slice(0, 2)
      .join(" ");

    items.push({
      id: "finsterwald",
      label: L(lang, "After", "Danach"),
      name: loc(night.name, lang),
      text: `${description} ${L(lang, "Booked separately.", "Wird separat gebucht.")}`,
      tag: L(lang, "Optional", "Optional"),
    });
  }

  return {
    title: L(
      lang,
      `All five passes in ${days} days`,
      `Alle fünf Pässe in ${days} Tagen`,
    ),
    days,
    stay,
    items,
    notes: [
      L(
        lang,
        "This is a plan to talk through, not a booked itinerary. Erich confirms the route, the nights and the price with you.",
        "Das ist ein Plan zum Besprechen, keine gebuchte Reise. Erich bestätigt Route, Übernachtungen und Preis mit Ihnen.",
      ),
      L(
        lang,
        "Hotels are booked separately. Motorcycle and riding gear are arranged separately: ask before booking.",
        "Hotels werden separat gebucht. Motorrad und Fahrerausrüstung werden separat geklärt: bitte vor der Buchung fragen.",
      ),
      L(
        lang,
        "The pass tours start at CHF 780 for 5 days. A combined trip is quoted by Erich himself.",
        "Die Passtouren beginnen bei CHF 780 für 5 Tage. Eine kombinierte Reise offeriert Erich selbst.",
      ),
      loc(passTour("furka").conditions, lang),
    ],
    added: [],
    removed: [],
  };
}

/** Compares with the plan before the last adjustment, so the reply can say what changed. */
export function buildWithDiff(input: PlanInput, lang: Lang): Plan {
  const plan = buildPlan(input, lang);

  if (!input.tweaks.length) return plan;
  const before = buildPlan(
    { ...input, tweaks: input.tweaks.slice(0, -1) },
    lang,
  );
  const names = (p: Plan) => p.items.map((i) => i.name);

  return {
    ...plan,
    added: names(plan).filter((n) => !names(before).includes(n)),
    removed: names(before).filter((n) => !names(plan).includes(n)),
  };
}
