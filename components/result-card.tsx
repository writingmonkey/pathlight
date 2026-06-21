"use client";

import {
  Flame,
  Compass,
  Star,
  Key,
  Anchor,
  Feather,
  Eye,
  TreePine,
  Sun,
  Moon,
  Waves,
  Mountain,
  Sprout,
  BookOpen,
  Crown,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { type ResultCardSpec, type ResultEmblem } from "@/lib/types";
import { cn } from "@/lib/utils";

const EMBLEM_ICONS: Record<ResultEmblem, LucideIcon> = {
  flame: Flame,
  compass: Compass,
  star: Star,
  key: Key,
  anchor: Anchor,
  feather: Feather,
  eye: Eye,
  tree: TreePine,
  sun: Sun,
  moon: Moon,
  waves: Waves,
  mountain: Mountain,
  seed: Sprout,
  book: BookOpen,
  crown: Crown,
  lightbulb: Lightbulb,
};

const ACCENT_COLORS: Record<string, string> = {
  gold: "var(--gold)",
  terracotta: "var(--terracotta)",
  sage: "var(--sage)",
  teal: "#4f6b6a",
};

const CORNERS = [
  "left-2.5 top-2.5",
  "right-2.5 top-2.5",
  "left-2.5 bottom-2.5",
  "right-2.5 bottom-2.5",
];

/** A bespoke tarot card composed in the deck's parchment-and-gold style. */
export function ResultCard({
  spec,
  className,
}: {
  spec: ResultCardSpec;
  className?: string;
}) {
  const Icon = EMBLEM_ICONS[spec.emblem] ?? Star;
  const accent = ACCENT_COLORS[spec.accent] ?? ACCENT_COLORS.gold;

  return (
    <div
      className={cn(
        "relative aspect-[2/3] w-full overflow-hidden rounded-lg select-none",
        className,
      )}
      style={{
        containerType: "inline-size",
        background: "linear-gradient(160deg, #f7f0dd 0%, #ecdcba 100%)",
        boxShadow:
          "inset 0 0 0 6px rgba(184,144,47,0.14), inset 0 0 0 7px rgba(184,144,47,0.5), 0 18px 40px -18px rgba(44,40,32,0.55)",
      }}
    >
      {/* inner hairline frame */}
      <div className="pointer-events-none absolute inset-[14px] rounded-sm border border-gold/40" />

      {/* corner flourishes */}
      {CORNERS.map((pos) => (
        <span
          key={pos}
          className={cn("absolute text-[10px] text-gold/70", pos)}
          aria-hidden="true"
        >
          ✦
        </span>
      ))}

      {/* top mark */}
      <div className="absolute inset-x-0 top-[7%] flex items-center justify-center gap-2 text-gold">
        <span className="text-[10px] opacity-60">✦</span>
        <Star className="h-4 w-4" fill="currentColor" strokeWidth={0} />
        <span className="text-[10px] opacity-60">✦</span>
      </div>

      {/* central emblem */}
      <div className="absolute inset-x-0 top-[42%] flex -translate-y-1/2 flex-col items-center">
        <div
          className="relative flex h-[28%] w-[44%] min-h-20 min-w-20 items-center justify-center rounded-full"
          style={{ border: `1px solid ${accent}`, aspectRatio: "1 / 1" }}
        >
          <span
            className="absolute -top-2 text-[10px]"
            style={{ color: accent }}
            aria-hidden="true"
          >
            ✦
          </span>
          <Icon
            className="h-[46%] w-[46%]"
            style={{ color: accent }}
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* bottom banner */}
      <div className="absolute inset-x-[12%] bottom-[8%] text-center">
        <div
          className="mx-auto mb-3 h-px w-2/3"
          style={{ background: "color-mix(in srgb, var(--gold) 55%, transparent)" }}
        />
        <h3 className="card-title-caps text-[clamp(0.85rem,3.6cqw,1.1rem)] leading-tight text-ink">
          {spec.title}
        </h3>
        {spec.motto ? (
          <p className="mt-1.5 font-display text-[clamp(0.8rem,3.4cqw,1rem)] italic leading-snug text-ink/75">
            {spec.motto}
          </p>
        ) : null}
      </div>
    </div>
  );
}
