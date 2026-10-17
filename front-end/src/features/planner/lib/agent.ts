import type { UIMessage } from "ai";
import type { Lang, PassId } from "../data/passes";

import { loc, PASS_INTEREST, passTour } from "../data/passes";

import {
  buildWithDiff,
  passDays,
  shortDate,
  zurichDay,
  type PlanInput,
} from "./plan";

import { tourSeed } from "@/features/tours/seed";

export type Step =
  | { kind: "reasoning"; text: string }
  | { kind: "tool"; name: string; input: unknown; output: unknown; ms?: number }
  | { kind: "ask"; name: string; input: unknown }
  | { kind: "text"; text: string };

export type Turn = Step[];

export interface OpenDeparture {
  id: string;
  startsAt: string;
  seats: number;
}

export interface AgentHooks {
  language: () => Lang;
  /** Upcoming departures of a tour that are open, with the seats still free. */
  departures: (tourId: string) => OpenDeparture[];
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

/** The tour the conversation is about now: the last one whose dates were picked or asked for. */
function currentPass(a: Answer[]): PassId {
  const switched = [...a]
    .reverse()
    .find(
      (x) =>
        x.name === "ask_departure" ||
        (x.name === "ask_next" && String(x.output.id).startsWith("switch:")),
    );

  if (switched?.name === "ask_departure") return switched.output.pass as PassId;
  if (switched) return String(switched.output.id).slice(7) as PassId;

  return (latest(a, "ask_interests")?.interests as PassId[])[0];
}

export function inputFrom(a: Answer[]): PlanInput | null {
  const ride = latest(a, "ask_ride");
  const party = latest(a, "ask_party");
  const interests = latest(a, "ask_interests");
  const at = a.map((x) => x.name).lastIndexOf("ask_departure");

  if (!ride || !party || !interests || at < 0) return null;
  const departure = a[at].output;

  return {
    ride: ride.id as PlanInput["ride"],
    riders: party.riders as number,
    pass: departure.pass as PassId,
    picks: interests.interests as PassId[],
    departureId: departure.departureId as string,
    startsAt: departure.startsAt as string,
    tweaks: a
      .slice(at + 1)
      .filter((x) => x.name === "ask_next" && x.output.id === "stay")
      .map(() => "stay"),
  };
}

const passName = (lang: Lang, id: PassId) => loc(passTour(id).name, lang);
const chfFor = (id: PassId) => Math.round(passTour(id).adultPrice / 100);

const MONTHS_IN_SEASON = [6, 7, 8, 9, 10];

function departuresTurn(
  pass: PassId,
  riders: number,
  picks: PassId[],
  hooks: AgentHooks,
  lead: string,
): Turn {
  const lang = hooks.language();
  const tour = passTour(pass);
  const all = hooks.departures(tour.id);
  const open = all.filter((d) => d.seats >= riders).slice(0, 6);
  const others = picks.filter((p) => p !== pass);
  const days = passDays(pass);

  const turn: Turn = [
    {
      kind: "reasoning",
      text: [
        lead,
        L(
          lang,
          `${passName(lang, pass)} runs ${days} days from Andermatt, from CHF ${chfFor(pass)} per rider. Let me see which dates are open for ${riders === 1 ? "one rider" : `${riders} riders`}.`,
          `${passName(lang, pass)} dauert ${days} Tage ab Andermatt, ab CHF ${chfFor(pass)} pro Person. Ich schaue, welche Termine für ${riders === 1 ? "eine Person" : `${riders} Personen`} frei sind.`,
        ),
      ].join("\n\n"),
    },
    {
      kind: "tool",
      name: "find_departures",
      input: { tour: tour.slug, riders },
      output: {
        tour: passName("en", pass),
        open: open.map((d) => ({
          date: shortDate("en", Date.parse(d.startsAt)),
          seatsLeft: d.seats,
        })),
        withoutEnoughSeats: all.length - open.length,
      },
      ms: 900,
    },
  ];

  if (!open.length) {
    return [
      ...turn,
      {
        kind: "text",
        text:
          all.length > 0
            ? L(
                lang,
                `No scheduled departure of ${passName(lang, pass)} has seats for ${riders} riders. Erich can arrange private dates for your group.`,
                `Keine geplante Abfahrt von ${passName(lang, pass)} hat Plätze für ${riders} Personen. Erich kann private Termine für Ihre Gruppe vereinbaren.`,
              )
            : L(
                lang,
                `${passName(lang, pass)} has no scheduled departure open right now. Erich can arrange private dates on request.`,
                `${passName(lang, pass)} hat zurzeit keine offene Abfahrt. Erich kann auf Anfrage private Termine vereinbaren.`,
              ),
      },
      {
        kind: "ask",
        name: "ask_next",
        input: {
          options: [
            {
              id: "private",
              label: L(
                lang,
                "Ask Erich for private dates",
                "Erich nach privaten Terminen fragen",
              ),
              group: "Next",
            },
            ...others.slice(0, 2).map((p) => ({
              id: `switch:${p}`,
              label: L(
                lang,
                `Try ${passName(lang, p)} instead`,
                `Stattdessen ${passName(lang, p)} versuchen`,
              ),
              group: "Next",
            })),
            {
              id: "tours",
              label: L(lang, "Browse the tours", "Die Touren ansehen"),
              group: "Next",
            },
          ],
        },
      },
    ];
  }

  return [
    ...turn,
    {
      kind: "text",
      text: L(
        lang,
        `These dates are open. Which one suits you?`,
        `Diese Termine sind frei. Welcher passt Ihnen?`,
      ),
    },
    {
      kind: "ask",
      name: "ask_departure",
      input: {
        pass,
        options: open.map((d) => ({
          id: d.id,
          startsAt: d.startsAt,
          label: shortDate(lang, Date.parse(d.startsAt)),
          hint: L(
            lang,
            `${d.seats} seat${d.seats === 1 ? "" : "s"} left`,
            `${d.seats} ${d.seats === 1 ? "Platz" : "Plätze"} frei`,
          ),
        })),
      },
    },
  ];
}

function planTurn(input: PlanInput, lang: Lang, lead: string): Turn {
  const plan = buildWithDiff(input, lang);
  const first = input.tweaks.length === 0;
  const others = input.picks.filter((p) => p !== input.pass);
  const used = new Set(input.tweaks);

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
    !used.has("stay") && {
      id: "stay",
      label: L(
        lang,
        "Add a night in Finsterwald",
        "Eine Nacht in Finsterwald dazunehmen",
      ),
      group: "Adjust",
    },
    {
      id: "date",
      label: L(lang, "Pick another date", "Anderen Termin wählen"),
      group: "Adjust",
    },
    ...others.slice(0, 2).map((p) => ({
      id: `switch:${p}`,
      label: L(
        lang,
        `Plan ${passName(lang, p)} instead`,
        `Stattdessen ${passName(lang, p)} planen`,
      ),
      group: "Adjust",
    })),
    {
      id: `open:${plan.slug}`,
      label: L(lang, "Open this tour to book", "Diese Tour zum Buchen öffnen"),
      group: "Next",
    },
    {
      id: `story:${input.pass}`,
      label: L(
        lang,
        `Read the ${PASS_INTEREST[input.pass].theme} story`,
        `Die Geschichte des ${PASS_INTEREST[input.pass].theme} lesen`,
      ),
      group: "Next",
    },
    {
      id: "send",
      label: L(lang, "Send this plan to Erich", "Diesen Plan an Erich senden"),
      group: "Next",
    },
  ].filter(Boolean);

