"use client";

import Image from "next/image";
import { cardImagePath, type TarotCard as TarotCardData } from "@/lib/cards";
import { cn } from "@/lib/utils";
import { StarMark } from "@/components/brand";

export function CardBack({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center rounded-lg",
        "bg-[#efe2c4] text-gold",
        "ring-1 ring-gold/50",
        className,
      )}
      style={{
        boxShadow:
          "inset 0 0 0 6px rgba(184,144,47,0.12), inset 0 0 0 7px rgba(184,144,47,0.45)",
      }}
    >
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <StarMark className="h-10 w-10 animate-float text-gold" />
        <span className="card-title-caps text-sm text-ink/70">Pathlight</span>
        <div className="mt-1 flex gap-1.5 text-gold/70">
          <span className="text-xs">✦</span>
          <span className="text-xs">✦</span>
          <span className="text-xs">✦</span>
        </div>
      </div>
    </div>
  );
}

export function TarotCard({
  card,
  faceUp,
  onClick,
  priority,
  className,
}: {
  card: TarotCardData;
  faceUp: boolean;
  onClick?: () => void;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("perspective-1000 select-none", onClick && "cursor-pointer", className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? `Reveal ${card.name}` : card.name}
    >
      <div
        className={cn(
          "relative aspect-[2/3] w-full preserve-3d transition-transform duration-700 ease-out",
          faceUp && "rotate-y-180",
        )}
      >
        {/* back */}
        <div className="absolute inset-0 backface-hidden">
          <CardBack />
        </div>
        {/* face — the printed card art */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 overflow-hidden rounded-lg ring-1 ring-gold/40 shadow-[0_18px_40px_-18px_rgba(44,40,32,0.55)]">
          <Image
            src={cardImagePath(card)}
            alt={`${card.name} — ${card.question}`}
            fill
            sizes="(max-width: 640px) 80vw, 360px"
            priority={priority}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
