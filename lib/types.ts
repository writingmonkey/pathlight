// Shared domain types for Pathlight.

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

/** Spec for the bespoke tarot card composed for each reading. */
export interface ResultCardSpec {
  title: string; // the archetype as a card name, e.g. "The Quiet Builder"
  motto: string; // a short evocative line, like the deck's printed questions
  emblem: ResultEmblem;
  accent: ResultAccent;
}

/** The free, instant reflection shown after the taste cards — now genuinely useful. */
export interface Summary {
  headline: string; // a sharp, specific one-liner
  archetype: string; // 2-4 word type name
  typeRead: string; // named read, e.g. "INFP-leaning · Enneagram 4w5 · high Openness"
  insight: string; // 1-2 punchy, specific paragraphs of real value
  strengths: string[]; // 3 concrete strengths
  watchout: string; // one honest growth edge (earns trust)
  direction: string; // a concrete, useful next direction
  themes: string[]; // 3-5 keyword themes
  card: ResultCardSpec; // the designed card
  teaser: string; // one line nudging toward the full guide
}

export interface GuideSection {
  title: string;
  body: string;
  items: string[];
}

/** The gated, longer output — mirrors the "Full Purpose Guide" spec. */
export interface FullGuide {
  headline: string;
  typeSynthesis: string; // MBTI + Enneagram + Big Five, woven into one portrait
  card: ResultCardSpec; // the bespoke card, refined from all 25 answers
  sections: GuideSection[]; // the 5 sections
}

/** Payload assembled client-side and replayed to the server after sign-in. */
export interface ReadingPayload {
  birth: BirthInfo;
  answers: AnswerInput[];
}
