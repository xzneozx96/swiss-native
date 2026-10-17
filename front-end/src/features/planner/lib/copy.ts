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
    pickWhen: string;
    adjust: string;
    nextStep: string;
    continue: string;
    riders: string;
    rider: (n: number) => string;
    flexible: string;
    days: (n: number) => string;
    daysHint: string;
    monthHint: string;
    sent: string;
    day: string;
    summary: (days: number, passes: number, price: number) => string;
    lunch: string;
    isNew: string;
    removed: string;
    goodToKnow: string;
    leftOut: string;
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
      check_pass_season: "Check the pass season",
      match_tours: "Match tours to your interests",
      build_itinerary: "Build the itinerary",
      create_inquiry: "Send the plan to Erich",
    },
    chooseOne: "Choose one",
    chooseAny: "Choose any",
    setNumbers: "Set the numbers",
    pickWhen: "Pick a month and a length",
    adjust: "Adjust the plan",
    nextStep: "Next step",
    continue: "Continue",
    riders: "Riders",
    rider: (n) => `${n} rider${n === 1 ? "" : "s"}`,
    flexible: "I'm flexible",
    days: (n) => `${n} days`,
    daysHint: "Tour length",
    monthHint: "Summer 2027",
    sent: "Your plan is with Erich.",
    day: "Day",
    summary: (days, passes, price) =>
      `${days} days · ${passes} pass${passes === 1 ? "" : "es"} · from CHF ${price}`,
    lunch: "Lunch",
    isNew: "New",
    removed: "Removed:",
    goodToKnow: "Good to know",
    leftOut: "Left out",
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
      check_pass_season: "Passsaison prüfen",
      match_tours: "Touren zu Ihren Interessen finden",
      build_itinerary: "Reiseplan erstellen",
      create_inquiry: "Plan an Erich senden",
    },
    chooseOne: "Eine auswählen",
    chooseAny: "Beliebig viele wählen",
    setNumbers: "Anzahl festlegen",
    pickWhen: "Monat und Dauer wählen",
    adjust: "Plan anpassen",
    nextStep: "Nächster Schritt",
    continue: "Weiter",
    riders: "Fahrende",
    rider: (n) => `${n} ${n === 1 ? "Fahrender" : "Fahrende"}`,
    flexible: "Ich bin flexibel",
    days: (n) => `${n} Tage`,
    daysHint: "Tourlänge",
    monthHint: "Sommer 2027",
    sent: "Ihr Plan ist bei Erich.",
    day: "Tag",
    summary: (days, passes, price) =>
      `${days} Tage · ${passes} ${passes === 1 ? "Pass" : "Pässe"} · ab CHF ${price}`,
    lunch: "Mittagessen",
    isNew: "Neu",
    removed: "Entfernt:",
    goodToKnow: "Gut zu wissen",
    leftOut: "Weggelassen",
  },
};
