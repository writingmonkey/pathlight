// A short forced-choice calibration: quick this-or-that instincts that anchor
// the measured profile to direct self-report, instead of inferring everything
// from open text alone. One 4-point item per anchored dimension.

import type { DimKey } from "@/lib/scoring";

export interface CalibrationItem {
  id: string;
  dim: DimKey;
  prompt: string;
  low: string; // left pole → low score
  high: string; // right pole → high score
}

export const CALIBRATION: CalibrationItem[] = [
  { id: "energy", dim: "energy", prompt: "After a full day, you recharge by…", low: "Time alone", high: "Being around people" },
  { id: "perception", dim: "perception", prompt: "You trust more…", low: "Facts & what's proven", high: "Patterns & possibilities" },
  { id: "decisions", dim: "decisions", prompt: "When deciding, you weigh…", low: "Logic & consistency", high: "People & values" },
  { id: "structure", dim: "structure", prompt: "You're at ease when things are…", low: "Planned & settled", high: "Open & flexible" },
  { id: "openness", dim: "openness", prompt: "New, untested ideas…", low: "make you cautious", high: "pull you in" },
  { id: "conscientiousness", dim: "conscientiousness", prompt: "Your approach to tasks is…", low: "Loose, last-minute", high: "Organized, early" },
  { id: "agreeableness", dim: "agreeableness", prompt: "In a disagreement, you tend to…", low: "Hold your ground", high: "Seek harmony" },
  { id: "stability", dim: "stability", prompt: "Under real pressure, you're usually…", low: "Rattled", high: "Steady" },
];

/** 4-point response index (0..3) → anchor score toward the high pole. */
export const ANCHOR_SCALE = [12, 40, 60, 88];
export const ANCHOR_LABELS = ["Strongly", "Slightly", "Slightly", "Strongly"];

export function computeAnchors(
  responses: Record<string, number> | undefined,
): Partial<Record<DimKey, number>> {
  const out: Partial<Record<DimKey, number>> = {};
  if (!responses) return out;
  for (const item of CALIBRATION) {
    const r = responses[item.id];
    if (typeof r === "number" && r >= 0 && r < ANCHOR_SCALE.length) {
      out[item.dim] = ANCHOR_SCALE[r];
    }
  }
  return out;
}
