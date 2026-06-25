// Shared domain types for Pathlight.

import type { Profile } from "@/lib/scoring";
export type { Profile };

export interface BirthInfo {
  displayName: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string | null; // HH:MM (24h)
  birthPlace?: string | null;
}

export interface AnswerInput {
  cardNumber: number;
  cardSlug: string;
  cardName: string;
  question: string;
  answer: string;
}

/** Astrology is used ONLY as private guidance for the model — never surfaced. */
export interface AstroProfile {
  sunSign: string;
  moonSign?: string | null;
  risingSign?: string | null;
  chartNote?: string | null;
  hasFullChart: boolean;
}

/** Emblems the designed result card can use (mapped to icons in result-card.tsx). */
export const RESULT_EMBLEMS = [
  "flame",
  "compass",
  "star",
  "key",
  "anchor",
  "feather",
  "eye",
  "tree",
  "sun",
  "moon",
  "waves",
  "mountain",
  "seed",
  "book",
  "crown",
  "lightbulb",
] as const;
export type ResultEmblem = (typeof RESULT_EMBLEMS)[number];

export const RESULT_ACCENTS = ["gold", "terracotta", "sage", "teal"] as const;
export type ResultAccent = (typeof RESULT_ACCENTS)[number];

/** Spec for the designed (instant, SVG) result card shown on the free reading. */
export interface ResultCardSpec {
  title: string; // the archetype as a card name, e.g. "The Quiet Builder"
  motto: string; // a short evocative line, like the deck's printed questions
  emblem: ResultEmblem;
  accent: ResultAccent;
  /** short visual description used to paint the deck-matched card after sign-in */
  scene?: string;
}

/** A concrete career / path suggestion (grounded privately in interest-fit logic). */
export interface CareerMatch {
  title: string; // e.g. "Product designer", "Documentary storyteller"
  why: string; // one specific line tying it to them
}

/** The free, instant reading shown after the taste cards. */
export interface Summary {
  headline: string; // a sharp, specific one-liner
  archetype: string; // 2-4 word type name
  rarity: string; // a short distinctiveness line, e.g. "~1 in 16 lead with this pairing"
  insight: string; // 1-2 contrastive, non-obvious paragraphs (their words; a named tension)
  forecast: string; // the time-aware "season ahead" — a specific, timely prediction
  strengths: string[]; // 3 concrete strengths
  watchout: string; // one honest blind spot / tension
  careers: CareerMatch[]; // 3-4 tailored career/path matches
  direction: string; // a concrete next move
  guidePreview: string[]; // 3-4 personalized teasers of what the full guide reveals
  themes: string[]; // 3-5 keyword themes
  profile: Profile; // the measured 0-100 dimension scores (drives rarity/careers)
  card: ResultCardSpec; // the designed card
  teaser: string; // one line nudging toward the full guide
}

export interface GuideSection {
  title: string;
  body: string;
  items: string[];
}

/** The gated, longer output — the "Full Purpose Guide". */
export interface FullGuide {
  headline: string;
  rarity: string; // distinctiveness line
  portrait: string; // a plain-language portrait — NO framework jargon
  forecast: string; // an extended time-aware "season ahead" forecast
  profile: Profile; // the measured 0-100 dimension scores
  card: ResultCardSpec; // designed spec (also drives the painted card prompt)
  careers: CareerMatch[]; // a fuller set of matches
  sections: GuideSection[]; // the 5 sections
}

/** Payload assembled client-side and replayed to the server after sign-in. */
export interface ReadingPayload {
  birth: BirthInfo;
  answers: AnswerInput[];
}
