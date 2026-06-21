import "server-only";
import OpenAI from "openai";
import {
  RESULT_ACCENTS,
  RESULT_EMBLEMS,
  type AnswerInput,
  type AstroProfile,
  type BirthInfo,
  type FullGuide,
  type ResultCardSpec,
  type Summary,
} from "@/lib/types";
import {
  FRAMEWORK_OVERVIEW,
  GUIDE_INSTRUCTIONS,
  SUMMARY_INSTRUCTIONS,
  formatAnswersForPrompt,
  formatAstroForPrompt,
  formatBirthForPrompt,
} from "@/lib/frameworks";

const MODEL = process.env.OPENAI_MODEL || "gpt-5.4";
const REASONING_EFFORT = process.env.OPENAI_REASONING_EFFORT || "none";

let client: OpenAI | null = null;
function getClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

type ChatMessage = { role: "system" | "user"; content: string };

/**
 * Calls chat completions asking for JSON, progressively stripping model-specific
 * params if the first attempt is rejected (so it survives model differences).
 */
async function chatJSON(messages: ChatMessage[]): Promise<string> {
  const c = getClient();
  if (!c) throw new Error("no-openai-key");

  const base = { model: MODEL, messages } as Record<string, unknown>;
  const attempts: Record<string, unknown>[] = [
    {
      ...base,
      reasoning_effort: REASONING_EFFORT,
      max_completion_tokens: 4096,
      response_format: { type: "json_object" },
    },
    { ...base, response_format: { type: "json_object" } },
    { ...base },
  ];

  let lastErr: unknown;
  for (const body of attempts) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await c.chat.completions.create(body as any);
      const content = res.choices?.[0]?.message?.content;
      if (content) return content;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error("openai-empty-response");
}

function parseJSON<T>(raw: string): T {
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  }
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first > 0 || last < s.length - 1) s = s.slice(first, last + 1);
  return JSON.parse(s) as T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeCard(c: any, fallbackTitle: string): ResultCardSpec {
  const emblem = RESULT_EMBLEMS.includes(c?.emblem) ? c.emblem : "star";
  const accent = RESULT_ACCENTS.includes(c?.accent) ? c.accent : "gold";
  return {
    title: typeof c?.title === "string" && c.title.trim() ? c.title : fallbackTitle,
    motto: typeof c?.motto === "string" ? c.motto : "",
    emblem,
    accent,
  };
}

interface GenInput {
  birth: BirthInfo;
  answers: AnswerInput[];
  astro: AstroProfile | null;
}

function buildUserBlock(input: GenInput): string {
  return [
    formatBirthForPrompt(input.birth),
    "",
    "Their reflections:",
    formatAnswersForPrompt(input.answers),
    "",
    `PRIVATE astrology guidance (intuition only — do NOT mention to the user): ${formatAstroForPrompt(
      input.astro,
    )}`,
  ].join("\n");
}

export async function generateSummary(input: GenInput): Promise<Summary> {
  try {
    const raw = await chatJSON([
      { role: "system", content: `${FRAMEWORK_OVERVIEW}\n\n${SUMMARY_INSTRUCTIONS}` },
      { role: "user", content: buildUserBlock(input) },
    ]);
    const p = parseJSON<Partial<Summary>>(raw);
    const archetype = p.archetype || "The Seeker";
    return {
      headline: p.headline || "A path is taking shape",
      archetype,
      typeRead: p.typeRead || "",
      insight: p.insight || "",
      strengths: Array.isArray(p.strengths) ? p.strengths.slice(0, 3) : [],
      watchout: p.watchout || "",
      direction: p.direction || "",
      themes: Array.isArray(p.themes) ? p.themes.slice(0, 5) : [],
      card: sanitizeCard(
        p.card,
        archetype.startsWith("The") ? archetype : `The ${archetype}`,
      ),
      teaser:
        p.teaser ||
        "Sign in to unfold your full Purpose Guide — your type, your map, and your next steps.",
    };
  } catch (err) {
    console.error(
      "[pathlight] summary generation failed, using fallback:",
      (err as Error)?.message,
    );
    return mockSummary(input);
  }
}

