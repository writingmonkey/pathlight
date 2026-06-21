"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReadingDraft } from "@/lib/draft";
import { SummaryView } from "@/components/summary-view";
import { AuthGate } from "@/components/auth-gate";

export default function ResultPage() {
  const router = useRouter();
  const { draft, ready } = useReadingDraft();

  useEffect(() => {
    if (!ready) return;
    if (!draft.summary) {
      router.replace(draft.birth ? "/reading" : "/reading/begin");
    }
  }, [ready, draft.summary, draft.birth, router]);

  if (!ready || !draft.summary) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-muted-foreground">
        Revealing your reading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <SummaryView summary={draft.summary} />
      <div className="mt-12">
        <AuthGate next="/reading" />
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Your answers are saved on this device — sign in from the same browser to
        continue where you left off.
      </p>
    </div>
  );
}
