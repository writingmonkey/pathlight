import Link from "next/link";
import { cn } from "@/lib/utils";

export function StarMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-6 w-6", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 1.5l1.6 6.4a4 4 0 0 0 2.5 2.5l6.4 1.6-6.4 1.6a4 4 0 0 0-2.5 2.5L12 22.5l-1.6-6.4a4 4 0 0 0-2.5-2.5L1.5 12l6.4-1.6a4 4 0 0 0 2.5-2.5L12 1.5z"
        fill="currentColor"
        fillOpacity="0.9"
      />
    </svg>
  );
}

export function Brand({
  className,
  href = "/",
  size = "md",
}: {
  className?: string;
  href?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const text =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-xl";
  const mark = size === "lg" ? "h-7 w-7" : size === "sm" ? "h-5 w-5" : "h-6 w-6";

  const inner = (
    <span className={cn("inline-flex items-center gap-2 text-ink", className)}>
      <StarMark className={cn(mark, "text-gold")} />
      <span
        className={cn(
          "font-display font-semibold tracking-wide text-ink",
          text,
        )}
      >
        Pathlight
      </span>
    </span>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="transition-opacity hover:opacity-80">
      {inner}
    </Link>
  );
}
