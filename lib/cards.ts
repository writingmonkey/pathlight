// The 25 tarot cards of Pathlight. Each card poses one reflective question.
// `dimensions` tag which facets of the synthesized framework a card illuminates
// (see lib/frameworks.ts) so the AI gets structured hints when reading answers.

export type CardDimension =
  // MBTI axes
  | "EI"
  | "SN"
  | "TF"
  | "JP"
  // Big Five
  | "openness"
  | "conscientiousness"
  | "extraversion"
  | "agreeableness"
  | "neuroticism"
  // Ikigai
  | "ikigai-love"
  | "ikigai-skill"
  | "ikigai-world-need"
  | "ikigai-vocation"
  // Enneagram + general
  | "enneagram-core"
  | "values"
  | "identity"
  | "authenticity"
  | "passion"
  | "shadow"
  | "vulnerability"
  | "growth"
  | "resilience"
  | "purpose"
  | "meaning"
  | "vision"
  | "lifestyle"
  | "aspiration"
  | "impact"
  | "service"
  | "talent"
  | "flow"
  | "strengths"
  | "alignment"
  | "self-awareness"
  | "courage"
  | "action";

export interface TarotCard {
  number: number;
  roman: string;
  /** matches the file at /public/cards/<NN>-<slug>.png */
  slug: string;
  /** display name as printed on the card */
  name: string;
  question: string;
  /** gentle tap-to-fill prompts; the user can insert then edit */
  suggestions: string[];
  dimensions: CardDimension[];
}

/** Number of cards an anonymous user draws before the summary + sign-in gate. */
export const TASTE_CARD_COUNT = 6;

