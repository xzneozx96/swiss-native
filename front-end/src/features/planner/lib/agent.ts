import type { UIMessage } from "ai";
import type { Lang } from "../data/passes";

import { loc } from "../data/passes";

import {
  buildWithDiff,
  effectiveDays,
  effectiveStay,
  type PlanInput,
} from "./plan";

import { tourSeed } from "@/features/tours/seed";

export type Step =
  | { kind: "reasoning"; text: string }
  | { kind: "tool"; name: string; input: unknown; output: unknown; ms?: number }
  | { kind: "ask"; name: string; input: unknown }
  | { kind: "text"; text: string };

export type Turn = Step[];

export interface AgentHooks {
  language: () => Lang;
  createInquiry: (summary: {
    riders: number;
    dateFrom: string;
    dateTo: string;
    note: string;
  }) => string;
}

interface Answer {
  name: string;
  output: Record<string, unknown>;
}

const TWEAKS = ["base", "move", "longer", "shorter", "finsterwald"];

const L = (lang: Lang, en: string, de: string) => (lang === "de" ? de : en);

const MONTHS: Record<Lang, string[]> = {
  en: ["June", "July", "August", "September"],
  de: ["Juni", "Juli", "August", "September"],
};
const monthName = (lang: Lang, month: number) => MONTHS[lang][month - 6];

/** Every answered client tool, in conversation order. */
function answered(messages: UIMessage[]): Answer[] {
  return messages
    .filter((m) => m.role === "assistant")
    .flatMap((m) => m.parts)
    .flatMap((part) => {
      const p = part as {
        type: string;
        state?: string;
        output?: Record<string, unknown>;
      };

      return p.type.startsWith("tool-ask_") &&
        p.state === "output-available" &&
        p.output
        ? [{ name: p.type.slice(5), output: p.output }]
        : [];
    });
}

const latest = (a: Answer[], name: string) =>
  [...a].reverse().find((x) => x.name === name)?.output;

export function inputFrom(a: Answer[]): PlanInput | null {
  const ride = latest(a, "ask_ride");
  const party = latest(a, "ask_party");
  const when = latest(a, "ask_when");
  const stay = latest(a, "ask_stay");

  if (!ride || !party || !when || !stay) return null;

  return {
    ride: ride.id as PlanInput["ride"],
    riders: party.riders as number,
    month: when.month as number,
    days: when.days as number,
    stay: stay.id as PlanInput["stay"],
    tweaks: a
      .filter((x) => x.name === "ask_next")
      .map((x) => x.output.id as string)
      .filter((id) => TWEAKS.includes(id)),
  };
}

