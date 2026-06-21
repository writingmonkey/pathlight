"use client";

import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ReflectionInput({
  value,
  onChange,
  suggestions,
  placeholder = "Write as little or as much as feels true…",
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function addSuggestion(s: string) {
    const trimmed = value.trim();
    const next = trimmed.length === 0 ? s : `${trimmed}, ${s.toLowerCase()}`;
    onChange(next);
    requestAnimationFrame(() => ref.current?.focus());
  }

  return (
    <div className="space-y-3">
      <Textarea
        ref={ref}
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className={cn(
          "resize-none bg-card/70 text-base leading-relaxed",
          "border-input/80 focus-visible:ring-gold/40",
          "font-body",
        )}
      />
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs uppercase tracking-wider text-muted-foreground">
            Need a nudge?
          </span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addSuggestion(s)}
              className={cn(
                "rounded-full border border-gold/40 bg-accent/40 px-3 py-1 text-sm text-ink/80",
                "transition-colors hover:border-gold hover:bg-accent",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
