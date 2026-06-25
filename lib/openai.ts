import "server-only";
import OpenAI from "openai";
import {
  RESULT_ACCENTS,
  RESULT_EMBLEMS,
  type AnswerInput,
  type AstroProfile,
  type BirthInfo,
  type CareerMatch,
  type FullGuide,
  type ResultCardSpec,
  type Summary,
} from "@/lib/types";
import {
  FRAMEWORK_OVERVIEW,
  GUIDE_INSTRUCTIONS,
  SUMMARY_INSTRUCTIONS,
  SCORING_SYSTEM,
  SCORING_INSTRUCTIONS,
  formatAnswersForPrompt,
  formatAstroForPrompt,
  formatBirthForPrompt,
} from "@/lib/frameworks";
import {
  careerTitles,
  computeRarity,
  profileForPrompt,
  sanitizeProfile,
  type Profile,
  type Rarity,
} from "@/lib/scoring";

const MODEL = process.env.OPENAI_MODEL || "gpt-5.4";
const REASONING_EFFORT = process.env.OPENAI_REASONING_EFFORT || "none";
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";

let client: OpenAI | null = null;
function getClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

type ChatMessage = { role: "system" | "user"; content: string };

async function chatJSON(messages: ChatMessage[]): Promise<string> {
  const c = getClient();
  if (!c) throw new Error("no-openai-key");

  const base = { model: MODEL, messages } as Record<string, unknown>;
  const attempts: Record<string, unknown>[] = [
    {
      ...base,
      reasoning_effort: REASONING_EFFORT,
      max_completion_tokens: 5000,
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
    scene: typeof c?.scene === "string" ? c.scene : undefined,
  };
}

/** Career titles come from the RIASEC map; the model only supplies each "why". */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mergeCareers(titles: string[], modelCareers: any): CareerMatch[] {
  const whyByTitle = new Map<string, string>(
    (Array.isArray(modelCareers) ? modelCareers : [])
      .filter((c) => c && typeof c.title === "string")
      .map((c) => [String(c.title).toLowerCase().trim(), typeof c.why === "string" ? c.why : ""]),
  );
  return titles.map((t) => ({ title: t, why: whyByTitle.get(t.toLowerCase().trim()) || "" }));
}

interface GenInput {
  birth: BirthInfo;
  answers: AnswerInput[];
  astro: AstroProfile | null;
}

function buildAnswersBlock(input: GenInput): string {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return [
    formatBirthForPrompt(input.birth),
    `Today is ${today}. Anchor the forecast to the weeks ahead of this date.`,
    "",
    "Their reflections:",
    formatAnswersForPrompt(input.answers),
    "",
    `PRIVATE background (intuition only — never reference): ${formatAstroForPrompt(input.astro)}`,
  ].join("\n");
}

function buildNarrativeBlock(
  input: GenInput,
  profile: Profile,
  rarity: Rarity,
  titles: string[],
): string {
  return [
    buildAnswersBlock(input),
    "",
    "MEASURED PROFILE (0-100, stay consistent with these):",
    profileForPrompt(profile),
    "",
    `DISTINCTIVENESS: about 1 in ${rarity.oneIn} people share this combination, driven by ${rarity.drivers
      .map((d) => d.hint)
      .join(" and ")}. Use this EXACT ratio in "rarity".`,
    "",
    "CAREER CANDIDATES (write one entry per title, verbatim, in this order):",
    ...titles.map((t) => `- ${t}`),
  ].join("\n");
}

/** Score the answers into a measured 0-100 profile (everything derives from this). */
export async function scoreProfile(input: GenInput): Promise<Profile> {
  try {
    const raw = await chatJSON([
      { role: "system", content: `${SCORING_SYSTEM}\n\n${SCORING_INSTRUCTIONS}` },
      { role: "user", content: buildAnswersBlock(input) },
    ]);
    return sanitizeProfile(parseJSON(raw));
  } catch (err) {
    console.error("[pathlight] scoring failed, using fallback profile:", (err as Error)?.message);
    return mockProfile();
  }
}

export async function generateSummary(input: GenInput): Promise<Summary> {
  const profile = await scoreProfile(input);
  const rarity = computeRarity(profile);
  const titles = careerTitles(profile, 4);
  try {
    const raw = await chatJSON([
      { role: "system", content: `${FRAMEWORK_OVERVIEW}\n\n${SUMMARY_INSTRUCTIONS}` },
      { role: "user", content: buildNarrativeBlock(input, profile, rarity, titles) },
    ]);
    const p = parseJSON<Partial<Summary>>(raw);
    const archetype = p.archetype || "The Seeker";
    return {
      headline: p.headline || "A path is taking shape",
      archetype,
      rarity: p.rarity || `~1 in ${rarity.oneIn} share this particular combination`,
      insight: p.insight || "",
      forecast: p.forecast || "",
      strengths: Array.isArray(p.strengths) ? p.strengths.slice(0, 3) : [],
      watchout: p.watchout || "",
      careers: mergeCareers(titles, p.careers),
      direction: p.direction || "",
      guidePreview: Array.isArray(p.guidePreview) ? p.guidePreview.slice(0, 4) : [],
      themes: Array.isArray(p.themes) ? p.themes.slice(0, 5) : [],
      profile,
      card: sanitizeCard(p.card, archetype.startsWith("The") ? archetype : `The ${archetype}`),
      teaser:
        p.teaser ||
        "Sign in to unfold your full Purpose Guide — your portrait, your paths, and your next steps.",
    };
  } catch (err) {
    console.error("[pathlight] summary generation failed, using fallback:", (err as Error)?.message);
    return mockSummary(input, profile, rarity, titles);
  }
}

export async function generateFullGuide(input: GenInput): Promise<FullGuide> {
  const profile = await scoreProfile(input);
  const rarity = computeRarity(profile);
  const titles = careerTitles(profile, 6);
  try {
    const raw = await chatJSON([
      { role: "system", content: `${FRAMEWORK_OVERVIEW}\n\n${GUIDE_INSTRUCTIONS}` },
      { role: "user", content: buildNarrativeBlock(input, profile, rarity, titles) },
    ]);
    const p = parseJSON<Partial<FullGuide>>(raw);
    if (!p.sections || p.sections.length === 0) return mockGuide(input, profile, rarity, titles);
    const headline = p.headline || "Your Path";
    return {
      headline,
      rarity: p.rarity || `~1 in ${rarity.oneIn} share this particular combination`,
      portrait: p.portrait || "",
      forecast: p.forecast || "",
      profile,
      careers: mergeCareers(titles, p.careers),
      card: sanitizeCard(p.card, headline.startsWith("The") ? headline : `The ${headline}`),
      sections: p.sections.map((s) => ({
        title: s.title ?? "",
        body: s.body ?? "",
        items: Array.isArray(s.items) ? s.items : [],
      })),
    };
  } catch (err) {
    console.error("[pathlight] guide generation failed, using fallback:", (err as Error)?.message);
    return mockGuide(input, profile, rarity, titles);
  }
}

/**
 * Paint a bespoke, deck-matched tarot ILLUSTRATION (dormant — the app currently
 * renders the designed SVG card. Kept for easy re-enable). Returns a data URL or null.
 */
export async function generatePaintedCard(card: ResultCardSpec): Promise<string | null> {
  const c = getClient();
  if (!c) return null;
  const scene =
    card.scene?.trim() ||
    `a lone figure embodying "${card.title}", holding or beside a symbolic ${card.emblem}`;
  const prompt = `A vintage tarot card illustration in the hand-painted Rider-Waite-Smith style: muted earthy palette of sage green, terracotta, ochre, and parchment cream; soft ink linework with gentle watercolor shading; aged paper texture; a calm, allegorical, symbolic scene with a single central figure or symbol; serene and dignified. Scene: ${scene}. Full-bleed painterly illustration, centered composition. ABSOLUTELY NO text, no words, no letters, no numbers, no title, no caption, no border lettering.`;
  try {
    const res = await c.images.generate({
      model: IMAGE_MODEL,
      prompt,
      size: "1024x1536",
      quality: "medium",
      output_format: "jpeg",
      output_compression: 80,
    });
    const b64 = res.data?.[0]?.b64_json;
    return b64 ? `data:image/jpeg;base64,${b64}` : null;
  } catch (err) {
    console.error("[pathlight] painted card generation failed:", (err as Error)?.message);
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Fallbacks — used only if a model call fails. Profile/rarity/careers
 * passed in are still the real computed values where possible.
 * ------------------------------------------------------------------ */

function pick(input: GenInput, slug: string): string {
  return input.answers.find((a) => a.cardSlug === slug)?.answer?.trim() ?? "";
}

function mockProfile(): Profile {
  return sanitizeProfile({
    energy: { score: 34, evidence: "" },
    perception: { score: 76, evidence: "" },
    decisions: { score: 64, evidence: "" },
    structure: { score: 58, evidence: "" },
    openness: { score: 82, evidence: "" },
    conscientiousness: { score: 56, evidence: "" },
    agreeableness: { score: 70, evidence: "" },
    stability: { score: 60, evidence: "" },
    extraversion: { score: 36, evidence: "" },
    realistic: { score: 38, evidence: "" },
    investigative: { score: 70, evidence: "" },
    artistic: { score: 80, evidence: "" },
    social: { score: 58, evidence: "" },
    enterprising: { score: 44, evidence: "" },
    conventional: { score: 40, evidence: "" },
  });
}

function mockSummary(input: GenInput, profile: Profile, rarity: Rarity, titles: string[]): Summary {
  const spark = pick(input, "the-spark");
  const name = input.birth.displayName?.split(" ")[0] || "traveler";
  return {
    headline: `${name}, you build meaning before you chase status`,
    archetype: "The Quiet Builder",
    rarity: `~1 in ${rarity.oneIn} share this particular combination`,
    insight: `The throughline across your answers isn't ambition for its own sake — it's that you only switch fully on when the work means something to you. ${
      spark ? `You said it plainly: "${spark}".` : ""
    }\n\nThe tension worth naming: the standards that make your work good can keep you waiting for the "right" moment — so you under-ship the very thing that would prove you right.`,
    forecast:
      "The weeks ahead favour finishing over starting. A door you've filed under 'someday' opens narrowly mid-season — say yes before you feel ready.",
    strengths: [
      "Turning half-formed ideas into finished, real things",
      "Reading what people actually need beneath what they say",
      "Holding to your values when it would be easier not to",
    ],
    watchout: "You mistake 'not ready yet' for 'not good enough' — and stall on work that's already worth shipping.",
    careers: mergeCareers(titles, []),
    direction: "Pick one small thing only you would make, and ship a rough version this month.",
    guidePreview: [
      "The exact environments that quietly drain vs. light you up",
      "A 90-day plan toward work that fits",
      "The blind spot that's been costing you momentum",
    ],
    themes: ["creation", "depth", "meaning", "autonomy"],
    profile,
    card: { title: "The Quiet Builder", motto: "What will you make real?", emblem: "lightbulb", accent: "terracotta" },
    teaser: "Sign in to unfold your full Purpose Guide — your portrait, your paths, and your next steps.",
  };
}

function mockGuide(input: GenInput, profile: Profile, rarity: Rarity, titles: string[]): FullGuide {
  const love = pick(input, "the-delight") || pick(input, "the-spark") || "making things";
  const need = pick(input, "the-ache") || "what moves you";
  const action = pick(input, "the-seed") || "take one small step this week";
  return {
    headline: "The Compassionate Maker",
    rarity: `~1 in ${rarity.oneIn} share this particular combination`,
    portrait:
      "You build quietly, then invite people in. Across your answers the same pattern holds: you want what you make to matter, and you'd rather go deep than wide. You read people well and carry a strong inner compass — but you hold yourself to a standard that can keep good work in the drawer.",
    forecast:
      "The season ahead rewards finishing. Watch the few weeks around mid-season for a quiet opening you'd normally talk yourself out of — take it.",
    profile,
    careers: mergeCareers(titles, []),
    card: {
      title: "The Compassionate Maker",
      motto: "Where do your gifts meet the world?",
      emblem: "flame",
      accent: "terracotta",
      scene: "a calm figure cupping a small steady flame, a workbench and an open window behind them",
    },
    sections: [
      {
        title: "Your Reflection, in Full Light",
        body: "The same thread keeps surfacing: you want what you make to mean something, and you notice what others miss.",
        items: [
          `In your own words, you love "${love}".`,
          `What moves you — "${need}" — is also a compass.`,
          "You lead with empathy and quiet exactingness.",
        ],
      },
      {
        title: "Journaling Prompts Aligned With You",
        body: "Sit with these over the coming week, one per sitting.",
        items: [
          "When did I last lose track of time, and what was I doing?",
          "Where am I performing a role that isn't truly mine?",
          "What would I make if no one were watching?",
        ],
      },
      {
        title: "Your Purpose Map",
        body: "Map the overlap of what you love, what you're good at, what the world needs, and what could sustain you.",
        items: [`Love: ${love}`, "Skill: what people already come to you for", `World's need: ${need}`],
      },
      {
        title: "Creative Practice Toolkit",
        body: "A light rhythm to keep the maker in you fed.",
        items: [
          "A 20-minute daily 'first draft' ritual, no editing",
          "One weekly walk with no phone, to let ideas surface",
          "Ship one small finished thing this month",
        ],
      },
      {
        title: "A Path Forward",
        body: "Small, purposeful steps — not a leap.",
        items: [action, "Tell one person about the thing you want to build", "Block two hours next week for it"],
      },
    ],
  };
}
