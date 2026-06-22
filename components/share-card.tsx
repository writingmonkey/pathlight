"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ACCENTS: Record<string, string> = {
  gold: "#b8902f",
  terracotta: "#b0512c",
  sage: "#6e7a56",
  teal: "#4f6b6a",
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const r = Math.max(w / img.width, h / img.height);
  const iw = img.width * r;
  const ih = img.height * r;
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}

async function buildBlob(opts: {
  title: string;
  motto: string;
  accent: string;
  imageUrl?: string | null;
}): Promise<Blob | null> {
  const W = 1000;
  const H = 1500;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  try {
    await (document.fonts?.ready ?? Promise.resolve());
  } catch {
    /* ignore */
  }
  const accent = ACCENTS[opts.accent] ?? ACCENTS.gold;

  ctx.fillStyle = "#f3ead6";
  ctx.fillRect(0, 0, W, H);

  if (opts.imageUrl) {
    try {
      const img = await loadImage(opts.imageUrl);
      ctx.save();
      ctx.beginPath();
      ctx.rect(48, 48, W - 96, H - 96);
      ctx.clip();
      drawCover(ctx, img, 48, 48, W - 96, H - 96);
      ctx.restore();
    } catch {
      /* fall through to text-only */
    }
    const grad = ctx.createLinearGradient(0, H - 420, 0, H - 48);
    grad.addColorStop(0, "rgba(243,234,214,0)");
    grad.addColorStop(1, "rgba(243,234,214,0.97)");
    ctx.fillStyle = grad;
    ctx.fillRect(48, H - 420, W - 96, 372);
  } else {
    ctx.fillStyle = accent;
    ctx.font = "120px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("✦", W / 2, H / 2 - 40);
  }

  ctx.strokeStyle = "rgba(184,144,47,0.6)";
  ctx.lineWidth = 10;
  ctx.strokeRect(26, 26, W - 52, H - 52);
  ctx.lineWidth = 2;
  ctx.strokeRect(46, 46, W - 92, H - 92);

  ctx.textAlign = "center";
  try {
    ctx.letterSpacing = "7px";
  } catch {
    /* ignore */
  }
  ctx.fillStyle = "#2c2820";
  ctx.font = "600 58px 'Cormorant Garamond', Georgia, serif";
  ctx.fillText(opts.title.toUpperCase(), W / 2, H - 230);

  try {
    ctx.letterSpacing = "0px";
  } catch {
    /* ignore */
  }
  if (opts.motto) {
    ctx.fillStyle = "rgba(44,40,32,0.78)";
    ctx.font = "italic 40px 'EB Garamond', Georgia, serif";
    ctx.fillText(opts.motto, W / 2, H - 165);
  }

  ctx.fillStyle = accent;
  ctx.font = "600 32px 'Cormorant Garamond', Georgia, serif";
  ctx.fillText("✦  pathlight", W / 2, H - 95);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

export function ShareCardButton({
  title,
  motto,
  accent = "gold",
  imageUrl,
  className,
}: {
  title: string;
  motto?: string;
  accent?: string;
  imageUrl?: string | null;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    try {
      const blob = await buildBlob({ title, motto: motto ?? "", accent, imageUrl });
      if (!blob) {
        toast.error("Couldn't create your card image.");
        return;
      }
      const slug =
        title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "card";
      const file = new File([blob], `pathlight-${slug}.png`, { type: "image/png" });

      const nav = navigator as Navigator & {
        canShare?: (data?: { files?: File[] }) => boolean;
      };
      if (nav.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "My Pathlight card" });
          return;
        } catch {
          /* user cancelled or unsupported — fall back to download */
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Couldn't create your card image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={busy} className={className}>
      {busy ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Preparing…
        </>
      ) : (
        <>
          <Download className="h-4 w-4" /> Save your card
        </>
      )}
    </Button>
  );
}
