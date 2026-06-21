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

export interface AstroProfile {
  sunSign: string;
  moonSign?: string | null;
  risingSign?: string | null;
  /** short human-readable flavor line, e.g. extra planet placements */
  chartNote?: string | null;
  hasFullChart: boolean;
}

/** The free, instant reflection shown after the taste cards. */
export interface Summary {
  headline: string; // evocative one-liner
  archetype: string; // short type name, e.g. "The Quiet Maker"
  reflection: string; // 2-3 short paragraphs, may contain blank lines
  themes: string[]; // 3-5 keyword themes
  teaser: string; // one line nudging toward the full guide
}

export interface GuideSection {
  title: string;
  body: string; // a short paragraph of intro
  items: string[]; // concrete prompts / steps / exercises
}

/** The gated, longer output — mirrors the "Full Purpose Guide" spec. */
export interface FullGuide {
  headline: string; // e.g. "The Compassionate Maker"
  typeSynthesis: string; // MBTI + Enneagram + Big Five synthesis, plain language
  astrologyNote?: string | null; // how the chart colors the reading
  sections: GuideSection[]; // the 5 sections
}

/** Payload assembled client-side and replayed to the server after sign-in. */
export interface ReadingPayload {
  birth: BirthInfo;
  answers: AnswerInput[];
}
