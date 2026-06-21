import type { FullGuide } from "@/lib/types";
import { Flourish } from "@/components/flourish";
import { ResultCard } from "@/components/result-card";
import { PaintedCard } from "@/components/painted-card";
import {
  Sparkles,
  NotebookPen,
  Compass,
  Palette,
  Footprints,
  Briefcase,
} from "lucide-react";

const SECTION_ICONS = [Sparkles, NotebookPen, Compass, Palette, Footprints];

export function GuideView({
  guide,
  cardImage,
}: {
  guide: FullGuide;
  cardImage?: string | null;
}) {
  const portraitParas = (guide.portrait || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl">
      <header className="text-center">
        <p className="card-title-caps text-sm text-gold">Your Full Purpose Guide</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          {guide.headline}
        </h1>
      </header>

      {/* bespoke card */}
      <div className="mx-auto mt-8 w-56 sm:w-64">
        {cardImage ? (
          <PaintedCard imageUrl={cardImage} title={guide.card.title} motto={guide.card.motto} />
        ) : (
          <ResultCard spec={guide.card} />
        )}
        <p className="mt-3 text-center text-xs uppercase tracking-wider text-muted-foreground">
          Your card
        </p>
      </div>

      <Flourish className="my-8" />

      <div className="mx-auto max-w-prose space-y-4 text-lg leading-relaxed text-ink/85">
        {portraitParas.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* career paths */}
      {guide.careers?.length > 0 && (
        <section className="mt-10 rounded-2xl border border-gold/30 bg-card/70 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-accent/50 text-gold">
              <Briefcase className="h-5 w-5" />
            </span>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Paths that fit you
            </h2>
          </div>
          <ul className="mt-4 space-y-3">
            {guide.careers.map((c, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                <span className="leading-relaxed text-ink/85">
                  <span className="font-semibold text-ink">{c.title}</span>
                  {c.why ? <span className="text-ink/70"> — {c.why}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10 space-y-10">
        {guide.sections.map((section, i) => {
          const Icon = SECTION_ICONS[i % SECTION_ICONS.length];
          return (
            <section
              key={section.title}
              className="rounded-2xl border border-gold/30 bg-card/70 p-6 shadow-[0_14px_36px_-22px_rgba(44,40,32,0.45)] sm:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-accent/50 text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  {section.title}
                </h2>
              </div>

              {section.body ? (
                <p className="mt-4 text-lg leading-relaxed text-ink/85">{section.body}</p>
              ) : null}

              {section.items?.length > 0 && (
                <ul className="mt-4 space-y-2.5">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex gap-3 text-ink/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </article>
  );
}
