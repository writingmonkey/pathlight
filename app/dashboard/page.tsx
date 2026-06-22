import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flourish } from "@/components/flourish";
import { Sparkles } from "lucide-react";
import type { FullGuide, Summary } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin?next=/dashboard");

  const { data: readings } = await supabase
    .from("readings")
    .select("id, full_guide, summary, created_at, tier, card_image")
    .order("created_at", { ascending: false });

  const list = readings ?? [];
  const lastDate = list[0]?.created_at ? new Date(list[0].created_at) : null;
  const daysSince = lastDate
    ? Math.floor((Date.now() - lastDate.getTime()) / 86_400_000)
    : 0;
  const showRedraw = list.length > 0 && daysSince >= 30;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="flex flex-col items-center text-center">
        <Sparkles className="h-7 w-7 text-gold" />
        <h1 className="mt-4 font-display text-4xl font-semibold text-ink">
          Your readings
        </h1>
        <p className="mt-3 text-ink/75">
          Your collection of cards — return to a guide, or draw a new one.
        </p>
      </div>

      <Flourish className="my-8" />

      {list.length === 0 ? (
        <div className="rounded-2xl border border-gold/30 bg-card/70 p-10 text-center">
          <p className="text-ink/75">You haven&apos;t completed a reading yet.</p>
          <Link
            href="/reading/begin"
            className={cn(buttonVariants({ size: "lg" }), "mt-5")}
          >
            Begin your reading
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {showRedraw && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-gold/40 bg-accent/30 p-5 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-ink/85">
                It&apos;s been {daysSince} days since your last reading — the
                season has shifted. Draw again to see what&apos;s moved.
              </p>
              <Link
                href="/reading/begin"
                className={cn(buttonVariants(), "shrink-0")}
              >
                Draw again
              </Link>
            </div>
          )}

          {list.map((r) => {
            const guide = r.full_guide as unknown as FullGuide | null;
            const summary = r.summary as unknown as Summary | null;
            const title = guide?.headline ?? summary?.archetype ?? "Your reading";
            const subtitle =
              summary?.headline ??
              (guide?.portrait ? guide.portrait.slice(0, 130) + "…" : "");
            const date = new Date(r.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            return (
              <Link
                key={r.id}
                href={`/guide/${r.id}`}
                className="flex gap-4 rounded-2xl border border-gold/30 bg-card/70 p-5 transition-colors hover:border-gold/60 hover:bg-card"
              >
                {r.card_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.card_image}
                    alt=""
                    className="h-28 w-[74px] shrink-0 rounded object-cover ring-1 ring-gold/40"
                  />
                ) : (
                  <div className="flex h-28 w-[74px] shrink-0 items-center justify-center rounded bg-accent/50 text-2xl text-gold ring-1 ring-gold/30">
                    ✦
                  </div>
                )}
                <div className="min-w-0">
                  <p className="card-title-caps text-xs text-gold">{date}</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold leading-tight text-ink">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="mt-1 line-clamp-2 text-ink/70">{subtitle}</p>
                  )}
                </div>
              </Link>
            );
          })}

          <div className="pt-4 text-center">
            <Link
              href="/reading/begin"
              className={buttonVariants({ variant: "outline" })}
            >
              Draw a new reading
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
