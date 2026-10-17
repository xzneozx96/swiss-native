import type { Lang } from "../data/passes";

/** The assistant's interface words; its replies are written in lib/agent.ts. */
export const ui: Record<
  Lang,
  {
    title: string;
    ai: string;
    back: string;
    start: string;
    startLabel: string;
    startText: string;
    typing: string;
    tapHint: string;
    startOver: string;
    thinking: string;
    thought: string;
    thoughtFor: (s: number) => string;
    toolCalls: (n: number) => string;
    tools: Record<string, string>;
    chooseOne: string;
    chooseAny: string;
    setNumbers: string;
    adjust: string;
    nextStep: string;
    continue: string;
    riders: string;
    rider: (n: number) => string;
    sent: string;
    day: string;
    summary: (days: number, range: string, price: number) => string;
    isNew: string;
    included: string;
    perRider: string;
    forGroup: (riders: number, total: number) => string;
    removed: string;
    goodToKnow: string;
  }
> = {
  en: {
    title: "Trip assistant",
    ai: "AI",
    back: "Back",
    start: "Start here",
    startLabel: "Start here",
    startText: "Plan my ride over the passes",
    typing: "The assistant is typing",
    tapHint: "Tap an option to reply.",
    startOver: "Start over",
    thinking: "Thinking…",
    thought: "Thought",
    thoughtFor: (s) => `Thought for ${s}s`,
    toolCalls: (n) => `${n} tool call${n === 1 ? "" : "s"}`,
    tools: {
      list_tours: "Look up the pass tours",
      find_departures: "Find open dates",
      check_conditions: "Check the tour's conditions",
      build_itinerary: "Build the itinerary",
      create_inquiry: "Send the plan to Erich",
    },
    chooseOne: "Choose one",
    chooseAny: "Choose any",
    setNumbers: "Set the numbers",
    adjust: "Adjust the plan",
    nextStep: "Next step",
    continue: "Continue",
    riders: "Riders",
    rider: (n) => `${n} rider${n === 1 ? "" : "s"}`,
    sent: "Your plan is with Erich.",
    day: "Day",
    summary: (days, range, price) =>
      `${days} days · ${range} · CHF ${price} per rider`,
    included: "Included",
    perRider: "per rider",
    forGroup: (riders, total) =>
      `CHF ${total.toLocaleString("de-CH")} for ${riders} rider${riders === 1 ? "" : "s"}`,
    isNew: "New",
    removed: "Removed:",
    goodToKnow: "Good to know",
  },
  de: {
    title: "Reiseassistent",
    ai: "KI",
    back: "Zurück",
    start: "Hier beginnen",
    startLabel: "Hier beginnen",
    startText: "Meine Fahrt über die Pässe planen",
    typing: "Der Assistent schreibt",
    tapHint: "Tippen Sie eine Option an, um zu antworten.",
    startOver: "Neu beginnen",
    thinking: "Denkt nach…",
    thought: "Überlegt",
    thoughtFor: (s) => `${s} s überlegt`,
    toolCalls: (n) => `${n} Werkzeugaufruf${n === 1 ? "" : "e"}`,
    tools: {
      list_tours: "Passtouren nachschlagen",
      find_departures: "Freie Termine suchen",
      check_conditions: "Bedingungen der Tour prüfen",
      build_itinerary: "Reiseplan erstellen",
      create_inquiry: "Plan an Erich senden",
    },
    chooseOne: "Eine auswählen",
    chooseAny: "Beliebig viele wählen",
    setNumbers: "Anzahl festlegen",
    adjust: "Plan anpassen",
    nextStep: "Nächster Schritt",
    continue: "Weiter",
    riders: "Fahrende",
    rider: (n) => `${n} ${n === 1 ? "Fahrender" : "Fahrende"}`,
    sent: "Ihr Plan ist bei Erich.",
    day: "Tag",
    summary: (days, range, price) =>
      `${days} Tage · ${range} · CHF ${price} pro Person`,
    included: "Inbegriffen",
    perRider: "pro Person",
    forGroup: (riders, total) =>
      `CHF ${total.toLocaleString("de-CH")} für ${riders} ${riders === 1 ? "Person" : "Personen"}`,
    isNew: "Neu",
    removed: "Entfernt:",
    goodToKnow: "Gut zu wissen",
  },
};
