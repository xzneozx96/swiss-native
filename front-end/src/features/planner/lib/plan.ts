import type { Lang, PassId } from "../data/passes";

import {
  loc,
  PASS_INTEREST,
  PASS_ORDER,
  passStops,
  passTour,
  priceFor,
} from "../data/passes";

export interface PlanInput {
  ride: "own" | "passenger" | "unsure";
  riders: number;
  /** 6 to 9 for June to September 2027, 0 when flexible. */
  month: number;
  days: number;
  interests: PassId[];
  /** "shorter", "longer", "relaxed", "stay". */
  tweaks: string[];
}

export interface PlanItem {
  id: string;
  day: number;
  name: string;
  text: string;
  tag?: string;
  /** The pass the day rides, when it rides one. */
  pass?: PassId;
}

export interface Plan {
  title: string;
  days: number;
  price: number;
  passes: PassId[];
  items: PlanItem[];
  notes: string[];
  skipped: { name: string; reason: string }[];
  added: string[];
  removed: string[];
}

const L = (lang: Lang, en: string, de: string) => (lang === "de" ? de : en);

export const effectiveDays = (input: PlanInput) => {
  let days = input.days;

  if (input.tweaks.includes("shorter")) days = Math.max(5, days - 1);
  if (input.tweaks.includes("longer")) days = Math.min(7, days + 1);

  return days;
};

const joinNames = (lang: Lang, names: string[]) =>
  names.length < 2
    ? names.join("")
    : `${names.slice(0, -1).join(", ")} ${L(lang, "and", "und")} ${names.at(-1)}`;

function stopLine(lang: Lang, id: PassId) {
  return passStops(id)
    .map((s) => loc(s.name, lang))
    .join(" · ");
}

/** The ride-out passes for the days that fit: the guest's picks first, then suggestions. */
function chooseRides(input: PlanInput, rideDays: number) {
  const picked = input.interests.slice(0, rideDays);
  const left = input.interests.slice(rideDays);
  const extra = PASS_ORDER.filter((p) => !input.interests.includes(p)).slice(
    0,
    Math.max(0, rideDays - picked.length),
  );

  return { picked, left, extra };
}

export function buildPlan(input: PlanInput, lang: Lang): Plan {
  const days = effectiveDays(input);
  const rideDays = days - 2;
  const relaxed = input.tweaks.includes("relaxed");
  const { picked, left, extra } = chooseRides(
    input,
    relaxed ? rideDays - 1 : rideDays,
  );
  const rides = [...picked, ...extra];
  const items: PlanItem[] = [];

  items.push({
    id: "day-1",
    day: 1,
    name: L(lang, "Andermatt, the base", "Andermatt, der Standort"),
    text: L(
      lang,
      "Meet Erich and the group, check the bikes and the weather, and plan the ride-out days together. Hotels are booked separately.",
      "Erich und die Gruppe treffen, Motorräder und Wetter prüfen und die Ausfahrten gemeinsam planen. Hotels werden separat gebucht.",
    ),
  });

  rides.forEach((id, i) => {
    const tour = passTour(id);

    items.push({
      id: `day-${i + 2}`,
      day: i + 2,
      name: loc(tour.name, lang),
      text: stopLine(lang, id),
      pass: id,
      tag: input.interests.includes(id)
        ? undefined
        : L(lang, "Suggested", "Vorschlag"),
    });
  });

  if (relaxed) {
    items.push({
      id: `day-${rides.length + 2}`,
      day: rides.length + 2,
      name: L(lang, "A slow day", "Ein ruhiger Tag"),
      text: L(
        lang,
        "No pass. Coffee in the village, the bikes, and whatever the group feels like.",
        "Kein Pass. Kaffee im Dorf, die Motorräder und was der Gruppe gerade passt.",
      ),
    });
  }

  items.push({
    id: `day-${days}`,
    day: days,
    name: input.tweaks.includes("stay")
      ? L(lang, "A night in Finsterwald", "Eine Nacht in Finsterwald")
      : L(lang, "Free ride and farewell", "Freie Fahrt und Abschied"),
    text: input.tweaks.includes("stay")
      ? L(
          lang,
          "Ride over to Erich's bee house in the Entlebuch biosphere for a quiet last evening. Rooms are still to be confirmed with Erich.",
          "Fahrt zu Erichs Bienenhaus im Biosphärenreservat Entlebuch für einen ruhigen letzten Abend. Die Zimmer werden noch mit Erich bestätigt.",
        )
      : L(
          lang,
          "A free ride from the base, shaped with Erich, and a last coffee together.",
          "Eine freie Fahrt ab dem Standort, mit Erich abgestimmt, und ein letzter Kaffee zusammen.",
        ),
  });

  const names = rides.map((id) => PASS_INTEREST[id].theme);

  return {
    title: L(
      lang,
      `${days} days over ${joinNames(lang, names)}`,
      `${days} Tage über ${joinNames(lang, names)}`,
    ),
    days,
    price: priceFor(days),
    passes: rides,
    items,
    notes: [
      L(
        lang,
        "Passes open with the seasons: usually from about June to October. Erich checks road status and weather before each ride-out, and a day can change.",
        "Pässe öffnen saisonal: meist etwa von Juni bis Oktober. Erich prüft vor jeder Ausfahrt Strassenzustand und Wetter, ein Tag kann sich ändern.",
      ),
      L(
        lang,
        "Fuel, meals and accommodation are not included. Bike and gear are arranged separately with Erich.",
        "Treibstoff, Essen und Unterkunft sind nicht inbegriffen. Motorrad und Ausrüstung klärt Erich separat mit Ihnen.",
      ),
    ],
    skipped: left.map((id) => ({
      name: loc(passTour(id).name, lang),
      reason: L(lang, `no room in ${days} days`, `kein Platz in ${days} Tagen`),
    })),
    added: [],
    removed: [],
  };
}

/** Compares two plans by day names, so a changed plan can say what was added and removed. */
export function buildWithDiff(
  input: PlanInput,
  lang: Lang,
  previousTweaks = input.tweaks.slice(0, -1),
): Plan {
  const plan = buildPlan(input, lang);

  if (!input.tweaks.length) return plan;
  const before = buildPlan({ ...input, tweaks: previousTweaks }, lang);
  const names = (p: Plan) => p.items.map((i) => i.name);

  return {
    ...plan,
    added: names(plan).filter((n) => !names(before).includes(n)),
    removed: names(before).filter((n) => !names(plan).includes(n)),
  };
}