  const month = Number(zurichDay(Date.parse(input.startsAt)).slice(5, 7));
  const inSeason = MONTHS_IN_SEASON.includes(month);

  return [
    {
      kind: "reasoning",
      text: lead,
    },
    {
      kind: "tool",
      name: "check_conditions",
      input: {
        tour: plan.slug,
        date: zurichDay(Date.parse(input.startsAt)),
      },
      output: {
        usualSeason: "about June to October (from the tour's conditions)",
        departureMonth: month,
        inUsualSeason: inSeason,
        note: "Snow or weather can change or cancel a day",
      },
      ms: 800,
    },
    {
      kind: "tool",
      name: "build_itinerary",
      input: { tour: plan.slug, departure: input.departureId },
      output: plan,
      ms: 1200,
    },
    {
      kind: "text",
      text:
        (first
          ? L(
              lang,
              `Here is ${plan.title}, ${plan.days} days from ${plan.dateRange}. The stops and times are the tour's own.`,
              `Hier ist ${plan.title}, ${plan.days} Tage vom ${plan.dateRange}. Stationen und Zeiten sind die der Tour.`,
            )
          : `${L(lang, "Updated.", "Angepasst.")} ${changes}`) +
        (inSeason
          ? ""
          : L(
              lang,
              ` That date is outside the usual pass season, so snow may change the ride-out day.`,
              ` Dieser Termin liegt ausserhalb der üblichen Passsaison, Schnee kann den Ausfahrtstag ändern.`,
            )) +
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
  stay: L(
    lang,
    "The night at Erich's bee house in Finsterwald is a separate booking, and the rooms are still to be confirmed with him, so I add it as an optional step after the tour.",
    "Die Nacht in Erichs Bienenhaus in Finsterwald wird separat gebucht, die Zimmer werden noch mit ihm bestätigt. Ich füge sie deshalb als optionalen Schritt nach der Tour an.",
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
            name: loc(t.name, "en"),
            days: passDays(t.slug.replace("-pass", "") as PassId),
            fromCHF: Math.round(t.adultPrice / 100),
          })),
        },
        ms: 700,
      },
      {
        kind: "text",
        text: L(
          lang,
          "Hi! I'm Erich's trip assistant. I match you to one of the pass tours he runs and plan it on dates that are really open. A few quick questions first. How will you ride?",
          "Grüezi! Ich bin Erichs Reiseassistent. Ich finde die passende Passtour aus seinem Angebot und plane sie auf Termine, die wirklich frei sind. Zuerst ein paar kurze Fragen. Wie fahren Sie?",
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
            "Each tour rides one pass on its ride-out day. Which passes draw you? Pick as many as you like, in the order you like them.",
            "Jede Tour fährt am Ausfahrtstag einen Pass. Welche Pässe reizen Sie? Wählen Sie, so viele Sie möchten, in der Reihenfolge Ihrer Vorliebe.",
          ),
        },
        { kind: "ask", name: "ask_interests", input: {} },
      ];
    case "ask_interests": {
      const picks = last.output.interests as PassId[];
      const riders = latest(a, "ask_party")?.riders as number;

      return departuresTurn(
        picks[0],
        riders,
        picks,
        hooks,
        picks.length > 1
          ? L(
              lang,
              `You picked ${picks.length} passes. A tour covers one pass on its ride-out day, so I start with the first one you picked and keep the others as ideas for the free days.`,
              `Sie haben ${picks.length} Pässe gewählt. Eine Tour fährt am Ausfahrtstag einen Pass, ich beginne also mit Ihrer ersten Wahl und behalte die anderen als Ideen für die freien Tage.`,
            )
          : L(
              lang,
              "One pass picked, so the match is direct.",
              "Ein Pass gewählt, die Zuordnung ist also eindeutig.",
            ),
      );
    }
    case "ask_departure": {
      const input = inputFrom(a);

      return input
        ? planTurn(
            input,
            lang,
            L(
              lang,
              "Before I lay out the days I'll check the date against the tour's conditions, then put the tour's own stops and times on your dates.",
              "Bevor ich die Tage aufbaue, prüfe ich den Termin gegen die Bedingungen der Tour und lege dann die Stationen und Zeiten der Tour auf Ihre Daten.",
            ),
          )
        : [];
    }
    case "ask_next": {
      const id = last.output.id as string;
      const input = inputFrom(a);
      const picks = latest(a, "ask_interests")?.interests as PassId[];
      const riders = latest(a, "ask_party")?.riders as number;

      if (id === "send" && input) {
        const dayOne = Date.parse(input.startsAt);
        const days = passDays(input.pass);
        const ride = {
          own: L(lang, "Own motorbike", "Eigenes Motorrad"),
          passenger: L(lang, "As a passenger", "Als Mitfahrende"),
          unsure: L(lang, "Riding to be confirmed", "Fahrart noch offen"),
        }[input.ride];
        const requestId = hooks.createInquiry({
          riders: input.riders,
          dateFrom: zurichDay(dayOne),
          dateTo: zurichDay(dayOne + (days - 1) * 86_400_000),
          note: `${passName(lang, input.pass)}. ${ride}.${input.tweaks.includes("stay") ? ` ${L(lang, "With a night in Finsterwald.", "Mit einer Nacht in Finsterwald.")}` : ""}`,
        });

        return [
          {
            kind: "reasoning",
            text: L(
              lang,
              "Packaging your answers and the plan into a short request for Erich, with the tour, the dates and the group, then sending it.",
              "Ich fasse Ihre Antworten und den Plan in einer kurzen Anfrage an Erich zusammen, mit Tour, Terminen und Gruppe, und sende sie.",
            ),
          },
          {
            kind: "tool",
            name: "create_inquiry",
            input: { tour: input.pass, riders: input.riders },
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
      if (id === "date")
        return departuresTurn(
          currentPass(a),
          riders,
          picks,
          hooks,
          L(
            lang,
            "Looking at the other open dates of the same tour.",
            "Ich schaue auf die anderen freien Termine derselben Tour.",
          ),
        );
      if (id.startsWith("switch:"))
        return departuresTurn(
          id.slice(7) as PassId,
          riders,
          picks,
          hooks,
          L(
            lang,
            `Switching to ${passName(lang, id.slice(7) as PassId)}. Its dates are its own, so I look them up again.`,
            `Wechsel zu ${passName(lang, id.slice(7) as PassId)}. Die Termine sind eigene, ich suche sie neu heraus.`,
          ),
        );
      if (input) return planTurn(input, lang, REASON_TWEAK(lang)[id] ?? "");

      return [];
    }
    default:
      return [];
  }
}
