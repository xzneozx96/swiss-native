import type { UIMessage } from "ai";
import type { Lang, PassId } from "../data/passes";

import {
  loc,
  MONTHS,
  PASS_INTEREST,
  PASS_ORDER,
  passTour,
} from "../data/passes";

import { buildWithDiff, effectiveDays, type PlanInput } from "./plan";

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
    month: number;
    days: number;
    interests: string;
    ride: string;
  }) => string;
}

interface Answer {
  name: string;
  output: Record<string, unknown>;
}

const TWEAKS = ["shorter", "longer", "relaxed", "stay"];

const L = (lang: Lang, en: string, de: string) => (lang === "de" ? de : en);

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
  const interests = latest(a, "ask_interests");

  if (!ride || !party || !when || !interests) return null;

  return {
    ride: ride.id as PlanInput["ride"],
    riders: party.riders as number,
    month: when.month as number,
    days: when.days as number,
    interests: interests.interests as PassId[],
    tweaks: a
      .filter((x) => x.name === "ask_next")
      .map((x) => x.output.id as string)
      .filter((id) => TWEAKS.includes(id)),
  };
}

const interestLabels = (lang: Lang, ids: PassId[]) =>
  ids.map((i) => PASS_INTEREST[i].label[lang].toLowerCase()).join(", ");

const monthName = (lang: Lang, month: number) =>
  month ? MONTHS[lang][month - 6] : L(lang, "any month", "jeden Monat");

function planTurn(input: PlanInput, lang: Lang, lead: string): Turn {
  const plan = buildWithDiff(input, lang);
  const first = input.tweaks.length === 0;
  const used = new Set(input.tweaks);
  const days = effectiveDays(input);
  const scored = PASS_ORDER.map((id) => ({
    id,
    tour: loc(passTour(id).name, lang),
    score: input.interests.includes(id)
      ? 1 - input.interests.indexOf(id) * 0.1
      : 0.2,
  })).sort((a, b) => b.score - a.score);

  const reasoning = [
    lead,
    first &&
      L(
        lang,
        `${input.riders === 1 ? "One rider" : `${input.riders} riders`}, ${monthName(lang, input.month)}, ${input.days} days. They like ${interestLabels(lang, input.interests)}. A tour starts at Andermatt on day one and rides out from there, so every day starts and ends in the same place.`,
        `${input.riders === 1 ? "Eine Fahrerin oder ein Fahrer" : `${input.riders} Fahrende`}, ${monthName(lang, input.month)}, ${input.days} Tage. Sie mögen ${interestLabels(lang, input.interests)}. Eine Tour beginnt am ersten Tag in Andermatt und fährt von dort aus, jeder Tag beginnt und endet am selben Ort.`,
      ),
    plan.skipped.length > 0 &&
      L(
        lang,
        `Left out: ${plan.skipped.map((s) => `${s.name} (${s.reason})`).join("; ")}.`,
        `Weggelassen: ${plan.skipped.map((s) => `${s.name} (${s.reason})`).join("; ")}.`,
      ),
  ]
    .filter(Boolean)
    .join("\n\n");

  const changes =
    plan.added.length || plan.removed.length
      ? [
          plan.added.length &&
            `${L(lang, "Added", "Neu")}: ${plan.added.join(", ")}.`,
          plan.removed.length &&
            `${L(lang, "Removed", "Entfernt")}: ${plan.removed.join(", ")}.`,
        ]
          .filter(Boolean)
          .join(" ")
      : "";

  const options = [
    !used.has("shorter") &&
      !used.has("longer") &&
      days > 5 && {
        id: "shorter",
        label: L(lang, "One day shorter", "Einen Tag kürzer"),
        group: "Adjust",
      },
    !used.has("longer") &&
      !used.has("shorter") &&
      days < 7 && {
        id: "longer",
        label: L(lang, "One day longer", "Einen Tag länger"),
        group: "Adjust",
      },
    !used.has("relaxed") && {
      id: "relaxed",
      label: L(lang, "A slower pace", "Ein ruhigeres Tempo"),
      group: "Adjust",
    },
    !used.has("stay") && {
      id: "stay",
      label: L(
        lang,
        "End with a night in Finsterwald",
        "Mit einer Nacht in Finsterwald enden",
      ),
      group: "Adjust",
    },
    ...plan.passes.slice(0, 2).map((id) => ({
      id: `story:${id}`,
      label: L(
        lang,
        `Read the ${PASS_INTEREST[id].theme} story`,
        `Die Geschichte des ${PASS_INTEREST[id].theme} lesen`,
      ),
      group: "Next",
    })),
    {
      id: "send",
      label: L(lang, "Send this plan to Erich", "Diesen Plan an Erich senden"),
      group: "Next",
    },
    {
      id: "tours",
      label: L(lang, "Browse the tours", "Die Touren ansehen"),
      group: "Next",
    },
  ].filter(Boolean);

  return [
    { kind: "reasoning", text: reasoning },
    {
      kind: "tool",
      name: "match_tours",
      input: { interests: input.interests, days: input.days },
      output: { ranked: scored.slice(0, 3) },
      ms: 800,
    },
    {
      kind: "tool",
      name: "build_itinerary",
      input: { ...input },
      output: plan,
      ms: 1300,
    },
    {
      kind: "text",
      text:
        (first
          ? L(
              lang,
              `Here is a ${days}-day plan over ${plan.passes.length} passes, from CHF ${plan.price}.`,
              `Hier ist ein Plan über ${plan.passes.length} Pässe in ${days} Tagen, ab CHF ${plan.price}.`,
            )
          : `${L(lang, "Updated.", "Angepasst.")} ${changes || L(lang, "The plan is unchanged: nothing else fits.", "Der Plan bleibt gleich: mehr passt nicht.")}`) +
        L(lang, " Want to adjust anything?", " Möchten Sie etwas ändern?"),
    },
    {
      kind: "ask",
      name: "ask_next",
      input: {
        prompt: L(
          lang,
          "Adjust the plan, or pick a next step.",
          "Plan anpassen oder nächsten Schritt wählen.",
        ),
        options,
      },
    },
  ];
}

