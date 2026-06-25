// Pathlight's scoring engine. The model produces a numeric profile (0-100 per
// dimension, with evidence); everything downstream — the distinctiveness/rarity,
// the career matches, the internal type code — is DERIVED from those numbers, so
// the reading is measured-then-explained rather than asserted. Frameworks behind
// this (MBTI axes, Big Five, Holland/RIASEC interests) are never named to users.

export type DimGroup = "temperament" | "trait" | "trait-hidden" | "interest";
export type DimKind = "bipolar" | "unipolar";

export interface DimMeta {
  key: string;
  group: DimGroup;
  kind: DimKind;
  /** bipolar: low/high poles; unipolar: label */
  low?: string;
  high?: string;
  label?: string;
}

export const DIMENSIONS: DimMeta[] = [
  // temperament (bipolar) — derived from the four classic cognitive axes
  { key: "energy", group: "temperament", kind: "bipolar", low: "Inward", high: "Outward" },
  { key: "perception", group: "temperament", kind: "bipolar", low: "Concrete", high: "Imaginative" },
  { key: "decisions", group: "temperament", kind: "bipolar", low: "Logic-led", high: "Heart-led" },
  { key: "structure", group: "temperament", kind: "bipolar", low: "Planned", high: "Open" },
  // makeup (unipolar traits)
  { key: "openness", group: "trait", kind: "unipolar", label: "Curiosity & imagination" },
  { key: "conscientiousness", group: "trait", kind: "unipolar", label: "Drive & follow-through" },
  { key: "agreeableness", group: "trait", kind: "unipolar", label: "Warmth & cooperation" },
  { key: "stability", group: "trait", kind: "unipolar", label: "Calm under pressure" },
  // scored but not charted (overlaps the Inward/Outward axis)
  { key: "extraversion", group: "trait-hidden", kind: "unipolar", label: "Outward energy" },
  // interests (unipolar) — drive the career matches
  { key: "realistic", group: "interest", kind: "unipolar", label: "Hands-on & making" },
  { key: "investigative", group: "interest", kind: "unipolar", label: "Investigating & analyzing" },
  { key: "artistic", group: "interest", kind: "unipolar", label: "Creating & expressing" },
  { key: "social", group: "interest", kind: "unipolar", label: "Helping & guiding" },
  { key: "enterprising", group: "interest", kind: "unipolar", label: "Leading & persuading" },
  { key: "conventional", group: "interest", kind: "unipolar", label: "Organizing & ordering" },
];

export const DIM_KEYS = DIMENSIONS.map((d) => d.key);
export type DimKey = (typeof DIMENSIONS)[number]["key"];

export interface DimScore {
  score: number; // 0-100
  evidence: string; // short, from their words
}
export type Profile = Record<string, DimScore>;

const META = new Map(DIMENSIONS.map((d) => [d.key, d]));

/** Coerce a raw model object into a complete, clamped profile. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanitizeProfile(raw: any): Profile {
  const out: Profile = {};
  for (const d of DIMENSIONS) {
    const r = raw?.[d.key] ?? {};
    let s = Number(typeof r === "object" ? r.score : r);
    if (!Number.isFinite(s)) s = 50;
    s = Math.max(0, Math.min(100, Math.round(s)));
    out[d.key] = { score: s, evidence: typeof r?.evidence === "string" ? r.evidence : "" };
  }
  return out;
}

/* ---------- statistics (normal model) ---------- */

function erf(x: number): number {
  const s = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741,
    a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return s * y;
}
function normCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}
const SIGMA = 18; // assumed population spread around the midpoint (50)
function z(score: number): number {
  return (score - 50) / SIGMA;
}
/** two-tailed probability of being at least this far from the mean */
function tail(score: number): number {
  return Math.min(1, Math.max(0.02, 2 * (1 - normCdf(Math.abs(z(score))))));
}

export interface RarityDriver {
  key: string;
  hint: string; // human description for the narrative model
}
export interface Rarity {
  oneIn: number;
  drivers: RarityDriver[];
}

function describeDriver(key: string, score: number): string {
  const m = META.get(key)!;
  if (m.kind === "bipolar") {
    return score >= 50 ? `strongly ${m.high}` : `strongly ${m.low}`;
  }
  if (m.group === "interest") {
    return score >= 50
      ? `a strong pull toward ${m.label}`
      : `little pull toward ${m.label}`;
  }
  return score >= 50 ? `high ${m.label}` : `low ${m.label}`;
}

/**
 * Real, computed distinctiveness: take the two most extreme dimensions from
 * different families (to limit correlation) and multiply their tail
 * probabilities under a normal model. Returns "1 in N" + the driving traits.
 */
