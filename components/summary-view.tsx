import type { Summary } from "@/lib/types";
import { Flourish } from "@/components/flourish";
import { ResultCard } from "@/components/result-card";
import { cn } from "@/lib/utils";
import { Compass, Sparkles, Leaf } from "lucide-react";

export function SummaryView({
  summary,
  className,
}: {
  summary: Summary;
  className?: string;
}) {
  const paragraphs = (summary.insight || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={cn("grid items-start gap-10 md:grid-cols-[260px_1fr] md:gap-12", className)}>
      {/* bespoke card */}
      <div className="mx-auto w-48 animate-fade-up sm:w-56 md:sticky md:top-20 md:w-full">
        <ResultCard spec={summary.card} />
        <p className="mt-3 text-center text-xs uppercase tracking-wider text-muted-foreground">
          Your card
        </p>
      </div>

      {/* the reading */}
      <div className="animate-fade-up">
        <p className="card-title-caps text-sm text-gold">{summary.archetype}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {summary.headline}
        </h2>
        {summary.typeRead ? (
          <p className="mt-3 font-display text-lg italic text-ink/70">{summary.typeRead}</p>
        ) : null}

        <Flourish className="my-6" />

        <div className="max-w-prose space-y-4 text-lg leading-relaxed text-ink/85">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {summary.strengths?.length > 0 && (
          <section className="mt-8">
            <h3 className="flex items-center gap-2 card-title-caps text-xs text-gold">
              <Sparkles className="h-4 w-4" /> Where you&apos;re strong
            </h3>
            <ul className="mt-3 space-y-2">
              {summary.strengths.map((s, i) => (
                <li key={i} className="flex gap-3 text-ink/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {summary.watchout && (
          <section className="mt-6 rounded-xl border border-gold/30 bg-accent/30 p-5">
            <h3 className="flex items-center gap-2 card-title-caps text-xs text-gold">
              <Leaf className="h-4 w-4" /> A growth edge
            </h3>
            <p className="mt-2 leading-relaxed text-ink/85">{summary.watchout}</p>
          </section>
        )}

        {summary.direction && (
          <section className="mt-6 rounded-xl border border-sage/40 bg-sage/10 p-5">
            <h3 className="flex items-center gap-2 card-title-caps text-xs text-sage">
              <Compass className="h-4 w-4" /> Your next move
            </h3>
            <p className="mt-2 leading-relaxed text-ink/90">{summary.direction}</p>
          </section>
        )}

        {summary.themes?.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-2">
            {summary.themes.map((t) => (
              <span
                key={t}
                className="rounded-full border border-gold/40 bg-accent/40 px-3 py-1 text-sm capitalize text-ink/80"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
