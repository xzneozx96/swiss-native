import type { LocalizedText } from "@/features/catalog/types";
import type { Tour, TourStop } from "@/features/tours/types";

import { tourSeed } from "@/features/tours/seed";

export type Lang = "en" | "de";

export const loc = (text: LocalizedText, lang: Lang) =>
  text[lang] ?? text.en ?? "";

export type PassId = "furka" | "grimsel" | "susten" | "gotthard" | "nufenen";

export const PASS_ORDER: PassId[] = [
  "furka",
  "grimsel",
  "susten",
  "gotthard",
  "nufenen",
];

/** What each pass is about: the picker's label and the one-line reason it is suggested. */
export const PASS_INTEREST: Record<
  PassId,
  { label: Record<Lang, string>; why: Record<Lang, string>; theme: string }
> = {
  furka: {
    label: { en: "Cinema and glaciers", de: "Kino und Gletscher" },
    why: {
      en: "you like film locations and big mountain views",
      de: "Sie Filmkulissen und grosse Bergblicke mögen",
    },
    theme: "Furka",
  },
  grimsel: {
    label: { en: "Cheese and trade routes", de: "Käse und Handelswege" },
    why: {
      en: "you enjoy the stories behind old trade routes",
      de: "Sie die Geschichten alter Handelswege mögen",
    },
    theme: "Grimsel",
  },
  susten: {
    label: { en: "Engineering and craft", de: "Baukunst und Handwerk" },
    why: {
      en: "you appreciate how a road is built",
      de: "Sie schätzen, wie eine Strasse gebaut wird",
    },
    theme: "Susten",
  },
  gotthard: {
    label: { en: "History and heritage", de: "Geschichte und Kulturerbe" },
    why: {
      en: "you like roads you can feel history on",
      de: "Sie Strassen mögen, auf denen man Geschichte spürt",
    },
    theme: "Gotthard",
  },
  nufenen: {
    label: { en: "Languages and open space", de: "Sprachen und Weite" },
    why: {
      en: "you want wide skies and a change of language",
      de: "Sie weiten Himmel und einen Sprachwechsel suchen",
    },
    theme: "Nufenen",
  },
};

export const passTour = (id: PassId): Tour => {
  const tour = tourSeed.find((t) => t.slug === `${id}-pass`);

  if (!tour) throw new Error(`No tour for pass ${id}`);

  return tour;
};

/** The places a pass tour visits, without the base and the two practical notes. */
export const passStops = (id: PassId): TourStop[] =>
  passTour(id).itinerary.filter(
    (s) => !["base-andermatt", "licence", "bike"].includes(s.id),
  );

export const BASE_STOP = (id: PassId) =>
  passTour(id).itinerary.find((s) => s.id === "base-andermatt")!;

export const stayTour = (): Tour => {
  const tour = tourSeed.find((t) => t.kind === "stay");

  if (!tour) throw new Error("No stay in the tour seed");

  return tour;
};