export function computeRarity(profile: Profile): Rarity {
  const ranked = DIMENSIONS.filter((d) => d.group !== "trait-hidden")
    .map((d) => ({ key: d.key, group: d.group, dev: Math.abs(profile[d.key].score - 50) }))
    .sort((a, b) => b.dev - a.dev);

  const first = ranked[0];
  const second = ranked.find((r) => r.group !== first.group) ?? ranked[1];

  // Dampen the second factor (the two drivers are usually correlated) and keep
  // the figure believable — a "1 in 800" claim reads as invented even if computed.
  const p = tail(profile[first.key].score) * Math.sqrt(tail(profile[second.key].score));
  let oneIn = Math.round(1 / p);
  oneIn = Math.max(3, Math.min(150, oneIn));
  if (oneIn >= 100) oneIn = Math.round(oneIn / 10) * 10;
  else if (oneIn >= 25) oneIn = Math.round(oneIn / 5) * 5;

  return {
    oneIn,
    drivers: [first, second].map((r) => ({
      key: r.key,
      hint: describeDriver(r.key, profile[r.key].score),
    })),
  };
}

/* ---------- interests → careers ---------- */

export const INTEREST_KEYS = [
  "realistic",
  "investigative",
  "artistic",
  "social",
  "enterprising",
  "conventional",
] as const;
export type InterestKey = (typeof INTEREST_KEYS)[number];

const RIASEC_CAREERS: Record<InterestKey, string[]> = {
  realistic: [
    "Industrial or product designer",
    "Maker / skilled craftsperson",
    "Engineer or technician",
    "Chef or food maker",
  ],
  investigative: [
    "Researcher or analyst",
    "Data scientist",
    "UX researcher",
    "Strategy consultant",
  ],
  artistic: [
    "Writer or editor",
    "Designer (brand / visual)",
    "Filmmaker or photographer",
    "Creative director",
  ],
  social: [
    "Teacher or educator",
    "Coach or counselor",
    "Healthcare or therapy",
    "Community builder",
  ],
  enterprising: [
    "Founder / entrepreneur",
    "Product manager",
    "Marketing or growth lead",
    "Partnerships or sales",
  ],
  conventional: [
    "Operations or program manager",
    "Analyst (finance / ops)",
    "Editor or curator",
    "Systems / process designer",
  ],
};

export function topInterests(profile: Profile): InterestKey[] {
  return [...INTEREST_KEYS].sort((a, b) => profile[b].score - profile[a].score);
}

/** Candidate role titles from the two strongest interest areas. */
export function careerTitles(profile: Profile, limit = 6): string[] {
  const top = topInterests(profile).slice(0, 2);
  const out: string[] = [];
  const lists = top.map((k) => RIASEC_CAREERS[k]);
  for (let i = 0; i < 4; i++) {
    for (const list of lists) {
      if (list[i] && !out.includes(list[i])) out.push(list[i]);
    }
  }
  return out.slice(0, limit);
}

export function interestLabel(key: InterestKey): string {
  return META.get(key)!.label!;
}

/* ---------- internal type code (private, for model consistency) ---------- */

export function typeCode(profile: Profile): string {
  const ax = (k: string, a: string, b: string) => (profile[k].score < 50 ? a : b);
  return (
    ax("energy", "I", "E") +
    ax("perception", "S", "N") +
    ax("decisions", "T", "F") +
    ax("structure", "J", "P")
  );
}

/** Blend the model's scores with direct self-report anchors (anchor-led). */
export function blendWithAnchors(
  llm: Profile,
  anchors: Partial<Record<string, number>>,
): Profile {
  const out: Profile = {};
  for (const d of DIMENSIONS) {
    const a = anchors[d.key];
    const base = llm[d.key]?.score ?? 50;
    const score = typeof a === "number" ? Math.round(0.6 * a + 0.4 * base) : base;
    out[d.key] = {
      score: Math.max(0, Math.min(100, score)),
      evidence: llm[d.key]?.evidence ?? "",
    };
  }
  return out;
}

/** Human-readable anchors for the scoring prompt (so the model aligns to them). */
export function anchorsForPrompt(anchors: Partial<Record<string, number>>): string {
  return Object.entries(anchors)
    .map(([k, v]) => {
      const m = META.get(k);
      const name = m ? (m.kind === "bipolar" ? `${m.low}↔${m.high}` : m.label) : k;
      return `- ${name}: about ${v}/100`;
    })
    .join("\n");
}

/** A compact, human summary of the profile for the narrative prompt. */
export function profileForPrompt(profile: Profile): string {
  return DIMENSIONS.filter((d) => d.group !== "trait-hidden")
    .map((d) => {
      const s = profile[d.key].score;
      const name = d.kind === "bipolar" ? `${d.low}↔${d.high}` : d.label;
      return `- ${name}: ${s}/100`;
    })
    .join("\n");
}
