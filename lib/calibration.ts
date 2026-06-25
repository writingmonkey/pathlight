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
  { id: "energy", dim: "energy", prompt: "You feel most restored…", low: "Alone & quiet", high: "Among people" },
  { id: "perception", dim: "perception", prompt: "Your mind drifts toward…", low: "What's real", high: "What's possible" },
  { id: "decisions", dim: "decisions", prompt: "When it truly matters, you follow…", low: "Your head", high: "Your heart" },
  { id: "structure", dim: "structure", prompt: "Life feels right when it's…", low: "Settled & planned", high: "Loose & open" },
  { id: "openness", dim: "openness", prompt: "Something new and untried…", low: "Makes you wary", high: "Calls to you" },
  { id: "conscientiousness", dim: "conscientiousness", prompt: "You move through your days…", low: "On a whim", high: "With a plan" },
  { id: "agreeableness", dim: "agreeableness", prompt: "When you and someone clash, you…", low: "Hold your ground", high: "Soften to peace" },
  { id: "stability", dim: "stability", prompt: "When the ground shakes, you're…", low: "Easily shaken", high: "Hard to rattle" },
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