function planTurn(input: PlanInput, lang: Lang, lead: string): Turn {
  const plan = buildWithDiff(input, lang);
  const first = input.tweaks.length === 0;
  const used = new Set(input.tweaks);
  const days = effectiveDays(input);
  const stay = effectiveStay(input);

  const changes =
    plan.added.length || plan.removed.length
      ? [
          plan.added.length > 0 &&
            `${L(lang, "Added", "Neu")}: ${plan.added.join(", ")}.`,
          plan.removed.length > 0 &&
            `${L(lang, "Removed", "Entfernt")}: ${plan.removed.join(", ")}.`,
        ]
          .filter(Boolean)
          .join(" ")
      : "";

  const options = [
    {
      id: stay === "base" ? "move" : "base",
      label:
        stay === "base"
          ? L(
              lang,
              "Change base along the way",
              "Unterwegs die Unterkunft wechseln",
            )
          : L(
              lang,
              "Sleep in Andermatt every night",
              "Jede Nacht in Andermatt schlafen",
            ),
      group: "Adjust",
    },
    days < 7 && {
      id: "longer",
      label: L(lang, "One day longer", "Einen Tag länger"),
      group: "Adjust",
    },
    days > 5 && {
      id: "shorter",
      label: L(lang, "One day shorter", "Einen Tag kürzer"),
      group: "Adjust",
    },
    !used.has("finsterwald") && {
      id: "finsterwald",
      label: L(
        lang,
        "Add a night in Finsterwald",
        "Eine Nacht in Finsterwald dazunehmen",
      ),
      group: "Adjust",
    },
    {
      id: "send",
      label: L(lang, "Send this plan to Erich", "Diesen Plan an Erich senden"),
      group: "Next",
    },
    {
      id: "passes",
      label: L(
        lang,
        "Read the five pass stories",
        "Die fünf Pass-Geschichten lesen",
      ),
      group: "Next",
    },
    {
      id: "tours",
      label: L(
        lang,
        "Browse the single-pass tours",
        "Die Einzelpass-Touren ansehen",
      ),
      group: "Next",
    },
  ].filter(Boolean);

  return [
    { kind: "reasoning", text: lead },
    {
      kind: "tool",
      name: "plan_route",
      input: {
        passes: 5,
        days,
        base: stay === "base" ? "Andermatt" : "moving",
      },
      output: {
        loops: [
          {
            passes: "Furka, Grimsel, Susten",
            km: "about 120",
            riding: "about 2.5 h",
            withStops: "3 to 5 h",
          },
          {
            passes: "Gotthard, Nufenen, Furka",
            km: "about 105 to 135",
            riding: "about 2.5 h",
          },
        ],
        sources: ["Andermatt Tourism roadbook", "Switzerland Tourism"],
      },
      ms: 900,
    },
    {
      kind: "tool",
      name: "build_itinerary",
      input: { days, stay },
      output: plan,
      ms: 1200,
    },
    {
      kind: "text",
      text:
        (first
          ? L(
              lang,
              `Here is a ${days}-day plan that covers all five passes in two loops, with ${stay === "base" ? "every night in Andermatt" : "nights in Andermatt, Innertkirchen and Airolo"}.`,
              `Hier ist ein Plan über ${days} Tage, der alle fünf Pässe in zwei Runden abdeckt, ${stay === "base" ? "mit jeder Nacht in Andermatt" : "mit Nächten in Andermatt, Innertkirchen und Airolo"}.`,
            )
          : `${L(lang, "Updated.", "Angepasst.")} ${changes}`) +
        L(lang, " Want to adjust anything?", " Möchten Sie etwas ändern?"),
    },
    {
      kind: "ask",
      name: "ask_next",
      input: { options },
    },
  ];
}

const REASON_TWEAK = (lang: Lang): Record<string, string> => ({
  base: L(
    lang,
    "Back to one base. Both loops start and end in Andermatt, so every night can be spent there and the bags stay put.",
    "Zurück zu einer Unterkunft. Beide Runden beginnen und enden in Andermatt, jede Nacht lässt sich dort verbringen und das Gepäck bleibt.",
  ),
  move: L(
    lang,
    "Changing base: the three-pass loop splits at Innertkirchen, and the south side is reached from Airolo, so I move the nights there and rebuild the days.",
    "Wechsel der Unterkunft: Die Dreipässe-Runde teilt sich bei Innertkirchen, und die Südseite erreicht man von Airolo aus. Ich verlege die Nächte dorthin und baue die Tage neu.",
  ),
  longer: L(
    lang,
    "One more day. The ride days stay the same, so the extra day goes to the reserve and to a pass you want to ride again.",
    "Ein Tag mehr. Die Fahrtage bleiben gleich, der zusätzliche Tag geht an die Reserve und an einen Pass, den Sie nochmals fahren möchten.",
  ),
  shorter: L(
    lang,
    "One day fewer. I'll keep both loops and take the time from the spare days.",
    "Ein Tag weniger. Beide Runden bleiben, die Zeit nehme ich von den freien Tagen.",
  ),
  finsterwald: L(
    lang,
    "The night at Erich's bee house in Finsterwald is a separate booking, and the rooms are still to be confirmed with him, so I add it as an optional step after the trip.",
    "Die Nacht in Erichs Bienenhaus in Finsterwald wird separat gebucht, die Zimmer werden noch mit ihm bestätigt. Ich füge sie deshalb als optionalen Schritt nach der Reise an.",
  ),
});

