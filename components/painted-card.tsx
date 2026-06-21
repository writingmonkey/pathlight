import { cn } from "@/lib/utils";

/**
 * Renders the AI-painted, deck-matched illustration with a crisp parchment
 * banner overlay (title + motto) and gold frame — so the card text is always
 * legible and on-brand, while the art matches the hand-painted deck.
 */
export function PaintedCard({
  imageUrl,
  title,
  motto,
  className,
}: {
  imageUrl: string;
  title: string;
  motto?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("relative aspect-[2/3] w-full overflow-hidden rounded-lg", className)}
      style={{
        boxShadow:
          "inset 0 0 0 6px rgba(184,144,47,0.14), inset 0 0 0 7px rgba(184,144,47,0.5), 0 18px 40px -18px rgba(44,40,32,0.55)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-[10px] rounded-sm border border-gold/40" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#efe2c4] via-[#efe2c4f2] to-transparent px-4 pb-4 pt-12 text-center">
        <h3 className="card-title-caps text-base leading-tight text-ink">{title}</h3>
        {motto ? (
          <p className="mt-1 font-display text-sm italic leading-snug text-ink/75">{motto}</p>
        ) : null}
      </div>
    </div>
  );
}
