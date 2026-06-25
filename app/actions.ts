"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buildAstroProfile } from "@/lib/astrology";
import { generateFullGuide, generateSummary } from "@/lib/openai";
import type { ReadingPayload, Summary } from "@/lib/types";
import type { Json } from "@/lib/database.types";

/** Free taste reflection — runs for anonymous users, no DB write. */
export async function createTasteSummary(
  payload: ReadingPayload,
): Promise<Summary> {
  const astro = await buildAstroProfile(payload.birth);
  return generateSummary({
    birth: payload.birth,
    answers: payload.answers,
    astro,
    calibration: payload.calibration,
  });
}

type CompleteResult = { readingId: string } | { error: string };

/** Gated full reading — requires auth. Persists profile, reading, answers. */
export async function completeReading(
  payload: ReadingPayload,
  tasteSummary?: Summary | null,
): Promise<CompleteResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not-authenticated" };

  const astro = await buildAstroProfile(payload.birth);

  const guide = await generateFullGuide({
    birth: payload.birth,
    answers: payload.answers,
    astro,
    calibration: payload.calibration,
  });

  const summary =
    tasteSummary ??
    (await generateSummary({
      birth: payload.birth,
      answers: payload.answers,
      astro,
      calibration: payload.calibration,
    }));

  await supabase.from("profiles").upsert({
    id: user.id,
    display_name: payload.birth.displayName,
    birth_date: payload.birth.birthDate,
    birth_time: payload.birth.birthTime || null,
    birth_place: payload.birth.birthPlace || null,
    sun_sign: astro.sunSign,
  });

  const { data: reading, error } = await supabase
    .from("readings")
    .insert({
      user_id: user.id,
      tier: "full",
      summary: summary as unknown as Json,
      full_guide: guide as unknown as Json,
      astro: astro as unknown as Json,
    })
    .select("id")
    .single();

  if (error || !reading) return { error: error?.message ?? "insert-failed" };

  if (payload.answers.length > 0) {
    const rows = payload.answers.map((a) => ({
      reading_id: reading.id,
      card_number: a.cardNumber,
      card_slug: a.cardSlug,
      question: a.question,
      answer: a.answer,
    }));
    const { error: aErr } = await supabase.from("answers").insert(rows);
    if (aErr) return { error: aErr.message };
  }

  return { readingId: reading.id };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
