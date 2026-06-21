import type { Summary } from "@/lib/types";
import { Flourish } from "@/components/flourish";
import { cn } from "@/lib/utils";

export function SummaryView({
  summary,
  className,
}: {
  summary: Summary;
  className?: string;
}) {
  const paragraphs = (summary.reflection || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={cn("text-center", className)}>
      <p className="card-title-caps text-sm text-gold">{summary.archetype}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
        {summary.headline}
      </h2>

      <Flourish className="my-6" />

      <div className="mx-auto max-w-prose space-y-4 text-left text-lg leading-relaxed text-ink/85">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {summary.themes?.length > 0 && (
        <div className="mt-7 flex flex-wrap justify-center gap-2">
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
  );
}
