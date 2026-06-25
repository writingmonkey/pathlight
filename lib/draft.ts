"use client";

import { useCallback, useEffect, useState } from "react";
import type { BirthInfo, ReadingPayload, Summary } from "@/lib/types";
import { CARDS, OPENING } from "@/lib/cards";

const KEY = "pathlight:draft:v1";

export interface Draft {
  birth: BirthInfo | null;
  /** keyed by card number */
  answers: Record<number, string>;
  /** forced-choice calibration, keyed by item id (response 0-3) */
  calibration: Record<string, number>;
  summary: Summary | null;
}

const EMPTY: Draft = { birth: null, answers: {}, calibration: {}, summary: null };

export function loadDraft(): Draft {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Draft;
    return {
      ...EMPTY,
      ...parsed,
      answers: parsed.answers ?? {},
      calibration: parsed.calibration ?? {},
    };
  } catch {
    return EMPTY;
  }
}

export function saveDraft(draft: Draft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* ignore quota errors */
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Build the server payload (birth + ordered answers) from a draft. */
export function draftToPayload(draft: Draft): ReadingPayload | null {
  if (!draft.birth) return null;
  const answers = [OPENING, ...CARDS]
    .filter((c) => (draft.answers[c.number] ?? "").trim().length > 0)
    .map(
    (c) => ({
      cardNumber: c.number,
      cardSlug: c.slug,
      cardName: c.name,
      question: c.question,
      answer: draft.answers[c.number].trim(),
    }),
  );
  return { birth: draft.birth, answers, calibration: draft.calibration ?? {} };
}

/** React hook: reactive, localStorage-backed reading draft. */
export function useReadingDraft() {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDraft(loadDraft());
    setReady(true);
  }, []);

  const update = useCallback((patch: Partial<Draft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      saveDraft(next);
      return next;
    });
  }, []);

  const setBirth = useCallback(
    (birth: BirthInfo) => update({ birth }),
    [update],
  );

  const setAnswer = useCallback(
    (cardNumber: number, value: string) => {
      setDraft((prev) => {
        const next = {
          ...prev,
          answers: { ...prev.answers, [cardNumber]: value },
        };
        saveDraft(next);
        return next;
      });
    },
    [],
  );

  const setCalibration = useCallback((itemId: string, value: number) => {
    setDraft((prev) => {
      const next = {
        ...prev,
        calibration: { ...prev.calibration, [itemId]: value },
      };
      saveDraft(next);
      return next;
    });
  }, []);

  const setSummary = useCallback(
    (summary: Summary | null) => update({ summary }),
    [update],
  );

  const reset = useCallback(() => {
    clearDraft();
    setDraft(EMPTY);
  }, []);

  return {
    draft,
    ready,
    setBirth,
    setAnswer,
    setCalibration,
    setSummary,
    update,
    reset,
  };
}
