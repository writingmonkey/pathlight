"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useReadingDraft } from "@/lib/draft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flourish } from "@/components/flourish";
import { Sparkles, Plus, Minus } from "lucide-react";

export default function BeginPage() {
  const router = useRouter();
  const { draft, ready, setBirth } = useReadingDraft();

  const [displayName, setDisplayName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  // hydrate from any existing draft
  useEffect(() => {
    if (!ready || !draft.birth) return;
    setDisplayName(draft.birth.displayName ?? "");
    setBirthDate(draft.birth.birthDate ?? "");
    if (draft.birth.birthTime || draft.birth.birthPlace) setShowChart(true);
    setBirthTime(draft.birth.birthTime ?? "");
    setBirthPlace(draft.birth.birthPlace ?? "");
  }, [ready, draft.birth]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birthDate) return;
    setBirth({
      displayName: displayName.trim(),
      birthDate,
      birthTime: showChart ? birthTime || null : null,
      birthPlace: showChart ? birthPlace.trim() || null : null,
    });
    router.push("/reading");
  }

  return (
    <div className="relative mx-auto flex max-w-xl flex-col px-4 py-12 sm:py-16">
      <div className="text-center">
        <Sparkles className="mx-auto h-7 w-7 text-gold" />
        <h1 className="mt-4 font-display text-4xl font-semibold text-ink">
          Before you draw
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink/75">
          A few details to ground your reading. Your birth date lets us read the
          stars alongside your answers.
        </p>
      </div>

      <Flourish className="my-8" />

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-gold/30 bg-card/70 p-6 sm:p-8"
      >
        <div className="space-y-2">
          <Label htmlFor="name">What should we call you?</Label>
          <Input
            id="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="bg-background/80"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">
            Birth date <span className="text-terracotta">*</span>
          </Label>
          <Input
            id="birthDate"
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="bg-background/80"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowChart((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-gold/30 bg-accent/30 px-4 py-3 text-left text-sm text-ink/80 transition-colors hover:bg-accent/50"
        >
          <span>
            Add birth time &amp; place
            <span className="ml-1 text-muted-foreground">
              — for a fuller birth chart (optional)
            </span>
          </span>
          {showChart ? (
            <Minus className="h-4 w-4 text-gold" />
          ) : (
            <Plus className="h-4 w-4 text-gold" />
          )}
        </button>

        {showChart && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="birthTime">Birth time</Label>
              <Input
                id="birthTime"
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="bg-background/80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthPlace">Birth place</Label>
              <Input
                id="birthPlace"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                placeholder="City, country"
                className="bg-background/80"
              />
            </div>
          </div>
        )}

        <Button type="submit" size="lg" className="w-full text-base" disabled={!birthDate}>
          Draw my first card
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Your first cards are free. No account needed to begin.
        </p>
      </form>
    </div>
  );
}