/** The scripted agent: reads the conversation so far and returns the next turn. */
export function nextTurn(messages: UIMessage[], hooks: AgentHooks): Turn {
  const lang = hooks.language();
  const a = answered(messages);
  const last = a.at(-1);

  if (!last) {
    const tours = tourSeed.filter((t) => t.kind === "tour" && t.published);

    return [
      {
        kind: "reasoning",
        text: L(
          lang,
          "Erich's five pass tours each ride one pass. Most riders who come for the passes want all five, so I'll plan that. First I need to know how you travel.",
          "Erichs fünf Passtouren fahren je einen Pass. Wer wegen der Pässe kommt, will meist alle fünf, also plane ich das. Zuerst muss ich wissen, wie Sie reisen.",
        ),
      },
      {
        kind: "tool",
        name: "list_tours",
        input: { kind: "motorbike pass tour" },
        output: {
          count: tours.length,
          tours: tours.map((t) => ({
            name: loc(t.name, "en"),
            fromCHF: Math.round(t.adultPrice / 100),
          })),
        },
        ms: 700,
      },
      {
        kind: "text",
        text: L(
          lang,
          "Hi! I'm Erich's trip assistant. I can plan all five passes (Furka, Grimsel, Susten, Gotthard and Nufenen) as one trip around Andermatt. A few quick questions first. How will you ride?",
          "Grüezi! Ich bin Erichs Reiseassistent. Ich kann alle fünf Pässe (Furka, Grimsel, Susten, Gotthard und Nufenen) als eine Reise rund um Andermatt planen. Zuerst ein paar kurze Fragen. Wie fahren Sie?",
        ),
      },
      {
        kind: "ask",
        name: "ask_ride",
        input: {
          options: [
            {
              id: "own",
              label: L(
                lang,
                "On my own motorbike",
                "Mit meinem eigenen Motorrad",
              ),
              hint: L(lang, "I ride myself", "Ich fahre selbst"),
            },
            {
              id: "passenger",
              label: L(lang, "As a passenger", "Als Sozia oder Sozius"),
              hint: L(lang, "Someone else rides", "Jemand anderes fährt"),
            },
            {
              id: "unsure",
              label: L(lang, "I'm not sure yet", "Das weiss ich noch nicht"),
              hint: L(
                lang,
                "Erich and I sort it out",
                "Erich und ich klären es",
              ),
            },
          ],
        },
      },
    ];
  }

  switch (last.name) {
    case "ask_ride":
      return [
        {
          kind: "text",
          text: L(
            lang,
            "Good. Motorcycle and riding gear are arranged separately with Erich, so we'll keep that for later. How many riders are in the group?",
            "Gut. Motorrad und Fahrerausrüstung klärt Erich separat mit Ihnen, das heben wir uns für später auf. Wie viele Personen sind in der Gruppe?",
          ),
        },
        { kind: "ask", name: "ask_party", input: {} },
      ];
    case "ask_party":
      return [
        {
          kind: "text",
          text: L(
            lang,
            "When would you like to ride, and how many days do you have?",
            "Wann möchten Sie fahren, und wie viele Tage haben Sie?",
          ),
        },
        { kind: "ask", name: "ask_when", input: {} },
      ];
    case "ask_when": {
      const month = last.output.month as number;
      const early = month === 6;

      return [
        {
          kind: "reasoning",
          text: L(
            lang,
            `${monthName(lang, month)}. Pass roads close for snow in winter, so before I plan anything I should check how that month sits in the season. The tours say the passes are usually open from about June to October.`,
            `${monthName(lang, month)}. Passstrassen sind im Winter wegen Schnee gesperrt, also prüfe ich, wie dieser Monat in der Saison liegt. Laut den Touren sind die Pässe meist von etwa Juni bis Oktober offen.`,
          ),
        },
        {
          kind: "tool",
          name: "check_season",
          input: { month: monthName("en", month), year: 2027 },
          output: {
            usualSeason: "about June to October (from the tours' conditions)",
            status: early
              ? "early in the season, a pass can open late"
              : "usually open",
            note: "Snow or weather can change or cancel a day; check road status before riding",
          },
          ms: 900,
        },
        {
          kind: "text",
          text: early
            ? L(
                lang,
                "Early June is the start of the season, so a pass may open late. I'll keep a reserve day in the plan. Where do you want to sleep?",
                "Anfang Juni beginnt die Saison, ein Pass kann später öffnen. Ich plane einen Reservetag ein. Wo möchten Sie übernachten?",
              )
            : L(
                lang,
                "That falls inside the usual season. Where do you want to sleep?",
                "Das liegt in der üblichen Saison. Wo möchten Sie übernachten?",
              ),
        },
        {
          kind: "ask",
          name: "ask_stay",
          input: {
            options: [
              {
                id: "base",
                label: L(
                  lang,
                  "One base: Andermatt every night",
                  "Eine Unterkunft: jede Nacht in Andermatt",
                ),
                hint: L(
                  lang,
                  "Both loops start and end there",
                  "Beide Runden beginnen und enden dort",
                ),
              },
              {
                id: "move",
                label: L(
                  lang,
                  "Change base along the way",
                  "Unterwegs die Unterkunft wechseln",
                ),
                hint: L(
                  lang,
                  "Andermatt, Innertkirchen, Airolo",
                  "Andermatt, Innertkirchen, Airolo",
                ),
              },
            ],
          },
        },
      ];
    }
    case "ask_stay": {
      const input = inputFrom(a);

      return input
        ? planTurn(
            input,
            lang,
            L(
              lang,
              "All five passes fit into two classic loops around Andermatt: Furka, Grimsel and Susten, then Gotthard, Nufenen and Furka again. I'll check their lengths, then lay out the days.",
              "Alle fünf Pässe passen in zwei klassische Runden rund um Andermatt: Furka, Grimsel und Susten, dann Gotthard, Nufenen und nochmals Furka. Ich prüfe die Längen und baue dann die Tage.",
            ),
          )
        : [];
    }
    case "ask_next": {
      const id = last.output.id as string;
      const input = inputFrom(a);

      if (id === "send" && input) {
        const days = effectiveDays(input);
        const year = 2027;
        const from = `${year}-${String(input.month).padStart(2, "0")}-01`;
        const to = new Date(Date.UTC(year, input.month, 0))
          .toISOString()
          .slice(0, 10);
        const ride = {
          own: L(lang, "Own motorbike", "Eigenes Motorrad"),
          passenger: L(lang, "As a passenger", "Als Mitfahrende"),
          unsure: L(lang, "Riding to be confirmed", "Fahrart noch offen"),
        }[input.ride];
        const requestId = hooks.createInquiry({
          riders: input.riders,
          dateFrom: from,
          dateTo: to,
          note: `${L(lang, "All five passes", "Alle fünf Pässe")}, ${days} ${L(lang, "days", "Tage")}, ${
            effectiveStay(input) === "base"
              ? L(lang, "every night in Andermatt", "jede Nacht in Andermatt")
              : L(
                  lang,
                  "nights in Andermatt, Innertkirchen and Airolo",
                  "Nächte in Andermatt, Innertkirchen und Airolo",
                )
          }. ${ride}.${input.tweaks.includes("finsterwald") ? ` ${L(lang, "With a night in Finsterwald.", "Mit einer Nacht in Finsterwald.")}` : ""}`,
        });

        return [
          {
            kind: "reasoning",
            text: L(
              lang,
              "Packaging your answers and the plan into a short request for Erich, with the month, the group and the plan, then sending it.",
              "Ich fasse Ihre Antworten und den Plan in einer kurzen Anfrage an Erich zusammen, mit Monat, Gruppe und Plan, und sende sie.",
            ),
          },
          {
            kind: "tool",
            name: "create_inquiry",
            input: { passes: 5, days, riders: input.riders },
            output: { requestId, status: "sent" },
            ms: 1000,
          },
          {
            kind: "text",
            text: L(
              lang,
              "Done. Erich has your plan and will answer himself by email.",
              "Erledigt. Erich hat Ihren Plan und antwortet selbst per E-Mail.",
            ),
          },
        ];
      }
      if (input) return planTurn(input, lang, REASON_TWEAK(lang)[id] ?? "");

      return [];
    }
    default:
      return [];
  }
}
