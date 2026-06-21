import { cn } from "@/lib/utils";

/** A thin gold rule with a centered diamond, echoing the card borders. */
export function Flourish({ className }: { className?: string }) {
  return (
    <div className={cn("flourish w-full", className)} aria-hidden="true">
      <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0 text-gold" fill="currentColor">
        <path d="M8 0l2.2 5.8L16 8l-5.8 2.2L8 16l-2.2-5.8L0 8l5.8-2.2L8 0z" />
      </svg>
    </div>
  );
}