export async function generateFullGuide(input: GenInput): Promise<FullGuide> {
  try {
    const raw = await chatJSON([
      { role: "system", content: `${FRAMEWORK_OVERVIEW}\n\n${GUIDE_INSTRUCTIONS}` },
      { role: "user", content: buildUserBlock(input) },
    ]);
    const p = parseJSON<Partial<FullGuide>>(raw);
    if (!p.sections || p.sections.length === 0) return mockGuide(input);
    const headline = p.headline || "Your Path";
    return {
      headline,
      typeSynthesis: p.typeSynthesis || "",
      card: sanitizeCard(
        p.card,
        headline.startsWith("The") ? headline : `The ${headline}`,
      ),
      sections: p.sections.map((s) => ({
        title: s.title ?? "",
        body: s.body ?? "",
        items: Array.isArray(s.items) ? s.items : [],
      })),
    };
  } catch (err) {
    console.error(
      "[pathlight] guide generation failed, using fallback:",
      (err as Error)?.message,
    );
    return mockGuide(input);
  }
}

/* ------------------------------------------------------------------ *
 * Mock fallbacks — only used if the API key is missing or a call fails.
 * ------------------------------------------------------------------ */

function pick(input: GenInput, slug: string): string {
  return input.answers.find((a) => a.cardSlug === slug)?.answer?.trim() ?? "";
}

function mockSummary(input: GenInput): Summary {
  const spark = pick(input, "the-spark");
  const name = input.birth.displayName?.split(" ")[0] || "traveler";
  return {
    headline: `${name}, you build meaning before you chase status`,
    archetype: "The Quiet Builder",
    typeRead: "Intuitive, Feeling-led (INFP/INFJ-leaning) · Enneagram 4w5 · high Openness",
    insight: `Across your first cards, the same signal keeps surfacing: you're energized from the inside, drawn to making things that mean something rather than things that merely impress. ${
      spark ? `You named it yourself — “${spark}”.` : ""
    }\n\nThat points to a maker's temperament: imaginative, values-led, and quietly exacting about work that matters to you.`,
    strengths: [
      "Turning inner ideas into real, finished things",
      "Reading people and what they actually need",
      "Staying true to your values under pressure",
    ],
    watchout:
      "You may wait for the 'right' conditions and under-ship — momentum matters more than perfect readiness.",
    direction:
      "Pick one small thing only you would make, and give it two focused hours this week.",
    themes: ["creation", "depth", "meaning", "growth"],
    card: { title: "The Quiet Builder", motto: "What will you make real?", emblem: "lightbulb", accent: "terracotta" },
    teaser:
      "This is only the first light. Sign in to unfold your full Purpose Guide — your type, your map, and your next steps.",
  };
}

function mockGuide(input: GenInput): FullGuide {
  const love = pick(input, "the-delight") || pick(input, "the-spark") || "making things";
  const need = pick(input, "the-ache") || "what moves you";
  const action = pick(input, "the-seed") || "take one small step this week";
  return {
    headline: "The Compassionate Maker",
    typeSynthesis:
      "You read as an Intuitive, Feeling-led maker — INFP/INFJ in flavor — with the depth and idealism of an Enneagram 4 and a strong, principled wing. On the Big Five you sit high in Openness and warmth, with a quiet conscientiousness that switches on when the work genuinely matters to you.",
    card: { title: "The Compassionate Maker", motto: "Where do your gifts meet the world?", emblem: "flame", accent: "terracotta" },
    sections: [
      {
        title: "Your Reflection, in Full Light",
        body: "You build worlds quietly, then invite people in. Across your answers, the same thread keeps surfacing: you want what you make to mean something.",
        items: [
          `In your own words, you love “${love}”.`,
          `What moves you — “${need}” — is also a compass.`,
          "You lead with empathy and notice what others miss.",
        ],
      },
      {
        title: "Journaling Prompts Aligned With You",
        body: "Sit with these over the coming week, one per sitting.",
        items: [
          "When did I last lose track of time, and what was I doing?",
          "Where am I performing a role that isn't truly mine?",
          "What would I make if no one were watching?",
          "Who needs exactly the thing I find easy?",
        ],
      },
      {
        title: "Your Purpose Map",
        body: "Map the overlap of what you love, what you're good at, what the world needs, and what could sustain you.",
        items: [
          `Love: ${love}`,
          "Skill: the things people already come to you for",
          `World's need: ${need}`,
          "Bridge: a small project that joins all three",
        ],
      },
      {
        title: "Creative Practice Toolkit",
        body: "A light rhythm to keep the maker in you fed.",
        items: [
          "A 20-minute daily 'first draft' ritual, no editing",
          "One weekly walk with no phone, to let ideas surface",
          "A mini-project: make one small finished thing this month",
        ],
      },
      {
        title: "A Path Forward",
        body: "Small, purposeful steps — not a leap.",
        items: [
          action,
          "Tell one person about the thing you want to build",
          "Block two hours next week for it",
          "Find one example of someone living a version of it",
        ],
      },
    ],
  };
}
