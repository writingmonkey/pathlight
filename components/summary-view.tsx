import type { Summary } from "@/lib/types";
import { Flourish } from "@/components/flourish";
import { ResultCard } from "@/components/result-card";
import { ShareCardButton } from "@/components/share-card";
import { ProfilePanel } from "@/components/profile-panel";
import { cn } from "@/lib/utils";
import { Compass, Sparkles, Leaf, Briefcase, Lock, Moon } from "lucide-react";

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
  const forecastParas = (summary.forecast || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={cn("grid items-start gap-10 md:grid-cols-[260px_1fr] md:gap-12", className)}>
      {/* designed card */}
      <div className="mx-auto w-48 animate-fade-up sm:w-56 md:sticky md:top-20 md:w-full">
        <ResultCard spec={summary.card} />
        <div className="mt-3 flex flex-col items-center gap-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Your card
          </p>
          <ShareCardButton
            title={summary.card.title}
            motto={summary.card.motto}
            accent={summary.card.accent}
          />
        </div>
      </div>

      {/* the reading */}
      <div className="animate-fade-up">
        <p className="card-title-caps text-sm text-gold">{summary.archetype}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {summary.headline}
        </h2>

        {summary.rarity && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-dashed border-gold/60 bg-accent/30 px-3.5 py-1.5 text-sm text-ink/80">
            <Sparkles className="h-4 w-4 text-gold" />
            <span>{summary.rarity}</span>
          </div>
        )}

        <Flourish className="my-6" />

        <div className="max-w-prose space-y-4 text-lg leading-relaxed text-ink/85">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {summary.profile && <ProfilePanel profile={summary.profile} className="mt-8" />}

        {forecastParas.length > 0 && (
          <div className="mt-7 rounded-2xl border border-gold/40 bg-accent/40 p-5 sm:p-6">
            <Header icon={Moon} tone="gold">
              The season ahead
            </Header>
            <div className="mt-2 space-y-3 leading-relaxed text-ink/90">
              {forecastParas.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        )}

        {summary.strengths?.length > 0 && (
          <Section icon={Sparkles} label="Where you're strong">
            <ul className="space-y-2">
              {summary.strengths.map((s, i) => (
                <li key={i} className="flex gap-3 text-ink/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {summary.careers?.length > 0 && (
          <Section icon={Briefcase} label="Paths that fit you">
            <ul className="space-y-2.5">
              {summary.careers.map((c, i) => (
                <li key={i} className="flex gap-3 text-ink/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                  <span className="leading-relaxed">
                    <span className="font-semibold text-ink">{c.title}</span>
                    {c.why ? <span className="text-ink/70"> — {c.why}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {summary.watchout && (
          <div className="mt-6 rounded-xl border border-gold/30 bg-accent/30 p-5">
            <Header icon={Leaf} tone="gold">A growth edge</Header>
            <p className="mt-2 leading-relaxed text-ink/85">{summary.watchout}</p>
          </div>
        )}

        {summary.direction && (
          <div className="mt-6 rounded-xl border border-sage/40 bg-sage/10 p-5">
            <Header icon={Compass} tone="sage">Your next move</Header>
            <p className="mt-2 leading-relaxed text-ink/90">{summary.direction}</p>
          </div>
        )}

        {summary.guidePreview?.length > 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-gold/50 bg-card/60 p-5">
            <Header icon={Lock} tone="gold">Inside your full Purpose Guide</Header>
            <ul className="mt-3 space-y-2">
              {summary.guidePreview.map((g, i) => (
                <li key={i} className="flex gap-3 text-ink/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/70" />
                  <span className="leading-relaxed">{g}</span>
                </li>
              ))}
            </ul>
          </div>
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

function Header({
  icon: Icon,
  tone = "gold",
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone?: "gold" | "sage";
  children: React.ReactNode;
}) {
  return (
    <h3
      className={cn(
        "flex items-center gap-2 card-title-caps text-xs",
        tone === "sage" ? "text-sage" : "text-gold",
      )}
    >
      <Icon className="h-4 w-4" /> {children}
    </h3>
  );
}

function Section({
  icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <Header icon={icon}>{label}</Header>
      <div className="mt-3">{children}</div>
    </section>
  );
}
