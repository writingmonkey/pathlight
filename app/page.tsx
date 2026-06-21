import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StarField } from "@/components/star-field";
import { Flourish } from "@/components/flourish";
import {
  Sparkles,
  NotebookPen,
  Compass,
  Palette,
  Footprints,
  ScrollText,
  Hand,
  Lock,
} from "lucide-react";

const FAN = [
  { src: "/cards/01-the-spark.jpg", alt: "The Spark", rotate: "-9deg", delay: "0s" },
  { src: "/cards/11-the-compass.jpg", alt: "The Compass", rotate: "0deg", delay: "1.5s" },
  { src: "/cards/22-the-bridge.jpg", alt: "The Bridge", rotate: "9deg", delay: "0.8s" },
];

const STEPS = [
  {
    icon: Hand,
    title: "Draw the cards",
    desc: "Each question is a hand-painted tarot card. Reflect in your own words — there are no wrong answers.",
  },
  {
    icon: ScrollText,
    title: "Receive your reading",
    desc: "We read your first cards through personality and purpose, and reflect a portrait of who you are.",
  },
  {
    icon: Lock,
    title: "Unlock your guide",
    desc: "Sign in to draw all 25 cards and open your full Purpose Guide — your map and your next steps.",
  },
];

const GUIDE_SECTIONS = [
  {
    icon: Sparkles,
    title: "Your Reflection, in Full Light",
    desc: "An expanded reading of who you are, drawn from all 25 of your answers.",
  },
  {
    icon: NotebookPen,
    title: "Journaling Prompts Aligned With You",
    desc: "Personalized prompts that match your themes and the way your mind moves.",
  },
  {
    icon: Compass,
    title: "Your Purpose Map",
    desc: "An Ikigai-style map of where your gifts meet what the world needs.",
  },
  {
    icon: Palette,
    title: "Creative Practice Toolkit",
    desc: "A creative routine and a mini-project tuned to your particular energy.",
  },
  {
    icon: Footprints,
    title: "A Path Forward",
    desc: "Small, purposeful steps to begin walking your path this week.",
  },
];

export default function Home() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <StarField className="opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-16 text-center sm:pt-24">
          <p className="card-title-caps text-sm text-gold">
            A reading for your life&apos;s direction
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.05] text-ink sm:text-7xl">
            Find your path.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
            Answer twenty-five tarot cards. Pathlight reads your reflections
            through personality, purpose, and the stars — and shows you what to
            do with your one wild life.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/reading/begin"
              className={cn(buttonVariants({ size: "lg" }), "text-base")}
            >
              Begin your reading
            </Link>
            <Link
              href="#inside"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "text-base")}
            >
              See what&apos;s inside
            </Link>
          </div>

          {/* fanned spread */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-end -space-x-10 sm:-space-x-8">
              {FAN.map((c) => (
                <div key={c.src} style={{ transform: `rotate(${c.rotate})` }}>
                  <div
                    className="animate-float overflow-hidden rounded-xl ring-1 ring-gold/40 shadow-[0_24px_50px_-24px_rgba(44,40,32,0.6)]"
                    style={{ animationDelay: c.delay }}
                  >
                    <Image
                      src={c.src}
                      alt={c.alt}
                      width={220}
                      height={330}
                      className="h-auto w-36 sm:w-52"
                      priority
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <Flourish className="mb-12" />
        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-accent/40 text-gold">
                <s.icon className="h-6 w-6" />
              </span>
              <p className="mt-4 card-title-caps text-xs text-gold">
                Step {i + 1}
              </p>
              <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-ink/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT'S INSIDE — the full purpose guide */}
      <section id="inside" className="border-y border-gold/20 bg-card/40">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <div className="text-center">
            <p className="card-title-caps text-sm text-gold">After you sign in</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
              Your Full Purpose Guide
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink/75">
              A personal guide composed from all twenty-five answers — blending
              MBTI, the Enneagram, and your chart into one coherent path.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-px overflow-hidden rounded-2xl border border-gold/30">
            {GUIDE_SECTIONS.map((g) => (
              <div
                key={g.title}
                className="flex items-start gap-4 bg-card/70 p-5 sm:p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-accent/50 text-gold">
                  <g.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {g.title}
                  </h3>
                  <p className="mt-1 text-ink/70">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Sparkles className="mx-auto h-7 w-7 text-gold" />
        <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
          The cards are waiting.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-ink/75">
          It takes a few quiet minutes. What you find might change your week — or
          your year.
        </p>
        <Link
          href="/reading/begin"
          className={cn(buttonVariants({ size: "lg" }), "mt-7 text-base")}
        >
          Begin your reading
        </Link>
      </section>

      <footer className="border-t border-gold/20 py-8 text-center text-sm text-muted-foreground">
        Pathlight · a reflective reading, not a diagnosis · made with care
      </footer>
    </div>
  );
}