export const CARDS: TarotCard[] = [
  {
    number: 1,
    roman: "I",
    slug: "the-spark",
    name: "The Spark",
    question: "When do you feel most alive?",
    suggestions: ["When I'm making something", "In deep conversation", "Outdoors, moving my body"],
    dimensions: ["passion", "ikigai-love", "EI"],
  },
  {
    number: 2,
    roman: "II",
    slug: "the-root",
    name: "The Root",
    question: "What did you love as a child?",
    suggestions: ["Drawing & making things", "Reading & imagining", "Exploring outdoors"],
    dimensions: ["passion", "ikigai-love", "openness"],
  },
  {
    number: 3,
    roman: "III",
    slug: "the-flame",
    name: "The Flame",
    question: "What are you proud of?",
    suggestions: ["Something I created", "A hard thing I overcame", "Showing up for someone"],
    dimensions: ["ikigai-skill", "identity", "self-awareness"],
  },
  {
    number: 4,
    roman: "IV",
    slug: "the-veil",
    name: "The Veil",
    question: "What do you keep hidden?",
    suggestions: ["A quiet ambition", "A fear of not being enough", "A softer side of me"],
    dimensions: ["shadow", "enneagram-core", "vulnerability"],
  },
  {
    number: 5,
    roman: "V",
    slug: "the-mirror",
    name: "The Mirror",
    question: "When do you feel most truly yourself?",
    suggestions: ["Alone with my thoughts", "With people who get me", "When I'm creating"],
    dimensions: ["identity", "authenticity", "EI"],
  },
  {
    number: 6,
    roman: "VI",
    slug: "the-beacon",
    name: "The Beacon",
    question: "What do people come to you for?",
    suggestions: ["Advice & a calm head", "Ideas & creativity", "A good listener"],
    dimensions: ["ikigai-skill", "strengths", "ikigai-vocation"],
  },
  {
    number: 7,
    roman: "VII",
    slug: "the-gift",
    name: "The Gift",
    question: "What comes easily to you?",
    suggestions: ["Understanding people", "Words & ideas", "Seeing patterns"],
    dimensions: ["ikigai-skill", "talent", "SN"],
  },
  {
    number: 8,
    roman: "VIII",
    slug: "the-delight",
    name: "The Delight",
    question: "What do you love to do well?",
    suggestions: ["Creating something", "Solving problems", "Helping someone grow"],
    dimensions: ["ikigai-love", "ikigai-skill", "flow"],
  },
  {
    number: 9,
    roman: "IX",
    slug: "the-stream",
    name: "The Stream",
    question: "What comes to you like water — swift and natural?",
    suggestions: ["Writing or speaking", "Bringing order to chaos", "Connecting with people"],
    dimensions: ["ikigai-skill", "flow", "talent"],
  },
  {
    number: 10,
    roman: "X",
    slug: "the-longing",
    name: "The Longing",
    question: "What would you love to master?",
    suggestions: ["A craft or art", "A skill I admire", "A whole field of knowledge"],
    dimensions: ["aspiration", "growth", "ikigai-love"],
  },
  {
    number: 11,
    roman: "XI",
    slug: "the-compass",
    name: "The Compass",
    question: "What values guide you?",
    suggestions: ["Honesty & integrity", "Freedom", "Compassion"],
    dimensions: ["values", "TF", "enneagram-core"],
  },
  {
    number: 12,
    roman: "XII",
    slug: "the-measure",
    name: "The Measure",
    question: "What does a good life look like?",
    suggestions: ["Meaningful work", "Close relationships", "Freedom & peace of mind"],
    dimensions: ["values", "vision", "lifestyle"],
  },
  {
    number: 13,
    roman: "XIII",
    slug: "the-thread",
    name: "The Thread",
    question: "What has felt meaningful to you?",
    suggestions: ["Helping someone", "Creating something lasting", "A moment of connection"],
    dimensions: ["meaning", "purpose", "ikigai-world-need"],
  },
  {
    number: 14,
    roman: "XIV",
    slug: "the-imprint",
    name: "The Imprint",
    question: "How do you hope to affect others?",
    suggestions: ["Inspire them", "Comfort them", "Help them grow"],
    dimensions: ["impact", "ikigai-world-need", "agreeableness"],
  },
  {
    number: 15,
    roman: "XV",
    slug: "the-ashes",
    name: "The Ashes",
    question: "What pain reshaped you — and what did it teach you to feel?",
    suggestions: ["A loss I carried", "A failure that humbled me", "An ending that changed me"],
    dimensions: ["growth", "resilience", "enneagram-core"],
  },
  {
    number: 16,
    roman: "XVI",
    slug: "the-horizon",
    name: "The Horizon",
    question: "Describe your ideal future day.",
    suggestions: ["Slow morning, creative work", "Time with people I love", "Outdoors and free"],
    dimensions: ["vision", "lifestyle", "JP"],
  },
  {
    number: 17,
    roman: "XVII",
    slug: "the-whisper",
    name: "The Whispers",
    question: "What dream still calls to you?",
    suggestions: ["To create something of my own", "To travel and explore", "To master a craft"],
    dimensions: ["aspiration", "vision", "openness"],
  },
  {
    number: 18,
    roman: "XVIII",
    slug: "the-gate",
    name: "The Gate",
    question: "What would you begin if nothing stood in your way?",
    suggestions: ["Start my own thing", "Make art full-time", "Change my whole path"],
    dimensions: ["aspiration", "courage", "vision"],
  },
  {
    number: 19,
    roman: "XIX",
    slug: "the-muse",
    name: "The Muse",
    question: "Who inspires you, and why?",
    suggestions: ["A mentor or teacher", "An artist I admire", "Someone who lived bravely"],
    dimensions: ["values", "aspiration", "identity"],
  },
  {
    number: 20,
    roman: "XX",
    slug: "the-divide",
    name: "The Divide",
    question: "What feels aligned? What doesn't?",
    suggestions: ["My work feels off", "My relationships feel right", "I'm out of rhythm"],
    dimensions: ["alignment", "self-awareness", "values"],
  },
  {
    number: 21,
    roman: "XXI",
    slug: "the-ache",
    name: "The Ache",
    question: "What breaks your heart and calls you to act?",
    suggestions: ["Injustice", "People suffering alone", "Wasted potential"],
    dimensions: ["ikigai-world-need", "purpose", "impact"],
  },
  {
    number: 22,
    roman: "XXII",
    slug: "the-bridge",
    name: "The Bridge",
    question: "Where do your gifts meet the world's need?",
    suggestions: ["Teaching what I know", "Building something useful", "Telling stories that matter"],
    dimensions: ["ikigai-vocation", "ikigai-world-need", "ikigai-skill"],
  },
  {
    number: 23,
    roman: "XXIII",
    slug: "the-vessel",
    name: "The Vessel",
    question: "How could your talents serve others?",
    suggestions: ["Mentoring", "Creating for people", "Solving real problems"],
    dimensions: ["ikigai-world-need", "ikigai-skill", "service"],
  },
  {
    number: 24,
    roman: "XXIV",
    slug: "the-role",
    name: "The Role",
    question: "What is your truest role in this world?",
    suggestions: ["The maker", "The guide", "The connector", "The healer"],
    dimensions: ["identity", "purpose", "ikigai-vocation"],
  },
  {
    number: 25,
    roman: "XXV",
    slug: "the-seed",
    name: "The Seed",
    question: "What's one action you can take now?",
    suggestions: ["Start small today", "Reach out to someone", "Make the first thing"],
    dimensions: ["action", "conscientiousness", "JP"],
  },
];

// A strong opening step (rendered face-down, since it has no printed art):
// "why are you here" sets intent and frames everything that follows.
export const OPENING: TarotCard = {
  number: 0,
  roman: "✦",
  slug: "the-threshold",
  name: "The Threshold",
  question: "Why are you here — what made you open Pathlight today?",
  suggestions: ["I'm at a crossroads", "Something feels off", "I want direction"],
  dimensions: ["values", "aspiration", "self-awareness"],
};

// The free reading draws a curated, high-signal set: energy/passion (Spark),
// natural strengths (Gift), values (Compass), what calls them (Ache), and the
// hidden tension (Veil). Strong signal for both insight and career fit.
const TASTE_NUMBERS = [1, 7, 11, 21, 4];
export const TASTE_CARDS: TarotCard[] = TASTE_NUMBERS.map(
  (n) => CARDS.find((c) => c.number === n)!,
).filter(Boolean);
export const FULL_CARDS = CARDS;

export function cardImagePath(card: Pick<TarotCard, "number" | "slug">): string {
  return `/cards/${String(card.number).padStart(2, "0")}-${card.slug}.jpg`;
}

export function getCard(number: number): TarotCard | undefined {
  if (number === 0) return OPENING;
  return CARDS.find((c) => c.number === number);
}
