import { DIMENSIONS, type Profile } from "@/lib/scoring";
import { cn } from "@/lib/utils";

/** Shows the measured 0-100 profile: temperament axes (bipolar) + trait bars. */
export function ProfilePanel({
  profile,
  className,
}: {
  profile: Profile;
  className?: string;
}) {
  const temperament = DIMENSIONS.filter((d) => d.group === "temperament");
  const traits = DIMENSIONS.filter((d) => d.group === "trait");

  return (
    <div
      className={cn(
        "rounded-2xl border border-gold/30 bg-card/70 p-6 sm:p-8",
        className,
      )}
    >
      <h3 className="card-title-caps text-xs text-gold">Your measured profile</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Read from your answers — not a guess.
      </p>

      <div className="mt-5 space-y-4">
        {temperament.map((d) => {
          const s = profile[d.key]?.score ?? 50;
          return (
            <div key={d.key}>
              <div className="flex justify-between text-xs">
                <span className={cn(s <= 50 ? "font-medium text-ink" : "text-muted-foreground")}>
                  {d.low}
                </span>
                <span className={cn(s > 50 ? "font-medium text-ink" : "text-muted-foreground")}>
                  {d.high}
                </span>
              </div>
              <div className="relative mt-1.5 h-1.5 rounded-full bg-accent/70">
                <span
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold bg-card shadow-sm"
                  style={{ left: `${s}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        {traits.map((d) => {
          const s = profile[d.key]?.score ?? 50;
          return (
            <div key={d.key}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-ink/85">{d.label}</span>
                <span className="text-xs text-muted-foreground">{s}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-accent/70">
                <div className="h-full rounded-full bg-gold/70" style={{ width: `${s}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
