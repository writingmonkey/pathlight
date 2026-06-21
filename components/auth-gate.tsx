"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

export function AuthGate({
  next = "/reading",
  title = "Continue your journey",
  description = "Sign in to draw the remaining cards and unlock your full Purpose Guide. We'll email you a magic link — no password needed.",
}: {
  next?: string;
  title?: string;
  description?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      next,
    )}`;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });
    if (error) {
      setStatus("idle");
      toast.error(error.message || "Something went wrong. Please try again.");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-card/80 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-accent/50 text-gold">
          <Mail className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
          Check your inbox
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-ink/75">
          We sent a magic link to <span className="font-semibold">{email}</span>.
          Open it on this device to continue your reading.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gold/40 bg-card/80 p-8 text-center">
      <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-ink/75">{description}</p>
      <form onSubmit={sendLink} className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background/80"
          disabled={status === "sending"}
        />
        <Button type="submit" disabled={status === "sending"} className="shrink-0">
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            "Email me a link"
          )}
        </Button>
      </form>
    </div>
  );
}
