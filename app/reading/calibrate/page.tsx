"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReadingDraft } from "@/lib/draft";
import { CALIBRATION, ANCHOR_LABELS } from "@/lib/calibration";
import { Button } from "@/components/ui/button";
import { Flourish } from "@/components/flourish";
import { cn } from "@/lib/utils";

export default function CalibratePage() {
  const router = useRouter();
  const { draft, ready, setCalibration } = useReadingDraft();

  useEffect(() => {
    if (ready && !draft.birth) router.replace("/reading/begin");
  }, [ready, draft.birth, router]);

  if (!ready || !draft.birth) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-muted-foreground">
        Preparing…
      </div>
    );
  }

  const answered = CALIBRATION.filter(
    (i) => draft.calibration[i.id] !== undefined,
  ).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <div className="text-center">
        <p className="card-title-caps text-sm text-gold">A few quick instincts</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Before you draw
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink/75">
          Tap toward whichever side fits you more. No wrong answers — this tunes
          your reading to you.
        </p>
      </div>

      <Flourish className="my-8" />

      <div className="space-y-8">
        {CALIBRATION.map((item) => {
          const val = draft.calibration[item.id];
          return (
            <div key={item.id}>
              <p className="text-center font-display text-xl text-ink">
                {item.prompt}
              </p>
              <div className="mt-3 flex items-center gap-2 sm:gap-4">
                <span className="w-20 shrink-0 text-right text-sm leading-tight text-ink/70 sm:w-32">
                  {item.low}
                </span>
                <div className="flex flex-1 gap-1.5">
                  {[0, 1, 2, 3].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCalibration(item.id, opt)}
                      aria-label={`${ANCHOR_LABELS[opt]} ${opt < 2 ? item.low : item.high}`}
                      aria-pressed={val === opt}
                      className={cn(
                        "h-10 flex-1 rounded-md border transition-colors",
                        val === opt
                          ? "border-gold bg-gold/30"
                          : "border-gold/30 bg-accent/30 hover:bg-accent/60",
                      )}
                    />
                  ))}
                </div>
                <span className="w-20 shrink-0 text-sm leading-tight text-ink/70 sm:w-32">
                  {item.high}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <Button size="lg" className="text-base" onClick={() => router.push("/reading")}>
          Continue to the cards
        </Button>
        <p className="text-xs text-muted-foreground">
          {answered} of {CALIBRATION.length} answered · you can skip any
        </p>
      </div>
    </div>
  );
}
