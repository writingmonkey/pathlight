"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReadingDraft } from "@/lib/draft";
import { CALIBRATION, ANCHOR_LABELS } from "@/lib/calibration";
import { Button } from "@/components/ui/button";
import { StarField } from "@/components/star-field";
import { cn } from "@/lib/utils";

const CORNERS = ["left-3 top-3", "right-3 top-3", "left-3 bottom-3", "right-3 bottom-3"];

function MoonMark() {
  return (
    <div className="flex items-center justify-center gap-2 text-gold" aria-hidden="true">
      <span className="text-xs opacity-60">✦</span>
      <svg viewBox="0 0 24 24" className="h-8 w-8">
        <path
          fill="currentColor"
          d="M14.5 2.5a8.5 8.5 0 1 0 6.8 13.3A7 7 0 0 1 14.5 2.5z"
        />
      </svg>
      <span className="text-xs opacity-60">✦</span>
    </div>
  );
}

function Constellation({
  value,
  onSelect,
  low,
  high,
}: {
  value: number | undefined;
  onSelect: (opt: number) => void;
  low: string;
  high: string;
}) {
  return (
    <div className="relative flex flex-1 items-center">
      <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-gold/25 via-gold/50 to-gold/25" />
      <div className="relative flex w-full items-center justify-between">
        {[0, 1, 2, 3].map((opt) => {
          const sel = value === opt;
          const outer = opt === 0 || opt === 3;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              aria-label={`${ANCHOR_LABELS[opt]} ${opt < 2 ? low : high}`}
              aria-pressed={sel}
              className={cn(
                "relative flex items-center justify-center rounded-full border transition-all duration-200",
                outer ? "h-6 w-6" : "h-4 w-4",
                sel
                  ? "border-gold bg-gold text-[#f7f0dd]"
                  : "border-gold/50 bg-[#f7f0dd] hover:scale-110 hover:border-gold",
              )}
              style={
                sel
                  ? { boxShadow: "0 0 12px color-mix(in srgb, var(--gold) 65%, transparent)" }
                  : undefined
              }
            >
              {sel ? <span className="text-[10px] leading-none">✦</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
      <div className="relative overflow-hidden pb-2 text-center">
        <StarField className="opacity-50" />
        <div className="relative">
          <MoonMark />
          <p className="mt-3 card-title-caps text-sm text-gold">A few quick instincts</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Find your bearings
          </h1>
          <p className="mx-auto mt-3 max-w-md font-display text-lg italic leading-relaxed text-ink/75">
            Before the cards are drawn, let the needle settle where it wants to.
            Touch what feels true — don&apos;t overthink it.
          </p>
        </div>
      </div>

      {/* the tableau — one ornate card */}
      <div
        className="relative mt-9 overflow-hidden rounded-xl bg-[#f7f0dd] px-5 py-9 sm:px-9"
        style={{
          boxShadow:
            "inset 0 0 0 6px rgba(184,144,47,0.12), inset 0 0 0 7px rgba(184,144,47,0.45), 0 18px 44px -24px rgba(44,40,32,0.45)",
        }}
      >
        <div className="pointer-events-none absolute inset-[14px] rounded-sm border border-gold/35" />
        {CORNERS.map((pos) => (
          <span
            key={pos}
            className={cn("absolute text-[11px] text-gold/70", pos)}
            aria-hidden="true"
          >
            ✦
          </span>
        ))}

        <div className="relative space-y-9 px-1 sm:px-4">
          {CALIBRATION.map((item, i) => (
            <div key={item.id}>
              {i > 0 && (
                <div className="mx-auto mb-7 h-px w-12 bg-gold/25" aria-hidden="true" />
              )}
              <p className="text-center font-display text-xl text-ink">{item.prompt}</p>
              <div className="mt-4 flex items-center gap-2 sm:gap-5">
                <span className="w-16 shrink-0 text-right text-xs italic leading-tight text-ink/60 sm:w-28">
                  {item.low}
                </span>
                <Constellation
                  value={draft.calibration[item.id]}
                  onSelect={(opt) => setCalibration(item.id, opt)}
                  low={item.low}
                  high={item.high}
                />
                <span className="w-16 shrink-0 text-left text-xs italic leading-tight text-ink/60 sm:w-28">
                  {item.high}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-9 flex flex-col items-center gap-3">
        <Button size="lg" className="text-base" onClick={() => router.push("/reading")}>
          Continue to the cards
        </Button>
        <p className="text-xs text-muted-foreground">
          {answered} of {CALIBRATION.length} · you can skip any
        </p>
      </div>
    </div>
  );
}
