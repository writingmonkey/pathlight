import { cn } from "@/lib/utils";

// Deterministic positions so server and client markup match (no hydration drift).
const STARS = [
  { top: "8%", left: "12%", size: 3, delay: "0s" },
  { top: "18%", left: "82%", size: 2, delay: "1.2s" },
  { top: "30%", left: "24%", size: 2, delay: "0.6s" },
  { top: "42%", left: "68%", size: 3, delay: "1.8s" },
  { top: "12%", left: "52%", size: 2, delay: "2.4s" },
  { top: "62%", left: "16%", size: 2, delay: "0.9s" },
  { top: "72%", left: "84%", size: 3, delay: "1.5s" },
  { top: "55%", left: "44%", size: 2, delay: "2.1s" },
  { top: "84%", left: "36%", size: 2, delay: "0.3s" },
  { top: "26%", left: "92%", size: 2, delay: "1.0s" },
  { top: "48%", left: "6%", size: 2, delay: "2.7s" },
  { top: "78%", left: "60%", size: 3, delay: "0.5s" },
];

export function StarField({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold animate-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            boxShadow: "0 0 6px var(--gold)",
          }}
        />
      ))}
    </div>
  );
}
