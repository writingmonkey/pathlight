"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CARDS, OPENING, TASTE_CARDS } from "@/lib/cards";
import { useReadingDraft, draftToPayload } from "@/lib/draft";
import { TarotCard, CardBack } from "@/components/tarot-card";
import { ReflectionInput } from "@/components/reflection-input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StarMark } from "@/components/brand";
import { completeReading, createTasteSummary } from "@/app/actions";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";

function ReadingOverlay({ authed }: { authed: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/90 backdrop-blur-sm">
      <StarMark className="h-12 w-12 animate-float text-gold" />
      <p className="card-title-caps text-sm text-gold">
        {authed ? "Composing your Purpose Guide" : "Reading the cards"}
      </p>
      <p className="max-w-xs text-center text-ink/70">
        {authed
          ? "Drawing meaning from your answers and painting your card…"
          : "Drawing meaning from your reflections…"}
      </p>
    </div>
  );
}

function FlowSkeleton() {
  return (
    <div className="mx-auto flex max-w-5xl animate-pulse flex-col items-center gap-6 px-4 py-16">
      <div className="aspect-[2/3] w-56 rounded-lg bg-muted" />
      <div className="h-6 w-72 rounded bg-muted" />
      <div className="h-28 w-full max-w-md rounded bg-muted" />
    </div>
  );
}

export function ReadingFlow({ authed }: { authed: boolean }) {
  const router = useRouter();
  const { draft, ready, setAnswer, setSummary, reset } = useReadingDraft();

  // Every reading opens with "Why are you here?", then the tarot cards.
  const steps = useMemo(
    () => (authed ? [OPENING, ...CARDS] : [OPENING, ...TASTE_CARDS]),
    [authed],
  );
  const cardCount = steps.length - 1;

  const [index, setIndex] = useState(0);
  const [faceUp, setFaceUp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // `busy` guard: after a finished reading we reset the draft (birth becomes
    // null) right before navigating to the guide — don't bounce to /begin then.
    if (ready && !draft.birth && !busy) router.replace("/reading/begin");
  }, [ready, draft.birth, busy, router]);

  useEffect(() => {
    if (!ready || started) return;
    const firstUnanswered = steps.findIndex(
      (c) => !(draft.answers[c.number] ?? "").trim(),
    );
    setIndex(firstUnanswered === -1 ? steps.length - 1 : firstUnanswered);
    setStarted(true);
  }, [ready, started, steps, draft.answers]);

  useEffect(() => {
    setFaceUp(false);
    const t = setTimeout(() => setFaceUp(true), 180);
    return () => clearTimeout(t);
  }, [index]);

  if (!ready || !draft.birth) return <FlowSkeleton />;

  const step = steps[index];
  const isOpener = step.number === 0;
  const isLast = index === steps.length - 1;
  const answer = draft.answers[step.number] ?? "";
  const progress = ((index + 1) / steps.length) * 100;
  const finishLabel = authed ? "Reveal my Purpose Guide" : "Reveal my reading";

  async function finish() {
    const payload = draftToPayload(draft);
    if (!payload || payload.answers.length === 0) {
      toast.error("Reflect on at least one card before revealing your reading.");
      return;
    }
    setBusy(true);
    try {
      if (authed) {
        const res = await completeReading(payload, draft.summary);
        if ("error" in res) {
          toast.error("We couldn't save your reading. Please try again.");
          setBusy(false);
          return;
        }
        reset();
        router.push(`/guide/${res.readingId}`);
      } else {
        const summary = await createTasteSummary(payload);
        setSummary(summary);
        router.push("/result");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      {busy && <ReadingOverlay authed={authed} />}

      {/* progress */}
      <div className="mx-auto mb-8 max-w-md">
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
          <span>{isOpener ? "To begin" : `Card ${index} of ${cardCount}`}</span>
          {!authed && <span>Free reading</span>}
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <div className="grid items-center gap-8 md:grid-cols-[minmax(0,320px)_1fr] md:gap-12">
        {/* card / deck */}
        <div className="mx-auto w-52 sm:w-64 md:w-full md:max-w-[320px]">
          {isOpener ? (
            <div className="aspect-[2/3] w-full animate-fade-up">
              <CardBack />
            </div>
          ) : (
            <TarotCard card={step} faceUp={faceUp} priority />
          )}
        </div>

        {/* question + input */}
        <div className="animate-fade-up" key={step.number}>
          <p className="card-title-caps text-sm text-gold">
            {isOpener ? "Before you draw" : `${step.roman} · ${step.name}`}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {step.question}
          </h1>

          <div className="mt-6">
            <ReflectionInput
              value={answer}
              onChange={(v) => setAnswer(step.number, v)}
              suggestions={step.suggestions}
              autoFocus
            />
          </div>

          <div className="mt-7 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              disabled={index === 0 || busy}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            {isLast ? (
              <Button onClick={finish} disabled={busy} size="lg">
                {finishLabel}
              </Button>
            ) : (
              <Button
                onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
                disabled={busy}
              >
                {isOpener ? "Draw the first card" : "Next card"}{" "}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {!authed && (
            <p className="mt-4 text-sm text-muted-foreground">
              A few cards now for a free reading — then sign in to continue all
              25 and unlock your full Purpose Guide.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
