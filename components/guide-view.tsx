import type { FullGuide } from "@/lib/types";
import { Flourish } from "@/components/flourish";
import { ResultCard } from "@/components/result-card";
import { Sparkles, NotebookPen, Compass, Palette, Footprints } from "lucide-react";

const SECTION_ICONS = [Sparkles, NotebookPen, Compass, Palette, Footprints];

export function GuideView({ guide }: { guide: FullGuide }) {
  return (
    <article className="mx-auto max-w-3xl">
      <header className="text-center">
        <p className="card-title-caps text-sm text-gold">Your Full Purpose Guide</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          {guide.headline}
        </h1>
        <Flourish className="my-7" />
        <p className="mx-auto max-w-prose text-left text-lg leading-relaxed text-ink/85">
          {guide.typeSynthesis}
        </p>
      </header>

      <div className="mx-auto mt-10 w-52 sm:w-60">
        <ResultCard spec={guide.card} />
        <p className="mt-3 text-center text-xs uppercase tracking-wider text-muted-foreground">
          Your card
        </p>
      </div>

      <div className="mt-12 space-y-10">
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
                <p className="mt-4 text-lg leading-relaxed text-ink/85">
                  {section.body}
                </p>
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