const REASON_TWEAK = (lang: Lang): Record<string, string> => ({
  shorter: L(
    lang,
    "Taking one day off. The ride-out days shrink, so the last picks may drop out.",
    "Ein Tag weniger. Die Ausfahrtstage werden weniger, die letzten Wünsche fallen eventuell weg.",
  ),
  longer: L(
    lang,
    "Adding a day. More room means I can add a pass you did not pick but that fits your taste.",
    "Ein Tag mehr. Mehr Platz heisst, ich kann einen Pass ergänzen, den Sie nicht gewählt haben, der aber zu Ihnen passt.",
  ),
  relaxed: L(
    lang,
    "A slower pace: I'll turn one ride-out day into a free day with no pass.",
    "Ein ruhigeres Tempo: Ich mache aus einem Ausfahrtstag einen freien Tag ohne Pass.",
  ),
  stay: L(
    lang,
    "Ending in Finsterwald. The night at Erich's bee house is a separate booking, and the rooms are still to be confirmed with him.",
    "Das Ende in Finsterwald. Die Nacht in Erichs Bienenhaus wird separat gebucht, die Zimmer werden noch mit ihm bestätigt.",
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
          "To suggest the right tour I need to know how you travel and what you enjoy. First, let me look at the tours we have.",
          "Um die richtige Tour vorzuschlagen, muss ich wissen, wie Sie reisen und was Ihnen gefällt. Zuerst schaue ich, welche Touren wir haben.",
        ),
      },
      {
        kind: "tool",
        name: "list_tours",
        input: { kind: "motorbike pass tour" },
        output: {
          count: tours.length,
          tours: tours.map((t) => ({
            name: loc(t.name, lang),
            days: "5 to 7",
            from: "CHF 780",
          })),
        },
        ms: 700,
      },
      {
        kind: "text",
        text: L(
          lang,
          "Hi! I'm Erich's trip assistant. I plan a ride over the Swiss passes from the tours he runs. A few quick questions first. How will you ride?",
          "Grüezi! Ich bin Erichs Reiseassistent. Ich plane eine Fahrt über die Schweizer Pässe aus den Touren, die er anbietet. Zuerst ein paar kurze Fragen. Wie fahren Sie?",
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
            "Good. Riding or passenger arrangements, equipment and the bike are always confirmed with Erich before you book. How many riders are in the group?",
            "Gut. Ob Selbstfahren oder Mitfahren, Ausrüstung und Motorrad: Das klärt Erich immer vor der Buchung mit Ihnen. Wie viele Fahrende sind in der Gruppe?",
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
            "When would you like to ride, and for how long?",
            "Wann möchten Sie fahren, und wie lange?",
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
            `${monthName(lang, month)}. Pass roads are closed by snow in winter, so before I plan anything I should check how the season looks for the five passes.`,
            `${monthName(lang, month)}. Passstrassen sind im Winter wegen Schnee gesperrt, also prüfe ich, wie die Saison für die fünf Pässe aussieht, bevor ich etwas plane.`,
          ),
        },
        {
          kind: "tool",
          name: "check_pass_season",
          input: { month: month || "flexible", passes: PASS_ORDER },
          output: {
            month: month ? monthName("en", month) : "flexible",
            passes: PASS_ORDER.map((id) => ({
              pass: PASS_INTEREST[id].theme,
              status: early ? "may still have snow" : "usually open",
            })),
            note: "Passes usually open from about June to October",
          },
          ms: 1000,
        },
        {
          kind: "text",
          text: early
            ? L(
                lang,
                "Early June can still have snow on the high passes, so a day may change. Erich checks the road status before each ride-out. What draws you most? Pick as many as you like.",
                "Anfang Juni kann auf den hohen Pässen noch Schnee liegen, ein Tag kann sich ändern. Erich prüft vor jeder Ausfahrt den Strassenzustand. Was reizt Sie am meisten? Wählen Sie, so viele Sie möchten.",
              )
            : L(
                lang,
                "The passes are usually open then, and Erich checks the road status before each ride-out. What draws you most? Pick as many as you like.",
                "Dann sind die Pässe meist offen, und Erich prüft vor jeder Ausfahrt den Strassenzustand. Was reizt Sie am meisten? Wählen Sie, so viele Sie möchten.",
              ),
        },
        { kind: "ask", name: "ask_interests", input: {} },
      ];
    }
    case "ask_interests": {
      const input = inputFrom(a);

      return input
        ? planTurn(
            input,
            lang,
            L(
              lang,
              "I'll match your interests to the passes, then build the days.",
              "Ich ordne Ihre Interessen den Pässen zu und baue dann die Tage.",
            ),
          )
        : [];
    }
    case "ask_next": {
      const id = last.output.id as string;
      const input = inputFrom(a);

      if (id === "send" && input) {
        const requestId = hooks.createInquiry({
          riders: input.riders,
          month: input.month,
          days: effectiveDays(input),
          interests: interestLabels(lang, input.interests),
          ride: {
            own: L(lang, "Own motorbike", "Eigenes Motorrad"),
            passenger: L(lang, "As a passenger", "Als Mitfahrende"),
            unsure: L(lang, "Riding to be confirmed", "Fahrart noch offen"),
          }[input.ride],
        });

        return [
          {
            kind: "reasoning",
            text: L(
              lang,
              "Packaging your answers and the plan into a short brief that is easy to read at a glance, then sending it to Erich.",
              "Ich fasse Ihre Antworten und den Plan in einem kurzen Brief zusammen, der sich auf einen Blick lesen lässt, und sende ihn an Erich.",
            ),
          },
          {
            kind: "tool",
            name: "create_inquiry",
            input: { passes: input.interests, days: effectiveDays(input) },
            output: { requestId, status: "sent" },
            ms: 1000,
          },
          {
            kind: "text",
            text: L(
              lang,
              "Done. Erich has your plan with everything you chose and will answer himself by email.",
              "Erledigt. Erich hat Ihren Plan mit allem, was Sie gewählt haben, und antwortet selbst per E-Mail.",
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
